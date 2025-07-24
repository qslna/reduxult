import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoSlot } from '@/components/cms/VideoSlotManager';
import { videoSlots, defaultCurrentVideos, videoSlotUtils } from '@/data/videoSlots';

// Store state interface
interface VideoSlotsState {
  // Current videos for each slot
  currentVideos: Record<string, VideoSlot['currentVideo']>;
  
  // Loading states
  loadingSlots: Set<string>;
  
  // Error states
  errors: Record<string, string>;
  
  // Actions
  updateSlotVideo: (slotId: string, video: VideoSlot['currentVideo']) => void;
  deleteSlotVideo: (slotId: string) => void;
  setSlotLoading: (slotId: string, loading: boolean) => void;
  setSlotError: (slotId: string, error: string | null) => void;
  clearSlotError: (slotId: string) => void;
  clearAllErrors: () => void;
  
  // Getters
  getSlotVideo: (slotId: string) => VideoSlot['currentVideo'] | undefined;
  getSlotWithCurrentVideo: (slotId: string) => VideoSlot | null;
  isSlotLoading: (slotId: string) => boolean;
  getSlotError: (slotId: string) => string | null;
  
  // Batch operations
  updateMultipleSlots: (updates: Record<string, VideoSlot['currentVideo']>) => void;
  resetSlot: (slotId: string) => void;
  resetAllSlots: () => void;
  
  // Provider-specific operations
  getSlotsByProvider: (provider: 'upload' | 'google-drive' | 'youtube' | 'vimeo') => VideoSlot[];
  updateProviderSlots: (provider: 'upload' | 'google-drive' | 'youtube' | 'vimeo', updates: Record<string, VideoSlot['currentVideo']>) => void;
  
  // Statistics
  getStats: () => {
    totalSlots: number;
    slotsWithVideos: number;
    emptySlots: number;
    loadingSlots: number;
    errorSlots: number;
    providerCounts: Record<string, number>;
  };
}

export const useVideoSlotsStore = create<VideoSlotsState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentVideos: { ...defaultCurrentVideos },
      loadingSlots: new Set(),
      errors: {},

      // Update a single slot's video
      updateSlotVideo: (slotId: string, video: VideoSlot['currentVideo']) => {
        set((state) => ({
          currentVideos: {
            ...state.currentVideos,
            [slotId]: video
          }
        }));
        
        // Clear any existing error for this slot
        get().clearSlotError(slotId);
      },

      // Delete a slot's video
      deleteSlotVideo: (slotId: string) => {
        set((state) => {
          const newVideos = { ...state.currentVideos };
          delete newVideos[slotId];
          return { currentVideos: newVideos };
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

      // Get video for a specific slot
      getSlotVideo: (slotId: string) => {
        return get().currentVideos[slotId];
      },

      // Get slot configuration with current video
      getSlotWithCurrentVideo: (slotId: string) => {
        const slot = videoSlotUtils.getSlotById(slotId);
        if (!slot) return null;

        return {
          ...slot,
          currentVideo: get().currentVideos[slotId]
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
      updateMultipleSlots: (updates: Record<string, VideoSlot['currentVideo']>) => {
        set((state) => ({
          currentVideos: {
            ...state.currentVideos,
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
        const defaultVideo = defaultCurrentVideos[slotId];
        if (defaultVideo) {
          get().updateSlotVideo(slotId, defaultVideo);
        } else {
          get().deleteSlotVideo(slotId);
        }
      },

      // Reset all slots to defaults
      resetAllSlots: () => {
        set({
          currentVideos: { ...defaultCurrentVideos },
          loadingSlots: new Set(),
          errors: {}
        });
      },

      // Get slots by provider
      getSlotsByProvider: (provider: 'upload' | 'google-drive' | 'youtube' | 'vimeo') => {
        const state = get();
        const allSlots = videoSlotUtils.getAllSlotsGrouped()
          .flatMap(({ slots }) => slots);
        
        return allSlots
          .filter(slot => {
            const currentVideo = state.currentVideos[slot.id];
            return currentVideo?.provider === provider;
          })
          .map(slot => ({
            ...slot,
            currentVideo: state.currentVideos[slot.id]
          }));
      },

      // Update multiple slots for a specific provider
      updateProviderSlots: (provider: 'upload' | 'google-drive' | 'youtube' | 'vimeo', updates: Record<string, VideoSlot['currentVideo']>) => {
        const validUpdates: Record<string, VideoSlot['currentVideo']> = {};
        
        Object.entries(updates).forEach(([slotId, video]) => {
          if (video && video.provider === provider) {
            validUpdates[slotId] = video;
          }
        });
        
        get().updateMultipleSlots(validUpdates);
      },

      // Get statistics about the slots
      getStats: () => {
        const state = get();
        const totalSlots = videoSlotUtils.getTotalSlotCount();
        const slotsWithVideos = Object.keys(state.currentVideos).length;
        const emptySlots = totalSlots - slotsWithVideos;
        const loadingSlots = state.loadingSlots.size;
        const errorSlots = Object.keys(state.errors).length;

        // Count videos by provider
        const providerCounts: Record<string, number> = {};
        Object.values(state.currentVideos).forEach(video => {
          const provider = video?.provider || 'unknown';
          providerCounts[provider] = (providerCounts[provider] || 0) + 1;
        });

        return {
          totalSlots,
          slotsWithVideos,
          emptySlots,
          loadingSlots,
          errorSlots,
          providerCounts
        };
      }
    }),
    {
      name: 'redux-video-slots',
      version: 1,
      partialize: (state) => ({
        currentVideos: state.currentVideos
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
export const useVideoSlot = (slotId: string) => {
  const store = useVideoSlotsStore();
  
  return {
    slot: store.getSlotWithCurrentVideo(slotId),
    video: store.getSlotVideo(slotId),
    isLoading: store.isSlotLoading(slotId),
    error: store.getSlotError(slotId),
    
    // Actions for this specific slot
    updateVideo: (video: VideoSlot['currentVideo']) => store.updateSlotVideo(slotId, video),
    deleteVideo: () => store.deleteSlotVideo(slotId),
    setLoading: (loading: boolean) => store.setSlotLoading(slotId, loading),
    setError: (error: string | null) => store.setSlotError(slotId, error),
    clearError: () => store.clearSlotError(slotId),
    reset: () => store.resetSlot(slotId)
  };
};

// Hook for page-specific slots
export const usePageVideoSlots = (pageId: string) => {
  const store = useVideoSlotsStore();
  const pageSlots = videoSlotUtils.getSlotsForPage(pageId);
  
  return {
    slots: pageSlots.map(slot => ({
      ...slot,
      currentVideo: store.getSlotVideo(slot.id),
      isLoading: store.isSlotLoading(slot.id),
      error: store.getSlotError(slot.id)
    })),
    
    // Page-level actions
    updateSlot: store.updateSlotVideo,
    deleteSlot: store.deleteSlotVideo,
    clearPageErrors: () => {
      pageSlots.forEach(slot => store.clearSlotError(slot.id));
    }
  };
};

// Hook for designer video slots
export const useDesignerVideoSlots = () => {
  const store = useVideoSlotsStore();
  const designerSlots = videoSlotUtils.getDesignerSlots();
  
  return {
    slots: designerSlots.map(slot => ({
      ...slot,
      currentVideo: store.getSlotVideo(slot.id),
      isLoading: store.isSlotLoading(slot.id),
      error: store.getSlotError(slot.id)
    })),
    
    // Designer-specific actions
    updateDesignerVideo: store.updateSlotVideo,
    bulkUpdateGoogleDriveLinks: (updates: Record<string, string>) => {
      const videoUpdates: Record<string, VideoSlot['currentVideo']> = {};
      
      Object.entries(updates).forEach(([slotId, driveUrl]) => {
        const match = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const embedId = match[1];
          videoUpdates[slotId] = {
            url: `https://drive.google.com/file/d/${embedId}/preview`,
            filename: `designer-${slotId}`,
            provider: 'google-drive',
            embedId: embedId,
            title: `Designer Showcase - ${slotId}`
          };
        }
      });
      
      store.updateMultipleSlots(videoUpdates);
    }
  };
};

// Hook for fashion film slots
export const useFashionFilmSlots = () => {
  const store = useVideoSlotsStore();
  const fashionFilmSlots = videoSlotUtils.getFashionFilmSlots();
  
  return {
    slots: fashionFilmSlots.map(slot => ({
      ...slot,
      currentVideo: store.getSlotVideo(slot.id),
      isLoading: store.isSlotLoading(slot.id),
      error: store.getSlotError(slot.id)
    })),
    
    // Fashion film specific actions
    updateFashionFilm: store.updateSlotVideo,
    clearAllFashionFilmErrors: () => {
      fashionFilmSlots.forEach(slot => store.clearSlotError(slot.id));
    }
  };
};

// Hook for admin dashboard stats
export const useVideoSlotsStats = () => {
  return useVideoSlotsStore((state) => state.getStats());
};