'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, Edit2, Upload, Check, X, AlertCircle, Copy, Eye, MoreHorizontal, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import useCMSStore from '@/store/useCMSStore';

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
  enableSelection?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  enableContextMenu?: boolean;
  contextMenuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    action: () => void;
    type?: 'normal' | 'danger';
  }>;
}

// Enhanced ImageKit upload function matching HTML CMS functionality
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
  enableSelection = false,
  isSelected = false,
  onSelectionChange,
  enableContextMenu = true,
  contextMenuItems = [],
}: EditableImageProps) {
  const { isAdmin } = useAdminAuth();
  const { 
    addMedia, 
    updateMedia,
    deleteMedia, 
    addActivity,
    duplicateMedia
  } = useCMSStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState(src);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Context menu effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showContextMenu && !imageRef.current?.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContextMenu]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, WebP, AVIF, or GIF image.');
      return;
    }

    // Validate file size (15MB max to match HTML version)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Please select an image under 15MB.');
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
      
      // Simulate progress tracking like HTML version
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Upload to ImageKit
      const uploadedUrl = await uploadToImageKit(file, category);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create CMS media entry matching HTML version structure
      const newMedia = {
        id: newMediaId,
        url: uploadedUrl,
        type: 'image' as const,
        alt: alt || file.name.replace(/\.[^/.]+$/, ''),
        title: file.name,
        description: `Uploaded image: ${file.name}`,
        category,
        folder: category,
        width: 0, // Would be filled by ImageKit response
        height: 0, // Would be filled by ImageKit response
        size: file.size,
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [category, 'uploaded'],
        metadata: {
          originalName: file.name,
          fileType: file.type,
          uploadedBy: 'admin',
          source: 'EditableImage'
        }
      };

      // Add to CMS store
      if (enableCMS) {
        addMedia(newMedia);
        addActivity({
          userId: 'admin',
          action: 'upload',
          entityType: 'media',
          entityId: newMedia.id,
          details: `Replaced image: ${file.name} in ${category}`
        });
      }

      // Update image source
      setImageSrc(uploadedUrl);
      
      // Call onUpdate callback
      if (onUpdate) {
        onUpdate(uploadedUrl);
      }

      // Success feedback
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
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
    }
  };

  const handleEdit = () => {
    fileInputRef.current?.click();
  };

  const handleDuplicate = () => {
    if (enableCMS && mediaId) {
      duplicateMedia(mediaId);
      addActivity({
        userId: 'admin',
        action: 'edit',
        entityType: 'media',
        entityId: mediaId,
        details: `Duplicated image: ${alt}`
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isAdmin || !enableContextMenu) return;
    
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleSelection = () => {
    if (enableSelection && onSelectionChange) {
      onSelectionChange(!isSelected);
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

  // Non-admin view (like HTML version public view)
  if (!isAdmin) {
    return (
      <div 
        className={`relative redux-img-container ${aspectRatio ? `aspect-[${aspectRatio}]` : ''} ${className}`}
        onContextMenu={handleContextMenu}
      >
        <Image
          src={getImageUrl(imageSrc)}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageSrc('/images/placeholder.jpg')}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={imageRef}
      className={`relative redux-img-container group ${aspectRatio ? `aspect-[${aspectRatio}]` : ''} ${className} ${
        isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
      onClick={enableSelection ? handleSelection : undefined}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Selection Checkbox (like HTML version) */}
      {enableSelection && (
        <div 
          className={`redux-select-checkbox absolute top-2 left-2 w-6 h-6 border-2 border-white rounded-md bg-black/50 cursor-pointer z-20 flex items-center justify-center transition-all duration-200 ${
            isSelected ? 'bg-blue-500 border-blue-500' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelection();
          }}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      )}
      
      {/* Image */}
      <Image
        src={getImageUrl(imageSrc)}
        alt={alt}
        fill
        className={`object-cover transition-all duration-300 ${
          isHovered && !isUploading ? 'brightness-75 scale-105' : ''
        } ${isSelected ? 'brightness-90' : ''}`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageSrc('/images/placeholder.jpg')}
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      {/* Upload Progress Overlay (enhanced like HTML version) */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30"
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-sm font-medium mb-2">Uploading Image...</p>
              <p className="text-xs text-gray-300 mb-3">{Math.round(uploadProgress)}%</p>
              <div className="w-40 h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
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
            className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex items-center justify-center z-30"
          >
            <div className="text-center text-white p-4 max-w-xs">
              <AlertCircle size={32} className="mx-auto mb-3" />
              <p className="text-sm font-semibold mb-2">Upload Failed</p>
              <p className="text-xs leading-relaxed mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Admin Controls (enhanced like HTML version) */}
      <AnimatePresence>
        {isHovered && showEditButton && !isUploading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="redux-img-controls absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="redux-img-btn w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center"
                title="Replace Image"
              >
                <Edit2 size={16} className="text-white" />
              </button>
              
              {enableCMS && mediaId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                  className="redux-img-btn w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center"
                  title="Duplicate Image"
                >
                  <Copy size={16} className="text-white" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="redux-img-btn w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center"
                title="More Actions"
              >
                <MoreHorizontal size={16} className="text-white" />
              </button>
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="redux-img-btn w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 hover:scale-110 shadow-lg flex items-center justify-center"
                  title="Delete Image"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Actions Panel */}
      <AnimatePresence>
        {showActions && enableCMS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-4 right-4 bg-black/95 backdrop-blur-md rounded-xl p-4 z-40 min-w-64 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white text-sm font-semibold">Image Actions</h4>
              <button
                onClick={() => setShowActions(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(imageSrc);
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Copy size={14} />
                Copy Image URL
              </button>
              
              <button
                onClick={() => {
                  window.open(imageSrc, '_blank');
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Eye size={14} />
                View Full Size
              </button>
              
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageSrc;
                  link.download = `${alt || 'image'}.jpg`;
                  link.click();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Upload size={14} />
                Download Image
              </button>
              
              <div className="border-t border-gray-600 pt-3 mt-3">
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-gray-300">Category:</span> {category}</p>
                  <p><span className="text-gray-300">Alt:</span> {alt}</p>
                  {mediaId && <p><span className="text-gray-300">ID:</span> {mediaId}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Context Menu (like HTML version right-click) */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bg-black/95 backdrop-blur-md rounded-lg py-2 z-50 shadow-2xl border border-white/10 min-w-48"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            <button
              onClick={() => {
                handleEdit();
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <Edit2 size={14} />
              Replace Image
            </button>
            
            <button
              onClick={() => {
                handleDuplicate();
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <Copy size={14} />
              Duplicate
            </button>
            
            <div className="border-t border-gray-600 my-1" />
            
            <button
              onClick={() => {
                handleDelete();
                setShowContextMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              Delete Image
            </button>
            
            {/* Custom context menu items */}
            {contextMenuItems.length > 0 && (
              <>
                <div className="border-t border-gray-600 my-1" />
                {contextMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setShowContextMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      item.type === 'danger' 
                        ? 'text-red-400 hover:bg-red-500/10' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Status Indicators */}
      <div className="absolute top-2 right-2 z-30 flex gap-1">
        {/* Upload indicator */}
        {isUploading && (
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Upload size={14} className="text-white" />
          </div>
        )}
        
        {/* Success indicator */}
        {uploadProgress === 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check size={14} className="text-white" />
            </div>
          </motion.div>
        )}
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}