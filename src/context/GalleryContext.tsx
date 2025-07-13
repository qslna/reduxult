'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GalleryImage } from '@/types';

interface GalleryContextType {
  galleries: Record<string, GalleryImage[]>;
  updateGallery: (galleryId: string, images: GalleryImage[]) => void;
  addImagesToGallery: (galleryId: string, images: GalleryImage[]) => void;
  removeImageFromGallery: (galleryId: string, imageId: string) => void;
  moveImage: (fromGallery: string, toGallery: string, imageId: string) => void;
  getGallery: (galleryId: string) => GalleryImage[];
  searchImages: (query: string) => GalleryImage[];
  filterByCategory: (category: string) => GalleryImage[];
  filterByDesigner: (designer: string) => GalleryImage[];
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: React.ReactNode;
  initialGalleries?: Record<string, GalleryImage[]>;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({
  children,
  initialGalleries = {}
}) => {
  const [galleries, setGalleries] = useState<Record<string, GalleryImage[]>>(initialGalleries);

  const updateGallery = useCallback((galleryId: string, images: GalleryImage[]) => {
    setGalleries(prev => ({
      ...prev,
      [galleryId]: images
    }));
  }, []);

  const addImagesToGallery = useCallback((galleryId: string, images: GalleryImage[]) => {
    setGalleries(prev => ({
      ...prev,
      [galleryId]: [...(prev[galleryId] || []), ...images]
    }));
  }, []);

  const removeImageFromGallery = useCallback((galleryId: string, imageId: string) => {
    setGalleries(prev => ({
      ...prev,
      [galleryId]: (prev[galleryId] || []).filter(img => img.id !== imageId)
    }));
  }, []);

  const moveImage = useCallback((fromGallery: string, toGallery: string, imageId: string) => {
    setGalleries(prev => {
      const fromImages = prev[fromGallery] || [];
      const toImages = prev[toGallery] || [];
      const image = fromImages.find(img => img.id === imageId);
      
      if (!image) return prev;

      return {
        ...prev,
        [fromGallery]: fromImages.filter(img => img.id !== imageId),
        [toGallery]: [...toImages, image]
      };
    });
  }, []);

  const getGallery = useCallback((galleryId: string) => {
    return galleries[galleryId] || [];
  }, [galleries]);

  const searchImages = useCallback((query: string) => {
    const allImages = Object.values(galleries).flat();
    return allImages.filter(image => 
      image.name.toLowerCase().includes(query.toLowerCase()) ||
      image.category.toLowerCase().includes(query.toLowerCase()) ||
      image.designer.toLowerCase().includes(query.toLowerCase())
    );
  }, [galleries]);

  const filterByCategory = useCallback((category: string) => {
    const allImages = Object.values(galleries).flat();
    return allImages.filter(image => image.category === category);
  }, [galleries]);

  const filterByDesigner = useCallback((designer: string) => {
    const allImages = Object.values(galleries).flat();
    return allImages.filter(image => image.designer === designer);
  }, [galleries]);

  const value: GalleryContextType = {
    galleries,
    updateGallery,
    addImagesToGallery,
    removeImageFromGallery,
    moveImage,
    getGallery,
    searchImages,
    filterByCategory,
    filterByDesigner
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};