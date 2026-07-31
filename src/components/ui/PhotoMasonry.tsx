import { useEffect, useRef, useState } from 'react'
import { optimizedPhotoSrcSet, optimizedPhotoUrl } from '../../config/photo'

const INITIAL_BATCH_SIZE = 16
const NEXT_BATCH_SIZE = 12
const GRID_SIZES =
  '(min-width: 1280px) 22vw, (min-width: 1024px) 29vw, (min-width: 640px) 44vw, 92vw'

interface PhotoMasonryProps {
  images: string[]
}

export default function PhotoMasonry({ images }: PhotoMasonryProps) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_BATCH_SIZE, images.length),
  )
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH_SIZE, images.length))
  }, [images])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || visibleCount >= images.length) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisibleCount(current =>
          Math.min(current + NEXT_BATCH_SIZE, images.length),
        )
      },
      { rootMargin: '160px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [images.length, visibleCount])

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
        {images.slice(0, visibleCount).map((src, index) => (
          <MasonryImage key={src} src={src} index={index} />
        ))}
      </div>
      {visibleCount < images.length && (
        <div
          ref={sentinelRef}
          className="h-24 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-5 w-5 rounded-full border border-white/20 border-t-white/60 animate-spin" />
        </div>
      )}
    </>
  )
}

function MasonryImage({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { rootMargin: '120px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="break-inside-avoid mb-3">
      <div className="overflow-hidden rounded bg-white/[0.04]">
        {!inView ? (
          <div
            className="animate-pulse bg-white/[0.04]"
            style={{ paddingTop: '75%' }}
          />
        ) : error ? (
          <div
            className="flex items-center justify-center bg-white/[0.02]"
            style={{ paddingTop: '56%', position: 'relative' }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white/25 text-xs">
              图片加载失败
            </span>
          </div>
        ) : (
          <img
            src={optimizedPhotoUrl(src, 480)}
            srcSet={optimizedPhotoSrcSet(src)}
            sizes={GRID_SIZES}
            alt={`${index + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={event => {
              const image = event.currentTarget
              if (image.dataset.originalFallback !== 'true') {
                image.dataset.originalFallback = 'true'
                image.srcset = ''
                image.src = src
                return
              }
              setLoaded(true)
              setError(true)
            }}
            className={`w-full h-auto block transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
    </div>
  )
}
