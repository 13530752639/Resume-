import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../../store/useAppStore'

const R2_URL = 'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'

const papers = [
  {
    id: 'nca',
    title: '《INTERPRETING CHENG DIEYI FROM GENDER PERFORMATIVITY》',
    image: `${R2_URL}/academic/NCA邀请函.jpg`,
    description: '本文依托巴特勒性别操演理论，结合都岚岚提出的戏剧、仪式、语言三维分析框架，探究《霸王别姬》程蝶衣女性化身份形成与悲剧成因。论文入选新传四大会议"NCA"。',
  },
  {
    id: 'tiaozhanbei',
    title: '《潮汕地区高生育率的文化密码》',
    image: `${R2_URL}/academic/tiaozhanbei.jpg`,
    description: '历时2年，作为负责人在潮汕地区实地走访103个村，访谈318人，发放6000余份问卷。发表论文2篇，形成全国人大代表议案。',
  },
  {
    id: 'qinghua',
    title: '《中非命运共同体视域下非洲媒体的认同路径与区域断裂研究》',
    image: '/academic/award-qinghua.jpg',
    description: '该文以2000-2025年非洲五大区域12家媒体两万余条新闻数据为样本，借助量化分析、多重中介与K-means聚类，探究非洲媒体对中非命运共同体的差异化认同逻辑。论文评议为清华论坛《全球传媒学刊》分论坛"最佳论文"。',
  },
]

/* ─── 滚动防抖 ─── */

function useScrollDebounce(
  onScroll: (deltaY: number) => void,
  cooldownMs = 800
) {
  const lastTimeRef = useRef(0)

  const handler = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const now = Date.now()
    if (now - lastTimeRef.current < cooldownMs) return
    if (Math.abs(e.deltaY) < 30) return
    lastTimeRef.current = now
    onScroll(e.deltaY)
  }, [cooldownMs, onScroll])

  useEffect(() => {
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [handler])
}

export default function AcademicSection() {
  const { navigateTo } = useAppStore()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScrollSwitch = useCallback((deltaY: number) => {
    if (deltaY > 0) {
      setActiveIndex(prev => Math.min(papers.length - 1, prev + 1))
    } else {
      setActiveIndex(prev => Math.max(0, prev - 1))
    }
  }, [])

  useScrollDebounce(handleScrollSwitch, 800)

  const paper = papers[activeIndex]

  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      {/* 暖光效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-amber-900/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 导航 */}
      <div className="relative z-20 px-6 md:px-12 lg:px-16 py-8">
        <nav className="flex items-center justify-end gap-4 md:gap-6 text-sm text-white/70 flex-wrap">
          <button onClick={() => navigateTo('home')} className="text-white hover:text-white/80 transition-colors">
            返回首页
          </button>
          <span className="text-white/20">|</span>
          <button onClick={() => navigateTo('video-works')} className="hover:text-white transition-colors">影像作品</button>
          <span className="text-white/20">|</span>
          <button onClick={() => navigateTo('photo-works')} className="hover:text-white transition-colors">摄影作品</button>
          <span className="text-white/20">|</span>
          <button onClick={() => navigateTo('media-works')} className="hover:text-white transition-colors">自媒体作品</button>
        </nav>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-16 py-8 flex-1 flex items-center min-h-[calc(100vh-180px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide mb-16">
            学术作品<span className="text-red-600 ml-3">*</span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
            >
              {/* 左侧: 论文图片 */}
              <div className="order-2 lg:order-1">
                <div className="rounded-lg overflow-hidden shadow-2xl shadow-amber-500/10 border border-white/10">
                  <img
                    src={paper.image}
                    alt={paper.title}
                    className="w-full h-auto max-h-[60vh] object-contain bg-gray-900"
                    decoding="async"
                  />
                </div>
              </div>

              {/* 右侧: 论文介绍 */}
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 tracking-wide">
                  {paper.title}
                </h2>
                <p className="text-white/70 leading-relaxed text-base md:text-lg">
                  {paper.description}
                </p>

                {/* 手动序号跳转 */}
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex gap-2">
                    {papers.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setActiveIndex(i)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                          i === activeIndex
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-110'
                            : 'bg-white/10 text-white/60 hover:bg-white/25 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <span className="text-white/40 text-sm min-w-[3rem] text-center">
                    {activeIndex + 1} / {papers.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-sm flex items-center gap-2 animate-bounce">
        <span>滚动切换</span>
        <span>↓</span>
      </div>
    </section>
  )
}
