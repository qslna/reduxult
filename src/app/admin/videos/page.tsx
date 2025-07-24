'use client';

import { useEffect, useState, useRef } from 'react';
import CMSLayout from '@/components/cms/CMSLayout';
import { cmsClient, MediaItem } from '@/lib/cms-client';
import { useImageKit } from '@/lib/imagekit-client';
import { 
  Upload, 
  Search, 
  Play,
  Pause,
  Trash2,
  Copy,
  CheckCircle,
  Edit,
  Save,
  X,
  FileVideo,
  ExternalLink
} from 'lucide-react';

interface VideoMetadata extends MediaItem {
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{title: string; description: string}>({
    title: '',
    description: ''
  });
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagekitClient = useImageKit();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const response = await cmsClient.getMediaItems({
        mimeType: 'video',
        limit: 50
      });
      
      if (response.success && response.data) {
        const videoData = response.data.map(item => ({
          ...item,
          duration: item.metadata?.duration || 0,
          aspectRatio: item.metadata?.aspectRatio || '16:9',
          resolution: item.metadata?.resolution || 'Unknown'
        }));
        setVideos(videoData);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Video file validation
      if (!file.type.startsWith('video/')) {
        alert(`${file.name} is not a valid video file.`);
        continue;
      }

      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        alert(`${file.name} is too large. Maximum file size is 500MB.`);
        continue;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Get video metadata
        const videoElement = document.createElement('video');
        const videoMetadata = await new Promise<{width: number; height: number; duration: number}>((resolve) => {
          videoElement.onloadedmetadata = () => {
            resolve({
              width: videoElement.videoWidth,
              height: videoElement.videoHeight,
              duration: videoElement.duration
            });
          };
          videoElement.src = URL.createObjectURL(file);
        });

        const uploadResponse = await imagekitClient.uploadFile({
          file,
          fileName: file.name,
          folder: '/redux-videos',
          tags: ['video', 'cms-upload']
        });

        // Create video item in CMS with enhanced metadata
        const mediaResponse = await cmsClient.createMediaItem({
          filename: uploadResponse.name,
          originalFilename: file.name,
          url: uploadResponse.url,
          thumbnailUrl: uploadResponse.thumbnailUrl,
          altText: '',
          caption: '',
          tags: ['video'],
          mimeType: file.type,
          fileSize: file.size,
          metadata: {
            width: videoMetadata.width,
            height: videoMetadata.height,
            duration: videoMetadata.duration,
            aspectRatio: `${videoMetadata.width}:${videoMetadata.height}`,
            resolution: `${videoMetadata.width}x${videoMetadata.height}`,
            fileId: uploadResponse.fileId
          }
        });

        if (mediaResponse.success && mediaResponse.data) {
          const newVideo: VideoMetadata = {
            ...mediaResponse.data,
            duration: videoMetadata.duration,
            aspectRatio: `${videoMetadata.width}:${videoMetadata.height}`,
            resolution: `${videoMetadata.width}x${videoMetadata.height}`
          };
          setVideos(prev => [newVideo, ...prev]);
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);

        // Clean up video element
        URL.revokeObjectURL(videoElement.src);

      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await cmsClient.deleteMediaItem(videoId);
      if (response.success) {
        setVideos(videos => videos.filter(video => video.id !== videoId));
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleEditStart = (video: VideoMetadata) => {
    setEditingId(video.id);
    setEditingData({
      title: video.altText || video.filename,
      description: video.caption || ''
    });
  };

  const handleEditSave = async (videoId: string) => {
    try {
      const response = await cmsClient.updateMediaItem(videoId, {
        altText: editingData.title,
        caption: editingData.description
      });

      if (response.success && response.data) {
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { ...video, altText: editingData.title, caption: editingData.description }
            : video
        ));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update video:', error);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredVideos = videos.filter(video => 
    !searchQuery || 
    video.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.altText && video.altText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <CMSLayout title="Video Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Video Management</h1>
            <p className="text-gray-400">Manage your video content with advanced controls</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Videos
          </button>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="text-white font-medium">Uploading Videos</h3>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{fileName}</span>
                  <span className="text-gray-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Videos List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading videos...</div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileVideo className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery ? 'No matching videos found' : 'No videos yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 
                'Try adjusting your search criteria' :
                'Upload your first video to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Upload Video
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Video Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-48 h-27 bg-gray-700 rounded-lg overflow-hidden group">
                        <video
                          className="w-full h-full object-cover"
                          poster={video.metadata?.thumbnailUrl}
                          preload="metadata"
                          onPlay={() => setPlayingVideoId(video.id)}
                          onPause={() => setPlayingVideoId(null)}
                        >
                          <source src={video.url} type={video.mimeType} />
                        </video>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              const videoEl = document.querySelector(`video[src="${video.url}"]`) as HTMLVideoElement;
                              if (videoEl) {
                                if (playingVideoId === video.id) {
                                  videoEl.pause();
                                } else {
                                  videoEl.play();
                                }
                              }
                            }}
                            className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                          >
                            {playingVideoId === video.id ? (
                              <Pause className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6" />
                            )}
                          </button>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                          {formatDuration(video.duration || 0)}
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      {editingId === video.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editingData.title}
                            onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Video title"
                          />
                          <textarea
                            value={editingData.description}
                            onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Video description"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSave(video.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {video.altText || video.filename}
                          </h3>
                          {video.caption && (
                            <p className="text-gray-300 mb-3">{video.caption}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                            <div>
                              <span className="font-medium">File Size:</span><br />
                              {formatFileSize(video.fileSize)}
                            </div>
                            <div>
                              <span className="font-medium">Resolution:</span><br />
                              {video.resolution}
                            </div>
                            <div>
                              <span className="font-medium">Aspect Ratio:</span><br />
                              {video.aspectRatio}
                            </div>
                            <div>
                              <span className="font-medium">Format:</span><br />
                              {video.mimeType.split('/')[1].toUpperCase()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(video.url)}
                        className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === video.url ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditStart(video)}
                        className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                        title="Edit details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredVideos.length} of {videos.length} videos
            </span>
            <span>
              Total size: {formatFileSize(
                videos.reduce((total, video) => total + video.fileSize, 0)
              )}
            </span>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => {
            if (e.target.files) {
              handleVideoUpload(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </div>
    </CMSLayout>
  );
}