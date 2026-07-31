import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { resolveMediaUrl } from '../../config/media'
import categoriesData from '../../data/categories.json'
import StreetPhotoModule from './StreetPhotoModule'
import PortraitPhotoModule from './PortraitPhotoModule'
import NewsPhotoModule from './NewsPhotoModule'
import FeaturePhotoModule from './FeaturePhotoModule'

const videoCategories = [
  { id: 'aigc', title: 'AIGC影像', enTitle: 'AIGC' },
  { id: 'documentary', title: '纪录片', enTitle: 'Documentary' },
  { id: 'special', title: '专题片', enTitle: 'Special' },
  { id: 'commercial', title: '宣传片', enTitle: 'Commercial' },
]

const photoCategories = [
  { id: 'street', title: '街头摄影', enTitle: 'Streetphoto' },
  { id: 'portrait', title: '人像摄影', enTitle: 'Portrait' },
  { id: 'news', title: '新闻摄影', enTitle: 'Journalism' },
  { id: 'feature', title: '专题摄影', enTitle: 'Documentary' },
]

/* ─── 滚动防抖 hook ─── */

function useScrollDebounce(
  onScroll: (deltaY: number) => void,
  enabled: boolean,
  cooldownMs = 800
) {
  const lastTimeRef = useRef(0)

  const handler = useCallback((e: WheelEvent) => {
    if (!enabled) return
    e.preventDefault()
    const now = Date.now()
    if (now - lastTimeRef.current < cooldownMs) return
    if (Math.abs(e.deltaY) < 30) return
    lastTimeRef.current = now
    onScroll(e.deltaY)
  }, [enabled, cooldownMs, onScroll])

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [handler, enabled])
}

export default function WorksCategorySection() {
  const { currentLevel, navigateTo } = useAppStore()
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)

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
    if (isVideoPage) return '/covers/video-bg.jpg'
    if (isPhotoPage) return '/covers/photo-bg.jpg'
    return '/covers/video-bg.jpg'
  }

  const getBgOverlay = () => {
    if (isVideoPage) return 'bg-black/50'
    if (isPhotoPage) return 'bg-blue-900/30'
    return 'bg-black/50'
  }

  const getFullscreenWorks = () => {
    if (isMediaPage) return categoriesData.mediaWorks
    if (selectedSubCategory) return getWorksForCategory(selectedSubCategory)
    return []
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

  const handleFullscreenBack = () => {
    setSelectedSubCategory(null)
    setActiveWorkIndex(0)
  }

  const fullscreenWorks = getFullscreenWorks()
  const isFullscreen = (isMediaPage && !selectedSubCategory) || (!!selectedSubCategory && !(isPhotoPage && (selectedSubCategory === 'street' || selectedSubCategory === 'portrait' || selectedSubCategory === 'news' || selectedSubCategory === 'feature')))

  // 滚动防抖切换
  const handleScrollSwitch = useCallback((deltaY: number) => {
    if (fullscreenWorks.length <= 1) return
    if (deltaY > 0) {
      setActiveWorkIndex(prev => Math.min(fullscreenWorks.length - 1, prev + 1))
    } else {
      setActiveWorkIndex(prev => Math.max(0, prev - 1))
    }
  }, [fullscreenWorks.length])

  useScrollDebounce(handleScrollSwitch, isFullscreen, 800)

  const currentWorks = selectedSubCategory ? getWorksForCategory(selectedSubCategory) : []
  const navLinks = getNavLinks()
  const titleInfo = getTitle()

  const isStreetPhoto = isPhotoPage && selectedSubCategory === 'street'
  const isPortraitPhoto = isPhotoPage && selectedSubCategory === 'portrait'
  const isNewsPhoto = isPhotoPage && selectedSubCategory === 'news'
  const isFeaturePhoto = isPhotoPage && selectedSubCategory === 'feature'

  return (
    <section className="relative min-h-screen overflow-hidden">
      {!isFullscreen && !isStreetPhoto && !isPortraitPhoto && !isNewsPhoto && !isFeaturePhoto && (
        <div className="absolute inset-0">
          <img src={getBgImage()} alt="Background" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${getBgOverlay()}`} />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence>
          {isFullscreen && (
            <FullscreenPlayer
              key="content-fullscreen"
              works={fullscreenWorks}
              activeIndex={activeWorkIndex}
              onIndexChange={setActiveWorkIndex}
              onBack={handleFullscreenBack}
              navLinks={navLinks}
              isVideo={isVideoPage || isMediaPage}
              isMedia={isMediaPage}
            />
          )}
          {isStreetPhoto && (
            <StreetPhotoModule key="street-photo" onBack={handleFullscreenBack} />
          )}
          {isPortraitPhoto && (
          <PortraitPhotoModule key="portrait-photo" onBack={handleFullscreenBack} />
        )}
        {isNewsPhoto && (
          <NewsPhotoModule key="news-photo" onBack={handleFullscreenBack} />
        )}
        {isFeaturePhoto && (
          <FeaturePhotoModule key="feature-photo" onBack={handleFullscreenBack} />
        )}
      </AnimatePresence>

        {!isFullscreen && !isStreetPhoto && !isPortraitPhoto && !isNewsPhoto && !isFeaturePhoto && (
          <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
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
        )}

        {!isFullscreen && !isStreetPhoto && !isPortraitPhoto && !isNewsPhoto && !isFeaturePhoto && (
        <div className="flex-1 flex items-center">
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full px-6 md:px-12 lg:px-16"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-12 tracking-wide max-w-3xl">
                {titleInfo.main}
                {titleInfo.hasStar && <span className="text-red-600 ml-3">*</span>}
              </h1>
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
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── 全屏播放器（含播放控件 + 手动跳转） ─── */

function FullscreenPlayer({
  works,
  activeIndex,
  onIndexChange,
  onBack,
  navLinks,
  isVideo,
  isMedia,
}: {
  works: any[]
  activeIndex: number
  onIndexChange: (i: number) => void
  onBack: () => void
  navLinks: { label: string; action: () => void; highlight?: boolean }[]
  isVideo: boolean
  isMedia: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playerMode, setPlayerMode] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [buffering, setBuffering] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const work = works[activeIndex]

  // 同步视频时间
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTime = () => setCurrentTime(video.currentTime)
    const onMeta = () => setDuration(video.duration)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onWaiting = () => setBuffering(true)
    const onCanPlay = () => setBuffering(false)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('canplay', onCanPlay)
    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [activeIndex, playerMode])

  // 切换视频时重置状态
  useEffect(() => {
    setPlaying(false)
    setIsMuted(false)
    setSpeed(1)
    setCurrentTime(0)
    setDuration(0)
    setBuffering(false)
    setVideoError(false)
    setPlayerMode(false)
  }, [activeIndex])

  const enterPlayer = () => {
    setPlayerMode(true)
    setShowControls(true)
    setIsMuted(false)
    setVideoError(false)
  }

  const exitPlayer = () => {
    videoRef.current?.pause()
    setPlayerMode(false)
    setPlaying(false)
    setBuffering(false)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      setVideoError(false)
      void videoRef.current.play().catch(() => {
        setPlaying(false)
        setBuffering(false)
      })
    } else {
      videoRef.current.pause()
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation()
    const speeds = [0.75, 1, 1.25, 1.5, 2]
    const idx = speeds.indexOf(speed)
    const next = speeds[(idx + 1) % speeds.length]
    if (videoRef.current) videoRef.current.playbackRate = next
    setSpeed(next)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (t: number) => {
    if (isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const resetControlsTimer = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 4000)
  }

  useEffect(() => {
    if (!playerMode) {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
      return
    }

    setShowControls(true)
    resetControlsTimer()
    const video = videoRef.current
    if (video) {
      video.muted = false
      video.playbackRate = speed
      void video.play().catch(() => setPlaying(false))
    }

    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [playerMode])

  const handlePlayerAreaClick = () => {
    if (!playerMode) return
    setShowControls(prev => !prev)
    if (!showControls) resetControlsTimer()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // AnimatePresence 退出期间路由可能已切到一个没有全屏作品的分类。
  // 所有 hooks 必须先执行，避免路由切换时出现 hooks 数量不一致并导致白屏。
  if (!work) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* 背景媒体层 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {playerMode && isVideo && work.videoUrl ? (
            videoError ? (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white/60">
                视频暂时无法加载，请检查网络后重试。
              </div>
            ) : (
            <video
              ref={videoRef}
              src={resolveMediaUrl(work.videoUrl)}
              poster={work.thumbnail}
              autoPlay
              muted={isMuted}
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-contain"
              onError={() => {
                setVideoError(true)
                setBuffering(false)
                setPlaying(false)
              }}
            />
            )
          ) : (
            <img
              src={work.thumbnail}
              alt={work.title}
              className="absolute inset-0 w-full h-full object-cover"
              decoding="async"
              loading="eager"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 暗色渐变叠加层（非播放器模式时显示，确保文字可读） */}
      {!playerMode && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none" />
      )}

      {/* ── 非播放器模式：文字叠加 + 点击进入提示 ── */}
      {!playerMode && (
        <>
          {/* 顶部导航栏 */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6">
            <button
              onClick={onBack}
              aria-label={isMedia ? '返回首页' : '返回分类'}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {isMedia ? '返回首页' : '返回分类'}
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

          {/* 居中文字 + 点击进入播放器 */}
          <div
            role={isVideo && work.videoUrl ? 'button' : undefined}
            tabIndex={isVideo && work.videoUrl ? 0 : undefined}
            aria-label={isVideo && work.videoUrl ? `播放《${work.title}》` : undefined}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 cursor-pointer"
            onClick={() => isVideo && work.videoUrl && enterPlayer()}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && isVideo && work.videoUrl) {
                event.preventDefault()
                enterPlayer()
              }
            }}
          >
            <motion.div
              key={`text-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide drop-shadow-lg">
                {work.title}
              </h2>
              {work.titleEn && (
                <p className="text-xl md:text-2xl text-red-400 italic mt-2 drop-shadow-lg">
                  {work.titleEn}
                </p>
              )}
              {work.description && (
                <p className="text-white/80 mt-4 max-w-xl mx-auto text-sm md:text-base drop-shadow-md">
                  {work.description}
                </p>
              )}
              {work.duration && (
                <span className="inline-block mt-4 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs backdrop-blur-sm">
                  {work.duration}
                </span>
              )}
            </motion.div>
            {isVideo && work.videoUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center gap-2 text-white/60 text-sm"
              >
                <Play className="w-4 h-4" />
                <span>点击进入播放器</span>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* ── 播放器模式：完整播放控件 ── */}
      {playerMode && (
        <div className="absolute inset-0 z-30" onClick={handlePlayerAreaClick}>
          {/* 退出播放器按钮 */}
          <button
            onClick={exitPlayer}
            aria-label="退出播放器"
            className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* 中央播放/暂停按钮 */}
          {!playing && !buffering && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={togglePlay}
              aria-label="播放视频"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </motion.button>
          )}

          {/* 缓冲加载指示器 */}
          {buffering && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white/60 text-xs">加载中...</span>
            </div>
          )}

          {/* 底部控制栏 */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-6 pb-6 pt-12"
              >
                {/* 进度条 */}
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="视频播放进度"
                    className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/20
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-red-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #dc2626 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 控制按钮行 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* 播放/暂停 */}
                    <button
                      onClick={togglePlay}
                      aria-label={playing ? '暂停视频' : '播放视频'}
                      className="text-white hover:text-red-400 transition-colors"
                    >
                      {playing ? <Pause className="w-6 h-6" fill="white" /> : <Play className="w-6 h-6" fill="white" />}
                    </button>

                    {/* 音量 */}
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? '取消静音' : '静音'}
                      className="text-white hover:text-red-400 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* 倍速 */}
                  <button
                    onClick={cycleSpeed}
                    aria-label={`当前播放速度 ${speed} 倍，点击切换`}
                    className="px-3 py-1 rounded text-white/80 hover:text-white hover:bg-white/10 text-sm transition-colors"
                  >
                    {speed}x
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── 底部：手动序号跳转 ── */}
      {works.length > 1 && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 ${playerMode ? 'bottom-24' : 'bottom-10'}`}>
          <div className="flex gap-2">
            {works.map((w: any, i: number) => (
              <button
                key={w.id}
                onClick={() => onIndexChange(i)}
                aria-label={`查看第 ${i + 1} 个作品：${w.title}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                  i === activeIndex
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-110'
                    : 'bg-white/10 text-white/60 hover:bg-white/25 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="text-white/40 text-sm min-w-[3rem] text-center">
            {activeIndex + 1} / {works.length}
          </span>
        </div>
      )}

      {/* 滚动提示（非播放器模式） */}
      {!playerMode && works.length > 1 && (
        <div className={`absolute left-1/2 -translate-x-1/2 text-white/30 text-sm flex items-center gap-2 animate-bounce pointer-events-none ${works.length > 1 ? 'bottom-20' : 'bottom-8'}`}>
          <span>滚动切换</span>
          <span>↓</span>
        </div>
      )}
    </motion.div>
  )
}
