import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { worksData } from '../../store/useAppStore'

const categories = [
  { id: 'aigc', title: 'AIGC短片', type: 'aigc' as const },
  { id: 'documentary', title: '纪录片', type: 'aigc' as const },
  { id: 'special', title: '专题片', type: 'aigc' as const },
  { id: 'short-video', title: '短视频', type: 'aigc' as const }
]

export default function WorksSection() {
  const { navigateTo, selectCategory, selectedCategory, selectWork } = useAppStore()
  const [hoveredWork, setHoveredWork] = useState<string | null>(null)

  const handleBack = () => {
    navigateTo('intro')
  }

  const handleCategoryClick = (category: typeof categories[0]) => {
    selectCategory(category)
  }

  const handleWorkClick = (work: typeof worksData.aigcWorks[0]) => {
    selectWork(work)
    navigateTo('work-detail')
  }

  const getWorksForCategory = () => {
    return worksData.aigcWorks
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cinema-black">
        <div className="absolute inset-0">
          <img
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cinematic+film+set+with+professional+camera+equipment+dark+moody+lighting+movie+production+atmosphere+film+noir+aesthetic&image_size=landscape_16_9"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cinema-black via-cinema-black/80 to-cinema-black" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="px-6 lg:px-12 py-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-cinema-muted hover:text-accent-warmYellow transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">返回</span>
          </motion.button>
        </div>

        <div className="flex-1 px-6 lg:px-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
              <span className="text-cinema-light">作品介绍</span>
              <span className="text-accent-warmYellow ml-4">(FILM & VIDEO)</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => handleCategoryClick(category)}
                className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
                  selectedCategory?.id === category.id
                    ? 'bg-accent-red text-white shadow-lg shadow-accent-red/30'
                    : 'bg-white/5 text-cinema-light hover:bg-white/10 border border-white/10'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getWorksForCategory().map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredWork(work.id)}
                      onMouseLeave={() => setHoveredWork(null)}
                      onClick={() => handleWorkClick(work)}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={work.thumbnailUrl}
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-accent-red/90 flex items-center justify-center shadow-lg shadow-accent-red/50">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                          {work.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-cinema-muted">
                          <span>{work.duration}</span>
                          <span>•</span>
                          <span>{work.createdAt}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {hoveredWork === work.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-4 right-4"
                          >
                            <div className="px-3 py-1.5 rounded bg-accent-warmYellow text-cinema-black text-xs font-semibold">
                              {work.duration}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <p className="text-2xl text-cinema-muted text-center">
                选择上方分类查看作品
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
