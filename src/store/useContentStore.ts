import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentStore {
  isAdmin: boolean;
  aboutImages: Record<string, string[]>;
  setAdmin: (admin: boolean) => void;
  updateCategoryImage: (categoryId: string, imageUrl: string) => void;
  addAboutImage: (categoryId: string, imageUrl: string) => void;
  removeAboutImage: (categoryId: string, index: number) => void;
  updateCategory: (categoryId: string, updates: any) => void;
}

const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      aboutImages: {},
      setAdmin: (admin) => set({ isAdmin: admin }),
      updateCategoryImage: (categoryId, imageUrl) => 
        set((state) => ({
          aboutImages: {
            ...state.aboutImages,
            [categoryId]: state.aboutImages[categoryId] 
              ? [imageUrl, ...state.aboutImages[categoryId].slice(1)]
              : [imageUrl]
          }
        })),
      addAboutImage: (categoryId, imageUrl) =>
        set((state) => ({
          aboutImages: {
            ...state.aboutImages,
            [categoryId]: [...(state.aboutImages[categoryId] || []), imageUrl]
          }
        })),
      removeAboutImage: (categoryId, index) =>
        set((state) => ({
          aboutImages: {
            ...state.aboutImages,
            [categoryId]: state.aboutImages[categoryId]?.filter((_, i) => i !== index) || []
          }
        })),
      updateCategory: (categoryId, updates) => {
        // This is a simplified implementation
        // In a real app, you'd update the category data
        // Category update logic would go here
      }
    }),
    {
      name: 'content-storage'
    }
  )
);

export default useContentStore;