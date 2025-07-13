'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, X, Upload, Trash2, Settings, Grid, List } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buildImageKitUrl } from '@/lib/imagekit';
import { useAdmin } from '@/hooks/useAdmin';
import { GalleryImage } from '@/types';

interface AdminImageGalleryProps {
  folder: string;
  title?: string;
  className?: string;
  layout?: 'stack' | 'grid';
  maxItems?: number;
}

export default function AdminImageGallery({
  folder,
  title,
  className,
  layout = 'stack',
  maxItems = 20
}: AdminImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/imagekit/list?folder=${folder}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [folder]);

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
          setUploadProgress(((index + 1) / files.length) * 100);
          
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
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as GalleryImage[];
      
      if (successfulUploads.length > 0) {
        setImages([...images, ...successfulUploads]);
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

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!isAdmin) return;

    try {
      const response = await fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
        setSelectedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!isAdmin || selectedImages.size === 0) return;

    const imagesToDelete = images.filter(img => selectedImages.has(img.id));
    
    try {
      await Promise.all(
        imagesToDelete.map(async (image) => {
          const response = await fetch('/api/imagekit/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: image.url })
          });
          return response.ok;
        })
      );

      setImages(images.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const displayImages = images.slice(0, maxItems);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-96', className)}>
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (layout === 'stack') {
    return (
      <div className={cn('relative w-full max-w-md mx-auto', className)} style={{ height: '400px' }}>
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setShowAdminControls(!showAdminControls)}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-colors",
                showAdminControls 
                  ? "bg-blue-600 text-white" 
                  : "bg-black/50 text-white hover:bg-black/70"
              )}
            >
              <Settings size={16} />
            </button>
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
          </div>
        )}

        {/* Stack Gallery */}
        {displayImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="absolute inset-0 cursor-pointer"
            style={{
              zIndex: displayImages.length - index,
              transform: `rotate(${[-2, 1, -1, 2, 0][index] || 0}deg) translateY(${index * -2}px)`,
            }}
            whileHover={{ 
              scale: 1.02,
              rotate: 0,
              zIndex: 100,
              transition: { duration: 0.3 }
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
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
                sizes="400px"
              />
              
              {/* Image Info Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-4 right-4 text-white"
              >
                <h3 className="font-medium text-sm mb-1">{image.name}</h3>
                <p className="text-xs text-white/70">{image.category}</p>
              </motion.div>

              {/* Admin Delete Button */}
              {isAdmin && showAdminControls && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.id, image.url);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-xs"
                >
                  <X size={12} />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {displayImages.length === 0 && isAdmin && (
          <motion.div
            className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center text-gray-400">
              <Plus size={32} className="mx-auto mb-2" />
              <p className="text-sm">이미지 추가하기</p>
            </div>
          </motion.div>
        )}

        {/* Stack Counter */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="text-white/60 text-sm font-mono">
            {displayImages.length} {displayImages.length === 1 ? 'IMAGE' : 'IMAGES'}
          </div>
        </motion.div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center gap-3">
              <Upload size={16} />
              <div className="flex-1">
                <div className="text-xs mb-1">업로드 중... {Math.round(uploadProgress)}%</div>
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
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

  // Grid Layout
  return (
    <div className={cn('w-full', className)}>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  업로딩... {Math.round(uploadProgress)}%
                </>
              ) : (
                <>
                  <Plus size={16} />
                  이미지 추가
                </>
              )}
            </button>
            
            {selectedImages.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                선택된 {selectedImages.size}개 삭제
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              )}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      )}>
        {displayImages.map((image) => (
          <motion.div
            key={image.id}
            className={cn(
              'relative group bg-gray-800 rounded-lg overflow-hidden cursor-pointer',
              selectedImages.has(image.id) && 'ring-2 ring-blue-500',
              viewMode === 'list' && 'flex items-center p-4'
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="relative aspect-square">
                  <Image
                    src={buildImageKitUrl(image.url, {
                      width: 300,
                      height: 300,
                      quality: 85,
                      format: 'webp'
                    })}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  
                  {/* Admin Controls Overlay */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                        className="w-5 h-5"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-white truncate">{image.name}</h4>
                  <p className="text-xs text-gray-400">{image.category}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={buildImageKitUrl(image.url, {
                      width: 64,
                      height: 64,
                      quality: 85,
                      format: 'webp'
                    })}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 ml-4">
                  <h4 className="text-sm font-medium text-white">{image.name}</h4>
                  <p className="text-xs text-gray-400">{image.category}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="w-4 h-4"
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id, image.url)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {displayImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-medium text-white mb-2">아직 이미지가 없습니다</h3>
          <p className="text-gray-400">
            {isAdmin ? '첫 번째 이미지를 업로드해보세요' : '곧 멋진 이미지들이 추가될 예정입니다'}
          </p>
          {isAdmin && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              이미지 추가하기
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
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