'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { StackGalleryProps, GalleryImage } from '@/types';
import { buildImageKitUrl, createBlurPlaceholder } from '@/lib/imagekit';

export default function StackGallery({ 
  images, 
  className, 
  maxItems = 5, 
  onItemClick 
}: StackGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.slice(0, maxItems);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    onItemClick?.(image);
  };

  const getStackTransform = (index: number, isHovered: boolean) => {
    const baseRotateY = [0, -2, 3, -1, 2][index] || 0;
    const baseRotateX = [0, 1, -1, 2, -2][index] || 0;
    const baseZ = [0, -10, -20, -30, -40][index] || 0;

    if (isHovered) {
      const hoverRotateY = [5, -8, 12, -6, 8][index] || 0;
      const hoverRotateX = [3, 4, -3, 5, -4][index] || 0;
      const hoverZ = [50, 30, 10, -10, -30][index] || 0;
      
      return {
        rotateY: hoverRotateY,
        rotateX: hoverRotateX,
        z: hoverZ,
        scale: 1.02,
      };
    }

    return {
      rotateY: baseRotateY,
      rotateX: baseRotateX,
      z: baseZ,
      scale: 1,
    };
  };

  return (
    <>
      <div 
        ref={containerRef}
        className={cn('stack-container relative w-full max-w-md mx-auto', className)}
        style={{ height: '400px' }}
        onMouseEnter={() => setHoveredIndex(0)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {displayImages.map((image, index) => {
          const isHovered = hoveredIndex !== null;
          const transform = getStackTransform(index, isHovered);
          
          return (
            <motion.div
              key={`${image.id}-${index}`}
              className="stack-item cursor-pointer"
              style={{
                width: '100%',
                height: '100%',
                zIndex: displayImages.length - index,
              }}
              animate={transform}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleImageClick(image)}
            >
              <motion.div
                className={cn(
                  'relative w-full h-full rounded-lg overflow-hidden shadow-2xl',
                  'bg-gray-900 border border-white/10'
                )}
                whileHover={{ 
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' 
                }}
              >
                <Image
                  src={buildImageKitUrl(image.url, {
                    width: 400,
                    height: 500,
                    quality: 85,
                    format: 'webp'
                  })}
                  alt={image.name}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={createBlurPlaceholder(image.url)}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image info overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 text-white"
                >
                  <h3 className="font-medium text-sm mb-1">{image.name}</h3>
                  <p className="text-xs text-white/70">{image.category}</p>
                </motion.div>

                {/* Stack number indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === 0 ? 1 : 0.6 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs font-mono"
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Stack counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="text-white/60 text-sm font-mono">
            {displayImages.length} {displayImages.length === 1 ? 'IMAGE' : 'IMAGES'}
          </div>
        </motion.div>
      </div>

      {/* Modal for enlarged view */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={buildImageKitUrl(selectedImage.url, {
                  quality: 95,
                  format: 'webp'
                })}
                alt={selectedImage.name}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>

              {/* Image info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white"
              >
                <h3 className="font-semibold text-lg mb-2">{selectedImage.name}</h3>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{selectedImage.category}</span>
                  <span>{selectedImage.designer}</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}