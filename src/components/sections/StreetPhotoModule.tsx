import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import streetTopics, { type StreetTopic } from '../../data/streetPhotos'

type Level = 0 | 1 | 2 | 3

interface StreetPhotoModuleProps {
  onBack: () => void
}

export default function StreetPhotoModule({ onBack }: StreetPhotoModuleProps) {
  const [level, setLevel] = useState<Level>(0)
  const [selectedTopic, setSelectedTopic] = useState<StreetTopic | null>(null)

  const handleSelectTopic = (topic: StreetTopic) => {
    setSelectedTopic(topic)
    setLevel(1)
  }

  const handleAdvance = () => {
    setLevel(prev => Math.min(3, prev + 1) as Level)
  }

  const handleBack = () => {
    if (level <= 1) {
      setLevel(0)
      setSelectedTopic(null)
    } else {
      setLevel((prev - 1) as Level)
    }
  }

  const levelLabels: Record<Level, string> = {
    0: '返回首页',
    1: '返回分类',
    2: '返回预览',
    3: '返回介绍',
  }

  return (
    <section className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {level === 0 && (
          <TopicSelector
            key="topic-selector"
            onSelect={handleSelectTopic}
            onBack={onBack}
          />
        )}
        {level === 1 && selectedTopic && (
          <CoverView
            key={`cover-${selectedTopic.id}`}
            topic={selectedTopic}
            onClick={handleAdvance}
            onBack={handleBack}
            backLabel={levelLabels[0]}
          />
        )}
        {level === 2 && selectedTopic && (
          <IntroView
            key={`intro-${selectedTopic.id}`}
            topic={selectedTopic}
            onClick={handleAdvance}
            onBack={handleBack}
            backLabel={levelLabels[1]}
          />
        )}
        {level === 3 && selectedTopic && (
          <GalleryView
            key={`gallery-${selectedTopic.id}`}
            topic={selectedTopic}
            onBack={handleBack}
            backLabel={levelLabels[2]}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─── Level 0: 主题选择 ─── */

function TopicSelector({
  onSelect,
  onBack,
}: {
  onSelect: (t: StreetTopic) => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col"
    >
      {/* 导航 */}
      <div className="px-6 md:px-12 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>
      </div>

      {/* 居中选项 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6">
        {streetTopics.map((topic, i) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
            onClick={() => onSelect(topic)}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide hover:text-red-400 transition-colors"
          >
            {topic.title}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Level 1: 封面视图 ─── */

function CoverView({
  topic,
  onClick,
  onBack,
  backLabel,
}: {
  topic: StreetTopic
  onClick: () => void
  onBack: () => void
  backLabel: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
    >
      {/* 背景图 70% 不透明度 */}
      <div className="absolute inset-0">
        <img
          src={topic.coverImage}
          alt={topic.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.7 }}
        />
      </div>

      {/* 暗色叠加 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 导航 */}
      <div className="relative z-10 px-6 md:px-12 py-6" onClick={e => e.stopPropagation()}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>
      </div>

      {/* 居中标题 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-widest drop-shadow-2xl"
        >
          {topic.enTitle}
        </motion.h1>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm animate-bounce pointer-events-none">
        点击继续
      </div>
    </motion.div>
  )
}

/* ─── Level 2: 介绍视图 ─── */

function IntroView({
  topic,
  onClick,
  onBack,
  backLabel,
}: {
  topic: StreetTopic
  onClick: () => void
  onBack: () => void
  backLabel: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-black cursor-pointer overflow-y-auto"
      onClick={onClick}
    >
      {/* 导航 */}
      <div className="relative z-10 px-6 md:px-12 py-6" onClick={e => e.stopPropagation()}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-6 md:px-12 lg:px-16 pt-4 pb-16 min-h-[calc(100vh-80px)]">
        {/* 左侧图片 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-1/2 flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <div className="rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <img
              src={topic.introImage}
              alt={topic.introTitle}
              className="w-full max-h-[60vh] object-cover"
            />
          </div>
        </motion.div>

        {/* 右侧文字 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full lg:w-1/2"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 tracking-wide">
            {topic.introTitle}
          </h2>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            {topic.introText}
          </p>
        </motion.div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm animate-bounce pointer-events-none">
        再次点击继续
      </div>
    </motion.div>
  )
}

/* ─── Level 3: 图库视图 ─── */

function GalleryView({
  topic,
  onBack,
  backLabel,
}: {
  topic: StreetTopic
  onBack: () => void
  backLabel: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-black overflow-y-auto"
    >
      {/* 导航 */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-sm px-6 md:px-12 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-16">
        {/* 大标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-wide"
        >
          {topic.title}
        </motion.h1>

        {/* 各板块 */}
        {topic.sections.map((section, sIdx) => (
          <SectionBlock key={section.name} section={section} isLast={sIdx === topic.sections.length - 1} />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── 板块区块 ─── */

function SectionBlock({ section, isLast }: { section: { name: string; images: string[] }; isLast: boolean }) {
  return (
    <div className={`mb-12 ${!isLast ? 'pb-12 border-b border-white/20' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧标题栏 1/5 */}
        <div className="md:w-1/5 flex-shrink-0">
          <h3 className="text-2xl md:text-3xl font-light text-amber-400 tracking-wide sticky top-24">
            {section.name}
          </h3>
        </div>

        {/* 右侧图片展示区 4/5 */}
        <div className="md:w-4/5">
          <AdaptiveImageGrid images={section.images} />
        </div>
      </div>
    </div>
  )
}

/* ─── 自适应图片网格 ─── */

function AdaptiveImageGrid({ images }: { images: string[] }) {
  const [, forceUpdate] = useState(0)
  const orientations = useRef<Map<string, 'landscape' | 'portrait'>>(new Map())

  const handleImageLoad = useCallback((src: string, img: HTMLImageElement) => {
    if (orientations.current.has(src)) return
    const ratio = img.naturalWidth / img.naturalHeight
    orientations.current.set(src, ratio >= 1 ? 'landscape' : 'portrait')
    forceUpdate(n => n + 1)
  }, [])

  // Lazy load images as they come into view
  const getImageSpan = (src: string) => {
    const orient = orientations.current.get(src)
    if (!orient) return 'col-span-1 row-span-1'
    return orient === 'landscape' ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
      {images.map((src, i) => (
        <LazyImage
          key={src}
          src={src}
          alt={`${i + 1}`}
          className={getImageSpan(src)}
          onLoad={(img) => handleImageLoad(src, img)}
        />
      ))}
    </div>
  )
}

/* ─── 懒加载图片 ─── */

function LazyImage({
  src,
  alt,
  className,
  onLoad,
}: {
  src: string
  alt: string
  className: string
  onLoad: (img: HTMLImageElement) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <div className="relative w-full overflow-hidden rounded bg-white/5" style={{ aspectRatio: '1' }}>
        {inView ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={(e) => {
              setLoaded(true)
              onLoad(e.currentTarget)
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        )}
      </div>
    </div>
  )
}
