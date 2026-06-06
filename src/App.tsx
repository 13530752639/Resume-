import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useAppStore from './store/useAppStore'
import HomeSection from './components/sections/HomeSection'

const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const WorksCategorySection = lazy(() => import('./components/sections/WorksCategorySection'))
const WorkDetailSection = lazy(() => import('./components/sections/WorkDetailSection'))
const AcademicSection = lazy(() => import('./components/sections/AcademicSection'))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-cinema-black" />
)

const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.7,
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
      case 'academic-works':
        return <AcademicSection />
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
          <Suspense fallback={<LoadingFallback />}>
            {renderPage()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
