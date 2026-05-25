import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Edit3, Check, X } from 'lucide-react'
import { worksData } from '../../store/useAppStore'
import useAppStore from '../../store/useAppStore'

export default function IntroSection() {
  const profile = worksData.profile
  const { navigateTo } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editableBio, setEditableBio] = useState(profile.bio)

  const handleContinue = () => {
    navigateTo('works')
  }

  const handleSaveBio = () => {
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditableBio(profile.bio)
    setIsEditing(false)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cinema-black">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-warmYellow/5 via-transparent to-accent-red/5" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-warmYellow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-[3/4]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-warmYellow/20 to-accent-red/20 rounded-2xl transform rotate-2" />
              <div className="absolute inset-0 bg-gradient-to-tl from-accent-red/20 to-accent-warmYellow/20 rounded-2xl transform -rotate-2" />
              
              <div className="relative h-full rounded-2xl overflow-hidden border-2 border-white/10">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional+film+director+portrait+cinematic+lighting+dramatic+shadows+studio+setting+confident+pose+dark+background+film+aesthetic+high+quality+photography&image_size=portrait_4_3"
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl font-display font-bold text-cinema-light mb-1">{profile.name}</h3>
                  <p className="text-lg text-accent-warmYellow font-medium">{profile.title}</p>
                </div>
              </div>

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-20 h-20 border-2 border-dashed border-accent-warmYellow/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-dashed border-accent-red/30 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-1 bg-gradient-to-r from-accent-warmYellow to-accent-red rounded-full mb-6"
              />
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-cinema-light mb-4">
                关于我
              </h2>
              
              <p className="text-lg text-cinema-muted mb-6">{profile.education}</p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cinema-light">个人简介</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cinema-muted hover:text-accent-warmYellow transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm">编辑</span>
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <textarea
                    value={editableBio}
                    onChange={(e) => setEditableBio(e.target.value)}
                    className="w-full h-40 p-4 rounded-xl bg-white/5 border border-white/10 text-cinema-light focus:border-accent-warmYellow focus:outline-none resize-none"
                    placeholder="输入您的个人简介..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveBio}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-warmYellow hover:bg-accent-warmYellow/90 text-cinema-black font-medium transition-all"
                    >
                      <Check className="w-4 h-4" />
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-cinema-muted transition-all"
                    >
                      <X className="w-4 h-4" />
                      取消
                    </button>
                  </div>
                </motion.div>
              ) : (
                <p className="text-base md:text-lg text-cinema-muted leading-relaxed">
                  {editableBio}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${profile.phone}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-accent-warmYellow/10 border border-white/5 hover:border-accent-warmYellow/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-warmYellow/10 group-hover:bg-accent-warmYellow/20 flex items-center justify-center transition-colors">
                  <Phone className="w-6 h-6 text-accent-warmYellow" />
                </div>
                <div>
                  <p className="text-xs text-cinema-muted uppercase tracking-wider">电话</p>
                  <p className="text-cinema-light font-semibold group-hover:text-accent-warmYellow transition-colors">{profile.phone}</p>
                </div>
              </a>

              <div className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-accent-red/10 border border-white/5 hover:border-accent-red/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-accent-red/10 group-hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                  <Mail className="w-6 h-6 text-accent-red" />
                </div>
                <div>
                  <p className="text-xs text-cinema-muted uppercase tracking-wider">微信</p>
                  <p className="text-cinema-light font-semibold group-hover:text-accent-red transition-colors">{profile.wechat}</p>
                </div>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={handleContinue}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-warmYellow to-accent-red text-cinema-black font-semibold text-lg hover:shadow-lg hover:shadow-accent-warmYellow/20 transition-all"
            >
              查看作品集
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
