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

async function main() {
  const localPath = path.resolve(__dirname, '..', 'public/covers/web/compressed/fengmian-new.jpg')
  console.log(`📤 上传新封面图至 R2...`)
  const upload = new Upload({
    client,
    params: {
      Bucket: env.R2_BUCKET,
      Key: 'covers/compressed/fengmian-new.jpg',
      Body: fs.createReadStream(localPath),
      ContentType: 'image/jpeg',
    },
  })
  await upload.done()
  console.log(`✅ 成功! URL: https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev/covers/compressed/fengmian-new.jpg`)
}
main()
