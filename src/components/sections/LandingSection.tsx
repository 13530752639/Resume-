import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

export default function LandingSection() {
  const { navigateTo } = useAppStore()

  const handleExplore = () => {
    navigateTo('intro')
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-cinema-black">
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/40 via-cinema-black/20 to-cinema-black/80" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-accent-warmYellow/5 via-transparent to-accent-red/5" />
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-warmYellow/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="font-display text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #ffffff 50%, #e63946 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ZHANGZELONG
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-3"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-cinema-light tracking-wide">
              作品集
            </h2>
            <p className="text-xl md:text-2xl font-body text-cinema-muted tracking-widest uppercase">
              PORTFOLIO
            </p>
          </motion.div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={handleExplore}
          className="mt-16 group cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-sm text-cinema-muted uppercase tracking-widest group-hover:text-accent-warmYellow transition-colors">
              探索
            </span>
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-cinema-muted/30 group-hover:border-accent-warmYellow/50 flex items-center justify-center transition-all duration-300">
                <ChevronDown className="w-8 h-8 text-cinema-muted group-hover:text-accent-warmYellow transition-colors" />
              </div>
              <div className="absolute inset-0 rounded-full bg-accent-warmYellow/0 group-hover:bg-accent-warmYellow/10 transition-all duration-300" />
            </div>
          </motion.div>
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cinema-black to-transparent pointer-events-none" />
    </section>
  )
}
