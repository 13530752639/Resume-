import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { worksData } from '../../store/useAppStore'
import useAppStore from '../../store/useAppStore'

export default function AboutSection() {
  const profile = worksData.profile
  const { navigateTo } = useAppStore()
  const bio = '专注于视听语言创作与影像叙事，擅长将AIGC技术与传统影视制作相融合，利用人工智能技术探索数字时代的影像表达边界。作品风格注重情感张力与视觉美学的统一，致力于用镜头讲述打动人心的故事。'

  return (
    <section className="min-h-screen bg-white">
      <div className="px-6 md:px-12 lg:px-16 py-8">
        <nav className="flex items-center justify-end gap-4 md:gap-6 text-sm text-gray-600 flex-wrap">
          <button onClick={() => navigateTo('home')} className="text-white bg-black/70 hover:bg-black px-3 py-1 rounded-full transition-colors">
            返回首页
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => navigateTo('video-works')} className="hover:text-black transition-colors">影像作品</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => navigateTo('photo-works')} className="hover:text-black transition-colors">摄影作品</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => navigateTo('media-works')} className="hover:text-black transition-colors">自媒体作品</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => navigateTo('academic-works')} className="hover:text-black transition-colors">学术作品</button>
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
          {/* 左侧: 个人肖像图片 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full aspect-[4/5] max-w-lg overflow-hidden rounded-xl shadow-2xl">
              <img
                src="/covers/web/DSC02125.JPG"
                alt="张泽龙"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* 右侧: 个人简介信息 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-light text-gray-800">张泽龙</h3>
            <p className="text-gray-600 leading-relaxed text-base">{bio}</p>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">教育背景</p>
              <p className="text-gray-800 font-medium">{profile.education}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">联系方式</p>
              <p className="text-gray-800 font-medium">13530752639 / zzl135307（微信）</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
