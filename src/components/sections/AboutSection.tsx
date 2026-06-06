import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function AboutSection() {
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

      <div className="px-6 md:px-12 lg:px-16 py-10 lg:py-14">
        {/* 标题 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-light mb-10 lg:mb-14 text-gray-800"
        >
          简介<span className="text-red-600">/</span>Header<span className="text-red-600">/</span>Intro<span className="text-red-600">*</span>
        </motion.h2>

        {/* 主内容：左(图A+姓名+文字) + 右(竖版大肖像，视觉重心) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* ── 左侧：16:9主图 + 姓名 + 文字信息 ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-5"
          >
            {/* 图A — 16:9 横幅图（适中尺寸） */}
            <div
              className="relative overflow-hidden rounded-xl max-w-sm"
              style={{
                boxShadow: '0 12px 36px -10px rgba(0,0,0,0.14), 0 4px 8px -3px rgba(0,0,0,0.04)'
              }}
            >
              <img
                src="https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev/covers/web/DSC02125_sm.jpg"
                alt=""
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>

            {/* 姓名 */}
            <h3 className="text-2xl font-medium text-gray-900 tracking-wide">张泽龙</h3>

            {/* 文字1 — 个人简介 */}
            <p className="text-gray-600 leading-relaxed text-base">{bio}</p>

            {/* 文字2 — 教育背景 / 联系方式 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">教育背景</p>
                <p className="text-gray-800 font-medium text-sm leading-relaxed">中央民族大学 新闻与传播学院 硕士研究生</p>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">联系方式</p>
                <p className="text-gray-800 font-medium text-sm leading-relaxed">13530752639 / zzl135307（微信）</p>
              </div>
            </div>
          </motion.div>

          {/* ── 右侧：竖版肖像（适中尺寸，视觉重心）── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex flex-col lg:sticky lg:top-20"
          >
            <div
              className="overflow-hidden rounded-xl flex-shrink-0"
              style={{
                boxShadow: '0 16px 48px -12px rgba(0,0,0,0.16), 0 4px 12px -4px rgba(0,0,0,0.06)',
                aspectRatio: '3/4',
              }}
            >
              <img
                src="https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev/covers/web/首页右侧照片_sm.jpg"
                alt="张泽龙"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>

            {/* 文字3 — 右下角补充说明 */}
            <p className="mt-5 text-sm text-gray-500 leading-relaxed italic">
              Film Director &nbsp;·&nbsp; Visual Storyteller
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
