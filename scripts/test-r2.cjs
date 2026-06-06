const fs = require('fs');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const env = fs.readFileSync('.env.r2', 'utf8')
  .split('\n').filter(l => l.includes('='))
  .reduce((acc, line) => {
    const [k, v] = line.split('=');
    acc[k.trim()] = v.trim();
    return acc;
  }, {});

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://' + env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

async function test() {
  try {
    const objs = await client.send(new ListObjectsV2Command({ Bucket: env.R2_BUCKET, MaxKeys: 10 }));
    console.log('✅ R2 连接成功！tare bucket 内容:');
    (objs.Contents || []).forEach(o => console.log('  ' + o.Key + ' (' + o.Size + ' bytes)'));
  } catch (e) {
    console.error('❌ 失败:', e.Code, '-', e.message);
  }
}
test();
