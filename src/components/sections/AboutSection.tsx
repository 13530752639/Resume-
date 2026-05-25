import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit3, Check, X } from 'lucide-react'
import { worksData } from '../../store/useAppStore'
import useAppStore from '../../store/useAppStore'

export default function AboutSection() {
  const profile = worksData.profile
  const { navigateTo } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editableBio, setEditableBio] = useState(profile.bio)

  const handleSaveBio = () => {
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditableBio(profile.bio)
    setIsEditing(false)
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-video bg-black rounded-lg overflow-hidden"
          >
            <img
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional+film+director+working+on+set+cinematic+lighting+camera+equipment+behind+the+scenes+dark+atmosphere+professional+production&image_size=landscape_16_9"
              alt="Director at work"
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional+portrait+photo+of+Chinese+film+director+confident+smile+studio+lighting+clean+background+professional+headshot+high+quality&image_size=portrait_4_3"
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
