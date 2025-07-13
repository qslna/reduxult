'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus } from 'lucide-react';
import { validateFile } from '@/lib/imagekit';
import { cn } from '@/utils/cn';

interface ImageManagerProps {
  images: string[];
  folder: string;
  maxImages?: number;
  className?: string;
  onImagesChange?: (images: string[]) => void;
  isAdmin?: boolean;
  gridLayout?: boolean;
  allowReorder?: boolean;
}

export default function ImageManager({
  images = [],
  folder,
  maxImages = 10,
  className = '',
  onImagesChange,
  isAdmin = false,
  gridLayout = false,
  allowReorder = true
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files.length || images.length >= maxImages) return;

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error(validation.error);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('fileName', file.name);

        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            newImages.push(result.data.url);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      onImagesChange?.(updatedImages);
    }

    setIsUploading(false);
  }, [images, folder, maxImages, onImagesChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange?.(newImages);
  };

  const handleDragStart = (index: number) => {
    if (!allowReorder) return;
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    if (!allowReorder) return;
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDragEnter = (index: number) => {
    if (!allowReorder || draggedItem === null) return;
    setDraggedOver(index);
  };

  const handleDragDropReorder = () => {
    if (!allowReorder || draggedItem === null || draggedOver === null) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedItem];
    newImages.splice(draggedItem, 1);
    newImages.splice(draggedOver, 0, draggedImage);
    
    onImagesChange?.(newImages);
    setDraggedItem(null);
    setDraggedOver(null);
  };

  if (!isAdmin) {
    return (
      <div className={cn('space-y-4', className)}>
        {images.length > 0 && (
          <div className={cn(
            gridLayout 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'flex flex-wrap gap-4'
          )}>
            {images.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          'hover:border-gray-400 focus-within:border-gray-500',
          isUploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading || images.length >= maxImages}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isUploading ? '업로드 중...' : '이미지를 드래그하거나 클릭하여 업로드'}
          </p>
          <p className="text-xs text-gray-500">
            {images.length}/{maxImages} 이미지
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-black text-white hover:bg-gray-800',
              'disabled:bg-gray-300 disabled:cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            이미지 선택
          </button>
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className={cn(
          gridLayout 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'flex flex-wrap gap-4'
        )}>
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  'relative group aspect-square rounded-lg overflow-hidden bg-gray-100',
                  'border-2 border-transparent',
                  draggedOver === index && 'border-blue-500',
                  allowReorder && 'cursor-move'
                )}
                draggable={allowReorder}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragEnter={() => handleDragEnter(index)}
                onDrop={handleDragDropReorder}
              >
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={cn(
                    'absolute top-2 right-2 w-6 h-6 rounded-full',
                    'bg-red-500 text-white opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-200 hover:bg-red-600',
                    'flex items-center justify-center text-sm'
                  )}
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Drag Indicator */}
                {allowReorder && (
                  <div className={cn(
                    'absolute top-2 left-2 w-6 h-6 rounded',
                    'bg-black/50 text-white opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-200',
                    'flex items-center justify-center text-xs'
                  )}>
                    ⋮⋮
                  </div>
                )}

                {/* Index */}
                <div className={cn(
                  'absolute bottom-2 left-2 px-2 py-1 rounded',
                  'bg-black/50 text-white text-xs'
                )}>
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>아직 업로드된 이미지가 없습니다.</p>
        </div>
      )}
    </div>
  );
}