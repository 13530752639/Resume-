import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit3, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { worksData } from '../../store/useAppStore'
import useAppStore from '../../store/useAppStore'

const introCards = [
  { id: 'intro', label: '自我介绍', src: '/covers/web/自我介绍.png' },
  { id: 'internship', label: '实习经历', src: '/covers/web/实习经历.png' },
  { id: 'works', label: '代表作品', src: '/covers/web/代表作品.png' },
  { id: 'honor', label: '代表荣誉', src: '/covers/web/代表荣誉.png' },
]

export default function AboutSection() {
  const profile = worksData.profile
  const { navigateTo } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editableBio, setEditableBio] = useState(profile.bio)
  const [activeCard, setActiveCard] = useState('intro')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSaveBio = () => {
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditableBio(profile.bio)
    setIsEditing(false)
  }

  const scrollToCard = (direction: 'up' | 'down') => {
    const currentIndex = introCards.findIndex(c => c.id === activeCard)
    const nextIndex = direction === 'up'
      ? Math.max(0, currentIndex - 1)
      : Math.min(introCards.length - 1, currentIndex + 1)
    if (nextIndex !== currentIndex) {
      setActiveCard(introCards[nextIndex].id)
    }
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="px-6 md:px-12 lg:px-16 py-8">
        <nav className="flex items-center justify-end gap-4 md:gap-6 text-sm text-gray-600 flex-wrap">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-black transition-colors"
          >
            返回首页
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigateTo('video-works')}
            className="hover:text-black transition-colors"
          >
            影像作品
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigateTo('photo-works')}
            className="hover:text-black transition-colors"
          >
            摄影作品
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigateTo('media-works')}
            className="hover:text-black transition-colors"
          >
            自媒体作品
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2">
            <Search className="w-5 h-5" />
          </button>
        </nav>
      </div>

      <div className="px-6 md:px-12 lg:px-16 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-light mb-12 text-gray-800"
        >
          简介(Header / Intro)<span className="text-red-600">*</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* 左侧: 可滑动自我介绍板块 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {introCards.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setActiveCard(card.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      activeCard === card.id
                        ? 'bg-black text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {card.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => scrollToCard('up')}
                  disabled={activeCard === introCards[0].id}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scrollToCard('down')}
                  disabled={activeCard === introCards[introCards.length - 1].id}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[400px] md:min-h-[500px]">
              {introCards.map(card => (
                <motion.div
                  key={card.id}
                  initial={false}
                  animate={{
                    opacity: activeCard === card.id ? 1 : 0,
                    scale: activeCard === card.id ? 1 : 0.98,
                    pointerEvents: activeCard === card.id ? 'auto' : 'none',
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl ${
                    activeCard === card.id ? 'z-10' : 'z-0'
                  }`}
                  style={{
                    boxShadow: activeCard === card.id
                      ? '0 20px 60px -15px rgba(0,0,0,0.3), 0 4px 12px -4px rgba(0,0,0,0.15)'
                      : 'none',
                  }}
                >
                  <div className="w-full h-full bg-white rounded-xl overflow-hidden" ref={activeCard === card.id ? scrollRef : undefined}>
                    <img
                      src={card.src}
                      alt={card.label}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧: 个人肖像 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 bg-gray-100 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/covers/web/portrait-compressed.jpg"
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 max-w-3xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">个人简介</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-black transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">编辑</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <textarea
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                className="w-full h-40 p-4 rounded-lg border border-gray-200 text-gray-800 focus:border-gray-400 focus:outline-none resize-none bg-white"
                placeholder="输入您的个人简介..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveBio}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-black hover:bg-gray-800 text-white font-medium transition-all"
                >
                  <Check className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-600 leading-relaxed text-base">
              {editableBio}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
        >
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">教育背景</p>
            <p className="text-gray-800 font-medium">{profile.education}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">联系方式</p>
            <p className="text-gray-800 font-medium">{profile.phone} / {profile.wechat}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
