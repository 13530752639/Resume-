const fs = require('fs')
const path = require('path')
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3')

const envFile = path.resolve(__dirname, '..', '.env.r2')
const content = fs.readFileSync(envFile, 'utf-8')
const env = {}
for (const line of content.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx > 0) env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
})

async function check() {
  const key = 'documentary/纪录片《半边天》.mp4'
  console.log(`🔍 检查 R2 文件: ${key}`)
  try {
    const res = await client.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET, Key: key }))
    console.log(`✅ 存在! 大小: ${(res.ContentLength / 1024 / 1024).toFixed(1)} MB, 类型: ${res.ContentType}`)
    console.log(`   URL: https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev/${encodeURIComponent(key)}`)
  } catch (e) {
    if (e.name === 'NotFound') {
      console.log(`❌ 文件不存在于 R2!`)
      // 列出 documentary 目录下有什么
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3')
      const list = await client.send(new ListObjectsV2Command({ Bucket: env.R2_BUCKET, Prefix: 'documentary/', MaxKeys: 20 }))
      console.log(`\n📂 R2 documentary/ 目录内容:`)
      ;(list.Contents || []).forEach(o => console.log(`   ${o.Key} (${(o.Size/1024/1024).toFixed(1)} MB)`))
    } else {
      console.log(`❌ 错误: ${e.message}`)
    }
  }
}
check()
