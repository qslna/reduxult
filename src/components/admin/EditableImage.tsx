'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Edit2, Upload, Check, X, AlertCircle, Copy, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useContentStore from '@/store/useContentStore';
import useCMSStore from '@/store/useCMSStore';
import { uploadToImageKit } from '@/lib/imagekit';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  onUpdate?: (newSrc: string) => void;
  onDelete?: () => void;
  category?: string;
  priority?: boolean;
  quality?: number;
  showEditButton?: boolean;
  aspectRatio?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  enableCMS?: boolean;
  mediaId?: string;
}

export default function EditableImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  onUpdate,
  onDelete,
  category = 'general',
  priority = false,
  quality = 85,
  showEditButton = true,
  aspectRatio,
  placeholder = 'empty',
  blurDataURL,
  enableCMS = true,
  mediaId,
}: EditableImageProps) {
  const { isAdmin } = useContentStore();
  const { 
    addMedia, 
    // updateMedia,  // TODO: Use when updating existing media
    deleteMedia, 
    addActivity,
    // setLoading,  // TODO: Use for global loading state
    addError 
  } = useCMSStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, WebP, or AVIF image.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Please select an image under 10MB.');
      return;
    }

    handleUpload(file);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Generate unique media ID
      const newMediaId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload to ImageKit
      const result = await uploadToImageKit(file, {
        folder: category,
        fileName: `${newMediaId}_${file.name}`,
        useUniqueFileName: true,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      if (result.success && result.url) {
        // Create CMS media entry
        const newMedia = {
          id: newMediaId,
          url: result.url,
          type: 'image' as const,
          alt: alt || file.name,
          title: file.name,
          category,
          folder: category,
          width: result.width || 0,
          height: result.height || 0,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          metadata: {
            originalName: file.name,
            fileType: file.type,
            ...result
          }
        };

        // Add to CMS store
        if (enableCMS) {
          addMedia(newMedia);
          addActivity({
            userId: 'admin', // TODO: Get actual user ID
            action: 'upload',
            entityType: 'media',
            entityId: newMedia.id,
            details: `Uploaded image: ${file.name} to ${category}`
          });
        }

        // Update image source
        setImageSrc(result.url);
        
        // Call onUpdate callback
        if (onUpdate) {
          onUpdate(result.url);
        }

        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);

      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      addError(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    
    if (enableCMS && mediaId) {
      deleteMedia(mediaId);
      addActivity({
        userId: 'admin',
        action: 'delete',
        entityType: 'media',
        entityId: mediaId,
        details: `Deleted image: ${alt}`
      });
    }
  };

  const handleEdit = () => {
    fileInputRef.current?.click();
  };

  const handleDuplicate = () => {
    if (enableCMS && mediaId) {
      // This would be implemented to duplicate the media item
      addActivity({
        userId: 'admin',
        action: 'edit',
        entityType: 'media',
        entityId: mediaId,
        details: `Duplicated image: ${alt}`
      });
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/images/placeholder.jpg';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    
    // If it's a relative path, construct ImageKit URL
    const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (baseUrl) {
      return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}?w=1920&q=${quality}&f=auto`;
    }
    
    return url;
  };

  if (!isAdmin) {
    return (
      <div className={`relative ${aspectRatio ? `aspect-[${aspectRatio}]` : ''} ${className}`}>
        <Image
          src={getImageUrl(imageSrc)}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onError={() => setImageSrc('/images/placeholder.jpg')}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${aspectRatio ? `aspect-[${aspectRatio}]` : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Image */}
      <Image
        src={getImageUrl(imageSrc)}
        alt={alt}
        fill
        className="object-cover transition-all duration-300 group-hover:brightness-75"
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={() => setImageSrc('/images/placeholder.jpg')}
      />
      
      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-sm font-medium">Uploading...</p>
              <p className="text-xs text-gray-300 mt-1">{uploadProgress}%</p>
              <div className="w-32 h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="text-center text-white p-4">
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p className="text-sm font-medium mb-2">Upload Error</p>
              <p className="text-xs">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Admin Controls */}
      <AnimatePresence>
        {isHovered && showEditButton && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                title="Replace Image"
              >
                <Edit2 size={16} className="text-white" />
              </button>
              
              {enableCMS && mediaId && (
                <>
                  <button
                    onClick={handleDuplicate}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                    title="Duplicate Image"
                  >
                    <Copy size={16} className="text-white" />
                  </button>
                  
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    title="More Actions"
                  >
                    <Eye size={16} className="text-white" />
                  </button>
                </>
              )}
              
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Additional Actions Panel */}
      <AnimatePresence>
        {showActions && enableCMS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 z-30 min-w-48"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white text-sm font-medium">Image Actions</h4>
              <button
                onClick={() => setShowActions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => navigator.clipboard.writeText(imageSrc)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded transition-colors"
              >
                <Copy size={12} />
                Copy URL
              </button>
              
              <button
                onClick={() => window.open(imageSrc, '_blank')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded transition-colors"
              >
                <Eye size={12} />
                View Full Size
              </button>
              
              <div className="border-t border-gray-600 pt-2">
                <p className="text-xs text-gray-400 mb-1">Category: {category}</p>
                {mediaId && <p className="text-xs text-gray-400">ID: {mediaId}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Upload indicator */}
      {isUploading && (
        <div className="absolute top-2 right-2 z-30">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Upload size={12} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Success indicator */}
      {uploadProgress === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute top-2 right-2 z-30"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        </motion.div>
      )}
    </div>
  );
}