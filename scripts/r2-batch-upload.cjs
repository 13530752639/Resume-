/**
 * Cloudflare R2 批量上传工具
 * 
 * 自动扫描 public/videos/ 目录并按分类上传到 R2 对应路径
 * 
 * 用法:
 *   node scripts/r2-batch-upload.js           # 上传全部
 *   node scripts/r2-batch-upload.js --dry-run # 预览不上传
 *   node scripts/r2-batch-upload.js --aigc    # 仅上传AIGC类
 */

const fs = require('fs')
const path = require('path')
const { uploadFile } = require('./r2-upload.cjs')

// ─── 扫描文件 ───────────────────────────────────────

function scanVideos(videosDir) {
  const categories = ['aigc', 'documentary', 'commercial', 'special', 'media']
  const files = []

  for (const cat of categories) {
    const catDir = path.join(videosDir, cat)
    if (!fs.existsSync(catDir)) {
      console.log(`⚠️ 跳过不存在的目录: ${cat}`)
      continue
    }

    const items = fs.readdirSync(catDir)
    for (const item of items) {
      if (item.endsWith('.mp4') && !item.startsWith('.')) {
        const localPath = path.join(catDir, item)
        const stat = fs.statSync(localPath)
        // 使用原始文件名作为 R2 key (保留中文)
        const remoteKey = `${cat}/${item}`
        files.push({
          category: cat,
          name: item,
          localPath,
          remoteKey,
          size: stat.size,
        })
      }
    }
  }

  return files
}

// ─── 格式化输出 ──────────────────────────────────────

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i]
}

// ─── 主逻辑 ─────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const videosDir = path.resolve(__dirname, '..', 'public', 'videos')
  const isDryRun = args.includes('--dry-run')
  const filterCategory = args.find(a => a.startsWith('--') && !a.startsWith('--dry'))

  console.log('☁️  Cloudflare R2 批量上传工具')
  console.log(`📂 扫描目录: ${videosDir}\n`)

  let allFiles = scanVideos(videosDir)

  if (allFiles.length === 0) {
    console.log('❌ 未找到任何 .mp4 文件')
    process.exit(1)
  }

  // 分类过滤
  if (filterCategory) {
    const cat = filterCategory.replace('--', '')
    allFiles = allFiles.filter(f => f.category === cat)
    console.log(`🎯 仅上传分类: ${cat}\n`)
  }

  // 打印文件清单
  const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0)
  console.log(`📋 待上传: ${allFiles.length} 个文件, 共 ${formatBytes(totalSize)}\n`)
  console.log('─'.repeat(70))

  for (const f of allFiles) {
    console.log(`  [${f.category}] ${f.name}  (${formatBytes(f.size)})`)
  }

  console.log('─'.repeat(70))

  if (isDryRun) {
    console.log('\n🔍 预览模式，不执行上传\n')
    return
  }

  // 确认
  console.log('\n⚠️  即将开始上传，按 Enter 继续，Ctrl+C 取消...')
  
  // 非交互模式下跳过等待
  const skipWait = args.includes('--yes') || args.includes('-y')
  if (!skipWait) {
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, 3000)
    })
  }
  console.log('')

  // 执行上传
  const results = []
  const startTime = Date.now()

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i]
    console.log(`\n[${i + 1}/${allFiles.length}] ${file.category}/${file.name}`)
    
    const result = await uploadFile(file.localPath, file.remoteKey)
    results.push({ ...file, ...result })

    // 如果失败且还有后续文件，询问是否继续
    if (!result.success && i < allFiles.length - 1) {
      console.log('   继续上传剩余文件...')
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  // ─── 汇总报告 ───────────────────────────────────────
  const elapsed = (Date.now() - startTime) / 1000
  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length
  const successSize = results.filter(r => r.success).reduce((s, r) => s + r.size, 0)

  console.log('\n' + '═'.repeat(70))
  console.log('📊 上传完毕')
  console.log('═'.repeat(70))
  console.log(`✅ 成功: ${successCount}/${allFiles.length}`)
  if (failCount > 0) console.log(`❌ 失败: ${failCount}/${allFiles.length}`)
  console.log(`📦 上传总量: ${formatBytes(successSize)}`)
  console.log(`⏱️  总耗时: ${Math.floor(elapsed / 60)}分${(elapsed % 60).toFixed(0)}秒`)
  console.log('═'.repeat(70))

  // 列出失败项
  if (failCount > 0) {
    console.log('\n❌ 失败的文件:')
    for (const r of results.filter(r => !r.success)) {
      console.log(`   ${r.remoteKey}: ${r.error}`)
    }
    console.log('\n💡 重试失败文件:')
    console.log('   node scripts/r2-upload.js \\')
    console.log(`     ${results.filter(r => !r.success).map(r => `"public/videos/${r.remoteKey}" "${r.remoteKey}"`).join(' \\\n     ')}`)
  }

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('未捕获错误:', err)
  process.exit(1)
})
