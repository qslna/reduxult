'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAdminAuth } from './useAdminAuth';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  createdAt: Date;
  alt?: string;
  category?: string;
  tags?: string[];
}

export interface GalleryData {
  [galleryId: string]: MediaItem[];
}

export interface UseInstagramCMSOptions {
  galleryId: string;
  initialItems?: MediaItem[];
  autoSave?: boolean;
  maxItems?: number;
  allowedTypes?: ('image' | 'video')[];
}

export const useInstagramCMS = ({
  galleryId,
  initialItems = [],
  autoSave = true,
  maxItems = 50,
  allowedTypes = ['image', 'video']
}: UseInstagramCMSOptions) => {
  const { isAdmin } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local storage key for this gallery
  const storageKey = `redux_gallery_${galleryId}`;

  // Load items from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsedItems = JSON.parse(saved).map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt)
          }));
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Failed to load gallery from localStorage:', error);
      }
    }
  }, [storageKey]);

  // Save to localStorage when items change
  useEffect(() => {
    if (autoSave && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save gallery to localStorage:', error);
      }
    }
  }, [items, autoSave, storageKey]);

  // Upload files to ImageKit (placeholder for now)
  const uploadFiles = useCallback(async (files: FileList): Promise<MediaItem[]> => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file
        if (!isValidFile(file)) {
          throw new Error(`Invalid file type: ${file.name}`);
        }

        // In a real implementation, upload to ImageKit
        // For now, create a blob URL for preview
        const url = URL.createObjectURL(file);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const newItem: MediaItem = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          filename: file.name,
          size: file.size,
          createdAt: new Date(),
          alt: file.name.replace(/\.[^/.]+$/, ''),
          category: galleryId
        };

        return newItem;
      });

      const newItems = await Promise.all(uploadPromises);
      return newItems;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, galleryId]);

  // Add items to gallery
  const addItems = useCallback((newItems: MediaItem[]) => {
    setItems(currentItems => {
      const combinedItems = [...currentItems, ...newItems];
      return combinedItems.slice(0, maxItems);
    });
  }, [maxItems]);

  // Remove item from gallery  
  const removeItem = useCallback((itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  }, []);

  // Remove multiple items
  const removeItems = useCallback((itemIds: string[]) => {
    setItems(currentItems => currentItems.filter(item => !itemIds.includes(item.id)));
  }, []);

  // Update item
  const updateItem = useCallback((itemId: string, updates: Partial<MediaItem>) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  }, []);

  // Reorder items
  const reorderItems = useCallback((startIndex: number, endIndex: number) => {
    setItems(currentItems => {
      const result = Array.from(currentItems);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Clear all items
  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  // Search items
  const searchItems = useCallback((query: string): MediaItem[] => {
    if (!query.trim()) return items;
    
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.filename.toLowerCase().includes(lowercaseQuery) ||
      item.alt?.toLowerCase().includes(lowercaseQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [items]);

  // Filter items by type
  const filterByType = useCallback((type: 'image' | 'video'): MediaItem[] => {
    return items.filter(item => item.type === type);
  }, [items]);

  // Get items with pagination
  const getPaginatedItems = useCallback((page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: items.slice(startIndex, endIndex),
      totalPages: Math.ceil(items.length / itemsPerPage),
      currentPage: page,
      totalItems: items.length
    };
  }, [items]);

  // Export gallery data
  const exportGallery = useCallback(() => {
    const data = {
      galleryId,
      items,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `redux_gallery_${galleryId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [galleryId, items]);

  // Import gallery data
  const importGallery = useCallback((data: any) => {
    try {
      if (data.galleryId && data.items && Array.isArray(data.items)) {
        const importedItems = data.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setItems(importedItems);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import gallery:', error);
      return false;
    }
  }, []);

  // Utility function to validate file types
  const isValidFile = useCallback((file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    
    if (allowedTypes.includes('image') && validImageTypes.includes(file.type)) return true;
    if (allowedTypes.includes('video') && validVideoTypes.includes(file.type)) return true;
    
    return false;
  }, [allowedTypes]);

  // Get gallery stats
  const getStats = useCallback(() => {
    const images = items.filter(item => item.type === 'image');
    const videos = items.filter(item => item.type === 'video');
    const totalSize = items.reduce((acc, item) => acc + item.size, 0);
    
    return {
      totalItems: items.length,
      images: images.length,
      videos: videos.length,
      totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      oldestItem: items.length > 0 ? items.reduce((oldest, item) => 
        item.createdAt < oldest.createdAt ? item : oldest
      ) : null,
      newestItem: items.length > 0 ? items.reduce((newest, item) => 
        item.createdAt > newest.createdAt ? item : newest
      ) : null
    };
  }, [items]);

  return {
    // Data
    items,
    isLoading,
    error,
    isAdmin,
    
    // Actions
    uploadFiles,
    addItems,
    removeItem,
    removeItems,
    updateItem,
    reorderItems,
    clearAll,
    
    // Utilities
    searchItems,
    filterByType,
    getPaginatedItems,
    exportGallery,
    importGallery,
    isValidFile,
    getStats,
    
    // Computed
    hasItems: items.length > 0,
    canAddMore: items.length < maxItems,
    remainingSlots: maxItems - items.length
  };
};

export default useInstagramCMS;