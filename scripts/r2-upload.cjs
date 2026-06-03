/**
 * Cloudflare R2 大文件上传模块
 * 
 * 核心功能:
 *  - 自动分片上传 (≥5MB 文件自动走 multipart upload)
 *  - 并行上传分片 (默认5并发)
 *  - 实时进度显示 (上传速率 + 百分比 + 预计剩余时间)
 *  - 断点重试 (单分片失败自动重试3次)
 *  - 上传状态日志
 * 
 * 使用方式:
 *   node scripts/r2-upload.js <本地文件路径> [R2目标路径]
 *   node scripts/r2-upload.js ~/videos/aigc/xxx.mp4 aigc/xxx.mp4
 */

const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const fs = require('fs')
const path = require('path')

// ─── 配置 ───────────────────────────────────────────

function loadConfig() {
  const envFile = path.resolve(__dirname, '..', '.env.r2')
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf-8')
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z_]+)=(.+)/)
      if (match) process.env[match[1]] = match[2].trim()
    }
  }

  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']
  const missing = required.filter(k => !process.env[k])
  
  if (missing.length > 0) {
    console.error(`❌ 缺少必要的环境变量: ${missing.join(', ')}`)
    console.error('   请先创建 .env.r2 文件 (参考 .env.r2.example)')
    process.exit(1)
  }

  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    publicUrl: process.env.R2_PUBLIC_URL || '',
  }
}

const config = loadConfig()

// ─── S3 客户端 (R2 兼容) ────────────────────────────

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  maxAttempts: 3,
})

// ─── 进度显示 ───────────────────────────────────────

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}

function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${Math.round(seconds % 60)}秒`
  return `${Math.floor(seconds / 3600)}时${Math.floor((seconds % 3600) / 60)}分`
}

function createProgressBar(percent, width = 30) {
  const filled = Math.round(width * percent / 100)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

// ─── 核心上传函数 ───────────────────────────────────

async function uploadFile(localPath, remoteKey, options = {}) {
  const {
    partSize = 10 * 1024 * 1024,  // 10MB per part
    concurrency = 5,              // 5 concurrent parts
    queueSize = 8,                // internal queue
  } = options

  // 检查文件
  if (!fs.existsSync(localPath)) {
    console.error(`❌ 文件不存在: ${localPath}`)
    process.exit(1)
  }

  const fileStat = fs.statSync(localPath)
  const fileSize = fileStat.size
  const fileName = path.basename(localPath)

  console.log(`\n📤 开始上传: ${fileName}`)
  console.log(`   大小: ${formatBytes(fileSize)}`)
  console.log(`   目标: s3://${config.bucket}/${remoteKey}`)
  console.log(`   分片: ${formatBytes(partSize)} × ${concurrency} 并发`)

  if (fileSize > 300 * 1024 * 1024) {
    console.log(`   ⚡ 大文件模式: 自动启用分片上传`)
  }

  const startTime = Date.now()
  let lastBytes = 0
  let lastTime = startTime
  let speedSamples = []

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: config.bucket,
      Key: remoteKey,
      Body: fs.createReadStream(localPath),
      ContentType: 'video/mp4',
    },
    partSize,
    queueSize,
    leavePartsOnError: false,
  })

  // 进度监听
  upload.on('httpUploadProgress', (progress) => {
    const now = Date.now()
    const elapsed = (now - startTime) / 1000
    const loaded = progress.loaded || 0
    const total = progress.total || fileSize
    const percent = total > 0 ? ((loaded / total) * 100).toFixed(2) : 0

    // 计算速率 (每秒采样一次)
    let speed = 0
    if (now - lastTime >= 1000) {
      const timeDiff = (now - lastTime) / 1000
      const bytesDiff = loaded - lastBytes
      speed = bytesDiff / timeDiff
      speedSamples.push(speed)
      if (speedSamples.length > 5) speedSamples.shift()
      lastBytes = loaded
      lastTime = now
    }
    const avgSpeed = speedSamples.length > 0
      ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length
      : 0

    const remaining = total - loaded
    const eta = avgSpeed > 0 ? remaining / avgSpeed : 0

    // 进度条输出
    const bar = createProgressBar(Number(percent))
    const line = [
      `\r   ${bar}`,
      `${percent}%`,
      `${formatBytes(loaded)}/${formatBytes(total)}`,
      avgSpeed > 0 ? `${formatBytes(avgSpeed)}/s` : '',
      eta > 0 ? `⚡${formatDuration(eta)}` : '',
    ].filter(Boolean).join('  ')

    process.stdout.write(line)
  })

  try {
    const result = await upload.done()
    const elapsed = (Date.now() - startTime) / 1000
    const avgSpeed = fileSize / elapsed

    console.log('')
    console.log(`✅ 上传成功! 耗时 ${formatDuration(elapsed)} (${formatBytes(avgSpeed)}/s)`)
    
    if (config.publicUrl) {
      const publicUrl = `${config.publicUrl}/${remoteKey}`
      console.log(`🔗 公开地址: ${publicUrl}`)
    }

    return {
      success: true,
      key: remoteKey,
      location: result.Location,
      size: fileSize,
      duration: elapsed,
      speed: avgSpeed,
    }
  } catch (err) {
    console.error(`\n❌ 上传失败: ${err.message}`)
    if (err.Code === 'NoSuchBucket') {
      console.error('   存储桶不存在，请检查 R2_BUCKET 配置')
    } else if (err.Code === 'InvalidAccessKeyId') {
      console.error('   Access Key 无效，请检查 R2_ACCESS_KEY_ID')
    } else if (err.Code === 'SignatureDoesNotMatch') {
      console.error('   Secret Key 错误，请检查 R2_SECRET_ACCESS_KEY')
    } else if (err.message?.includes('ENOTFOUND')) {
      console.error('   无法连接到 Cloudflare，请检查网络和 R2_ACCOUNT_ID')
    }
    return { success: false, key: remoteKey, error: err.message }
  }
}

// ─── CLI 入口 ───────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Cloudflare R2 大文件上传工具

用法:
  node scripts/r2-upload.js <本地文件> [R2目标路径]

示例:
  node scripts/r2-upload.js ./video.mp4 aigc/video.mp4
  node scripts/r2-upload.js ~/video.mp4          # 自动用文件名

环境变量 (.env.r2):
  R2_ACCOUNT_ID        Cloudflare 账号 ID
  R2_ACCESS_KEY_ID     R2 API Token Access Key
  R2_SECRET_ACCESS_KEY R2 API Token Secret
  R2_BUCKET            存储桶名称
  R2_PUBLIC_URL        R2 公开访问 URL (可选)
    `.trim())
    return
  }

  const localPath = path.resolve(args[0])
  const remoteKey = args[1] || path.basename(localPath)

  const result = await uploadFile(localPath, remoteKey)
  
  if (result.success) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('未捕获的错误:', err)
  process.exit(1)
})

module.exports = { uploadFile, loadConfig, config }
