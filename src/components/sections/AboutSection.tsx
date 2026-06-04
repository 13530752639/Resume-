import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { worksData } from '../../store/useAppStore'
import useAppStore from '../../store/useAppStore'

const introPanels = [
  {
    id: 'intro',
    label: '自我介绍',
    content: `张泽龙，影视导演、影像创作者，专注于视听语言与影像叙事。现就读于中央民族大学新闻与传播学院，具备扎实的影视理论基础与丰富的实践创作经验。

擅长将AIGC技术与传统影视制作相融合，利用人工智能技术探索数字时代的影像表达边界。作品涵盖纪录片、专题片、宣传片、AIGC影像及自媒体内容创作等多个领域。`
  },
  {
    id: 'internship',
    label: '实习经历',
    content: `• 中央电视台 实习编导
  参与新闻专题片策划与制作，负责前期调研、脚本撰写与后期剪辑

• 地方媒体 实习记者
  深入基层采访报道，独立完成多条新闻专题片

• 新媒体平台 内容创作
  运营个人自媒体账号，创作短视频内容，累计播放量超百万

• 汕头大学电视台 学生记者
  负责校园新闻采编与专题片制作`
  },
  {
    id: 'works',
    label: '代表作品',
    content: `• AIGC动画《何以为家》 — 导演/编剧
  探讨家与归属感的 AI 实验动画

• 纪录片《半边天》 — 导演
  纪录女性力量与社会角色变迁（10min）

• 央视视频《逐梦》 — 合作导演
  记录追梦人的奋斗故事

• 哈佛大学中美峰会《未尽之风》 — 导演
  官方宣传片制作

• 汕头大学抖肩舞2k版
  创意校园短片，全网热议`
  },
  {
    id: 'honor',
    label: '代表荣誉',
    content: `• 第十九届"挑战杯"全国二等奖
  历时2年，实地走访103个村，访谈318人

• NCA（美国全国传播学会）论文入选
  论文入选传播学四大国际会议之一

• 清华论坛《全球传媒学刊》最佳论文
  量化研究获评分论坛最佳论文

• 中国航天日 AI 动画作品
  AI 创作获官方平台推荐`
  }
]

export default function AboutSection() {
  const profile = worksData.profile
  const { navigateTo } = useAppStore()
  const [activePanel, setActivePanel] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const bio = '专注于视听语言创作与影像叙事，擅长将AIGC技术与传统影视制作相融合，利用人工智能技术探索数字时代的影像表达边界。作品风格注重情感张力与视觉美学的统一，致力于用镜头讲述打动人心的故事。'

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 30) {
      setActivePanel(prev => Math.min(introPanels.length - 1, prev + 1))
    } else if (e.deltaY < -30) {
      setActivePanel(prev => Math.max(0, prev - 1))
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false })
      return () => el.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

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
          {/* 左侧: 递进式纯文字折叠板块 */}
          <div
            ref={containerRef}
            className="relative flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {introPanels.map((panel, i) => (
                  <button
                    key={panel.id}
                    onClick={() => setActivePanel(i)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      i === activePanel
                        ? 'bg-black text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {panel.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex-1 min-h-[400px] md:min-h-[500px] rounded-xl overflow-hidden"
              style={{
                boxShadow: '0 20px 60px -15px rgba(0,0,0,0.25), 0 4px 12px -4px rgba(0,0,0,0.1)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white p-8 md:p-10 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900">
                      {introPanels[activePanel].label}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{activePanel + 1}/{introPanels.length}</span>
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </div>
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {introPanels[activePanel].content}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex gap-3">
                      {introPanels.map((panel, i) => (
                        <div
                          key={panel.id}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i === activePanel ? 'bg-black' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

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

        {/* 个人简介 - 固定内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 max-w-3xl"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">个人简介</h3>
          <p className="text-gray-600 leading-relaxed text-base">{bio}</p>
        </motion.div>

        {/* 教育背景 + 联系方式 */}
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
            <p className="text-gray-800 font-medium">13530752639 / zzl135307（微信）</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
