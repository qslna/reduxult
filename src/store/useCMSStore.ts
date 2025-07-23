'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enhanced CMS Types
export interface CMSMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt?: string;
  title?: string;
  description?: string;
  category: string;
  folder: string;
  width?: number;
  height?: number;
  duration?: number; // for videos
  size: number; // file size in bytes
  uploadedAt: string;
  updatedAt: string;
  tags: string[];
  metadata: Record<string, string | number | boolean | null>;
}

export interface CMSFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface CMSActivity {
  id: string;
  userId: string;
  action: 'upload' | 'delete' | 'edit' | 'move' | 'share';
  entityType: 'media' | 'folder' | 'content';
  entityId: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface CMSState {
  // Media Management
  media: Record<string, CMSMedia>;
  folders: Record<string, CMSFolder>;
  selectedMedia: string[];
  currentFolder: string;
  searchQuery: string;
  filters: {
    type?: 'image' | 'video';
    category?: string;
    tags?: string[];
    dateRange?: { start: string; end: string };
  };
  
  // Upload Management
  uploads: {
    inProgress: Record<string, { progress: number; file: File }>;
    completed: string[];
    failed: Record<string, string>; // id -> error message
  };
  
  // User Management
  currentUser: CMSUser | null;
  users: Record<string, CMSUser>;
  
  // System
  activities: CMSActivity[];
  settings: {
    maxFileSize: number;
    allowedTypes: string[];
    autoBackup: boolean;
    compressionQuality: number;
  };
  
  // UI State
  isLoading: boolean;
  errors: string[];
  
  // Actions
  // Media Actions
  addMedia: (media: CMSMedia) => void;
  updateMedia: (id: string, updates: Partial<CMSMedia>) => void;
  deleteMedia: (id: string) => void;
  bulkDeleteMedia: (ids: string[]) => void;
  moveMedia: (ids: string[], targetFolderId: string) => void;
  duplicateMedia: (id: string) => void;
  
  // Selection Actions
  selectMedia: (id: string) => void;
  deselectMedia: (id: string) => void;
  selectAllMedia: () => void;
  clearSelection: () => void;
  toggleMediaSelection: (id: string) => void;
  
  // Folder Actions
  addFolder: (folder: CMSFolder) => void;
  updateFolder: (id: string, updates: Partial<CMSFolder>) => void;
  deleteFolder: (id: string) => void;
  setCurrentFolder: (folderId: string) => void;
  
  // Search & Filter Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<CMSState['filters']>) => void;
  clearFilters: () => void;
  
  // Upload Actions
  startUpload: (fileId: string, file: File) => void;
  updateUploadProgress: (fileId: string, progress: number) => void;
  completeUpload: (fileId: string, media: CMSMedia) => void;
  failUpload: (fileId: string, error: string) => void;
  clearUploads: () => void;
  
  // User Actions
  setCurrentUser: (user: CMSUser | null) => void;
  updateUser: (id: string, updates: Partial<CMSUser>) => void;
  
  // Activity Actions
  addActivity: (activity: Omit<CMSActivity, 'id' | 'timestamp'>) => void;
  
  // System Actions
  setLoading: (loading: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  
  // Utility Actions
  getMediaByFolder: (folderId: string) => CMSMedia[];
  getFilteredMedia: () => CMSMedia[];
  getMediaStats: () => {
    total: number;
    images: number;
    videos: number;
    totalSize: number;
  };
}

const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      // Initial state
      media: {},
      folders: {
        root: {
          id: 'root',
          name: 'Root',
          path: '/',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        designers: {
          id: 'designers',
          name: 'Designers',
          path: '/designers',
          parentId: 'root',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        projects: {
          id: 'projects',
          name: 'Projects',
          path: '/projects',
          parentId: 'root',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        about: {
          id: 'about',
          name: 'About',
          path: '/about',
          parentId: 'root',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        general: {
          id: 'general',
          name: 'General',
          path: '/general',
          parentId: 'root',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      selectedMedia: [],
      currentFolder: 'root',
      searchQuery: '',
      filters: {},
      uploads: {
        inProgress: {},
        completed: [],
        failed: {},
      },
      currentUser: null,
      users: {},
      activities: [],
      settings: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
        autoBackup: true,
        compressionQuality: 85,
      },
      isLoading: false,
      errors: [],
      
      // Media Actions
      addMedia: (media) => set((state) => ({
        media: { ...state.media, [media.id]: media }
      })),
      
      updateMedia: (id, updates) => set((state) => ({
        media: {
          ...state.media,
          [id]: state.media[id] ? {
            ...state.media[id],
            ...updates,
            updatedAt: new Date().toISOString()
          } : state.media[id]
        }
      })),
      
      deleteMedia: (id) => set((state) => {
        const newMedia = { ...state.media };
        delete newMedia[id];
        return {
          media: newMedia,
          selectedMedia: state.selectedMedia.filter(mediaId => mediaId !== id)
        };
      }),
      
      bulkDeleteMedia: (ids) => set((state) => {
        const newMedia = { ...state.media };
        ids.forEach(id => delete newMedia[id]);
        return {
          media: newMedia,
          selectedMedia: state.selectedMedia.filter(mediaId => !ids.includes(mediaId))
        };
      }),
      
      moveMedia: (ids, targetFolderId) => set((state) => {
        const newMedia = { ...state.media };
        ids.forEach(id => {
          if (newMedia[id]) {
            newMedia[id] = {
              ...newMedia[id],
              folder: targetFolderId,
              updatedAt: new Date().toISOString()
            };
          }
        });
        return { media: newMedia };
      }),
      
      duplicateMedia: (id) => set((state) => {
        const original = state.media[id];
        if (!original) return state;
        
        const duplicate: CMSMedia = {
          ...original,
          id: `${id}-copy-${Date.now()}`,
          title: `${original.title || 'Untitled'} (Copy)`,
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return {
          media: { ...state.media, [duplicate.id]: duplicate }
        };
      }),
      
      // Selection Actions
      selectMedia: (id) => set((state) => ({
        selectedMedia: state.selectedMedia.includes(id) 
          ? state.selectedMedia 
          : [...state.selectedMedia, id]
      })),
      
      deselectMedia: (id) => set((state) => ({
        selectedMedia: state.selectedMedia.filter(mediaId => mediaId !== id)
      })),
      
      selectAllMedia: () => set((state) => {
        const currentFolderMedia = get().getMediaByFolder(state.currentFolder);
        return {
          selectedMedia: currentFolderMedia.map(media => media.id)
        };
      }),
      
      clearSelection: () => set({ selectedMedia: [] }),
      
      toggleMediaSelection: (id) => set((state) => ({
        selectedMedia: state.selectedMedia.includes(id)
          ? state.selectedMedia.filter(mediaId => mediaId !== id)
          : [...state.selectedMedia, id]
      })),
      
      // Folder Actions
      addFolder: (folder) => set((state) => ({
        folders: { ...state.folders, [folder.id]: folder }
      })),
      
      updateFolder: (id, updates) => set((state) => ({
        folders: {
          ...state.folders,
          [id]: state.folders[id] ? {
            ...state.folders[id],
            ...updates,
            updatedAt: new Date().toISOString()
          } : state.folders[id]
        }
      })),
      
      deleteFolder: (id) => set((state) => {
        const newFolders = { ...state.folders };
        delete newFolders[id];
        return { folders: newFolders };
      }),
      
      setCurrentFolder: (folderId) => set({ currentFolder: folderId, selectedMedia: [] }),
      
      // Search & Filter Actions
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      clearFilters: () => set({ filters: {}, searchQuery: '' }),
      
      // Upload Actions
      startUpload: (fileId, file) => set((state) => ({
        uploads: {
          ...state.uploads,
          inProgress: {
            ...state.uploads.inProgress,
            [fileId]: { progress: 0, file }
          }
        }
      })),
      
      updateUploadProgress: (fileId, progress) => set((state) => ({
        uploads: {
          ...state.uploads,
          inProgress: {
            ...state.uploads.inProgress,
            [fileId]: state.uploads.inProgress[fileId] ? {
              ...state.uploads.inProgress[fileId],
              progress
            } : state.uploads.inProgress[fileId]
          }
        }
      })),
      
      completeUpload: (fileId, media) => set((state) => {
        const newInProgress = { ...state.uploads.inProgress };
        delete newInProgress[fileId];
        
        return {
          media: { ...state.media, [media.id]: media },
          uploads: {
            ...state.uploads,
            inProgress: newInProgress,
            completed: [...state.uploads.completed, fileId]
          }
        };
      }),
      
      failUpload: (fileId, error) => set((state) => {
        const newInProgress = { ...state.uploads.inProgress };
        delete newInProgress[fileId];
        
        return {
          uploads: {
            ...state.uploads,
            inProgress: newInProgress,
            failed: { ...state.uploads.failed, [fileId]: error }
          }
        };
      }),
      
      clearUploads: () => set(() => ({
        uploads: {
          inProgress: {},
          completed: [],
          failed: {}
        }
      })),
      
      // User Actions
      setCurrentUser: (currentUser) => set({ currentUser }),
      
      updateUser: (id, updates) => set((state) => ({
        users: {
          ...state.users,
          [id]: state.users[id] ? { ...state.users[id], ...updates } : state.users[id]
        }
      })),
      
      // Activity Actions
      addActivity: (activity) => set((state) => ({
        activities: [
          {
            ...activity,
            id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString()
          },
          ...state.activities.slice(0, 99) // Keep last 100 activities
        ]
      })),
      
      // System Actions
      setLoading: (isLoading) => set({ isLoading }),
      
      addError: (error) => set((state) => ({
        errors: [...state.errors, error]
      })),
      
      clearErrors: () => set({ errors: [] }),
      
      // Utility Actions
      getMediaByFolder: (folderId) => {
        const state = get();
        return Object.values(state.media).filter(media => media.folder === folderId);
      },
      
      getFilteredMedia: () => {
        const state = get();
        const currentFolderMedia = state.getMediaByFolder ? state.getMediaByFolder(state.currentFolder) : [];
        
        return currentFolderMedia.filter(media => {
          // Search query filter
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            const searchableText = [
              media.title,
              media.alt,
              media.description,
              ...media.tags
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (!searchableText.includes(query)) return false;
          }
          
          // Type filter
          if (state.filters.type && media.type !== state.filters.type) {
            return false;
          }
          
          // Category filter
          if (state.filters.category && media.category !== state.filters.category) {
            return false;
          }
          
          // Tags filter
          if (state.filters.tags && state.filters.tags.length > 0) {
            const hasMatchingTag = state.filters.tags.some(tag => 
              media.tags.includes(tag)
            );
            if (!hasMatchingTag) return false;
          }
          
          // Date range filter
          if (state.filters.dateRange) {
            const mediaDate = new Date(media.uploadedAt);
            const startDate = new Date(state.filters.dateRange.start);
            const endDate = new Date(state.filters.dateRange.end);
            
            if (mediaDate < startDate || mediaDate > endDate) {
              return false;
            }
          }
          
          return true;
        });
      },
      
      getMediaStats: () => {
        const state = get();
        const allMedia = Object.values(state.media);
        
        return {
          total: allMedia.length,
          images: allMedia.filter(m => m.type === 'image').length,
          videos: allMedia.filter(m => m.type === 'video').length,
          totalSize: allMedia.reduce((sum, m) => sum + m.size, 0)
        };
      },
    }),
    {
      name: 'redux-cms-store',
      partialize: (state) => ({
        media: state.media,
        folders: state.folders,
        currentUser: state.currentUser,
        users: state.users,
        activities: state.activities,
        settings: state.settings,
      }),
    }
  )
);

export default useCMSStore;