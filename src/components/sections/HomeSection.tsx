import { motion } from 'framer-motion'
import useAppStore from '../../store/useAppStore'

export default function HomeSection() {
  const { navigateTo } = useAppStore()

  const handleExplore = () => {
    navigateTo('about')
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cinematic+film+scene+warm+lighting+through+window+soft+natural+light+interior+setting+film+aesthetic+moody+atmosphere+professional+photography&image_size=landscape_16_9"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 h-screen flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-1 text-white"
          >
            <p className="text-sm md:text-base tracking-wider font-light">ZHANGZELONG</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide">作品集</h1>
            <p className="text-xs md:text-sm tracking-widest font-light opacity-80">PORTFOLIO</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-red-600 text-4xl md:text-5xl font-bold select-none"
          >
            *
          </motion.div>
        </div>

        <div className="flex justify-center pb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            onClick={handleExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-3 rounded-full bg-white/90 hover:bg-white text-black font-medium transition-all shadow-lg backdrop-blur-sm"
          >
            探索
          </motion.button>
        </div>
      </div>
    </section>
  )
}
