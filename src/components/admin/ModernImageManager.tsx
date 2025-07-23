'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Upload, 
  Trash2, 
  Grid, 
  List, 
  Search,
  Image as ImageIcon,
  Video,
  File,
  Check
} from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  url: string;
  name?: string;
  type: 'image' | 'video' | 'file';
  size: number;
  uploadedAt: Date;
}

interface ModernImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (items: MediaItem[]) => void;
  allowMultiple?: boolean;
  acceptedTypes?: string[];
  galleryId?: string;
}

export default function ModernImageManager({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = true,
  acceptedTypes = ['image/*', 'video/*'],
  galleryId
}: ModernImageManagerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', galleryId || 'general');

        // Simulate upload progress
        setUploadProgress(((i + 1) / files.length) * 100);
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        const newItem: MediaItem = {
          id: `upload_${Date.now()}_${i}`,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
        };
        
        setMediaItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [galleryId]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const toggleSelection = (itemId: string) => {
    if (!allowMultiple) {
      setSelectedItems(new Set([itemId]));
    } else {
      const newSelection = new Set(selectedItems);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      setSelectedItems(newSelection);
    }
  };

  const handleConfirm = () => {
    const selected = mediaItems.filter(item => selectedItems.has(item.id));
    onSelect?.(selected);
    onClose();
  };

  const deleteItem = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const filteredItems = mediaItems.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="absolute inset-4 sm:inset-8 lg:inset-16 bg-gray-900 rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Media Manager</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative ${
              dragActive ? 'bg-blue-900/20 border-blue-500' : 'border-gray-700'
            } border-2 border-dashed rounded-lg transition-colors`}
          >
            {isUploading ? (
              <div className="p-8 text-center">
                <div className="w-full max-w-xs mx-auto">
                  <div className="text-white mb-2">Uploading...</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">
                  Supported: Images, Videos
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      selectedItems.has(item.id) ? 'ring-4 ring-blue-600' : ''
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.name || 'Media'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : item.type === 'video' ? (
                      <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-500" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                        <File className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    
                    {selectedItems.has(item.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="absolute top-2 left-2 p-1 bg-red-600 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center p-4 hover:bg-gray-800 cursor-pointer ${
                      selectedItems.has(item.id) ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden mr-4">
                      {item.type === 'image' ? (
                        <Image
                          src={item.url}
                          alt={item.name || 'Media'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : item.type === 'video' ? (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <File className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.name || 'Untitled'}</div>
                      <div className="text-sm text-gray-400">
                        {(item.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    
                    {selectedItems.has(item.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {selectedItems.size} selected
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedItems.size === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
}