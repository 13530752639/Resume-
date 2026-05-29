import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Search, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import VideoPlayer from '../ui/VideoPlayer'

export default function WorkDetailSection() {
  const { selectedWork, navigateTo } = useAppStore()
  const [showVideo, setShowVideo] = useState(false)

  const work = selectedWork || {
    id: '',
    title: '精选作品',
    titleEn: 'Featured Work',
    category: '',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cinematic+film+scene+dramatic+lighting+emotional+moment+film+still+professional+cinematography&image_size=landscape_16_9',
    duration: '',
    description: '',
    videoUrl: null
  }

  const handlePlay = () => {
    if (work.videoUrl) {
      setShowVideo(true)
    }
  }

  const handleBack = () => {
    navigateTo('video-works')
  }

  const detailMeta = [
    work.category,
    work.duration,
  ].filter(Boolean)

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {!showVideo && (
        <div className="absolute inset-0">
          {work.videoUrl ? (
            <video
              src={work.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src={work.thumbnail}
              alt={work.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {!showVideo ? (
        <div className="relative z-10 h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16">
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-2 tracking-wide">
                {work.title}
              </h1>
              {work.titleEn && (
                <p className="text-3xl md:text-4xl lg:text-5xl font-light text-red-500 italic tracking-wide">
                  {work.titleEn}
                </p>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 text-white/80 text-sm md:text-base max-w-md mx-auto"
              >
                {detailMeta.length > 0 && (
                  <p>{detailMeta.join(' | ')}{work.category.includes('导演') ? '' : ''}</p>
                )}
                {work.description && (
                  <p className="mt-2 text-white/60">{work.description}</p>
                )}
              </motion.div>
            </motion.div>
          </div>

          <div className="flex items-end justify-between">
            <nav className="flex items-center gap-4 md:gap-8 text-xs md:text-sm text-white/70">
              <button onClick={handleBack} className="hover:text-white transition-colors">
                返回作品集
              </button>
              <button onClick={() => navigateTo('video-works')} className="hover:text-white transition-colors">
                影像作品
              </button>
              <button onClick={() => navigateTo('photo-works')} className="hover:text-white transition-colors">
                摄影作品
              </button>
              <button onClick={() => navigateTo('media-works')} className="hover:text-white transition-colors">
                自媒体作品
              </button>
            </nav>

            <div className="flex items-center gap-4">
              {work.videoUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                  className="px-8 py-3 rounded-full bg-white/90 hover:bg-white text-black font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm"
                >
                  <Play className="w-4 h-4" fill="black" />
                  播放
                </motion.button>
              )}

              <button
                onClick={() => navigateTo('video-works')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black"
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <VideoPlayer
              url={work.videoUrl}
              title={work.title}
              accentColor="#e63946"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}
