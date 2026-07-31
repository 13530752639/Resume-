export const PHOTO_WIDTHS = [480, 960, 1600] as const

export type PhotoWidth = (typeof PHOTO_WIDTHS)[number]

export function optimizedPhotoUrl(source: string, width: PhotoWidth): string {
  const [path, query] = source.split('?', 2)

  if (!path.includes('/images/')) return source

  const optimizedPath = path
    .replace('/images/', `/images-optimized/${width}/`)
    .replace(/\.[^./]+$/, '.webp')

  const optimized = query ? `${optimizedPath}?${query}` : optimizedPath

  try {
    return new URL(optimized).toString()
  } catch {
    return optimized.replace(/ /g, '%20')
  }
}

export function optimizedPhotoSrcSet(source: string): string {
  return PHOTO_WIDTHS.map(width => `${optimizedPhotoUrl(source, width)} ${width}w`).join(', ')
}
