import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import categoriesData from '../../data/categories.json'

const videoCategories = [
  { id: 'aigc', title: 'AIGC影像', enTitle: 'AIGC' },
  { id: 'documentary', title: '纪录片', enTitle: 'Documentary' },
  { id: 'special', title: '专题片', enTitle: 'Special' },
  { id: 'commercial', title: '宣传片', enTitle: 'Commercial' },
]

const photoCategories = [
  { id: 'news', title: '新闻摄影', enTitle: 'Journalism' },
  { id: 'feature', title: '专题摄影', enTitle: 'Documentary' },
  { id: 'art', title: '艺术摄影', enTitle: 'Art' },
  { id: 'portrait', title: '人像摄影', enTitle: 'Portrait' },
  { id: 'street', title: '街拍作品', enTitle: 'Streetphoto' },
]

export default function WorksCategorySection() {
  const { currentLevel, navigateTo } = useAppStore()
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const isVideoPage = currentLevel === 'video-works'
  const isPhotoPage = currentLevel === 'photo-works'
  const isMediaPage = currentLevel === 'media-works'

  const getTitle = () => {
    if (isVideoPage) return { main: '影像作品', hasStar: true }
    if (isPhotoPage) return { main: '摄影作品', hasStar: true }
    return { main: '自媒体作品', hasStar: true }
  }

  const getCategories = () => {
    if (isVideoPage) return videoCategories
    if (isPhotoPage) return photoCategories
    return []
  }

  const getWorksForCategory = (categoryId: string) => {
    if (isVideoPage) {
      return categoriesData.videoWorks[categoryId as keyof typeof categoriesData.videoWorks] || []
    }
    if (isPhotoPage) {
      return categoriesData.photoWorks[categoryId as keyof typeof categoriesData.photoWorks] || []
    }
    return []
  }

  const getNavLinks = () => {
    if (isVideoPage) {
      return [
        { label: '返回首页', action: () => navigateTo('home'), highlight: true },
        { label: '摄影作品', action: () => navigateTo('photo-works') },
        { label: '自媒体作品', action: () => navigateTo('media-works') },
        { label: '学术作品', action: () => navigateTo('academic-works') },
      ]
    }
    if (isPhotoPage) {
      return [
        { label: '返回首页', action: () => navigateTo('home'), highlight: true },
        { label: '影像作品', action: () => navigateTo('video-works') },
        { label: '自媒体作品', action: () => navigateTo('media-works') },
        { label: '学术作品', action: () => navigateTo('academic-works') },
      ]
    }
    return [
      { label: '返回首页', action: () => navigateTo('home'), highlight: true },
      { label: '影像作品', action: () => navigateTo('video-works') },
      { label: '摄影作品', action: () => navigateTo('photo-works') },
      { label: '学术作品', action: () => navigateTo('academic-works') },
    ]
  }

  const getBgImage = () => {
    if (isVideoPage) return '/covers/web/Webp/video-bg.jpg'
    if (isPhotoPage) return '/covers/web/Webp/photo-bg.jpg'
    return '/covers/web/Webp/video-bg.jpg'
  }

  const getBgOverlay = () => {
    if (isVideoPage) return 'bg-black/50'
    if (isPhotoPage) return 'bg-blue-900/30'
    return 'bg-black/50'
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedSubCategory(categoryId)
    setActiveWorkIndex(0)
  }

  const handleBack = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null)
      setActiveWorkIndex(0)
    } else {
      navigateTo('home')
    }
  }

  // Wheel handler for content view scroll switching
  const handleWheel = useCallback((e: WheelEvent) => {
    let works: any[] = []
    if (isMediaPage) {
      works = categoriesData.mediaWorks.filter(w => w.videoUrl)
    } else if (selectedSubCategory) {
      works = getWorksForCategory(selectedSubCategory)
    } else {
      return
    }
    if (works.length <= 1) return
    e.preventDefault()
    if (Math.abs(e.deltaY) < 40) return
    if (e.deltaY > 0) {
      setActiveWorkIndex(prev => Math.min(works.length - 1, prev + 1))
    } else {
      setActiveWorkIndex(prev => Math.max(0, prev - 1))
    }
  }, [selectedSubCategory, isMediaPage])

  useEffect(() => {
    const el = contentRef.current
    const shouldListen = isMediaPage || !!selectedSubCategory
    if (el && shouldListen) {
      el.addEventListener('wheel', handleWheel, { passive: false })
      return () => el.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel, selectedSubCategory, isMediaPage])

  const currentWorks = selectedSubCategory ? getWorksForCategory(selectedSubCategory) : []
  const currentWork = currentWorks[activeWorkIndex]
  const navLinks = getNavLinks()
  const titleInfo = getTitle()

  return (
    <section ref={contentRef} className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={getBgImage()} alt="Background" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${getBgOverlay()}`} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation bar */}
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedSubCategory ? '返回分类' : '返回首页'}
          </button>

          <nav className="flex items-center gap-3 md:gap-5 text-sm flex-wrap justify-end">
            {navLinks.map((link, i) => (
              <span key={link.label} className="flex items-center gap-3 md:gap-5">
                {i > 0 && <span className="text-white/20">|</span>}
                <button
                  onClick={link.action}
                  className={`transition-colors ${
                    link.highlight
                      ? 'text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            {!selectedSubCategory ? (
              /* ── 分类选择视图 ── */
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full px-6 md:px-12 lg:px-16"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-12 tracking-wide max-w-3xl">
                  {titleInfo.main}
                  {titleInfo.hasStar && <span className="text-red-600 ml-3">*</span>}
                </h1>

                {isMediaPage ? (
                  /* 自媒体作品: 直接播放视频列表 */
                  <MediaDirectView
                    works={categoriesData.mediaWorks}
                    activeIndex={activeWorkIndex}
                    onIndexChange={setActiveWorkIndex}
                  />
                ) : (
                  /* 影像/摄影: 分类列表 */
                  <ul className="space-y-5 max-w-xl">
                    {getCategories().map((category, index) => (
                      <motion.li
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      >
                        <button
                          onClick={() => handleCategoryClick(category.id)}
                          className="group flex items-baseline gap-3 text-left hover:text-red-400 transition-colors text-white"
                        >
                          <span className="text-white/40 group-hover:text-red-400 transition-colors">•</span>
                          <span className="text-xl md:text-2xl font-normal">{category.title}</span>
                          {category.enTitle && (
                            <span className="text-base md:text-lg text-white/40 font-light italic">
                              {category.enTitle}
                            </span>
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ) : (
              /* ── 内容播放视图 ── */
              <ContentPlayer
                works={currentWorks}
                activeIndex={activeWorkIndex}
                onIndexChange={setActiveWorkIndex}
                isVideo={isVideoPage || isMediaPage}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ─── 内容播放器子组件 ─── */

function ContentPlayer({
  works,
  activeIndex,
  onIndexChange,
  isVideo,
}: {
  works: any[]
  activeIndex: number
  onIndexChange: (i: number) => void
  isVideo: boolean
}) {
  const work = works[activeIndex]
  if (!work) return null

  return (
    <motion.div
      key="content-player"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl"
        >
          {/* 媒体内容 */}
          <div className="rounded-lg overflow-hidden shadow-2xl bg-black/80">
            {isVideo && work.videoUrl ? (
              <video
                key={work.id}
                src={work.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full max-h-[65vh] object-contain"
              />
            ) : (
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full max-h-[65vh] object-contain"
              />
            )}
          </div>

          {/* 作品信息 */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
              {work.title}
            </h2>
            {work.titleEn && (
              <p className="text-lg text-red-400 italic mt-1">{work.titleEn}</p>
            )}
            {work.description && (
              <p className="text-white/60 mt-3 max-w-xl mx-auto text-sm md:text-base">
                {work.description}
              </p>
            )}
            {work.duration && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                {work.duration}
              </span>
            )}
          </div>

          {/* 分页指示器 */}
          {works.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex gap-2">
                {works.map((w: any, i: number) => (
                  <button
                    key={w.id}
                    onClick={() => onIndexChange(i)}
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? 'w-10 bg-red-600'
                        : 'w-4 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm">
                {activeIndex + 1} / {works.length}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 滚动提示 */}
      {works.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-sm flex items-center gap-2 animate-bounce">
          <span>滚动切换</span>
          <span>↓</span>
        </div>
      )}
    </motion.div>
  )
}

/* ─── 自媒体作品直接播放 ─── */

function MediaDirectView({
  works,
  activeIndex,
  onIndexChange,
}: {
  works: any[]
  activeIndex: number
  onIndexChange: (i: number) => void
}) {
  const work = works[activeIndex]
  if (!work) return null

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl"
        >
          <div className="rounded-lg overflow-hidden shadow-2xl bg-black/80">
            {work.videoUrl ? (
              <video
                key={work.id}
                src={work.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full max-h-[65vh] object-contain"
              />
            ) : (
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full max-h-[65vh] object-contain"
              />
            )}
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
              {work.title}
            </h2>
            {work.titleEn && (
              <p className="text-lg text-red-400 italic mt-1">{work.titleEn}</p>
            )}
            {work.description && (
              <p className="text-white/60 mt-3 max-w-xl mx-auto text-sm md:text-base">
                {work.description}
              </p>
            )}
          </div>

          {works.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex gap-2">
                {works.map((w: any, i: number) => (
                  <button
                    key={w.id}
                    onClick={() => onIndexChange(i)}
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? 'w-10 bg-red-600'
                        : 'w-4 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm">
                {activeIndex + 1} / {works.length}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {works.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-sm flex items-center gap-2 animate-bounce">
          <span>滚动切换</span>
          <span>↓</span>
        </div>
      )}
    </div>
  )
}
