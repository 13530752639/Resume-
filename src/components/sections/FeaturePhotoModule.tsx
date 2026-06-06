import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import featureTopic, { type FeatureTopic } from '../../data/featurePhotos'

type Level = 1 | 2

interface FeaturePhotoModuleProps {
  onBack: () => void
}

export default function FeaturePhotoModule({ onBack }: FeaturePhotoModuleProps) {
  const [level, setLevel] = useState<Level>(1)

  const goNext = () => setLevel(2)
  const backFromIntro = () => { setLevel(1); onBack() }
  const backFromBook = () => setLevel(1)

  return (
    <section className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {level === 1 && (
          <IntroView key="iv" topic={featureTopic} onClick={goNext} onBack={backFromIntro} />
        )}
        {level === 2 && (
          <BookView key="bv" topic={featureTopic} onBack={backFromBook} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─── Level 1：介绍 ─── */

function IntroView({ topic, onClick, onBack }: {
  topic: FeatureTopic; onClick: () => void; onBack: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-black overflow-y-auto"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onBack() }}
        className="absolute top-6 left-6 md:top-8 md:left-12 z-30 flex items-center gap-2
                   text-white/60 hover:text-white transition-colors text-sm bg-black/60 backdrop-blur-sm
                   rounded-full px-4 py-2 border border-white/10">
        <ArrowLeft className="w-4 h-4" /> 返回摄影集
      </button>

      <div
        className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-16 lg:py-20 cursor-pointer"
        onClick={onClick}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full lg:w-[42%] flex-shrink-0 flex items-center"
          >
            <div className="overflow-hidden shadow-2xl shadow-black/50 rounded-lg w-full">
              <img src={topic.introImage} alt="" className="w-full max-h-[60vh] lg:max-h-none object-contain" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-[58%] flex flex-col justify-center pt-2"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-5">{topic.introTitle}</h2>
            <p className="text-gray-400 leading-loose text-sm md:text-base">{topic.introText}</p>
            <div className="mt-8 text-white/25 text-xs">点击任意位置进入美食图册 →</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Level 2：16:9 横排画廊 ─── */

function BookView({ topic, onBack }: {
  topic: FeatureTopic; onBack: () => void
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const totalPages = topic.images.length

  const goToPage = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return
    if (direction === 'next' && currentPage >= totalPages - 1) return
    if (direction === 'prev' && currentPage <= 0) return
    setIsTransitioning(true)
    setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1)
    setTimeout(() => setIsTransitioning(false), 350)
  }, [currentPage, totalPages, isTransitioning])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPage('prev')
      if (e.key === 'ArrowRight') goToPage('next')
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPage])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-[#1a1a1a] overflow-hidden flex flex-col"
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-4">
        <button
          onClick={(e) => { e.stopPropagation(); onBack() }}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm
                     bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <ArrowLeft className="w-4 h-4" /> 返回介绍
        </button>
        <span className="text-white/30 text-xs tracking-wider">{topic.title}</span>
      </div>

      {/* Gallery area — 16:9 全宽展示 */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-20 pb-24">
        <div className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-lg shadow-2xl shadow-black/50 bg-[#222]"
          style={{ perspective: '1200px' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPage}
              src={topic.images[currentPage]}
              alt=""
              initial={{ opacity: 0, x: isTransitioning ? 40 : 0, scale: 1.02 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => setLightboxIndex(currentPage)}
            />
          </AnimatePresence>

          {/* Navigation overlay areas */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPage('prev') }}
            disabled={currentPage <= 0}
            className="absolute inset-y-0 left-0 w-1/4 z-10 disabled:opacity-0 group transition-opacity"
          >
            <div className="absolute inset-y-0 left-4 flex items-center">
              <ChevronLeft className="w-10 h-10 text-white/0 group-hover:text-white/60 drop-shadow-lg transition-all" />
            </div>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPage('next') }}
            disabled={currentPage >= totalPages - 1}
            className="absolute inset-y-0 right-0 w-1/4 z-10 disabled:opacity-0 group transition-opacity"
          >
            <div className="absolute inset-y-0 right-4 flex items-center">
              <ChevronRight className="w-10 h-10 text-white/0 group-hover:text-white/60 drop-shadow-lg transition-all" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom page counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 z-30">
        <button
          onClick={() => goToPage('prev')}
          disabled={currentPage <= 0}
          className="text-white/40 hover:text-white disabled:opacity-20 transition-colors p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-white/50 text-sm tracking-wider tabular-nums min-w-[60px] text-center">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => goToPage('next')}
          disabled={currentPage >= totalPages - 1}
          className="text-white/40 hover:text-white disabled:opacity-20 transition-colors p-2">
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 ml-4">
          {topic.images.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!isTransitioning) { setIsTransitioning(true); setCurrentPage(i); setTimeout(() => setIsTransitioning(false), 350) } }}
              className={`rounded-full transition-all ${
                i === currentPage ? 'bg-white/70 w-6' : 'bg-white/25 w-1.5 h-1.5 hover:bg-white/40'
              }`}
              style={{ height: i === currentPage ? '6px' : '6px' }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10 p-2">
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1)
              }}
              className="absolute left-6 text-white/60 hover:text-white transition-colors p-2 z-10"
              disabled={lightboxIndex === 0}>
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={topic.images[lightboxIndex]}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (lightboxIndex < totalPages - 1) setLightboxIndex(lightboxIndex + 1)
              }}
              className="absolute right-6 text-white/60 hover:text-white transition-colors p-2 z-10"
              disabled={lightboxIndex === totalPages - 1}>
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-wider">
              {lightboxIndex + 1} / {totalPages}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
