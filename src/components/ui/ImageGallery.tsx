'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Lightbox from './Lightbox';
import EditableImage from '@/components/admin/EditableImage';

interface ImageGalleryProps {
  images: string[];
  columns?: 2 | 3 | 4;
  gap?: number;
  category?: string;
  editable?: boolean;
  onImagesUpdate?: (images: string[]) => void;
}

export default function ImageGallery({
  images,
  columns = 3,
  gap = 6,
  category = 'gallery',
  editable = false,
  onImagesUpdate
}: ImageGalleryProps) {
  const [galleryImages, setGalleryImages] = useState(images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpdate = (index: number, newSrc: string) => {
    const newImages = [...galleryImages];
    newImages[index] = newSrc;
    setGalleryImages(newImages);
    onImagesUpdate?.(newImages);
  };

  const handleImageDelete = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    onImagesUpdate?.(newImages);
  };

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <>
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-${gap}`}>
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index);
              setLightboxOpen(true);
            }}
          >
            {editable ? (
              <EditableImage
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onUpdate={(newSrc) => handleImageUpdate(index, newSrc)}
                onDelete={() => handleImageDelete(index)}
                category={category}
              />
            ) : (
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* View icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentIndex(prev => (prev + 1) % galleryImages.length)}
        onPrevious={() => setCurrentIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
      />
    </>
  );
}