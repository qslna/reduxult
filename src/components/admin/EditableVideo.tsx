'use client';

import { useState, useRef, useCallback } from 'react';
import { Trash2, Edit2, Upload, Check, X, AlertCircle, Copy, Eye, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useContentStore from '@/store/useContentStore';
import useCMSStore from '@/store/useCMSStore';

interface EditableVideoProps {
  src: string;
  className?: string;
  onUpdate?: (newSrc: string) => void;
  onDelete?: () => void;
  category?: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  enableCMS?: boolean;
  mediaId?: string;
}

export default function EditableVideo({
  src,
  className = '',
  onUpdate,
  onDelete,
  category = 'videos',
  poster,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  enableCMS = true,
  mediaId,
}: EditableVideoProps) {
  const { isAdmin } = useContentStore();
  const { 
    addMedia, 
    // updateMedia,  // TODO: Use when updating existing media
    deleteMedia, 
    addActivity,
    addError 
  } = useCMSStore();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [videoSrc, setVideoSrc] = useState(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select an MP4, WebM, MOV, or AVI video.');
      return;
    }

    // Validate file size (50MB max for videos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Please select a video under 50MB.');
      return;
    }

    handleUpload(file);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      
      // Simulate successful upload
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadProgress(100);
        
        if (onUpdate) {
          onUpdate(objectUrl);
        }

        // Generate unique media ID
        const newMediaId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (enableCMS) {
          const newMedia = {
            id: newMediaId,
            url: objectUrl,
            type: 'video' as const,
            title: file.name,
            category,
            folder: category,
            width: 0,
            height: 0,
            duration: 0,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
            metadata: {
              originalName: file.name,
              fileType: file.type,
            }
          };

          addMedia(newMedia);
          addActivity({
            userId: 'admin',
            action: 'upload',
            entityType: 'media',
            entityId: newMedia.id,
            details: `Uploaded video: ${file.name} to ${category}`
          });
        }

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }, 2000);

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
        details: `Deleted video: ${videoSrc}`
      });
    }
  };

  const handleEdit = () => {
    fileInputRef.current?.click();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getVideoUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    
    // If it's a relative path, construct ImageKit URL
    const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (baseUrl) {
      return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    }
    
    return url;
  };

  if (!videoSrc && !isAdmin) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className={`relative ${className}`}>
        <video
          src={getVideoUrl(videoSrc)}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Video */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={getVideoUrl(videoSrc)}
          poster={poster}
          controls={controls && !isHovered}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Upload size={48} className="mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Video</p>
            <p className="text-sm">Click edit to upload a video</p>
          </div>
        </div>
      )}
      
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
              <p className="text-sm font-medium">Uploading Video...</p>
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
        {isHovered && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="flex items-center gap-2">
              {videoSrc && (
                <>
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
                  </button>
                </>
              )}
              
              <button
                onClick={handleEdit}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                title="Replace Video"
              >
                <Edit2 size={16} className="text-white" />
              </button>
              
              {enableCMS && mediaId && (
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                  title="More Actions"
                >
                  <Eye size={16} className="text-white" />
                </button>
              )}
              
              {onDelete && videoSrc && (
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  title="Delete Video"
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
              <h4 className="text-white text-sm font-medium">Video Actions</h4>
              <button
                onClick={() => setShowActions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => navigator.clipboard.writeText(videoSrc)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded transition-colors"
              >
                <Copy size={12} />
                Copy URL
              </button>
              
              <button
                onClick={() => window.open(videoSrc, '_blank')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded transition-colors"
              >
                <Eye size={12} />
                Open in New Tab
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