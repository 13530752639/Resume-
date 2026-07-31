import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2
} from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title: string
  accentColor?: string
}

export default function VideoPlayer({ url, title, accentColor = '#00d4ff' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 确保以原始帧率播放
    video.playbackRate = 1
    video.defaultPlaybackRate = 1

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
      video.playbackRate = 1
    }
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)
    const handleEnded = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
      if (isPlaying) {
        hideControlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('touchstart', handleMouseMove)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('touchstart', handleMouseMove)
      }
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      setHasError(false)
      void video.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const vol = parseFloat(e.target.value)
    video.volume = vol
    video.muted = vol === 0
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      video.volume = volume || 1
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const toggleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00'
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group/video"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        aria-label={title}
      />

      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: accentColor }} />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black px-6 text-center">
          <div>
            <p className="text-white/80">视频暂时无法加载</p>
            <p className="mt-2 text-sm text-white/45">请检查网络后重新打开播放器。</p>
          </div>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showControls ? 1 : 0,
          y: showControls ? 0 : 20 
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 flex flex-col justify-end p-6 ${!showControls ? 'pointer-events-none' : ''}`}
      >
        {/* Top Bar - Title */}
        <div className="flex items-center mb-auto mt-4">
          <h4 className="text-lg font-semibold text-white drop-shadow-lg">{title}</h4>
        </div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && !isLoading && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={togglePlay}
            aria-label="播放视频"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 0 30px ${accentColor}40`
            }}
          >
            <Play className="w-9 h-9 text-black ml-1" fill="currentColor" />
          </motion.button>
        )}

        {/* Progress Bar */}
        <div className="mb-4 space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            aria-label="视频播放进度"
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accentColor} ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
            }}
          />
          
          <div className="flex items-center justify-between text-xs text-white/80 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? '暂停视频' : '播放视频'}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? '取消静音' : '静音'}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="视频音量"
                className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/20 opacity-0 group-hover/volume:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none"
                style={{
                  background: `linear-gradient(to right, ${accentColor} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? '退出全屏' : '进入全屏'}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-white" />
              ) : (
                <Maximize className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
