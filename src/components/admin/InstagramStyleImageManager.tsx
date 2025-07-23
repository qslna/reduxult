'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Upload, Check } from 'lucide-react';
import Image from 'next/image';

interface ImageItem {
  id: string;
  url: string;
  name: string;
  selected?: boolean;
}

interface InstagramStyleImageManagerProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  allowMultiple?: boolean;
  className?: string;
}

export default function InstagramStyleImageManager({
  images,
  onImagesChange,
  maxImages = 50,
  allowMultiple = true,
  className = ''
}: InstagramStyleImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | File[]) => {
    if (isUploading) return;
    
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');

        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          return {
            id: result.fileId,
            url: result.url,
            name: result.name
          };
        }
        return null;
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as ImageItem[];
      onImagesChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const selectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedImages.size === 0) return;
    
    try {
      // Delete from ImageKit
      const deletePromises = Array.from(selectedImages).map(async (imageId) => {
        await fetch('/api/imagekit/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: imageId }),
        });
      });

      await Promise.all(deletePromises);
      
      // Update local state
      const remainingImages = images.filter(img => !selectedImages.has(img.id));
      onImagesChange(remainingImages);
      setSelectedImages(new Set());
      setShowConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: imageId }),
      });
      
      const remainingImages = images.filter(img => img.id !== imageId);
      onImagesChange(remainingImages);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`w-full ${className}`}>
      {/* Header Actions */}
      {images.length > 0 && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{images.length} images</span>
            {maxImages && <span>• {maxImages - images.length} remaining</span>}
          </div>
          
          {selectedImages.size > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedImages.size} selected
              </span>
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedImages(new Set())}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Select All
            </button>
          )}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {/* Upload Button - Instagram Style */}
        {canAddMore && (
          <motion.div
            className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Uploading...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                  Add Photo
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Image Items */}
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
              selectedImages.has(image.id) 
                ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' 
                : ''
            }`}
            onClick={() => toggleImageSelection(image.id)}
          >
            <Image
              src={image.url}
              alt={image.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
            
            {/* Selection Overlay */}
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
              selectedImages.has(image.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedImages.has(image.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-white bg-white/20'
              }`}>
                {selectedImages.has(image.id) && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>

            {/* Individual Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteImage(image.id);
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add photos to your gallery by clicking the button below or dragging files here
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Photos
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Images
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={allowMultiple}
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}