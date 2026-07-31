import { access, readFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const legacyMediaUrl = 'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'
const mediaUrl = (process.env.MEDIA_URL || legacyMediaUrl).replace(/\/+$/, '')
const root = process.cwd()
const data = JSON.parse(
  await readFile(path.join(root, 'src/data/categories.json'), 'utf8')
)

const videoWorks = [
  ...Object.values(data.videoWorks).flat(),
  ...data.mediaWorks,
]

const failures = []

async function verifyPoster(work) {
  const posterPath = path.join(root, 'public', work.thumbnail.replace(/^\/+/, ''))
  try {
    await access(posterPath, constants.R_OK)
  } catch {
    failures.push(`${work.id}: 本地封面不存在 ${work.thumbnail}`)
  }
}

async function verifyVideo(work) {
  const url = new URL(work.videoUrl.replace(/^\/+/, ''), `${mediaUrl}/`)
  const startedAt = performance.now()

  try {
    const response = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      signal: AbortSignal.timeout(20_000),
    })
    const elapsed = Math.round(performance.now() - startedAt)
    const contentType = response.headers.get('content-type') || ''
    const rangeSupported =
      response.status === 206 || Boolean(response.headers.get('content-range'))

    if (!response.ok || !contentType.startsWith('video/') || !rangeSupported) {
      failures.push(
        `${work.id}: HTTP ${response.status}, type=${contentType || '-'}, range=${rangeSupported}`
      )
      return
    }

    await response.arrayBuffer()
    console.log(`✓ ${work.id.padEnd(14)} HTTP ${response.status}  ${elapsed} ms`)
  } catch (error) {
    failures.push(`${work.id}: ${error instanceof Error ? error.message : error}`)
  }
}

await Promise.all(videoWorks.map(verifyPoster))

const concurrency = 4
for (let index = 0; index < videoWorks.length; index += concurrency) {
  await Promise.all(videoWorks.slice(index, index + concurrency).map(verifyVideo))
}

if (failures.length > 0) {
  console.error(`\n媒体检查失败（${failures.length} 项）：`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`\n全部 ${videoWorks.length} 个视频和本地封面检查通过。`)
}
