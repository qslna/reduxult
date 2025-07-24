'use client';

import { useState, useRef, useCallback } from 'react';
import { useImageKit } from '@/lib/imagekit-client';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { 
  Upload, 
  Video as VideoIcon, 
  X, 
  Eye, 
  Download, 
  Trash2, 
  RotateCcw,
  Edit3,
  Check,
  AlertCircle,
  Play,
  Pause,
  Loader,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  FileVideo,
  Youtube,
  Monitor
} from 'lucide-react';

export interface VideoSlot {
  id: string;
  name: string;
  description?: string;
  currentVideo?: {
    url: string;
    filename: string;
    fileId?: string;
    thumbnailUrl?: string;
    duration?: number;
    title?: string;
    description?: string;
    provider?: 'upload' | 'google-drive' | 'youtube' | 'vimeo';
    embedId?: string; // For external videos
  };
  constraints?: {
    maxFileSize?: number; // in bytes
    maxDuration?: number; // in seconds
    allowedFormats?: string[];
    requireThumbnail?: boolean;
  };
  folder?: string;
  tags?: string[];
  supportedProviders?: ('upload' | 'google-drive' | 'youtube' | 'vimeo')[];
}

export interface VideoSlotManagerProps {
  slot: VideoSlot;
  onVideoUpdate?: (slot: VideoSlot, newVideo: VideoSlot['currentVideo']) => void;
  onVideoDelete?: (slot: VideoSlot) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  layout?: 'compact' | 'expanded';
  showPreview?: boolean;
  adminMode?: boolean;
}

export default function VideoSlotManager({
  slot,
  onVideoUpdate,
  onVideoDelete,
  className = '',
  size = 'medium',
  layout = 'expanded',
  showPreview = true,
  adminMode = true
}: VideoSlotManagerProps) {
  const { isAuthenticated } = useCMSAuthStore();
  const imagekitClient = useImageKit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Form states for editing
  const [videoTitle, setVideoTitle] = useState(slot.currentVideo?.title || '');
  const [videoDescription, setVideoDescription] = useState(slot.currentVideo?.description || '');
  const [externalUrl, setExternalUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'external'>('upload');

  // Size configurations
  const sizeConfigs = {
    small: {
      container: 'w-32 h-20',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-xs px-2 py-1',
      text: 'text-xs'
    },
    medium: {
      container: 'w-80 h-48',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-sm px-3 py-2',
      text: 'text-sm'
    },
    large: {
      container: 'w-96 h-60',
      preview: 'w-full h-full object-cover',
      uploadButton: 'text-base px-4 py-2',
      text: 'text-base'
    }
  };

  const config = sizeConfigs[size];

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const { constraints } = slot;
    
    // Check file size
    const maxSize = constraints?.maxFileSize || 100 * 1024 * 1024; // 100MB default
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
      };
    }

    // Check file type
    const allowedFormats = constraints?.allowedFormats || ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    if (!allowedFormats.includes(file.type)) {
      return { 
        valid: false, 
        error: `Only ${allowedFormats.map(f => f.split('/')[1]).join(', ')} files are allowed` 
      };
    }

    return { valid: true };
  }, [slot.constraints]);

  const parseExternalUrl = useCallback((url: string): { provider: 'google-drive' | 'youtube' | 'vimeo'; embedId: string; embedUrl: string } | null => {
    try {
      const urlObj = new URL(url);
      
      // Google Drive
      if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          return {
            provider: 'google-drive',
            embedId: match[1],
            embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`
          };
        }
      }
      
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
          videoId = url.split('watch?v=')[1].split('&')[0];
        }
        if (videoId) {
          return {
            provider: 'youtube',
            embedId: videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}`
          };
        }
      }
      
      // Vimeo
      if (url.includes('vimeo.com')) {
        const match = url.match(/vimeo\.com\/(\d+)/);
        if (match) {
          return {
            provider: 'vimeo',
            embedId: match[1],
            embedUrl: `https://player.vimeo.com/video/${match[1]}`
          };
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }, []);

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
        setUploadProgress(prev => Math.min(prev + Math.random() * 20, 90));
      }, 500);

      const uploadResponse = await imagekitClient.uploadFile({
        file,
        fileName: `${slot.id}-${Date.now()}-${file.name}`,
        folder: slot.folder || '/redux-cms/video-slots',
        tags: [...(slot.tags || []), 'video-slot', slot.id]
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newVideo = {
        url: uploadResponse.url,
        filename: uploadResponse.name,
        fileId: uploadResponse.fileId,
        title: videoTitle || file.name.replace(/\.[^/.]+$/, ''),
        description: videoDescription,
        provider: 'upload' as const
      };

      onVideoUpdate?.(slot, newVideo);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setActiveTab('upload');
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload video. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [slot, imagekitClient, isAuthenticated, adminMode, validateFile, videoTitle, videoDescription, onVideoUpdate]);

  const handleExternalVideo = useCallback(() => {
    if (!externalUrl.trim()) {
      setError('Please enter a valid video URL');
      return;
    }

    const parsed = parseExternalUrl(externalUrl);
    if (!parsed) {
      setError('Unsupported video URL. Please use Google Drive, YouTube, or Vimeo links.');
      return;
    }

    if (slot.supportedProviders && !slot.supportedProviders.includes(parsed.provider)) {
      setError(`${parsed.provider} is not supported for this slot`);
      return;
    }

    const newVideo = {
      url: parsed.embedUrl,
      filename: `${parsed.provider}-${parsed.embedId}`,
      title: videoTitle || slot.name,
      description: videoDescription,
      provider: parsed.provider,
      embedId: parsed.embedId
    };

    onVideoUpdate?.(slot, newVideo);
    setExternalUrl('');
    setError(null);
  }, [externalUrl, parseExternalUrl, slot, videoTitle, videoDescription, onVideoUpdate]);

  const handleDelete = useCallback(async () => {
    if (!isAuthenticated || !adminMode || !slot.currentVideo) return;

    if (!confirm(`Are you sure you want to delete the video for ${slot.name}?`)) {
      return;
    }

    try {
      // Delete from ImageKit if it's an uploaded file
      if (slot.currentVideo.provider === 'upload' && slot.currentVideo.fileId) {
        await imagekitClient.deleteFile(slot.currentVideo.fileId);
      }

      onVideoDelete?.(slot);

    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete video. Please try again.');
    }
  }, [slot, imagekitClient, isAuthenticated, adminMode, onVideoDelete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!isAuthenticated || !adminMode) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('video/')) {
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

  const saveVideoInfo = useCallback(() => {
    if (slot.currentVideo) {
      const updatedVideo = {
        ...slot.currentVideo,
        title: videoTitle,
        description: videoDescription
      };
      onVideoUpdate?.(slot, updatedVideo);
    }
    setIsEditing(false);
  }, [slot, videoTitle, videoDescription, onVideoUpdate]);

  const getProviderIcon = (provider?: string) => {
    switch (provider) {
      case 'google-drive':
        return <Monitor className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'vimeo':
        return <VideoIcon className="w-4 h-4" />;
      default:
        return <FileVideo className="w-4 h-4" />;
    }
  };

  const renderVideoPreview = () => {
    if (!slot.currentVideo) return null;

    const { provider, url, embedId } = slot.currentVideo;

    if (provider === 'upload') {
      return (
        <video
          src={url}
          className={config.preview}
          controls
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      );
    } else {
      return (
        <iframe
          src={url}
          className={config.preview}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  };

  const renderContent = () => {
    if (layout === 'compact') {
      return (
        <div className="flex items-center gap-3">
          {/* Compact Video Preview */}
          <div className={`${config.container} rounded-xl overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0 relative`}>
            {slot.currentVideo ? (
              <>
                {renderVideoPreview()}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                <VideoIcon className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Compact Controls */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{slot.name}</h3>
            {slot.description && (
              <p className="text-white/60 text-xs mt-1 truncate">{slot.description}</p>
            )}
            {slot.currentVideo && (
              <div className="flex items-center gap-2 mt-1">
                {getProviderIcon(slot.currentVideo.provider)}
                <span className="text-xs text-white/50 capitalize">{slot.currentVideo.provider || 'upload'}</span>
              </div>
            )}
            
            {isAuthenticated && adminMode && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  disabled={isUploading}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {slot.currentVideo ? 'Replace' : 'Upload'}
                </button>
                
                {slot.currentVideo && (
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{slot.name}</h3>
            {slot.description && (
              <p className="text-white/70 text-sm mt-1">{slot.description}</p>
            )}
          </div>
          
          {slot.currentVideo && showPreview && (
            <button
              onClick={() => setShowPreviewModal(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Tabs */}
        {isAuthenticated && adminMode && !slot.currentVideo && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10 flex">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'external'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              External Link
            </button>
          </div>
        )}

        {/* Main Upload/Preview Area */}
        <div
          className={`relative ${config.container} mx-auto rounded-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-500/10' 
              : slot.currentVideo 
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
                <p className="text-sm">Uploading video...</p>
                <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {slot.currentVideo ? (
            <>
              {renderVideoPreview()}
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                {isAuthenticated && adminMode && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('upload')}
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

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-2 text-white/80">
                  {getProviderIcon(slot.currentVideo.provider)}
                  <span className="text-sm capitalize">{slot.currentVideo.provider || 'upload'}</span>
                  {slot.currentVideo.provider !== 'upload' && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/60 p-6">
              {activeTab === 'upload' ? (
                <>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <VideoIcon className="w-8 h-8" />
                  </div>
                  <p className="text-center text-sm font-medium mb-2">No video uploaded</p>
                  <p className="text-center text-xs text-white/40 mb-4">
                    {isAuthenticated && adminMode ? 'Drag & drop a video file or click to upload' : 'No video available'}
                  </p>
                  
                  {isAuthenticated && adminMode && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`${config.uploadButton} bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors`}
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Video
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <LinkIcon className="w-8 h-8" />
                  </div>
                  <p className="text-center text-sm font-medium mb-4">Add external video</p>
                  
                  <div className="w-full max-w-sm space-y-3">
                    <input
                      type="url"
                      placeholder="Paste video URL (Google Drive, YouTube, Vimeo...)"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                    <button
                      onClick={handleExternalVideo}
                      disabled={!externalUrl.trim()}
                      className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Video
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Video Info Editor */}
        {isAuthenticated && adminMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">Video Title</label>
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
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                  <button
                    onClick={saveVideoInfo}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-white/70">
                  {slot.currentVideo?.title || videoTitle || 'No title provided'}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <label className="text-sm font-medium text-white/80 block mb-2">Description</label>
              
              {isEditing ? (
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Enter video description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
                />
              ) : (
                <p className="text-sm text-white/70">
                  {slot.currentVideo?.description || videoDescription || 'No description provided'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 text-sm font-medium">Video Error</p>
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
            <h4 className="text-xs font-medium text-white/60 mb-2">Video Requirements</h4>
            <div className="space-y-1 text-xs text-white/50">
              {slot.constraints.maxFileSize && (
                <p>Max size: {Math.round(slot.constraints.maxFileSize / 1024 / 1024)}MB</p>
              )}
              {slot.constraints.maxDuration && (
                <p>Max duration: {Math.round(slot.constraints.maxDuration / 60)} minutes</p>
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
      <div className={`video-slot-manager ${className}`}>
        {renderContent()}
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={slot.constraints?.allowedFormats?.join(',') || 'video/*'}
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
      {showPreviewModal && slot.currentVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-900/95 rounded-2xl overflow-hidden border border-white/20">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="aspect-video">
              {renderVideoPreview()}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center gap-3 mb-2">
                {getProviderIcon(slot.currentVideo.provider)}
                <span className="text-white/80 text-sm capitalize">
                  {slot.currentVideo.provider || 'upload'}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg">{slot.currentVideo.title || slot.name}</h3>
              {slot.currentVideo.description && (
                <p className="text-white/70 text-sm mt-1">{slot.currentVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}