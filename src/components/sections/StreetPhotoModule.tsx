import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import streetTopics, { type StreetTopic } from '../../data/streetPhotos'

type Level = 0 | 1 | 2 | 3

interface StreetPhotoModuleProps {
  onBack: () => void
}

const BG_IMAGE = '/covers/web/PNG/street-cover.png'

export default function StreetPhotoModule({ onBack }: StreetPhotoModuleProps) {
  const [level, setLevel] = useState<Level>(0)
  const [selectedTopic, setSelectedTopic] = useState<StreetTopic | null>(null)

  const goToTopic = (topic: StreetTopic) => {
    setSelectedTopic(topic)
    setLevel(1)
  }

  const goNext = () => setLevel(prev => Math.min(3, prev + 1) as Level)

  // 显式各级别返回函数——不依赖闭包 level 值
  const backFromCover = () => { setLevel(0); setSelectedTopic(null) }
  const backFromIntro = () => setLevel(1)
  const backFromGallery = () => setLevel(2)

  return (
    <section className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {level === 0 && (
          <TopicSelector key="ts" onSelect={goToTopic} onBack={onBack} bgImage={BG_IMAGE} />
        )}
        {level === 1 && selectedTopic && (
          <CoverView key={`cv-${selectedTopic.id}`} topic={selectedTopic} onClick={goNext} onBack={backFromCover} />
        )}
        {level === 2 && selectedTopic && (
          <IntroView key={`iv-${selectedTopic.id}`} topic={selectedTopic} onClick={goNext} onBack={backFromIntro} />
        )}
        {level === 3 && selectedTopic && (
          <GalleryView key={`gv-${selectedTopic.id}`} topic={selectedTopic} onBack={backFromGallery} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─── Level 0 ─── */

function TopicSelector({ onSelect, onBack, bgImage }: {
  onSelect: (t: StreetTopic) => void
  onBack: () => void
  bgImage: string
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 px-6 md:px-12 py-6">
        <button onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> 返回摄影集
        </button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 px-6">
          {streetTopics.map((topic, i) => (
            <motion.button key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(topic)}
              className="px-10 py-3 rounded-full bg-white/90 hover:bg-white text-black font-medium
                         transition-all shadow-lg backdrop-blur-sm text-lg">
              {topic.title}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Level 1：封面 ─── */

function CoverView({ topic, onClick, onBack }: {
  topic: StreetTopic; onClick: () => void; onBack: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
    >
      <img src={topic.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* 导航按钮 — 直接在 container 上 stopPropagation */}
      <button
        onClick={(e) => { e.stopPropagation(); onBack() }}
        className="absolute top-6 left-6 md:top-8 md:left-12 z-20 flex items-center gap-2
                   text-white/70 hover:text-white transition-colors text-sm rounded px-2 py-1">
        <ArrowLeft className="w-4 h-4" /> 返回分类
      </button>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.h1 initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.15em]">
          {topic.enTitle}
        </motion.h1>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/35 text-xs tracking-widest uppercase pointer-events-none">
        点击继续 ↓
      </div>
    </motion.div>
  )
}

/* ─── Level 2：介绍 ─── */

function IntroView({ topic, onClick, onBack }: {
  topic: StreetTopic; onClick: () => void; onBack: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 bg-black overflow-y-auto"
    >
      {/* 返回按钮 — 独立于内容区，仅自己 stopPropagation */}
      <button
        onClick={(e) => { e.stopPropagation(); onBack() }}
        className="absolute top-6 left-6 md:top-8 md:left-12 z-30 flex items-center gap-2
                   text-white/60 hover:text-white transition-colors text-sm bg-black/60 backdrop-blur-sm
                   rounded-full px-4 py-2 border border-white/10">
        <ArrowLeft className="w-4 h-4" /> 返回预览
      </button>

      {/* 内容区 — 点击进入画廊 */}
      <div
        className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-16 lg:py-20 cursor-pointer"
        onClick={onClick}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-[42%] flex-shrink-0"
          >
            <div className="overflow-hidden shadow-2xl shadow-black/50">
              <img src={topic.introImage} alt="" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-[58%] pt-2"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-5">{topic.introTitle}</h2>
            <p className="text-gray-400 leading-loose text-sm md:text-base">{topic.introText}</p>
            <div className="mt-8 text-white/25 text-xs">点击任意位置进入画廊 →</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Level 3：图库 ─── */

function GalleryView({ topic, onBack }: {
  topic: StreetTopic; onBack: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 bg-black overflow-y-auto"
    >
      {/* 返回按钮 — absolute 定位，独立于任何 click handler */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2
                   text-white/60 hover:text-white transition-colors text-sm bg-black/60 backdrop-blur-sm
                   rounded-full px-4 py-2 border border-white/10">
        <ArrowLeft className="w-4 h-4" /> 返回介绍
      </button>

      <div className="pt-20 px-6 md:px-12 lg:px-20 pb-6">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-wide">
          {topic.title}
        </motion.h1>
      </div>
      <div className="px-6 md:px-12 lg:px-20 pb-20">
        {topic.sections.map((s, i) => (
          <SectionBlock key={s.name} section={s} isLast={i === topic.sections.length - 1} />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── 板块 ─── */

function SectionBlock({ section, isLast }: { section: { name: string; images: string[] }; isLast: boolean }) {
  return (
    <div className={`${!isLast ? 'pb-14 mb-14 border-b border-white/[0.07]' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        <div className="md:w-[13%] flex-shrink-0 pt-1">
          <h3 className="text-base md:text-lg font-medium text-amber-500/80 tracking-wider whitespace-nowrap">
            {section.name}
          </h3>
        </div>
        <div className="md:w-[87%]">
          <MasonryGrid images={section.images} />
        </div>
      </div>
    </div>
  )
}

/* ─── Masonry ─── */

function MasonryGrid({ images }: { images: string[] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
      {images.map((src, i) => (
        <MasonryImage key={src} src={src} index={i} />
      ))}
    </div>
  )
}

function MasonryImage({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="break-inside-avoid mb-3">
      <div className="overflow-hidden rounded bg-white/[0.04]">
        {!inView ? (
          <div className="animate-pulse bg-white/[0.04]" style={{ paddingTop: '75%' }} />
        ) : (
          <img src={src} alt={`${index + 1}`} loading="lazy" onLoad={() => setLoaded(true)}
            className={`w-full h-auto block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
    </div>
  )
}
