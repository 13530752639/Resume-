/**
 * Cloudflare R2 图片批量上传工具
 *
 * 将 public/ 下压缩后的图片批量上传到 R2 CDN
 * 上传路径保持与 public/ 相对结构一致
 *
 * 用法:
 *   node scripts/r2-upload-images.cjs           # 全部上传
 *   node scripts/r2-upload-images.cjs --dry-run  # 预览
 */

const fs = require('fs')
const path = require('path')
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')

// ─── 加载 R2 配置 ────────────────────────────────────
function loadR2Config() {
  const envFile = path.resolve(__dirname, '..', '.env.r2')
  if (!fs.existsSync(envFile)) {
    console.error('❌ 找不到配置文件:', envFile)
    process.exit(1)
  }
  const content = fs.readFileSync(envFile, 'utf-8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > 0) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
    }
  }
  const cfg = {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucket: env.R2_BUCKET,
    publicUrl: env.R2_PUBLIC_URL || '',
  }
  // 验证必填项
  for (const [k, v] of Object.entries(cfg)) {
    if (!v) { console.error(`❌ 配置缺失: ${k}`); process.exit(1) }
  }
  return cfg
}

const config = loadR2Config()

// ─── S3 客户端 ───────────────────────────────────────
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
})

// ─── 需要上传的目录映射 ──────────────────────────────
// localDir → R2 prefix
const UPLOAD_DIRS = [
  { local: 'images/news',          remote: 'images/news' },
  { local: 'images/feature',       remote: 'images/feature' },
  { local: 'images/portrait',      remote: 'images/portrait' },
  { local: 'images/street',        remote: 'images/street' },
  { local: 'academic',             remote: 'academic' },
  { local: 'covers/web/compressed', remote: 'covers/compressed' },
]

// ─── 图片扩展名 ───────────────────────────────────────
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP']

// ─── 工具函数 ─────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i]
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  return map[ext] || 'image/jpeg'
}

// ─── 递归扫描文件 ─────────────────────────────────────

function scanDir(localBase, remotePrefix) {
  const fullPath = path.resolve(__dirname, '..', 'public', localBase)
  if (!fs.existsSync(fullPath)) return []

  const files = []

  function walk(dir, prefix) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      if (item.startsWith('.') || item === '.gitkeep') continue
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      const relativeKey = prefix ? `${prefix}/${item}` : item

      if (stat.isDirectory()) {
        walk(itemPath, relativeKey)
      } else if (IMAGE_EXTS.includes(path.extname(item))) {
        files.push({
          name: item,
          localPath: itemPath,
          remoteKey: `${remotePrefix}/${relativeKey}`,
          size: stat.size,
        })
      }
    }
  }

  walk(fullPath, '')
  return files
}

// ─── 单文件上传（图片专用） ──────────────────────────

async function uploadImage(file) {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.bucket,
        Key: file.remoteKey,
        Body: fs.createReadStream(file.localPath),
        ContentType: getContentType(file.name),
      },
    })

    await upload.done()
    return { success: true, ...file }
  } catch (err) {
    return { success: false, error: err.message, ...file }
  }
}

// ─── 主逻辑 ─────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')

  console.log('☁️  Cloudflare R2 图片批量上传工具')
  console.log(`📦 Bucket: ${config.bucket}`)
  console.log(`🔗 CDN: ${config.publicUrl}\n`)

  // 扫描所有文件
  let allFiles = []
  for (const dir of UPLOAD_DIRS) {
    const files = scanDir(dir.local, dir.remote)
    allFiles = allFiles.concat(files)
  }

  if (allFiles.length === 0) {
    console.log('❌ 未找到任何图片文件')
    process.exit(1)
  }

  // 统计
  const totalSize = allFiles.reduce((s, f) => s + f.size, 0)
  console.log(`📋 待上传: ${allFiles.length} 个文件, 共 ${formatBytes(totalSize)}\n`)
  console.log('─'.repeat(70))

  // 按目录分组显示
  const grouped = {}
  for (const f of allFiles) {
    const dir = f.remoteKey.split('/').slice(0, -1).join('/')
    if (!grouped[dir]) grouped[dir] = []
    grouped[dir].push(f)
  }

  for (const [dir, files] of Object.entries(grouped)) {
    const dirSize = files.reduce((s, f) => s + f.size, 0)
    console.log(`\n📁 ${dir}/  (${files.length} 文件, ${formatBytes(dirSize)})`)
    for (const f of files) {
      console.log(`   ${f.name} (${formatBytes(f.size)})`)
    }
  }

  console.log('\n' + '─'.repeat(70))

  if (isDryRun) {
    console.log('\n🔍 预览模式，不执行上传\n')
    return
  }

  // 开始上传
  console.log('\n🚀 开始上传...\n')

  let successCount = 0
  let failCount = 0
  const startTime = Date.now()

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i]
    process.stdout.write(`[${i + 1}/${allFiles.length}] ${file.remoteKey} ... `)

    const result = await uploadImage(file)

    if (result.success) {
      successCount++
      console.log('✅')
    } else {
      failCount++
      console.log(`❌ ${result.error}`)
    }
  }

  // 汇总
  const elapsed = (Date.now() - startTime) / 1000
  console.log('\n' + '═'.repeat(70))
  console.log('📊 上传完毕')
  console.log('═'.repeat(70))
  console.log(`✅ 成功: ${successCount}/${allFiles.length}`)
  if (failCount > 0) console.log(`❌ 失败: ${failCount}/${allFiles.length}`)
  console.log(`⏱️  总耗时: ${Math.floor(elapsed / 60)}分${(elapsed % 60).toFixed(0)}秒`)
  console.log('═'.repeat(70))

  if (failCount > 0) process.exit(1)
}

main().catch(err => {
  console.error('未捕获错误:', err)
  process.exit(1)
})
