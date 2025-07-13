'use client';

import { useState, useEffect } from 'react';
import EnhancedStackGallery from './EnhancedStackGallery';
import { GalleryImage } from '@/types';
import { useAdmin } from '@/hooks/useAdmin';

interface GalleryWithImageKitProps {
  folder: string;
  maxItems?: number;
  className?: string;
  enableUpload?: boolean;
  enableDelete?: boolean;
  enableReorder?: boolean;
}

export default function GalleryWithImageKit({
  folder,
  maxItems = 5,
  className,
  enableUpload = true,
  enableDelete = true,
  enableReorder = false
}: GalleryWithImageKitProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/imagekit/list?folder=${folder}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [folder]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <EnhancedStackGallery
      images={images}
      className={className}
      maxItems={maxItems}
      isAdmin={isAdmin}
      folder={folder}
      enableUpload={enableUpload}
      enableDelete={enableDelete}
      enableReorder={enableReorder}
      onImagesChange={setImages}
    />
  );
}