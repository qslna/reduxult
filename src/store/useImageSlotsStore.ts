import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ImageSlot } from '@/components/cms/ImageSlotManager';
import { imageSlots, defaultCurrentImages, imageSlotUtils } from '@/data/imageSlots';

// Store state interface
interface ImageSlotsState {
  // Current images for each slot
  currentImages: Record<string, ImageSlot['currentImage']>;
  
  // Loading states
  loadingSlots: Set<string>;
  
  // Error states
  errors: Record<string, string>;
  
  // Actions
  updateSlotImage: (slotId: string, image: ImageSlot['currentImage']) => void;
  deleteSlotImage: (slotId: string) => void;
  setSlotLoading: (slotId: string, loading: boolean) => void;
  setSlotError: (slotId: string, error: string | null) => void;
  clearSlotError: (slotId: string) => void;
  clearAllErrors: () => void;
  
  // Getters
  getSlotImage: (slotId: string) => ImageSlot['currentImage'] | undefined;
  getSlotWithCurrentImage: (slotId: string) => ImageSlot | null;
  isSlotLoading: (slotId: string) => boolean;
  getSlotError: (slotId: string) => string | null;
  
  // Batch operations
  updateMultipleSlots: (updates: Record<string, ImageSlot['currentImage']>) => void;
  resetSlot: (slotId: string) => void;
  resetAllSlots: () => void;
  
  // Statistics
  getStats: () => {
    totalSlots: number;
    slotsWithImages: number;
    emptySlots: number;
    loadingSlots: number;
    errorSlots: number;
  };
}

export const useImageSlotsStore = create<ImageSlotsState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentImages: { ...defaultCurrentImages },
      loadingSlots: new Set(),
      errors: {},

      // Update a single slot's image
      updateSlotImage: (slotId: string, image: ImageSlot['currentImage']) => {
        set((state) => ({
          currentImages: {
            ...state.currentImages,
            [slotId]: image
          }
        }));
        
        // Clear any existing error for this slot
        get().clearSlotError(slotId);
      },

      // Delete a slot's image
      deleteSlotImage: (slotId: string) => {
        set((state) => {
          const newImages = { ...state.currentImages };
          delete newImages[slotId];
          return { currentImages: newImages };
        });
        
        get().clearSlotError(slotId);
      },

      // Set loading state for a slot
      setSlotLoading: (slotId: string, loading: boolean) => {
        set((state) => {
          const newLoadingSlots = new Set(state.loadingSlots);
          if (loading) {
            newLoadingSlots.add(slotId);
          } else {
            newLoadingSlots.delete(slotId);
          }
          return { loadingSlots: newLoadingSlots };
        });
      },

      // Set error state for a slot
      setSlotError: (slotId: string, error: string | null) => {
        set((state) => ({
          errors: error 
            ? { ...state.errors, [slotId]: error }
            : (() => {
                const newErrors = { ...state.errors };
                delete newErrors[slotId];
                return newErrors;
              })()
        }));
      },

      // Clear error for a specific slot
      clearSlotError: (slotId: string) => {
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[slotId];
          return { errors: newErrors };
        });
      },

      // Clear all errors
      clearAllErrors: () => {
        set({ errors: {} });
      },

      // Get image for a specific slot
      getSlotImage: (slotId: string) => {
        return get().currentImages[slotId];
      },

      // Get slot configuration with current image
      getSlotWithCurrentImage: (slotId: string) => {
        const slot = imageSlotUtils.getSlotById(slotId);
        if (!slot) return null;

        return {
          ...slot,
          currentImage: get().currentImages[slotId]
        };
      },

      // Check if slot is loading
      isSlotLoading: (slotId: string) => {
        return get().loadingSlots.has(slotId);
      },

      // Get error for a specific slot
      getSlotError: (slotId: string) => {
        return get().errors[slotId] || null;
      },

      // Update multiple slots at once
      updateMultipleSlots: (updates: Record<string, ImageSlot['currentImage']>) => {
        set((state) => ({
          currentImages: {
            ...state.currentImages,
            ...updates
          }
        }));

        // Clear errors for updated slots
        Object.keys(updates).forEach(slotId => {
          get().clearSlotError(slotId);
        });
      },

      // Reset a single slot to default
      resetSlot: (slotId: string) => {
        const defaultImage = defaultCurrentImages[slotId];
        if (defaultImage) {
          get().updateSlotImage(slotId, defaultImage);
        } else {
          get().deleteSlotImage(slotId);
        }
      },

      // Reset all slots to defaults
      resetAllSlots: () => {
        set({
          currentImages: { ...defaultCurrentImages },
          loadingSlots: new Set(),
          errors: {}
        });
      },

      // Get statistics about the slots
      getStats: () => {
        const state = get();
        const totalSlots = imageSlotUtils.getTotalSlotCount();
        const slotsWithImages = Object.keys(state.currentImages).length;
        const emptySlots = totalSlots - slotsWithImages;
        const loadingSlots = state.loadingSlots.size;
        const errorSlots = Object.keys(state.errors).length;

        return {
          totalSlots,
          slotsWithImages,
          emptySlots,
          loadingSlots,
          errorSlots
        };
      }
    }),
    {
      name: 'redux-image-slots',
      version: 1,
      partialize: (state) => ({
        currentImages: state.currentImages
      }),
      // Don't persist loading states or errors
      onRehydrateStorage: () => (state) => {
        // Reset transient states after rehydration
        if (state) {
          state.loadingSlots = new Set();
          state.errors = {};
        }
      }
    }
  )
);

// Custom hooks for easier access to specific functionality
export const useImageSlot = (slotId: string) => {
  const store = useImageSlotsStore();
  
  return {
    slot: store.getSlotWithCurrentImage(slotId),
    image: store.getSlotImage(slotId),
    isLoading: store.isSlotLoading(slotId),
    error: store.getSlotError(slotId),
    
    // Actions for this specific slot
    updateImage: (image: ImageSlot['currentImage']) => store.updateSlotImage(slotId, image),
    deleteImage: () => store.deleteSlotImage(slotId),
    setLoading: (loading: boolean) => store.setSlotLoading(slotId, loading),
    setError: (error: string | null) => store.setSlotError(slotId, error),
    clearError: () => store.clearSlotError(slotId),
    reset: () => store.resetSlot(slotId)
  };
};

// Hook for page-specific slots
export const usePageSlots = (pageId: string) => {
  const store = useImageSlotsStore();
  const pageSlots = imageSlotUtils.getSlotsForPage(pageId);
  
  return {
    slots: pageSlots.map(slot => ({
      ...slot,
      currentImage: store.getSlotImage(slot.id),
      isLoading: store.isSlotLoading(slot.id),
      error: store.getSlotError(slot.id)
    })),
    
    // Page-level actions
    updateSlot: store.updateSlotImage,
    deleteSlot: store.deleteSlotImage,
    clearPageErrors: () => {
      pageSlots.forEach(slot => store.clearSlotError(slot.id));
    }
  };
};

// Hook for admin dashboard stats
export const useImageSlotsStats = () => {
  return useImageSlotsStore((state) => state.getStats());
};