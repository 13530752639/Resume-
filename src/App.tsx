import { AnimatePresence, motion } from 'framer-motion'
import useAppStore from './store/useAppStore'
import HomeSection from './components/sections/HomeSection'
import AboutSection from './components/sections/AboutSection'
import WorksCategorySection from './components/sections/WorksCategorySection'
import WorkDetailSection from './components/sections/WorkDetailSection'

const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

export default function App() {
  const { currentLevel } = useAppStore()

  const renderPage = () => {
    switch (currentLevel) {
      case 'home':
        return <HomeSection />
      case 'about':
        return <AboutSection />
      case 'video-works':
      case 'photo-works':
      case 'media-works':
        return <WorksCategorySection />
      case 'work-detail':
        return <WorkDetailSection />
      default:
        return <HomeSection />
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          className="min-h-screen"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
