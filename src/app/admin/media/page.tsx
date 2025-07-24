'use client';

import { useEffect, useState, useRef } from 'react';
import CMSLayout from '@/components/cms/CMSLayout';
import { cmsClient, MediaItem } from '@/lib/cms-client';
import { useImageKit } from '@/lib/imagekit-client';
import { layoutUtils } from '@/lib/design-system';
import { 
  Upload, 
  Image, 
  Video, 
  File, 
  Search, 
  Filter,
  Grid,
  List,
  ChevronDown,
  Eye,
  Download,
  Trash2,
  Copy,
  CheckCircle,
  X
} from 'lucide-react';

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagekitClient = useImageKit();

  useEffect(() => {
    loadMediaItems();
  }, [typeFilter]);

  const loadMediaItems = async () => {
    try {
      setIsLoading(true);
      const response = await cmsClient.getMediaItems({
        mimeType: typeFilter !== 'all' ? typeFilter : undefined,
        search: searchQuery || undefined,
        limit: 100
      });
      
      if (response.success && response.data) {
        setMediaItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load media items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const validation = imagekitClient.validateFile(file);
      if (!validation.valid) {
        alert(`Invalid file ${file.name}: ${validation.error}`);
        continue;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const uploadResponse = await imagekitClient.uploadFile({
          file,
          fileName: file.name,
          folder: '/redux-media',
          tags: ['cms-upload']
        });

        // Create media item in CMS
        const mediaResponse = await cmsClient.createMediaItem({
          filename: uploadResponse.name,
          originalFilename: file.name,
          url: uploadResponse.url,
          thumbnailUrl: uploadResponse.thumbnailUrl,
          altText: '',
          caption: '',
          tags: [],
          mimeType: uploadResponse.fileType,
          fileSize: uploadResponse.size,
          metadata: {
            width: uploadResponse.width,
            height: uploadResponse.height,
            fileId: uploadResponse.fileId
          }
        });

        if (mediaResponse.success && mediaResponse.data) {
          setMediaItems(prev => [mediaResponse.data!, ...prev]);
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);

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

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    try {
      const response = await cmsClient.deleteMediaItem(itemId);
      if (response.success) {
        setMediaItems(items => items.filter(item => item.id !== itemId));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to delete media item:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} media items?`)) {
      return;
    }

    try {
      const promises = Array.from(selectedItems).map(id => 
        cmsClient.deleteMediaItem(id)
      );
      
      await Promise.all(promises);
      
      setMediaItems(items => items.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Failed to delete media items:', error);
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalFilename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.mimeType.startsWith(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <CMSLayout title="Media Library">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <p className="text-gray-400">Manage your images, videos, and other media files</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="text-white font-medium">Uploading Files</h3>
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

        {/* Filters & Controls */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bulk Actions */}
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedItems.size})
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="flex bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={layoutUtils.combineClasses(
                    'p-1 rounded transition-colors',
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={layoutUtils.combineClasses(
                    'p-1 rounded transition-colors',
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Items */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading media...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery || typeFilter !== 'all' ? 'No matching media found' : 'No media files yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || typeFilter !== 'all' ? 
                'Try adjusting your search or filter criteria' :
                'Upload your first media file to get started'
              }
            </p>
            {!searchQuery && typeFilter === 'all' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Upload Media
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          }>
            {filteredItems.map((item) => {
              const isSelected = selectedItems.has(item.id);
              const FileIcon = getFileIcon(item.mimeType);

              if (viewMode === 'grid') {
                return (
                  <div
                    key={item.id}
                    className={layoutUtils.combineClasses(
                      'relative bg-gray-800 rounded-lg overflow-hidden group cursor-pointer',
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    )}
                    onClick={() => {
                      const newSelected = new Set(selectedItems);
                      if (isSelected) {
                        newSelected.delete(item.id);
                      } else {
                        newSelected.add(item.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                  >
                    {/* Media Preview */}
                    <div className="aspect-square bg-gray-700 flex items-center justify-center">
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.metadata?.thumbnailUrl || item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.url, '_blank');
                          }}
                          className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.url);
                          }}
                          className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        >
                          {copiedUrl === item.url ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="p-2 bg-white/20 text-white rounded-full hover:bg-red-500/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className="absolute top-2 left-2">
                      <div className={layoutUtils.combineClasses(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'bg-black/20 border-white/30'
                      )}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-white text-sm font-medium truncate">{item.filename}</p>
                      <p className="text-gray-400 text-xs">{formatFileSize(item.fileSize)}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className={layoutUtils.combineClasses(
                      'bg-gray-800 rounded-lg p-4 flex items-center gap-4 cursor-pointer',
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    )}
                    onClick={() => {
                      const newSelected = new Set(selectedItems);
                      if (isSelected) {
                        newSelected.delete(item.id);
                      } else {
                        newSelected.add(item.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                  >
                    {/* Selection */}
                    <div className={layoutUtils.combineClasses(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'bg-transparent border-gray-400'
                    )}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>

                    {/* Preview */}
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.metadata?.thumbnailUrl || item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <FileIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{item.filename}</h3>
                      <p className="text-gray-400 text-sm">{formatFileSize(item.fileSize)} • {item.mimeType}</p>
                      <p className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.url, '_blank');
                        }}
                        className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.url);
                        }}
                        className="p-2 text-gray-400 hover:text-white rounded transition-colors"
                      >
                        {copiedUrl === item.url ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              {selectedItems.size > 0 ? `${selectedItems.size} selected • ` : ''}
              Showing {filteredItems.length} of {mediaItems.length} items
            </span>
            <span>
              Total size: {formatFileSize(
                mediaItems.reduce((total, item) => total + item.fileSize, 0)
              )}
            </span>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </div>
    </CMSLayout>
  );
}