import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowLeft, Play } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import categoriesData from '../../data/categories.json'

const videoCategories = [
  { id: 'aigc', title: 'AIGC影像', subtitle: '' },
  { id: 'documentary', title: '纪录片', subtitle: 'Documentary' },
  { id: 'special', title: '专题片', subtitle: '' },
  { id: 'commercial', title: '宣传片', subtitle: 'Commercial' }
]

const photoCategories = [
  { id: 'news', title: '新闻摄影', subtitle: '' },
  { id: 'feature', title: '专题摄影', subtitle: '' },
  { id: 'art', title: '艺术摄影', subtitle: '' },
  { id: 'portrait', title: '人像摄影', subtitle: '' },
  { id: 'street', title: '街拍作品', subtitle: '' }
]

export default function WorksCategorySection() {
  const { currentLevel, navigateTo, selectWork } = useAppStore()
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  const getTitle = () => {
    switch (currentLevel) {
      case 'video-works':
        return { main: 'FILM & VIDEO', hasStar: true }
      case 'photo-works':
        return { main: 'PHOTOGRAPHY', hasStar: true }
      case 'media-works':
        return { main: 'MEDIA WORKS', hasStar: true }
      default:
        return { main: 'FILM & VIDEO', hasStar: true }
    }
  }

  const getCategories = () => {
    switch (currentLevel) {
      case 'video-works':
        return videoCategories
      case 'photo-works':
        return photoCategories
      case 'media-works':
        return [{ id: 'media', title: '自媒体作品', subtitle: '' }]
      default:
        return videoCategories
    }
  }

  const getWorksForCategory = (categoryId: string) => {
    if (currentLevel === 'video-works') {
      return categoriesData.videoWorks[categoryId as keyof typeof categoriesData.videoWorks] || []
    } else if (currentLevel === 'photo-works') {
      return categoriesData.photoWorks[categoryId as keyof typeof categoriesData.photoWorks] || []
    } else if (currentLevel === 'media-works') {
      return categoriesData.mediaWorks
    }
    return []
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedSubCategory(categoryId)
  }

  const handleWorkClick = (work: any) => {
    selectWork(work)
    navigateTo('work-detail')
  }

  const handleBack = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null)
    } else {
      navigateTo('home')
    }
  }

  const titleInfo = getTitle()
  const categories = getCategories()
  const currentWorks = selectedSubCategory ? getWorksForCategory(selectedSubCategory) : []

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Soft+warm+interior+scene+with+natural+light+through+curtains+cozy+atmosphere+minimalist+design+faded+colors+vintage+aesthetic&image_size=landscape_16_9"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-8 md:px-16 lg:px-24 py-12">
        <div className="flex items-center justify-between mb-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedSubCategory ? '返回分类' : '返回首页'}
          </button>
          
          <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            {!selectedSubCategory ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl"
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-12 tracking-wide">
                  {titleInfo.main}
                  {titleInfo.hasStar && <span className="text-red-600 ml-3">*</span>}
                </h1>

                <ul className="space-y-6">
                  {categories.map((category, index) => (
                    <motion.li
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="group flex items-baseline gap-3 text-left hover:text-red-600 transition-colors"
                      >
                        <span className="text-gray-400 group-hover:text-red-600">•</span>
                        <span className="text-xl md:text-2xl font-normal">{category.title}</span>
                        {category.subtitle && (
                          <span className="text-base md:text-lg text-gray-500 font-light italic">
                            {category.subtitle}
                          </span>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="works"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wide text-gray-800">
                  {categories.find(c => c.id === selectedSubCategory)?.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentWorks.map((work: any, index: number) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => handleWorkClick(work)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 mb-3">
                        <img
                          src={work.thumbnail}
                          alt={work.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-black ml-1" fill="black" />
                          </div>
                        </div>

                        {work.duration && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/70 text-white text-sm font-medium">
                            {work.duration}
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-medium text-gray-800 mb-1 group-hover:text-red-600 transition-colors">
                        {work.title}
                      </h3>
                      {work.titleEn && (
                        <p className="text-sm text-gray-500 italic mb-2">{work.titleEn}</p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">{work.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
