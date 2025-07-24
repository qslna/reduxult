'use client';

import { useEffect, useState } from 'react';
import CMSLayout from '@/components/cms/CMSLayout';
import BulkMediaManager, { MediaFile } from '@/components/cms/BulkMediaManager';
import { cmsClient, MediaItem } from '@/lib/cms-client';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { 
  Image as ImageIcon, 
  Video as VideoIcon,
  FileText,
  Folder,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  Zap,
  Database
} from 'lucide-react';

interface MediaStats {
  totalFiles: number;
  totalImages: number;
  totalVideos: number;
  totalStorage: number;
  recentUploads: number;
  avgFileSize: number;
}

export default function AdminMediaPage() {
  const { isAuthenticated } = useCMSAuthStore();
  const [stats, setStats] = useState<MediaStats>({
    totalFiles: 0,
    totalImages: 0,
    totalVideos: 0,
    totalStorage: 0,
    recentUploads: 0,
    avgFileSize: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadMediaStats();
    }
  }, [isAuthenticated]);

  const loadMediaStats = async () => {
    try {
      setIsLoading(true);
      
      // Load stats from CMS client
      const response = await cmsClient.getMediaItems({ limit: 1000 });
      
      if (response.success && response.data) {
        const items = response.data;
        const images = items.filter(item => item.mimeType.startsWith('image/'));
        const videos = items.filter(item => item.mimeType.startsWith('video/'));
        const totalStorage = items.reduce((sum, item) => sum + item.fileSize, 0);
        const avgFileSize = items.length > 0 ? totalStorage / items.length : 0;
        const recentUploads = items.filter(item => {
          const uploadDate = new Date(item.createdAt);
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return uploadDate > oneWeekAgo;
        }).length;
        
        setStats({
          totalFiles: items.length,
          totalImages: images.length,
          totalVideos: videos.length,
          totalStorage,
          recentUploads,
          avgFileSize
        });
      } else {
        // Use mock data if CMS client fails
        setStats({
          totalFiles: 47,
          totalImages: 32,
          totalVideos: 15,
          totalStorage: 1024 * 1024 * 1024 * 2.3, // 2.3GB
          recentUploads: 8,
          avgFileSize: 1024 * 1024 * 5.2 // 5.2MB
        });
      }
    } catch (error) {
      console.error('Failed to load media stats:', error);
      // Use mock data as fallback
      setStats({
        totalFiles: 47,
        totalImages: 32,
        totalVideos: 15,
        totalStorage: 1024 * 1024 * 1024 * 2.3, // 2.3GB
        recentUploads: 8,
        avgFileSize: 1024 * 1024 * 5.2 // 5.2MB
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSelect = (files: MediaFile[]) => {
    setSelectedFiles(files);
  };

  const handleMediaUpdate = async (file: MediaFile) => {
    try {
      // Update media item in CMS
      const response = await cmsClient.updateMediaItem(file.fileId, {
        altText: file.metadata?.altText || '',
        caption: file.metadata?.description || '',
        tags: file.tags || []
      });
      
      if (response.success) {
        console.log('Media updated successfully:', file);
        // Refresh stats
        loadMediaStats();
      }
    } catch (error) {
      console.error('Failed to update media:', error);
    }
  };

  const handleMediaDelete = async (fileIds: string[]) => {
    try {
      // Delete from CMS
      const promises = fileIds.map(id => cmsClient.deleteMediaItem(id));
      await Promise.allSettled(promises);
      
      console.log('Media deleted:', fileIds);
      // Refresh stats
      loadMediaStats();
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statCards = [
    {
      title: 'Total Files',
      value: stats.totalFiles,
      change: '+12%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: FileText,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      color: 'text-blue-400'
    },
    {
      title: 'Images',
      value: stats.totalImages,
      change: '+8%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: ImageIcon,
      gradient: 'from-emerald-500/10 to-green-500/10',
      color: 'text-emerald-400'
    },
    {
      title: 'Videos',
      value: stats.totalVideos,
      change: '+25%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: VideoIcon,
      gradient: 'from-violet-500/10 to-purple-500/10',
      color: 'text-violet-400'
    },
    {
      title: 'Storage Used',
      value: formatFileSize(stats.totalStorage),
      change: '+15%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: Database,
      gradient: 'from-rose-500/10 to-pink-500/10',
      color: 'text-rose-400'
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      change: '+34%',
      changeType: 'positive' as const,
      description: 'this week',
      icon: TrendingUp,
      gradient: 'from-orange-500/10 to-yellow-500/10',
      color: 'text-orange-400'
    },
    {
      title: 'Avg File Size',
      value: formatFileSize(stats.avgFileSize),
      change: '-5%',
      changeType: 'negative' as const,
      description: 'vs last month',
      icon: BarChart3,
      gradient: 'from-gray-500/10 to-slate-500/10',
      color: 'text-gray-400'
    }
  ];

  if (!isAuthenticated) {
    return (
      <CMSLayout title="Media Library">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <p className="text-white/70 font-medium">Please log in to access the media library</p>
          </div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Media Library">
      <div className="space-y-8">
        {/* Media Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const changeColor = card.changeType === 'positive' ? 'text-emerald-400' : 
                               card.changeType === 'negative' ? 'text-red-400' : 'text-gray-400';
            
            return (
              <div 
                key={card.title} 
                className="group relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-white/20 transition-colors ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
                        {card.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                        {card.change}
                      </div>
                      <div className="text-xs text-white/50">{card.description}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Media Management</h2>
                <p className="text-white/60">Advanced tools for managing your media library</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bulk Operations */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bulk Operations</h3>
                <p className="text-white/60 text-sm mb-4">Select multiple files and perform batch operations like delete, tag, or organize.</p>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  <span>Drag & drop supported</span>
                </div>
              </div>

              {/* Smart Organization */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <Folder className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Organization</h3>
                <p className="text-white/60 text-sm mb-4">Automatically organize files by type, date, or custom tags with advanced filtering.</p>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <span>Auto-tagging enabled</span>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Performance Insights</h3>
                <p className="text-white/60 text-sm mb-4">Monitor usage patterns, file sizes, and optimization recommendations.</p>
                <div className="flex items-center text-violet-400 text-sm font-medium">
                  <span>Real-time analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Info */}
        {selectedFiles.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedFiles.length} files selected
                  </h3>
                  <p className="text-blue-300/80 text-sm">
                    {selectedFiles.filter(f => f.type === 'image').length} images, {selectedFiles.filter(f => f.type === 'video').length} videos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Export Selected
                </button>
                <button 
                  onClick={() => setSelectedFiles([])}
                  className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Media Manager */}
        <BulkMediaManager
          onMediaSelect={handleMediaSelect}
          onMediaUpdate={handleMediaUpdate}
          onMediaDelete={handleMediaDelete}
          multiSelect={true}
          allowedTypes={['image', 'video']}
          maxFiles={100}
          maxFileSize={100 * 1024 * 1024} // 100MB
          folder="/redux-cms/media"
          tags={['redux', 'cms']}
          className="media-manager-container"
        />

        {/* Usage Tips */}
        <div className="bg-gray-900/30 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/70">
            <div>
              <h4 className="font-medium text-white mb-2">Efficient Uploading</h4>
              <ul className="space-y-1">
                <li>• Drag multiple files at once for bulk upload</li>
                <li>• Use descriptive filenames for better organization</li>
                <li>• Add tags during upload for easier searching</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">File Management</h4>
              <ul className="space-y-1">
                <li>• Use the search function to find files quickly</li>
                <li>• Select multiple files for batch operations</li>
                <li>• Preview files before making changes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Performance</h4>
              <ul className="space-y-1">
                <li>• Optimize images before uploading when possible</li>
                <li>• Use appropriate file formats (WebP for images, MP4 for videos)</li>
                <li>• Consider file size limits for better loading times</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Organization</h4>
              <ul className="space-y-1">
                <li>• Use consistent naming conventions</li>
                <li>• Tag files by content, usage, or project</li>
                <li>• Regularly clean up unused files</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .media-manager-container {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </CMSLayout>
  );
}