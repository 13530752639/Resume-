import { create } from 'zustand'
import worksData from '../data/works.json'

type NavigationLevel = 'home' | 'about' | 'video-works' | 'photo-works' | 'media-works' | 'work-detail'

interface WorkCategory {
  id: string
  title: string
  subtitle?: string
  type: 'video' | 'photo' | 'media'
}

interface AppState {
  currentLevel: NavigationLevel
  isVideoModalOpen: boolean
  currentVideo: {
    url: string
    title: string
    category: 'aigc' | 'real-shot'
  } | null
  selectedCategory: WorkCategory | null
  selectedWork: typeof worksData.aigcWorks[0] | null
  searchQuery: string
  
  navigateTo: (level: NavigationLevel) => void
  openVideoModal: (url: string, title: string, category: 'aigc' | 'real-shot') => void
  closeVideoModal: () => void
  selectCategory: (category: WorkCategory | null) => void
  selectWork: (work: typeof worksData.aigcWorks[0] | null) => void
  setSearchQuery: (query: string) => void
}

const useAppStore = create<AppState>((set) => ({
  currentLevel: 'home',
  isVideoModalOpen: false,
  currentVideo: null,
  selectedCategory: null,
  selectedWork: null,
  searchQuery: '',
  
  navigateTo: (level) => set({ currentLevel: level }),
  
  openVideoModal: (url, title, category) =>
    set({
      isVideoModalOpen: true,
      currentVideo: { url, title, category }
    }),
  
  closeVideoModal: () =>
    set({
      isVideoModalOpen: false,
      currentVideo: null
    }),
  
  selectCategory: (category) => set({ selectedCategory: category }),
  selectWork: (work) => set({ selectedWork: work }),
  setSearchQuery: (query) => set({ searchQuery: query })
}))

export default useAppStore
export { worksData }
