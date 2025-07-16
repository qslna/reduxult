'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Designer, Project, Exhibition, CMSImage, Category } from '@/types';
import { DESIGNERS, PROJECTS, EXHIBITIONS, CATEGORIES } from '@/utils/constants';

interface ContentState {
  // Data
  designers: Designer[];
  projects: Project[];
  exhibitions: Exhibition[];
  categories: Category[];
  heroVideo: string;
  
  // CMS Images
  cmsImages: Record<string, CMSImage>;
  
  // Admin
  isAdmin: boolean;
  
  // Actions
  setDesigners: (designers: Designer[]) => void;
  setProjects: (projects: Project[]) => void;
  setExhibitions: (exhibitions: Exhibition[]) => void;
  setCategories: (categories: Category[]) => void;
  setHeroVideo: (url: string) => void;
  
  // CMS Actions
  updateCMSImage: (key: string, image: CMSImage) => void;
  deleteCMSImage: (key: string) => void;
  
  // Admin Actions
  setIsAdmin: (isAdmin: boolean) => void;
  
  // Designer specific actions
  updateDesigner: (id: string, data: Partial<Designer>) => void;
  updateDesignerImage: (id: string, imageType: 'profile' | 'cover', url: string) => void;
  addDesignerPortfolioImage: (id: string, url: string) => void;
  removeDesignerPortfolioImage: (id: string, index: number) => void;
  
  // Project specific actions
  updateProject: (id: string, data: Partial<Project>) => void;
  updateProjectImage: (id: string, imageType: 'cover' | 'gallery', url: string, index?: number) => void;
  addProjectGalleryImage: (id: string, url: string) => void;
  removeProjectGalleryImage: (id: string, index: number) => void;
  
  // Category specific actions
  updateCategory: (id: string, data: Partial<Category>) => void;
  updateCategoryImage: (id: string, url: string) => void;
  
  // About page images
  aboutImages: Record<string, string[]>;
  updateAboutImages: (category: string, images: string[]) => void;
  addAboutImage: (category: string, url: string) => void;
  removeAboutImage: (category: string, index: number) => void;
  
  // Initialize data
  initializeData: () => void;
}

const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      // Initial data
      designers: DESIGNERS,
      projects: PROJECTS,
      exhibitions: EXHIBITIONS,
      categories: Object.values(CATEGORIES) as Category[],
      heroVideo: 'https://ik.imagekit.io/t914/redux/videos/main-hero.mp4',
      cmsImages: {},
      isAdmin: false,
      aboutImages: {
        collective: [
          'https://ik.imagekit.io/t914/redux/about/collective/01.jpg',
          'https://ik.imagekit.io/t914/redux/about/collective/02.jpg',
          'https://ik.imagekit.io/t914/redux/about/collective/03.jpg',
        ],
        'visual-art': [
          'https://ik.imagekit.io/t914/redux/about/visual-art/01.jpg',
          'https://ik.imagekit.io/t914/redux/about/visual-art/02.jpg',
        ],
        'fashion-film': [
          'https://ik.imagekit.io/t914/redux/about/fashion-film/01.jpg',
        ],
        installation: [
          'https://ik.imagekit.io/t914/redux/about/installation/01.jpg',
          'https://ik.imagekit.io/t914/redux/about/installation/02.jpg',
        ],
        memory: [
          'https://ik.imagekit.io/t914/redux/about/memory/01.jpg',
        ],
      },
      
      // Basic setters
      setDesigners: (designers) => set({ designers }),
      setProjects: (projects) => set({ projects }),
      setExhibitions: (exhibitions) => set({ exhibitions }),
      setCategories: (categories) => set({ categories }),
      setHeroVideo: (heroVideo) => set({ heroVideo }),
      
      // CMS Actions
      updateCMSImage: (key, image) => set((state) => ({
        cmsImages: { ...state.cmsImages, [key]: image }
      })),
      deleteCMSImage: (key) => set((state) => {
        const newImages = { ...state.cmsImages };
        delete newImages[key];
        return { cmsImages: newImages };
      }),
      
      // Admin Actions
      setIsAdmin: (isAdmin) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuth', isAdmin.toString());
        }
        set({ isAdmin });
      },
      
      // Designer actions
      updateDesigner: (id, data) => set((state) => ({
        designers: state.designers.map(d => 
          d.id === id ? { ...d, ...data } : d
        )
      })),
      
      updateDesignerImage: (id, imageType, url) => set((state) => ({
        designers: state.designers.map(d => 
          d.id === id 
            ? { ...d, [imageType === 'profile' ? 'profileImage' : 'coverImage']: url }
            : d
        )
      })),
      
      addDesignerPortfolioImage: (id, url) => set((state) => ({
        designers: state.designers.map(d => 
          d.id === id 
            ? { ...d, portfolioImages: [...d.portfolioImages, url] }
            : d
        )
      })),
      
      removeDesignerPortfolioImage: (id, index) => set((state) => ({
        designers: state.designers.map(d => 
          d.id === id 
            ? { ...d, portfolioImages: d.portfolioImages.filter((_, i) => i !== index) }
            : d
        )
      })),
      
      // Project actions
      updateProject: (id, data) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...data } : p
        )
      })),
      
      updateProjectImage: (id, imageType, url, index) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id === id) {
            if (imageType === 'cover' && index === 0) {
              const newImages = [...p.images];
              newImages[0] = url;
              return { ...p, images: newImages };
            } else if (imageType === 'gallery' && index !== undefined) {
              const newImages = [...p.images];
              newImages[index] = url;
              return { ...p, images: newImages };
            }
          }
          return p;
        })
      })),
      
      addProjectGalleryImage: (id, url) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id 
            ? { ...p, images: [...p.images, url] }
            : p
        )
      })),
      
      removeProjectGalleryImage: (id, index) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id 
            ? { ...p, images: p.images.filter((_, i) => i !== index) }
            : p
        )
      })),
      
      // Category actions
      updateCategory: (id, data) => set((state) => ({
        categories: state.categories.map(c => 
          c.id === id ? { ...c, ...data } : c
        )
      })),
      
      updateCategoryImage: (id, url) => set((state) => ({
        categories: state.categories.map(c => 
          c.id === id ? { ...c, coverImage: url } : c
        )
      })),
      
      // About page actions
      updateAboutImages: (category, images) => set((state) => ({
        aboutImages: { ...state.aboutImages, [category]: images }
      })),
      
      addAboutImage: (category, url) => set((state) => ({
        aboutImages: {
          ...state.aboutImages,
          [category]: [...(state.aboutImages[category] || []), url]
        }
      })),
      
      removeAboutImage: (category, index) => set((state) => ({
        aboutImages: {
          ...state.aboutImages,
          [category]: (state.aboutImages[category] || []).filter((_, i) => i !== index)
        }
      })),
      
      // Initialize
      initializeData: () => {
        // Check admin status from localStorage
        if (typeof window !== 'undefined') {
          const adminAuth = localStorage.getItem('adminAuth');
          set({ isAdmin: adminAuth === 'true' });
        }
      },
    }),
    {
      name: 'redux-content-store',
      partialize: (state) => ({
        designers: state.designers,
        projects: state.projects,
        exhibitions: state.exhibitions,
        categories: state.categories,
        heroVideo: state.heroVideo,
        cmsImages: state.cmsImages,
        aboutImages: state.aboutImages,
      }),
    }
  )
);

export default useContentStore;