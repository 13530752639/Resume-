import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, Cpu, X, ChevronLeft, ChevronRight } from 'lucide-react'
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

interface AIGCSectionProps {
  works: Work[]
  onVideoOpen: (url: string, title: string, category: 'aigc' | 'real-shot') => void
}

export default function AIGCSection({ works, onVideoOpen }: AIGCSectionProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  return (
    <section id="aigc-works" className="relative py-24 md:py-32 film-grain">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-black via-cinema-dark/50 to-cinema-black" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl" />
      
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
            <div className="w-1 h-12 bg-gradient-to-b from-accent-blue to-accent-blue/20 rounded-full" />
            <span className="text-sm font-mono text-accent-blue uppercase tracking-[0.3em]">AIGC Works</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-cinema-light">AI驱动的</span>
            <br />
            <span className="text-gradient-blue">创意影像作品</span>
          </h2>
          
          <p className="text-lg text-cinema-muted max-w-2xl leading-relaxed">
            探索人工智能与影视艺术的融合边界，运用前沿AIGC工具创造独特的视觉叙事体验。
            每一件作品都是算法与创意的对话，展现数字时代影像表达的无限可能。
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-accent-blue" />
              <div>
                <p className="text-2xl font-bold text-cinema-light">{works.length}</p>
                <p className="text-xs text-cinema-muted uppercase tracking-wider">件作品</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(works.flatMap(w => w.tags))).slice(0, 4).map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedWork(work)}
              className="group cursor-pointer"
            >
              {/* Card Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-cinema-gray border border-white/5 hover:border-accent-blue/30 transition-all duration-300">
                {/* Thumbnail */}
                <img
                  src={work.thumbnailUrl}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-accent-blue/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-accent-blue/30 group-hover:animate-pulse-slow">
                    <Play className="w-8 h-8 text-cinema-black ml-1" fill="currentColor" />
                  </div>
                </motion.div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-effect">
                  <Clock className="w-3.5 h-3.5 text-accent-blue" />
                  <span className="text-xs font-semibold text-cinema-light">{work.duration}</span>
                </div>

                {/* Bottom Info Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <h3 className="font-display text-xl font-semibold text-cinema-light group-hover:text-accent-blue transition-colors line-clamp-1">
                    {work.title}
                  </h3>
                  
                  <p className="text-sm text-cinema-muted line-clamp-2 group-hover:text-cinema-light/80 transition-colors">
                    {work.briefDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {work.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-cinema-muted group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-accent-blue/20 group-hover:shadow-xl group-hover:shadow-accent-blue/10" />
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
                    accentColor="#00d4ff"
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
                        <p className="text-xs text-cinema-muted uppercase tracking-wider mb-1">AI工具</p>
                        <p className="text-sm font-semibold text-accent-blue">{selectedWork.technicalInfo.aiTools?.join(', ')}</p>
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
                      <span key={tag} className="px-4 py-2 rounded-full text-sm bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
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
