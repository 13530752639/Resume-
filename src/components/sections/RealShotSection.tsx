import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, Camera, Film, X } from 'lucide-react'
import VideoPlayer from '../ui/VideoPlayer'

interface Work {
  id: string
  title: string
  category: 'aigc' | 'real-shot'
  description: string
  briefDescription: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  createdAt: string
  tags: string[]
  technicalInfo?: {
    resolution?: string
    aiTools?: string[]
    cameraEquipment?: string
    postSoftware?: string
  }
}

interface RealShotSectionProps {
  works: Work[]
  onVideoOpen: (url: string, title: string, category: 'aigc' | 'real-shot') => void
}

export default function RealShotSection({ works, onVideoOpen }: RealShotSectionProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  return (
    <section id="real-shot-works" className="relative py-24 md:py-32 film-grain">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-black via-cinema-dark/50 to-cinema-black" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-3xl" />
      
      {/* Film Strip Decoration */}
      <div className="absolute top-20 left-0 right-0 overflow-hidden opacity-5">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Film className="w-6 h-6 text-accent-orange" />
              <div className="w-16 h-12 bg-accent-orange/30 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-accent-orange to-accent-orange/20 rounded-full" />
            <span className="text-sm font-mono text-accent-orange uppercase tracking-[0.3em]">Real Shot Works</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-cinema-light">镜头捕捉的</span>
            <br />
            <span className="text-gradient-orange">真实影像故事</span>
          </h2>
          
          <p className="text-lg text-cinema-muted max-w-2xl leading-relaxed">
            每一次快门都是对现实的凝视，每一帧画面都承载着真实情感的温度。
            从纪录片到艺术短片，用镜头语言记录时代，用影像力量触动人心。
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-accent-orange" />
              <div>
                <p className="text-2xl font-bold text-cinema-light">{works.length}</p>
                <p className="text-xs text-cinema-muted uppercase tracking-wider">部作品</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(works.flatMap(w => w.tags))).slice(0, 4).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Film-style Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedWork(work)}
              className="group cursor-pointer relative"
            >
              {/* Film Frame Container */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-cinema-gray">
                {/* Film Sprocket Holes - Left */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-cinema-dark flex flex-col justify-around py-2 z-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 mx-auto rounded-sm bg-accent-orange/20 group-hover:bg-accent-orange/40 transition-colors" />
                  ))}
                </div>

                {/* Film Sprocket Holes - Right */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-cinema-dark flex flex-col justify-around py-2 z-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 mx-auto rounded-sm bg-accent-orange/20 group-hover:bg-accent-orange/40 transition-colors" />
                  ))}
                </div>

                {/* Main Image Area */}
                <div className="absolute left-6 right-6 top-0 bottom-0 rounded overflow-hidden">
                  <img
                    src={work.thumbnailUrl}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Play Button with Film Reel Animation */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative">
                      {/* Outer rotating ring */}
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-24 h-24 -m-2 rounded-full border-2 border-dashed border-accent-orange/40"
                      />
                      
                      {/* Main play button */}
                      <div className="w-20 h-20 rounded-full bg-accent-orange/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-accent-orange/30 group-hover:animate-pulse-slow relative z-10">
                        <Play className="w-8 h-8 text-cinema-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Duration Badge - Film Style */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-effect">
                    <Film className="w-3.5 h-3.5 text-accent-orange" />
                    <span className="text-xs font-semibold text-cinema-light font-mono">{work.duration}</span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                    <h3 className="font-display text-lg font-semibold text-cinema-light group-hover:text-accent-orange transition-colors line-clamp-1">
                      {work.title}
                    </h3>
                    
                    <p className="text-sm text-cinema-muted line-clamp-2 group-hover:text-cinema-light/80 transition-colors">
                      {work.briefDescription}
                    </p>

                    {/* Equipment Tag */}
                    {work.technicalInfo?.cameraEquipment && (
                      <div className="flex items-center gap-2 pt-2">
                        <Camera className="w-3 h-3 text-accent-orange" />
                        <span className="text-xs text-cinema-muted group-hover:text-accent-orange/80 transition-colors">
                          {work.technicalInfo.cameraEquipment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Glow Border Effect */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 2px rgba(255, 107, 53, 0.3), 0 0 20px rgba(255, 107, 53, 0.15)`
                  }}
                />
              </div>

              {/* Film Frame Number (decorative) */}
              <div className="absolute -bottom-6 left-6 right-6 flex justify-between text-xs font-mono text-cinema-muted/40">
                <span>#{String(index + 1).padStart(3, '0')}</span>
                <span>{work.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedWork && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWork(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-4 md:inset-12 lg:inset-24 bg-cinema-dark rounded-3xl overflow-hidden z-50 flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedWork(null)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-cinema-light" />
                </button>

                {/* Video Player Area */}
                <div className="flex-1 relative bg-black">
                  <VideoPlayer
                    url={selectedWork.videoUrl}
                    title={selectedWork.title}
                    accentColor="#ff6b35"
                  />
                </div>

                {/* Info Panel */}
                <div className="p-8 border-t border-white/5 space-y-6 max-h-[40vh] overflow-y-auto">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-cinema-light mb-2">
                      {selectedWork.title}
                    </h3>
                    <p className="text-cinema-muted">{selectedWork.description}</p>
                  </div>

                  {selectedWork.technicalInfo && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-xs text-cinema-muted uppercase tracking-wider mb-1">分辨率</p>
                        <p className="text-sm font-semibold text-cinema-light">{selectedWork.technicalInfo.resolution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cinema-muted uppercase tracking-wider mb-1">拍摄设备</p>
                        <p className="text-sm font-semibold text-accent-orange">{selectedWork.technicalInfo.cameraEquipment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cinema-muted uppercase tracking-wider mb-1">后期软件</p>
                        <p className="text-sm font-semibold text-cinema-light">{selectedWork.technicalInfo.postSoftware}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cinema-muted uppercase tracking-wider mb-1">创作时间</p>
                        <p className="text-sm font-semibold text-cinema-light">{selectedWork.createdAt}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selectedWork.tags.map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full text-sm bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
