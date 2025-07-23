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
  ChevronRight,
  Settings,
  CheckSquare,
  MoreHorizontal,
  Copy,
  Move,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import useCMSStore from '@/store/useCMSStore';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  createdAt: Date;
  alt?: string;
  folder?: string;
  tags?: string[];
}

interface InstagramStyleCMSProps {
  galleryId: string;
  initialItems?: MediaItem[];
  onUpdate?: (items: MediaItem[]) => void;
  maxItems?: number;
  allowedTypes?: ('image' | 'video')[];
  aspectRatio?: 'square' | '4:3' | '16:9' | '4:5' | 'auto';
  columns?: number;
  enableBulkOperations?: boolean;
  enableRealUpload?: boolean;
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

// Real ImageKit upload function
const uploadToImageKit = async (file: File, folder: string = 'general'): Promise<string> => {
  try {
    // Get authentication token from API
    const authResponse = await fetch('/api/imagekit/auth');
    const authData = await authResponse.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('folder', `/${folder}`);
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
    formData.append('signature', authData.signature);
    formData.append('expire', authData.expire);
    formData.append('token', authData.token);

    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await uploadResponse.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.url;
  } catch (error) {
    console.error('ImageKit upload failed:', error);
    // Fallback to local URL for development
    return URL.createObjectURL(file);
  }
};

const InstagramStyleCMS: React.FC<InstagramStyleCMSProps> = ({
  galleryId,
  initialItems = [],
  onUpdate,
  maxItems = 50,
  allowedTypes = ['image', 'video'],
  aspectRatio = 'square',
  columns = 3,
  enableBulkOperations = true,
  enableRealUpload = true
}) => {
  const { isAdmin } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [previewGrid, setPreviewGrid] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // CMS Store integration
  const {
    addMedia,
    updateMedia,
    deleteMedia,
    bulkDeleteMedia,
    duplicateMedia,
    addActivity
  } = useCMSStore();

  // File validation utility
  const isValidFile = useCallback((file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov'];
    
    if (allowedTypes.includes('image') && validImageTypes.includes(file.type)) return true;
    if (allowedTypes.includes('video') && validVideoTypes.includes(file.type)) return true;
    
    return false;
  }, [allowedTypes]);

  // Enhanced file upload handler with real ImageKit integration
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const newItems: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!isValidFile(file)) continue;

      const tempId = `upload_${Date.now()}_${i}`;
      setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));

      try {
        let url: string;
        
        if (enableRealUpload) {
          // Real ImageKit upload with progress tracking
          url = await uploadToImageKit(file, galleryId);
        } else {
          // Development fallback
          url = URL.createObjectURL(file);
        }

        setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

        const newItem: MediaItem = {
          id: tempId,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          filename: file.name,
          size: file.size,
          createdAt: new Date(),
          alt: file.name.replace(/\.[^/.]+$/, ''),
          folder: galleryId,
          tags: []
        };
        
        newItems.push(newItem);

        // Add to CMS store
        addMedia({
          ...newItem,
          category: galleryId,
          folder: galleryId,
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          metadata: {}
        });

        // Add activity log
        addActivity({
          userId: 'current-user',
          action: 'upload',
          entityType: 'media',
          entityId: newItem.id,
          details: `Uploaded ${file.name} to ${galleryId}`
        });
        
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[tempId];
          return newProgress;
        });
      }
    }

    const updatedItems = [...items, ...newItems].slice(0, maxItems);
    setItems(updatedItems);
    onUpdate?.(updatedItems);
    
    // Clear upload progress after delay
    setTimeout(() => {
      setUploadProgress({});
      setIsUploading(false);
    }, 1000);
  }, [items, maxItems, onUpdate, isValidFile, enableRealUpload, galleryId, addMedia, addActivity]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAdmin) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            selectAll();
            break;
          case 'd':
            e.preventDefault();
            deselectAll();
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (selectedItems.size > 0) {
              deleteSelected();
            }
            break;
        }
      }

      // Lightbox navigation
      if (lightboxItem) {
        switch (e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, selectedItems, lightboxItem]);

  // 관리자 모드가 아니면 일반 갤러리만 표시
  if (!isAdmin) {
    return (
      <div className={`grid gap-2 ${getGridColumns(columns)} redux-gallery-view`}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`relative ${getAspectRatio(aspectRatio)} cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openLightbox(index)}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 6}
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            )}
            
            {/* Video indicator */}
            {item.type === 'video' && (
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full p-2">
                <Video className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    
    if (newSelection.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const selectAll = () => {
    setSelectedItems(new Set(items.map(item => item.id)));
    setIsSelectionMode(true);
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  // Delete handlers with CMS integration
  const deleteSelected = () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`정말로 선택된 ${selectedItems.size}개의 미디어를 삭제하시겠습니까?`)) {
      const idsToDelete = Array.from(selectedItems);
      
      // Remove from local state
      const updatedItems = items.filter(item => !selectedItems.has(item.id));
      setItems(updatedItems);
      onUpdate?.(updatedItems);
      
      // Remove from CMS store
      bulkDeleteMedia(idsToDelete);
      
      // Add activity log
      addActivity({
        userId: 'current-user',
        action: 'delete',
        entityType: 'media',
        entityId: 'bulk',
        details: `Deleted ${idsToDelete.length} media items`
      });
      
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    }
  };

  const deleteItem = (itemId: string) => {
    if (confirm('이 미디어를 삭제하시겠습니까?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      onUpdate?.(updatedItems);
      
      // Remove from CMS store
      deleteMedia(itemId);
      
      // Add activity log
      const item = items.find(i => i.id === itemId);
      addActivity({
        userId: 'current-user',
        action: 'delete',
        entityType: 'media',
        entityId: itemId,
        details: `Deleted ${item?.filename || 'media item'}`
      });
    }
  };

  const duplicateItem = (itemId: string) => {
    const originalItem = items.find(item => item.id === itemId);
    if (!originalItem) return;

    const duplicatedItem: MediaItem = {
      ...originalItem,
      id: `${itemId}_copy_${Date.now()}`,
      filename: `${originalItem.filename}_copy`,
      createdAt: new Date()
    };

    const updatedItems = [...items, duplicatedItem];
    setItems(updatedItems);
    onUpdate?.(updatedItems);
    
    // Add to CMS store
    addMedia({
      ...duplicatedItem,
      category: galleryId,
      folder: galleryId,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: originalItem.tags || [],
      metadata: {}
    });
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxItem(items[index]);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxItem(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % items.length;
    setLightboxIndex(nextIndex);
    setLightboxItem(items[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + items.length) % items.length;
    setLightboxIndex(prevIndex);
    setLightboxItem(items[prevIndex]);
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <div className="redux-instagram-cms">
      {/* Enhanced Admin Controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-lg">Gallery Manager</span>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full inline-block ml-2">
                {items.length}/{maxItems}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {enableBulkOperations && (
            <>
              <button
                onClick={() => setIsSelectionMode(!isSelectionMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isSelectionMode ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Selection Mode"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              
              {isSelectionMode && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">
                    {selectedItems.size} selected
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                  >
                    None
                  </button>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={deleteSelected}
                      className="text-xs px-2 py-1 bg-red-500/80 rounded hover:bg-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          <button
            onClick={() => setPreviewGrid(!previewGrid)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title={previewGrid ? "Hide Grid" : "Show Grid"}
          >
            {previewGrid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Media
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio
                </label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => {/* Handle aspect ratio change */}}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="square">Square (1:1)</option>
                  <option value="4:3">Landscape (4:3)</option>
                  <option value="16:9">Widescreen (16:9)</option>
                  <option value="4:5">Portrait (4:5)</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={columns}
                  onChange={(e) => {/* Handle columns change */}}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{columns} columns</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Mode
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableRealUpload}
                    onChange={(e) => {/* Handle upload mode change */}}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Real ImageKit Upload</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && Object.keys(uploadProgress).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-800">Uploading files...</span>
            </div>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="flex items-center gap-3">
                  <div className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-blue-700 font-medium">{progress}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Drag and Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative transition-all duration-300 ${
          isDragOver 
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-indigo-400 rounded-xl' 
            : 'bg-transparent'
        }`}
      >
        {/* Empty State */}
        {items.length === 0 && !isUploading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No media yet</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Start building your gallery by uploading images and videos. 
              You can drag and drop files here or use the button below.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Upload Your First Media
            </button>
          </div>
        )}

        {/* Media Grid */}
        <div className={`grid gap-4 ${getGridColumns(columns)}`}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative ${getAspectRatio(aspectRatio)} group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                selectedItems.has(item.id) ? 'ring-4 ring-indigo-500 ring-offset-2' : ''
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (isSelectionMode) {
                  toggleItemSelection(item.id);
                } else {
                  openLightbox(index);
                }
              }}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.alt || item.filename}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={index < 6}
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  muted
                  loop
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              )}

              {/* Enhanced Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Top Controls */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  {/* Selection Checkbox */}
                  {(isSelectionMode || selectedItems.has(item.id)) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemSelection(item.id);
                      }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedItems.has(item.id)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white/20 border-white/50 text-white hover:bg-white/30'
                      }`}
                    >
                      {selectedItems.has(item.id) && <Check className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Type Indicator */}
                  {item.type === 'video' && (
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Center Controls */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center hover:scale-110"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <div className="relative group/more">
                      <button
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center hover:scale-110"
                        title="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[120px] opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-200 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateItem(item.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle move functionality
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Move className="w-4 h-4" />
                          Move
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white">
                    <p className="text-sm font-medium truncate">{item.filename}</p>
                    <p className="text-xs text-white/80">
                      {(item.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Item Button */}
          {items.length > 0 && items.length < maxItems && (
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className={`${getAspectRatio(aspectRatio)} border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100 rounded-full flex items-center justify-center transition-all duration-300">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-sm text-gray-500 group-hover:text-indigo-600 font-medium">
                  Add Media
                </p>
              </div>
            </motion.button>
          )}
        </div>

        {/* Enhanced Drag Over Overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-100/90 to-purple-100/90 backdrop-blur-sm border-2 border-dashed border-indigo-400 rounded-xl flex items-center justify-center z-20"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <p className="text-2xl font-bold text-indigo-700 mb-2">Drop files here</p>
                <p className="text-indigo-600">Support for images and videos</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Professional Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[10000] flex items-center justify-center p-4"
            onClick={handleLightboxClick}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Media Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.type === 'image' ? (
                <Image
                  src={lightboxItem.url}
                  alt={lightboxItem.alt || lightboxItem.filename}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  sizes="90vw"
                />
              ) : (
                <video
                  src={lightboxItem.url}
                  controls
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                  autoPlay
                />
              )}
            </motion.div>

            {/* Info Panel */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{lightboxItem.filename}</h3>
                  <p className="text-white/80 text-sm">
                    {(lightboxItem.size / 1024 / 1024).toFixed(2)} MB • 
                    {lightboxItem.createdAt.toLocaleDateString()} • 
                    {lightboxIndex + 1} of {items.length}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => duplicateItem(lightboxItem.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(lightboxItem.id)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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