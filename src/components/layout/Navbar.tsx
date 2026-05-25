import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navItems = [
  { id: 'intro', label: '简介' },
  { id: 'aigc-works', label: 'AIGC作品' },
  { id: 'real-shot-works', label: '实拍影像作品' }
]

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId)
    setIsMobileMenuOpen(false)
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-effect shadow-lg shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-orange flex items-center justify-center">
                <span className="text-cinema-black font-display font-bold text-xl">Z</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-lg font-semibold text-cinema-light">张泽龙</p>
                <p className="text-xs text-cinema-muted tracking-wider">FILM DIRECTOR</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    activeSection === item.id
                      ? 'text-cinema-light'
                      : 'text-cinema-muted hover:text-cinema-light'
                  }`}
                >
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-orange/10 rounded-lg border border-accent-blue/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-cinema-light hover:text-accent-blue transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-cinema-dark border-l border-white/5 shadow-2xl"
            >
              <div className="pt-24 px-8">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium transition-all ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-accent-blue/20 to-accent-orange/20 text-cinema-light border-l-4 border-accent-blue'
                          : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-light'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                
                {/* Contact Info in Mobile Menu */}
                <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                  <p className="text-sm text-cinema-muted">联系方式</p>
                  <a href="tel:13530725369" className="block text-cinema-light hover:text-accent-blue transition-colors">
                    📞 13530725369
                  </a>
                  <p className="text-cinema-light hover:text-accent-blue transition-colors cursor-pointer">
                    💬 微信: zzl135307
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
