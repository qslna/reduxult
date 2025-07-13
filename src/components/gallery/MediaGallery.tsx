'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Play, Plus, X, Film, Camera, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buildImageKitUrl } from '@/lib/imagekit';
import { useAdmin } from '@/hooks/useAdmin';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // For videos
  name: string;
  category: string;
  designer: string;
  createdAt: Date;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onItemsChange: (items: MediaItem[]) => void;
  folder: string;
  className?: string;
  maxItems?: number;
}

export default function MediaGallery({
  items,
  onItemsChange,
  folder,
  className,
  maxItems = 6
}: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();

  const displayItems = items.slice(0, maxItems);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !isAdmin) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          
          // Update progress
          setUploadProgress(((index + 1) / files.length) * 100);
          
          if (data.video) {
            // Video upload with thumbnail
            return {
              id: data.video.fileId,
              type: 'video' as const,
              url: data.video.url,
              thumbnailUrl: data.thumbnail.url,
              name: file.name.replace(/\.[^/.]+$/, ''),
              category: 'Fashion Film',
              designer: 'collective',
              createdAt: new Date()
            } as MediaItem;
          } else {
            // Image upload
            return {
              id: data.fileId,
              type: 'image' as const,
              url: data.url,
              name: file.name.replace(/\.[^/.]+$/, ''),
              category: 'Fashion Film',
              designer: 'collective',
              createdAt: new Date()
            } as MediaItem;
          }
        }
        throw new Error('Upload failed');
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as MediaItem[];
      
      if (successfulUploads.length > 0) {
        onItemsChange([...items, ...successfulUploads]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string, itemUrl: string) => {
    if (!isAdmin) return;

    try {
      const response = await fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: itemUrl })
      });

      if (response.ok) {
        onItemsChange(items.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <>
      <div className={cn('w-full', className)}>
        {/* Upload Button */}
        {isAdmin && (
          <div className="mb-6 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  업로딩 중... {Math.round(uploadProgress)}%
                </>
              ) : (
                <>
                  <Plus size={20} />
                  미디어 업로드
                </>
              )}
            </button>
          </div>
        )}

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative aspect-video">
                <Image
                  src={buildImageKitUrl(item.thumbnailUrl || item.url, {
                    width: 400,
                    height: 300,
                    quality: 85,
                    format: 'webp'
                  })}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Media Type Indicator */}
                <div className="absolute top-3 left-3 p-2 bg-black/70 backdrop-blur-sm rounded-full">
                  {item.type === 'video' ? (
                    <Film size={16} className="text-pink-400" />
                  ) : (
                    <Camera size={16} className="text-blue-400" />
                  )}
                </div>

                {/* Play Button for Videos */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </motion.div>
                  </div>
                )}

                {/* Admin Delete Button */}
                {isAdmin && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id, item.url);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Item Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 text-white"
                >
                  <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                  <p className="text-xs text-white/70">{item.category}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {displayItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-medium text-white mb-2">아직 미디어가 없습니다</h3>
              <p className="text-gray-400">첫 번째 패션 필름을 업로드해보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
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
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="w-full h-auto rounded-lg"
                  style={{ maxHeight: '80vh' }}
                />
              ) : (
                <Image
                  src={buildImageKitUrl(selectedItem.url, {
                    quality: 95,
                    format: 'webp'
                  })}
                  alt={selectedItem.name}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
              )}
              
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Media info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white"
              >
                <h3 className="font-semibold text-lg mb-2">{selectedItem.name}</h3>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{selectedItem.category}</span>
                  <span>{selectedItem.type === 'video' ? 'Video' : 'Image'}</span>
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
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}