'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/components/ToastProvider';
import SimpleImageManager from './SimpleImageManager';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface StackGalleryProps {
  images: GalleryImage[];
  folder: string;
  className?: string;
  maxVisible?: number;
  onImagesUpdate?: (images: GalleryImage[]) => void;
}

export default function StackGallery({
  images,
  folder,
  className = '',
  maxVisible = 3,
  onImagesUpdate
}: StackGalleryProps) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(images);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();
  const { success, error } = useToast();

  const visibleImages = galleryImages.slice(0, maxVisible);
  const hasMoreImages = galleryImages.length > maxVisible;

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const uploadPromises = Array.from(files).map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          return {
            id: `${Date.now()}-${index}`,
            src: data.url,
            alt: file.name
          };
        }
        throw new Error('Upload failed');
      } catch (err) {
        error(`${file.name} 업로드에 실패했습니다.`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as GalleryImage[];
    
    if (successfulUploads.length > 0) {
      const newImages = [...galleryImages, ...successfulUploads];
      setGalleryImages(newImages);
      onImagesUpdate?.(newImages);
      success(`${successfulUploads.length}개 이미지가 추가되었습니다.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeImage = (imageId: string) => {
    const newImages = galleryImages.filter(img => img.id !== imageId);
    setGalleryImages(newImages);
    onImagesUpdate?.(newImages);
    success('이미지가 제거되었습니다.');
  };

  const handleAddImages = () => {
    if (isAdmin) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative aspect-square cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Stack Images */}
        <AnimatePresence>
          {visibleImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="absolute inset-0 rounded-lg overflow-hidden shadow-lg bg-white"
              initial={{ 
                rotate: 0,
                scale: 1,
                x: 0,
                y: 0
              }}
              animate={{ 
                rotate: isHovered ? (index * 8 - 8) : (index * 5 - 5),
                scale: isHovered ? (1 - index * 0.02) : (1 - index * 0.05),
                x: isHovered ? index * 25 : 0,
                y: isHovered ? index * 5 : index * -3
              }}
              transition={{ 
                duration: 0.4,
                ease: 'easeOut',
                delay: isHovered ? index * 0.1 : 0
              }}
              style={{ 
                zIndex: visibleImages.length - index,
                transformOrigin: 'bottom center'
              }}
            >
              <SimpleImageManager
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                folder={folder}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Remove Button for Admin */}
              {isAdmin && isHovered && (
                <motion.button
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  ×
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Count Indicator */}
        {hasMoreImages && (
          <motion.div
            className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            +{galleryImages.length - maxVisible}
          </motion.div>
        )}

        {/* Add Button for Admin */}
        {isAdmin && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-all duration-300"
              onClick={handleAddImages}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {galleryImages.length === 0 && (
          <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <div className="text-sm">
                {isAdmin ? '클릭하여 이미지 추가' : '이미지 없음'}
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}