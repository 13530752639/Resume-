const fs = require('fs')
const path = require('path')
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')

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

const extraFiles = [
  { local: 'public/covers/web/Webp/video-bg.jpg', remote: 'covers/Webp/video-bg.jpg' },
  { local: 'public/covers/web/Webp/photo-bg.jpg', remote: 'covers/Webp/photo-bg.jpg' },
]

async function main() {
  console.log('☁️  补传剩余资源至 R2\n')
  for (const f of extraFiles) {
    const localPath = path.resolve(__dirname, '..', f.local)
    if (!fs.existsSync(localPath)) { console.log(`⚠️ 跳过(不存在): ${f.local}`); continue }
    console.log(`📤 ${f.local} → ${f.remote}`)
    try {
      const upload = new Upload({ client, params: { Bucket: env.R2_BUCKET, Key: f.remote, Body: fs.createReadStream(localPath), ContentType: 'image/jpeg' } })
      await upload.done()
      console.log(`   ✅ 成功\n`)
    } catch (e) { console.log(`   ❌ 失败: ${e.message}\n`) }
  }

  // 检查 avatar
  const avatarPath = path.resolve(__dirname, '..', 'public/images/avatar.jpg')
  if (fs.existsSync(avatarPath)) {
    console.log(`📤 images/avatar.jpg → images/avatar.jpg`)
    try {
      const upload = new Upload({ client, params: { Bucket: env.R2_BUCKET, Key: 'images/avatar.jpg', Body: fs.createReadStream(avatarPath), ContentType: 'image/jpeg' } })
      await upload.done()
      console.log(`   ✅ 成功\n`)
    } catch (e) { console.log(`   ❌ 失败: ${e.message}\n`) }
  } else {
    console.log(`⚠️ avatar.jpg 不存在，跳过`)
  }
  console.log('完成!')
}
main()
