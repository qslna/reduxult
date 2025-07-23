'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Upload, 
  X, 
  Check, 
  Grid3X3, 
  Trash2, 
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  createdAt: Date;
  alt?: string;
}

interface InstagramStyleCMSProps {
  galleryId: string;
  initialItems?: MediaItem[];
  onUpdate?: (items: MediaItem[]) => void;
  maxItems?: number;
  allowedTypes?: ('image' | 'video')[];
  aspectRatio?: 'square' | '4:3' | '16:9' | '4:5' | 'auto';
  columns?: number;
}

// Utility functions
const getGridColumns = (cols: number): string => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-3 lg:grid-cols-6'
  };
  return colClasses[cols as keyof typeof colClasses] || 'grid-cols-3';
};

const getAspectRatio = (ratio: string): string => {
  const aspectClasses = {
    'square': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '4:5': 'aspect-[4/5]',
    'auto': 'aspect-auto'
  };
  return aspectClasses[ratio as keyof typeof aspectClasses] || 'aspect-square';
};

const InstagramStyleCMS: React.FC<InstagramStyleCMSProps> = ({
  galleryId,
  initialItems = [],
  onUpdate,
  maxItems = 50,
  allowedTypes = ['image', 'video'],
  aspectRatio = 'square',
  columns = 3
}) => {
  const { isAdmin } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [previewGrid, setPreviewGrid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // File validation utility
  const isValidFile = useCallback((file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov'];
    
    if (allowedTypes.includes('image') && validImageTypes.includes(file.type)) return true;
    if (allowedTypes.includes('video') && validVideoTypes.includes(file.type)) return true;
    
    return false;
  }, [allowedTypes]);

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const newItems: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!isValidFile(file)) continue;

      try {
        // Create a URL for preview (in real implementation, upload to ImageKit)
        const url = URL.createObjectURL(file);
        const newItem: MediaItem = {
          id: `temp_${Date.now()}_${i}`,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          filename: file.name,
          size: file.size,
          createdAt: new Date(),
          alt: file.name.replace(/\.[^/.]+$/, '')
        };
        
        newItems.push(newItem);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    const updatedItems = [...items, ...newItems].slice(0, maxItems);
    setItems(updatedItems);
    onUpdate?.(updatedItems);
    setIsUploading(false);
  }, [items, maxItems, onUpdate, isValidFile]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  // 관리자 모드가 아니면 일반 갤러리만 표시
  if (!isAdmin) {
    return (
      <div className={`grid gap-2 ${getGridColumns(columns)}`}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`relative ${getAspectRatio(aspectRatio)} cursor-pointer group overflow-hidden rounded-lg`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setLightboxItem(item)}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            )}
            
            {/* Video indicator */}
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                <Video className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  // Selection handlers
  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  // Delete handlers
  const deleteSelected = () => {
    const updatedItems = items.filter(item => !selectedItems.has(item.id));
    setItems(updatedItems);
    onUpdate?.(updatedItems);
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    onUpdate?.(updatedItems);
  };

  return (
    <div className="instagram-cms">
      {/* Admin Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5" />
          <span className="font-medium">Gallery Manager</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {items.length}/{maxItems}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewGrid(!previewGrid)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title={previewGrid ? "Hide Grid" : "Show Grid"}
          >
            {previewGrid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Selection Mode"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white text-purple-500 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Selection Mode Controls */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedItems.size} selected
                </span>
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Deselect All
                </button>
              </div>
              
              {selectedItems.size > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag and Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${getGridColumns(columns)} gap-3 p-4 rounded-lg transition-all duration-300 ${
          isDragOver 
            ? 'bg-blue-50 border-2 border-dashed border-blue-400' 
            : 'bg-transparent'
        }`}
      >
        {/* Empty State */}
        {items.length === 0 && !isUploading && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No media yet</p>
            <p className="text-sm mb-4">Drag and drop files here or click the Add button</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Image
            </button>
          </div>
        )}

        {/* Media Grid */}
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`relative ${getAspectRatio(aspectRatio)} group cursor-pointer overflow-hidden rounded-lg ${
              selectedItems.has(item.id) ? 'ring-4 ring-blue-500' : ''
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              if (isSelectionMode) {
                toggleItemSelection(item.id);
              } else {
                setLightboxItem(item);
              }
            }}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            )}

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex gap-2">
                {isSelectionMode ? (
                  <button
                    className={`p-2 rounded-full transition-colors ${
                      selectedItems.has(item.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(item);
                      }}
                      className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Type Indicator */}
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-80">
                <Video className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  className="w-5 h-5 rounded border-2 border-white bg-white/20 text-blue-500 focus:ring-blue-500 focus:ring-2"
                />
              </div>
            )}
          </motion.div>
        ))}

        {/* Add New Item Button */}
        {items.length > 0 && items.length < maxItems && (
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className={`${getAspectRatio(aspectRatio)} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-colors group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-purple-500" />
              <p className="text-sm text-gray-500 group-hover:text-purple-600">Add Media</p>
            </div>
          </motion.button>
        )}

        {/* Drag Over Overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-100/80 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p className="text-xl font-medium text-blue-700 mb-2">Drop files here</p>
                <p className="text-blue-600">Support images and videos</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="font-medium mb-2">Uploading media...</p>
              <p className="text-sm text-gray-600">Please wait while we process your files</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              
              {lightboxItem.type === 'image' ? (
                <Image
                  src={lightboxItem.url}
                  alt={lightboxItem.alt || lightboxItem.filename}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  sizes="100vw"
                />
              ) : (
                <video
                  src={lightboxItem.url}
                  controls
                  className="max-w-full max-h-full rounded-lg"
                  autoPlay
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <p className="text-white font-medium">{lightboxItem.filename}</p>
                <p className="text-gray-300 text-sm">
                  {(lightboxItem.size / 1024 / 1024).toFixed(2)} MB • {lightboxItem.createdAt.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.includes('image') && allowedTypes.includes('video') 
          ? 'image/*,video/*' 
          : allowedTypes.includes('image') 
            ? 'image/*' 
            : 'video/*'
        }
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default InstagramStyleCMS;