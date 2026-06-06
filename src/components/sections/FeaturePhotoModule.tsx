import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
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
      transition={{ duration: 0.35 }}
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
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-[42%] flex-shrink-0"
          >
            <div className="overflow-hidden shadow-2xl shadow-black/50 rounded-lg">
              <img src={topic.introImage} alt="" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-[58%] pt-2"
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

/* ─── Level 2：3D 书籍 ─── */

function BookView({ topic, onBack }: {
  topic: FeatureTopic; onBack: () => void
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const flippingRef = useRef(false)

  const totalPages = topic.images.length

  const flipTo = useCallback((direction: 'next' | 'prev') => {
    if (flippingRef.current) return
    if (direction === 'next' && currentPage >= totalPages - 1) return
    if (direction === 'prev' && currentPage <= 0) return

    flippingRef.current = true
    setIsFlipping(true)
    setFlipDirection(direction)
    setTimeout(() => {
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1)
      flippingRef.current = false
      setIsFlipping(false)
    }, 600)
  }, [currentPage, totalPages])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') flipTo('prev')
      if (e.key === 'ArrowRight') flipTo('next')
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flipTo])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
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

      {/* Book area */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-12 pt-16 pb-20">
        <div className="relative w-full max-w-6xl aspect-[1.6/1] flex items-center justify-center"
          style={{ perspective: '1800px' }}>
          {/* Left page */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center z-10"
            onClick={() => flipTo('prev')}
          >
            <div className="w-full h-full max-w-[480px] overflow-hidden rounded-l-lg shadow-2xl
              bg-gradient-to-r from-black/5 to-transparent cursor-pointer group"
              style={{
                transformOrigin: 'right center',
                transform: isFlipping && flipDirection === 'prev'
                  ? 'rotateY(-180deg)'
                  : 'rotateY(0deg)',
                transition: isFlipping && flipDirection === 'prev' ? 'transform 0.6s ease-in-out' : 'none',
                transformStyle: 'preserve-3d',
              }}>
              <img
                src={topic.images[Math.max(0, currentPage - 1)] || topic.images[0]}
                alt=""
                className="w-full h-full object-contain bg-[#2a2a2a] p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(Math.max(0, currentPage - 1))
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ChevronLeft className="w-8 h-8 text-white/0 group-hover:text-white/60 transition-all" />
              </div>
            </div>
          </div>

          {/* Right page */}
          <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center z-10"
            onClick={() => flipTo('next')}
          >
            <div className="w-full h-full max-w-[480px] overflow-hidden rounded-r-lg shadow-2xl
              bg-gradient-to-l from-black/5 to-transparent cursor-pointer group"
              style={{
                transformOrigin: 'left center',
                transform: isFlipping && flipDirection === 'next'
                  ? 'rotateY(180deg)'
                  : 'rotateY(0deg)',
                transition: isFlipping && flipDirection === 'next' ? 'transform 0.6s ease-in-out' : 'none',
                transformStyle: 'preserve-3d',
              }}>
              <img
                src={topic.images[currentPage]}
                alt=""
                className="w-full h-full object-contain bg-[#2a2a2a] p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(currentPage)
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ChevronRight className="w-8 h-8 text-white/0 group-hover:text-white/60 transition-all" />
              </div>
            </div>
          </div>

          {/* Spine */}
          <div className="absolute inset-y-[5%] left-1/2 w-[2px] bg-gradient-to-b from-amber-800/40 via-amber-600/20 to-amber-800/40 z-20 pointer-events-none" />
        </div>
      </div>

      {/* Bottom page counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
        <button
          onClick={() => flipTo('prev')}
          disabled={currentPage <= 0}
          className="text-white/40 hover:text-white disabled:opacity-20 transition-colors p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-white/40 text-xs tracking-wider tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => flipTo('next')}
          disabled={currentPage >= totalPages - 1}
          className="text-white/40 hover:text-white disabled:opacity-20 transition-colors p-2">
          <ChevronRight className="w-5 h-5" />
        </button>
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
              className="max-w-[90vw] max-h-[90vh] object-contain select-none"
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
