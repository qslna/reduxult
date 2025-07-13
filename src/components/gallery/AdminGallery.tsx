'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, X, Upload, Grid, Move, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buildImageKitUrl } from '@/lib/imagekit';
import { GalleryImage } from '@/types';

interface AdminGalleryProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  className?: string;
  title?: string;
  folder?: string;
  maxItems?: number;
  isAdmin?: boolean;
}

export default function AdminGallery({
  images,
  onImagesChange,
  className,
  title,
  folder = 'gallery',
  maxItems,
  isAdmin = false
}: AdminGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImages = maxItems ? images.slice(0, maxItems) : images;

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length || !isAdmin) return;
    
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
    
    if (successfulUploads.length > 0) {
      onImagesChange([...images, ...successfulUploads]);
    }
    
    setIsUploading(false);
  }, [images, onImagesChange, folder, isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!isAdmin) return;

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

  const handleDragStart = (index: number) => {
    if (!isAdmin) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!isAdmin || draggedIndex === null) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const handleEditName = (imageId: string, currentName: string) => {
    if (!isAdmin) return;
    setEditingImage(imageId);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    
    const updatedImages = images.map(img => 
      img.id === editingImage 
        ? { ...img, name: editName }
        : img
    );
    
    onImagesChange(updatedImages);
    setEditingImage(null);
    setEditName('');
  };

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {images.length} {images.length === 1 ? 'image' : 'images'}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
                Add Images
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative group"
              draggable={isAdmin}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src={buildImageKitUrl(image.url, {
                    width: 300,
                    height: 300,
                    quality: 85,
                    format: 'webp'
                  })}
                  alt={image.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Admin overlay */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditName(image.id, image.name)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Edit name"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Drag indicator */}
                {isAdmin && draggedIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/30 border-2 border-blue-500 border-dashed rounded-lg" />
                )}
              </div>

              {/* Image name */}
              <div className="mt-2">
                {editingImage === image.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') {
                          setEditingImage(null);
                          setEditName('');
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 truncate">{image.name}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Upload zone */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-gray-300">
              {isUploading ? (
                <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-white rounded-full" />
              ) : (
                <>
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm font-medium">Add Images</span>
                  <span className="text-xs text-gray-500">Click or drag files</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Show more indicator */}
      {maxItems && images.length > maxItems && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">
            Showing {maxItems} of {images.length} images
          </span>
        </div>
      )}
    </div>
  );
}