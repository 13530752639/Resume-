import { motion } from 'framer-motion'
import { Play, Search } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function WorkDetailSection() {
  const { navigateTo } = useAppStore()

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cinematic+film+scene+two+boys+looking+through+bars+dramatic+lighting+emotional+moment+film+still+professional+cinematography&image_size=landscape_16_9"
          alt="Work background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <div className="relative z-10 h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-2 tracking-wide">
              怪人
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-light text-red-500 italic tracking-wide">
              weirdo
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 text-white/80 text-sm md:text-base max-w-md mx-auto"
            >
              <p>剧情 / 悬疑 | 18分钟 | 编剧/导演: 张泽龙</p>
              <p className="mt-2 text-white/60">面部烧伤的怪人遇见突然闯入的小男孩……一群相</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-end justify-between">
          <nav className="flex items-center gap-4 md:gap-8 text-xs md:text-sm text-white/70">
            <button
              onClick={() => navigateTo('video-works')}
              className="hover:text-white transition-colors"
            >
              纪录/专题 Documentary
            </button>
            <button
              onClick={() => navigateTo('video-works')}
              className="hover:text-white transition-colors"
            >
              广告 Commercial
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white/90 hover:bg-white text-black font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm"
            >
              <Play className="w-4 h-4" fill="black" />
              播放
            </motion.button>

            <button
              onClick={() => navigateTo('video-works')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
