'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, X, Settings, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import { StackGalleryProps, GalleryImage } from '@/types';
import { buildImageKitUrl, createBlurPlaceholder } from '@/lib/imagekit';

interface EnhancedStackGalleryProps extends StackGalleryProps {
  isAdmin?: boolean;
  onImagesChange?: (images: GalleryImage[]) => void;
  folder?: string;
  enableUpload?: boolean;
  enableDelete?: boolean;
  enableReorder?: boolean;
}

export default function EnhancedStackGallery({
  images,
  className,
  maxItems = 5,
  onItemClick,
  isAdmin = false,
  onImagesChange,
  folder = 'gallery',
  enableUpload = true,
  enableDelete = true,
  enableReorder = false
}: EnhancedStackGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.slice(0, maxItems);
  const hasMoreImages = images.length > maxItems;

  const handleImageClick = (image: GalleryImage) => {
    if (!isAdmin || !showSettings) {
      setSelectedImage(image);
      setIsModalOpen(true);
      onItemClick?.(image);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !isAdmin || !enableUpload) return;
    
    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
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
            id: data.fileId,
            url: data.url,
            name: file.name.replace(/\.[^/.]+$/, ''),
            category: 'Gallery',
            designer: 'collective',
            createdAt: new Date()
          } as GalleryImage;
        }
        throw new Error('Upload failed');
      } catch (err) {
        console.error('Upload error:', err);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as GalleryImage[];
    
    if (successfulUploads.length > 0 && onImagesChange) {
      onImagesChange([...images, ...successfulUploads]);
    }
    
    setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!isAdmin || !enableDelete || !onImagesChange) return;

    try {
      const response = await fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });

      if (response.ok) {
        onImagesChange(images.filter(img => img.id !== imageId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    if (!isAdmin || !enableReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!isAdmin || !enableReorder || draggedIndex === null || !onImagesChange) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
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
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-colors",
                showSettings 
                  ? "bg-blue-600 text-white" 
                  : "bg-black/50 text-white hover:bg-black/70"
              )}
            >
              <Settings size={16} />
            </button>
            {enableUpload && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
              </button>
            )}
          </div>
        )}

        {displayImages.map((image, index) => {
          const isHovered = hoveredIndex !== null;
          const transform = getStackTransform(index, isHovered);
          const isDragged = draggedIndex === index;
          
          return (
            <motion.div
              key={`${image.id}-${index}`}
              className="stack-item cursor-pointer"
              style={{
                width: '100%',
                height: '100%',
                zIndex: displayImages.length - index + (isDragged ? 100 : 0),
              }}
              animate={transform}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleImageClick(image)}
            >
              <div
                draggable={isAdmin && enableReorder && showSettings}
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(index)}
                className="w-full h-full"
              >
              <motion.div
                className={cn(
                  'relative w-full h-full rounded-lg overflow-hidden shadow-2xl',
                  'bg-gray-900 border border-white/10',
                  isDragged && 'opacity-50'
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
                  className="absolute top-4 left-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs font-mono"
                >
                  {index + 1}
                </motion.div>

                {/* Admin Delete Button */}
                {isAdmin && enableDelete && showSettings && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id, image.url);
                    }}
                    className="absolute top-4 right-12 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-xs"
                  >
                    <X size={12} />
                  </motion.button>
                )}

                {/* Drag indicator */}
                {isAdmin && enableReorder && showSettings && (
                  <div className="absolute inset-0 border-2 border-dashed border-transparent hover:border-blue-400 transition-colors pointer-events-none" />
                )}
              </motion.div>
              </div>
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
            {hasMoreImages && (
              <span className="text-white/40 ml-2">
                (+{images.length - maxItems} more)
              </span>
            )}
          </div>
        </motion.div>

        {/* Empty state for admin */}
        {images.length === 0 && isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-gray-400">
              <Plus size={32} className="mx-auto mb-2" />
              <p className="text-sm">Click to add images</p>
            </div>
          </motion.div>
        )}
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
                <X size={20} />
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}