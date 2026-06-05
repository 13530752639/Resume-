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

  return (
    <section className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {level === 0 && (
          <TopicSelector key="topic-selector" onSelect={handleSelectTopic} onBack={onBack} />
        )}
        {level === 1 && selectedTopic && (
          <CoverView key={`cover-${selectedTopic.id}`} topic={selectedTopic} onClick={handleAdvance} onBack={handleBack} />
        )}
        {level === 2 && selectedTopic && (
          <IntroView key={`intro-${selectedTopic.id}`} topic={selectedTopic} onClick={handleAdvance} onBack={handleBack} />
        )}
        {level === 3 && selectedTopic && (
          <GalleryView key={`gallery-${selectedTopic.id}`} topic={selectedTopic} onBack={handleBack} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─── Level 0: 主题选择 ─── */

function TopicSelector({ onSelect, onBack }: { onSelect: (t: StreetTopic) => void; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex flex-col">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <img src="/covers/web/PNG/封面_副本.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 导航 */}
      <div className="relative z-10 px-6 md:px-12 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> 返回摄影集
        </button>
      </div>

      {/* 横向按钮 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 px-6">
          {streetTopics.map((topic, i) => (
            <motion.button key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(topic)}
              className="px-10 py-3 rounded-full bg-white/90 hover:bg-white text-black font-medium transition-all shadow-lg backdrop-blur-sm text-lg"
            >
              {topic.title}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Level 1: 封面视图（参照设计图1） ─── */

function CoverView({ topic, onClick, onBack }: { topic: StreetTopic; onClick: () => void; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
    >
      {/* 全屏背景图 */}
      <img src={topic.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />

      {/* 暗色渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* 导航栏 — 独立可点击区域 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-6">
        <button
          onClick={(e) => { e.stopPropagation(); onBack() }}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm rounded px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" /> 返回分类
        </button>
      </div>

      {/* 居中英文标题 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <motion.h1 initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.15em]"
        >
          {topic.enTitle}
        </motion.h1>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/35 text-xs tracking-widest uppercase pointer-events-none">
        点击继续 ↓
      </div>
    </motion.div>
  )
}

/* ─── Level 2: 介绍视图（参照设计图2） ─── */

function IntroView({ topic, onClick, onBack }: { topic: StreetTopic; onClick: () => void; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-[#141414] cursor-pointer overflow-y-auto"
      onClick={onClick}
    >
      {/* 导航栏 — 独立可点击 */}
      <nav className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-md px-6 md:px-12 py-5 border-b border-white/5">
        <button
          onClick={(e) => { e.stopPropagation(); onBack() }}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm rounded px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" /> 返回预览
        </button>
      </nav>

      {/* 内容区 — 点击不触发前进 */}
      <div className="min-h-[calc(100vh-60px)] flex items-center px-6 md:px-12 lg:px-20 py-8 lg:py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* 左侧图片 — 参照设计图：紧凑照片卡片 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[42%] flex-shrink-0"
          >
            <div className="overflow-hidden shadow-2xl shadow-black/50">
              <img
                src={topic.introImage}
                alt=""
                className="w-full h-auto max-h-[55vh] object-cover"
              />
            </div>
          </motion.div>

          {/* 右侧文字 — 参照设计图：标题+正文 */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[58%] pt-2"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-5">
              {topic.introTitle}
            </h2>
            <p className="text-gray-400 leading-loose text-sm md:text-base">
              {topic.introText}
            </p>

            {/* 点击继续提示 */}
            <div className="mt-8 text-white/25 text-xs">再次点击进入画廊 →</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Level 3: 图库视图（参照设计图3 — masonry 瀑布流） ─── */

function GalleryView({ topic, onBack }: { topic: StreetTopic; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="absolute inset-0 bg-[#111] overflow-y-auto"
    >
      {/* 导航栏 — 独立可点击，z-index 最高确保可操作 */}
      <nav className="sticky top-0 z-50 bg-[#111]/95 backdrop-blur-md px-6 md:px-12 py-5 border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm rounded px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" /> 返回介绍
        </button>
      </nav>

      {/* 大标题 */}
      <div className="px-6 md:px-12 lg:px-20 pt-8 pb-6">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-wide"
        >
          {topic.title}
        </motion.h1>
      </div>

      {/* 各板块 */}
      <div className="px-6 md:px-12 lg:px-20 pb-20">
        {topic.sections.map((section, sIdx) => (
          <SectionBlock key={section.name} section={section} isLast={sIdx === topic.sections.length - 1} />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── 板块区块（参照设计图3） ─── */

function SectionBlock({ section, isLast }: { section: { name: string; images: string[] }; isLast: boolean }) {
  return (
    <div className={`${!isLast ? 'pb-14 mb-14 border-b border-white/[0.07]' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* 左侧标题栏 */}
        <div className="md:w-[13%] flex-shrink-0 pt-1">
          <h3 className="text-base md:text-lg font-medium text-amber-500/80 tracking-wider whitespace-nowrap">
            {section.name}
          </h3>
        </div>

        {/* 右侧 masonry 图片区 */}
        <div className="md:w-[87%]">
          <MasonryGrid images={section.images} />
        </div>
      </div>
    </div>
  )
}

/* ─── Masonry 瀑布流网格（按原始宽高比展示，禁止裁切） ─── */

function MasonryGrid({ images }: { images: string[] }) {
  // 使用 CSS columns 实现真正的 masonry 布局
  // 图片保持原始宽高比，从上到下、从左到右自然排列
  return (
    <div
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3"
      style={{ breakInside: 'avoid' } as React.CSSProperties}
    >
      {images.map((src, i) => (
        <MasonryImage key={src} src={src} index={i} />
      ))}
    </div>
  )
}

/* ─── 单张 masonry 图片 ─── */

function MasonryImage({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="break-inside-avoid mb-3">
      <div className="overflow-hidden rounded bg-white/[0.04]">
        {!inView && <div className="animate-pulse bg-white/[0.04]" style={{ paddingTop: '75%' }} />}
        {inView && (
          <img
            src={src}
            alt={`${index + 1}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-auto block transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
    </div>
  )
}
