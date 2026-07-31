#!/usr/bin/env node

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(scriptDir, '..')
const envPath = resolve(projectDir, '.env.r2')
const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')
const widths = [480, 960, 1600]
const quality = 75
const concurrency = 4

function loadEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const separator = line.indexOf('=')
        return [line.slice(0, separator), line.slice(separator + 1)]
      }),
  )
}

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) {
        resolvePromise({ stdout, stderr })
      } else {
        reject(
          new Error(
            `${command} exited with code ${code}: ${stderr.trim() || stdout.trim()}`,
          ),
        )
      }
    })
  })
}

async function listObjects(client, bucket, prefix) {
  const objects = []
  let continuationToken

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    )
    objects.push(...(response.Contents ?? []))
    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return objects
}

function optimizedKey(sourceKey, width) {
  const relative = sourceKey.replace(/^images\//, '')
  const withoutExtension = relative.replace(/\.[^.]+$/, '')
  return `images-optimized/${width}/${withoutExtension}.webp`
}

async function getWidth(inputPath) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width',
    '-of',
    'csv=p=0',
    inputPath,
  ])
  const width = Number.parseInt(stdout.trim(), 10)
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error(`Unable to read image width for ${inputPath}`)
  }
  return width
}

async function retry(operation, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise(resolvePromise => setTimeout(resolvePromise, attempt * 500))
      }
    }
  }
  throw lastError
}

const env = loadEnv(await readFile(envPath, 'utf8'))
const requiredKeys = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
]

for (const key of requiredKeys) {
  if (!env[key]) throw new Error(`Missing ${key} in .env.r2`)
}

const bucket = env.R2_BUCKET || 'tare'
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

const sources = (await listObjects(client, bucket, 'images/'))
  .filter(object => object.Key && /\.(?:jpe?g|png)$/i.test(object.Key))
  .sort((a, b) => a.Key.localeCompare(b.Key, 'zh-CN'))
const existing = new Set(
  (await listObjects(client, bucket, 'images-optimized/'))
    .map(object => object.Key)
    .filter(Boolean),
)

console.log(
  `${dryRun ? 'Dry run: ' : ''}${sources.length} source images, ${widths.length} responsive variants each`,
)

if (dryRun) {
  const missing = sources.flatMap(source =>
    widths
      .map(width => optimizedKey(source.Key, width))
      .filter(key => force || !existing.has(key)),
  )
  console.log(`${missing.length} variants would be generated`)
  process.exit(0)
}

const workDir = await mkdtemp(join(tmpdir(), 'portfolio-photo-optimize-'))
let nextIndex = 0
let completed = 0
let uploaded = 0
let skipped = 0
let sourceBytes = 0
let outputBytes = 0
const failures = []

async function processSource(source) {
  const pendingWidths = widths.filter(
    width => force || !existing.has(optimizedKey(source.Key, width)),
  )

  if (pendingWidths.length === 0) {
    skipped += widths.length
    completed += 1
    console.log(`[${completed}/${sources.length}] skip ${source.Key}`)
    return
  }

  const id = randomUUID()
  const inputPath = join(workDir, `${id}.source`)
  const response = await retry(() =>
    client.send(new GetObjectCommand({ Bucket: bucket, Key: source.Key })),
  )
  const sourceBuffer = Buffer.from(await response.Body.transformToByteArray())
  sourceBytes += sourceBuffer.length
  await writeFile(inputPath, sourceBuffer)

  try {
    const originalWidth = await getWidth(inputPath)

    for (const width of widths) {
      const key = optimizedKey(source.Key, width)
      if (!force && existing.has(key)) {
        skipped += 1
        continue
      }

      const outputPath = join(workDir, `${id}-${width}.webp`)
      const targetWidth = Math.min(originalWidth, width)
      await run('cwebp', [
        '-quiet',
        '-mt',
        '-metadata',
        'none',
        '-q',
        String(quality),
        '-resize',
        String(targetWidth),
        '0',
        inputPath,
        '-o',
        outputPath,
      ])
      const output = await readFile(outputPath)

      await retry(() =>
        client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: output,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
            ContentDisposition: 'inline',
          }),
        ),
      )

      outputBytes += output.length
      uploaded += 1
      await unlink(outputPath)
    }
  } finally {
    await unlink(inputPath).catch(() => {})
  }

  completed += 1
  console.log(
    `[${completed}/${sources.length}] ${source.Key} (${pendingWidths.join(', ')})`,
  )
}

async function worker() {
  while (true) {
    const index = nextIndex
    nextIndex += 1
    if (index >= sources.length) return
    const source = sources[index]

    try {
      await processSource(source)
    } catch (error) {
      completed += 1
      failures.push({ key: source.Key, message: error.message })
      console.error(`[${completed}/${sources.length}] failed ${source.Key}: ${error.message}`)
    }
  }
}

try {
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
} finally {
  await rm(workDir, { recursive: true, force: true })
}

console.log(
  JSON.stringify(
    {
      sources: sources.length,
      uploaded,
      skipped,
      failed: failures.length,
      downloadedMiB: +(sourceBytes / 1024 / 1024).toFixed(1),
      uploadedMiB: +(outputBytes / 1024 / 1024).toFixed(1),
      failures,
    },
    null,
    2,
  ),
)

if (failures.length > 0) process.exit(1)
