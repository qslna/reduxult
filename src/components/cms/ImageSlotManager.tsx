'use client';

import { useState, useRef, useCallback } from 'react';
import { useImageKit } from '@/lib/imagekit-client';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Eye, 
  Download, 
  Trash2, 
  RotateCcw,
  Edit3,
  Check,
  AlertCircle,
  Camera,
  Loader
} from 'lucide-react';

export interface ImageSlot {
  id: string;
  name: string;
  description?: string;
  currentImage?: {
    url: string;
    filename: string;
    fileId?: string;
    altText?: string;
  };
  constraints?: {
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: string;
    maxFileSize?: number; // in bytes
    allowedFormats?: string[];
  };
  folder?: string; // ImageKit folder
  tags?: string[];
}

export interface ImageSlotManagerProps {
  slot: ImageSlot;
  onImageUpdate?: (slot: ImageSlot, newImage: ImageSlot['currentImage']) => void;
  onImageDelete?: (slot: ImageSlot) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  layout?: 'compact' | 'expanded';
  showPreview?: boolean;
  adminMode?: boolean;
}

export default function ImageSlotManager({
  slot,
  onImageUpdate,
  onImageDelete,
  className = '',
  size = 'medium',
  layout = 'expanded',
  showPreview = true,
  adminMode = true
}: ImageSlotManagerProps) {
  const { isAuthenticated } = useCMSAuthStore();
  const imagekitClient = useImageKit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [altText, setAltText] = useState(slot.currentImage?.altText || '');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Size configurations
  const sizeConfigs = {
    small: {
      container: 'w-32 h-32',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-xs px-2 py-1',
      text: 'text-xs'
    },
    medium: {
      container: 'w-48 h-48',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-sm px-3 py-2',
      text: 'text-sm'
    },
    large: {
      container: 'w-64 h-64',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-base px-4 py-2',
      text: 'text-base'
    }
  };

  const config = sizeConfigs[size];

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const { constraints } = slot;
    
    // Check file size
    const maxSize = constraints?.maxFileSize || 10 * 1024 * 1024; // 10MB default
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
      };
    }

    // Check file type
    const allowedFormats = constraints?.allowedFormats || ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      return { 
        valid: false, 
        error: `Only ${allowedFormats.map(f => f.split('/')[1]).join(', ')} files are allowed` 
      };
    }

    return { valid: true };
  }, [slot.constraints]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!isAuthenticated || !adminMode) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 30, 90));
      }, 200);

      const uploadResponse = await imagekitClient.uploadFile({
        file,
        fileName: `${slot.id}-${Date.now()}-${file.name}`,
        folder: slot.folder || '/redux-cms/image-slots',
        tags: [...(slot.tags || []), 'image-slot', slot.id]
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newImage = {
        url: uploadResponse.url,
        filename: uploadResponse.name,
        fileId: uploadResponse.fileId,
        altText: altText || slot.name
      };

      // Call the update callback
      onImageUpdate?.(slot, newImage);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [slot, imagekitClient, isAuthenticated, adminMode, validateFile, altText, onImageUpdate]);

  const handleDelete = useCallback(async () => {
    if (!isAuthenticated || !adminMode || !slot.currentImage) return;

    if (!confirm(`Are you sure you want to delete the image for ${slot.name}?`)) {
      return;
    }

    try {
      // Delete from ImageKit if we have fileId
      if (slot.currentImage.fileId) {
        await imagekitClient.deleteFile(slot.currentImage.fileId);
      }

      // Call the delete callback
      onImageDelete?.(slot);

    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete image. Please try again.');
    }
  }, [slot, imagekitClient, isAuthenticated, adminMode, onImageDelete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!isAuthenticated || !adminMode) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload, isAuthenticated, adminMode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isAuthenticated && adminMode) {
      setIsDragOver(true);
    }
  }, [isAuthenticated, adminMode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const saveAltText = useCallback(() => {
    if (slot.currentImage) {
      const updatedImage = {
        ...slot.currentImage,
        altText: altText
      };
      onImageUpdate?.(slot, updatedImage);
    }
    setIsEditing(false);
  }, [slot, altText, onImageUpdate]);

  const renderContent = () => {
    if (layout === 'compact') {
      return (
        <div className="flex items-center gap-3">
          {/* Compact Image Preview */}
          <div className={`${config.container} rounded-xl overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0`}>
            {slot.currentImage ? (
              <img
                src={slot.currentImage.url}
                alt={slot.currentImage.altText || slot.name}
                className={config.preview}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Compact Controls */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{slot.name}</h3>
            {slot.description && (
              <p className="text-white/60 text-xs mt-1 truncate">{slot.description}</p>
            )}
            
            {isAuthenticated && adminMode && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {slot.currentImage ? 'Replace' : 'Upload'}
                </button>
                
                {slot.currentImage && (
                  <button
                    onClick={handleDelete}
                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Expanded layout
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{slot.name}</h3>
            {slot.description && (
              <p className="text-white/70 text-sm mt-1">{slot.description}</p>
            )}
          </div>
          
          {slot.currentImage && showPreview && (
            <button
              onClick={() => setShowPreviewModal(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Upload/Preview Area */}
        <div
          className={`relative ${config.container} mx-auto rounded-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-500/10' 
              : slot.currentImage 
                ? 'border-white/20' 
                : 'border-white/30'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Uploading...</p>
                <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {slot.currentImage ? (
            <>
              <img
                src={slot.currentImage.url}
                alt={slot.currentImage.altText || slot.name}
                className={config.preview}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                {isAuthenticated && adminMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-3 bg-white/20 text-white rounded-full hover:bg-red-500/50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60 p-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-center text-sm font-medium mb-2">No image uploaded</p>
              <p className="text-center text-xs text-white/40 mb-4">
                {isAuthenticated && adminMode ? 'Drag & drop or click to upload' : 'No image available'}
              </p>
              
              {isAuthenticated && adminMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`${config.uploadButton} bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Image
                </button>
              )}
            </div>
          )}
        </div>

        {/* Alt Text Editor */}
        {slot.currentImage && isAuthenticated && adminMode && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white/80">Alt Text</label>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 text-white/60 hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                <button
                  onClick={saveAltText}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-white/70">
                {slot.currentImage.altText || 'No alt text provided'}
              </p>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 text-sm font-medium">Upload Error</p>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 text-red-400/60 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Constraints Info */}
        {slot.constraints && (
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <h4 className="text-xs font-medium text-white/60 mb-2">Image Requirements</h4>
            <div className="space-y-1 text-xs text-white/50">
              {slot.constraints.maxFileSize && (
                <p>Max size: {Math.round(slot.constraints.maxFileSize / 1024 / 1024)}MB</p>
              )}
              {slot.constraints.aspectRatio && (
                <p>Aspect ratio: {slot.constraints.aspectRatio}</p>
              )}
              {slot.constraints.allowedFormats && (
                <p>Formats: {slot.constraints.allowedFormats.map(f => f.split('/')[1]).join(', ')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`image-slot-manager ${className}`}>
        {renderContent()}
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={slot.constraints?.allowedFormats?.join(',') || 'image/*'}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </div>

      {/* Preview Modal */}
      {showPreviewModal && slot.currentImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-900/95 rounded-2xl overflow-hidden border border-white/20">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <img
              src={slot.currentImage.url}
              alt={slot.currentImage.altText || slot.name}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold">{slot.name}</h3>
              <p className="text-white/70 text-sm">{slot.currentImage.altText || 'No description'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}