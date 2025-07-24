'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useImageKit } from '@/lib/imagekit-client';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { 
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon,
  X, 
  Check,
  Trash2, 
  Download,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Loader,
  AlertCircle,
  CheckSquare,
  Square,
  FolderOpen,
  Calendar,
  FileText,
  Eye,
  Edit3,
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export interface MediaFile {
  id: string;
  fileId: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  uploadedAt: Date;
  folder?: string;
  tags?: string[];
  metadata?: {
    altText?: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
    duration?: number;
  };
  selected?: boolean;
}

export interface BulkMediaManagerProps {
  className?: string;
  onMediaSelect?: (files: MediaFile[]) => void;
  onMediaUpdate?: (file: MediaFile) => void;
  onMediaDelete?: (fileIds: string[]) => void;
  multiSelect?: boolean;
  allowedTypes?: ('image' | 'video')[];
  maxFiles?: number;
  maxFileSize?: number;
  folder?: string;
  tags?: string[];
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';
type SortOrder = 'asc' | 'desc';

export default function BulkMediaManager({
  className = '',
  onMediaSelect,
  onMediaUpdate,
  onMediaDelete,
  multiSelect = true,
  allowedTypes = ['image', 'video'],
  maxFiles = 50,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  folder = '/redux-cms/media',
  tags = []
}: BulkMediaManagerProps) {
  const { isAuthenticated } = useCMSAuthStore();
  const imagekitClient = useImageKit();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [allSelected, setAllSelected] = useState(false);
  const [showPreview, setShowPreview] = useState<MediaFile | null>(null);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);

  // Load media files
  useEffect(() => {
    if (isAuthenticated) {
      loadMediaFiles();
    }
  }, [isAuthenticated, folder]);

  const loadMediaFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate loading media files from ImageKit
      // In real implementation, this would fetch from ImageKit API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockFiles: MediaFile[] = [
        {
          id: '1',
          fileId: 'file_1',
          url: '/images/profile/placeholder.jpg',
          name: 'Designer Profile 1',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 1024 * 1024 * 2, // 2MB
          uploadedAt: new Date(Date.now() - 86400000),
          folder: '/redux-cms/media',
          tags: ['profile', 'designer'],
          metadata: {
            altText: 'Designer profile image',
            width: 1920,
            height: 1080
          }
        },
        {
          id: '2',
          fileId: 'file_2',
          url: '/images/about/visual-art/placeholder.jpg',
          name: 'Visual Art Showcase',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 1024 * 1024 * 3, // 3MB
          uploadedAt: new Date(Date.now() - 172800000),
          folder: '/redux-cms/media',
          tags: ['visual-art', 'exhibition'],
          metadata: {
            altText: 'Visual art exhibition piece',
            width: 1920,
            height: 1080
          }
        }
      ];
      
      setMediaFiles(mockFiles);
    } catch (error) {
      console.error('Failed to load media files:', error);
      setError('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  };

  const validateFiles = useCallback((files: File[]): { valid: File[]; invalid: { file: File; error: string }[] } => {
    const valid: File[] = [];
    const invalid: { file: File; error: string }[] = [];

    files.forEach(file => {
      // Check file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!allowedTypes.includes('image') && isImage) {
        invalid.push({ file, error: 'Image files not allowed' });
        return;
      }
      
      if (!allowedTypes.includes('video') && isVideo) {
        invalid.push({ file, error: 'Video files not allowed' });
        return;
      }
      
      if (!isImage && !isVideo) {
        invalid.push({ file, error: 'Only image and video files are allowed' });
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        invalid.push({ 
          file, 
          error: `File too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)` 
        });
        return;
      }

      valid.push(file);
    });

    // Check total file limit
    if (valid.length + mediaFiles.length > maxFiles) {
      const allowedCount = maxFiles - mediaFiles.length;
      const excess = valid.splice(allowedCount);
      excess.forEach(file => {
        invalid.push({ file, error: `Maximum ${maxFiles} files allowed` });
      });
    }

    return { valid, invalid };
  }, [allowedTypes, maxFileSize, maxFiles, mediaFiles.length]);

  const handleBulkUpload = useCallback(async (files: File[]) => {
    if (!isAuthenticated) return;

    const { valid, invalid } = validateFiles(files);
    
    if (invalid.length > 0) {
      setError(`${invalid.length} files failed validation: ${invalid.map(i => i.error).join(', ')}`);
    }
    
    if (valid.length === 0) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress({});

      const uploadPromises = valid.map(async (file, index) => {
        const fileId = `upload_${index}_${Date.now()}`;
        
        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + Math.random() * 20, 90)
          }));
        }, 200);

        try {
          const uploadResponse = await imagekitClient.uploadFile({
            file,
            fileName: `${Date.now()}-${file.name}`,
            folder,
            tags: [...tags, file.type.startsWith('image/') ? 'image' : 'video']
          });

          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

          return {
            id: uploadResponse.fileId,
            fileId: uploadResponse.fileId,
            url: uploadResponse.url,
            name: uploadResponse.name,
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date(),
            folder,
            tags,
            metadata: {
              title: file.name.replace(/\.[^/.]+$/, '')
            }
          };
        } catch (error) {
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: -1 })); // -1 indicates error
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<MediaFile>).value);
      
      const failedUploads = results.filter(result => result.status === 'rejected').length;

      setMediaFiles(prev => [...successfulUploads, ...prev]);
      
      if (successfulUploads.length > 0) {
        setSuccess(`Successfully uploaded ${successfulUploads.length} files`);
      }
      
      if (failedUploads > 0) {
        setError(`${failedUploads} files failed to upload`);
      }

      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);

    } catch (error) {
      console.error('Bulk upload failed:', error);
      setError('Bulk upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [isAuthenticated, validateFiles, imagekitClient, folder, tags]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!isAuthenticated) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleBulkUpload(files);
    }
  }, [handleBulkUpload, isAuthenticated]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setIsDragOver(true);
    }
  }, [isAuthenticated]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the drop zone completely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const toggleFileSelection = useCallback((file: MediaFile) => {
    if (!multiSelect) {
      setMediaFiles(prev => prev.map(f => ({
        ...f,
        selected: f.id === file.id ? !f.selected : false
      })));
    } else {
      setMediaFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, selected: !f.selected } : f
      ));
    }
  }, [multiSelect]);

  const toggleSelectAll = useCallback(() => {
    const filteredFiles = getFilteredAndSortedFiles();
    const allCurrentlySelected = filteredFiles.every(f => f.selected);
    
    setMediaFiles(prev => prev.map(f => {
      const isInCurrentView = filteredFiles.some(ff => ff.id === f.id);
      return isInCurrentView ? { ...f, selected: !allCurrentlySelected } : f;
    }));
    
    setAllSelected(!allCurrentlySelected);
  }, [mediaFiles, searchQuery, selectedFileType]);

  const handleBulkDelete = useCallback(async () => {
    const selectedFiles = mediaFiles.filter(f => f.selected);
    if (selectedFiles.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} files? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Delete files from ImageKit
      const deletePromises = selectedFiles.map(file => 
        imagekitClient.deleteFile(file.fileId)
      );
      
      await Promise.allSettled(deletePromises);
      
      // Remove from local state
      setMediaFiles(prev => prev.filter(f => !f.selected));
      
      // Call callback
      onMediaDelete?.(selectedFiles.map(f => f.fileId));
      
      setSuccess(`Successfully deleted ${selectedFiles.length} files`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      setError('Failed to delete some files');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  }, [mediaFiles, imagekitClient, onMediaDelete]);

  const getFilteredAndSortedFiles = useCallback(() => {
    let filtered = mediaFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.metadata?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
      
      return matchesSearch && matchesType;
    });

    // Sort files
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = a.uploadedAt.getTime();
          bValue = b.uploadedAt.getTime();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mediaFiles, searchQuery, selectedFileType, sortBy, sortOrder]);

  const selectedCount = mediaFiles.filter(f => f.selected).length;
  const filteredFiles = getFilteredAndSortedFiles();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bulk-media-manager ${className}`}>
      {/* Header with Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Media Library</h2>
            <p className="text-white/60 text-sm">
              {mediaFiles.length} files • {selectedCount} selected
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Upload Files
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          
          {/* File Type Filter */}
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value as 'all' | 'image' | 'video')}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
          
          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        {/* Bulk Actions */}
        {multiSelect && (
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              Select All ({filteredFiles.length})
            </button>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">{selectedCount} selected</span>
                <button
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 text-sm font-medium">Error</p>
            <p className="text-red-400/80 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-300 text-sm font-medium">Success</p>
            <p className="text-green-400/80 text-sm">{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="p-1 text-green-400/60 hover:text-green-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
          <h3 className="text-blue-300 font-medium mb-3">Uploading Files...</h3>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="flex items-center gap-3">
                <div className="flex-1 bg-blue-900/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress === -1 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: progress === -1 ? '100%' : `${progress}%` }}
                  />
                </div>
                <span className="text-blue-300 text-sm font-medium min-w-[50px]">
                  {progress === -1 ? 'Error' : `${Math.round(progress)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative min-h-[400px] border-2 border-dashed rounded-2xl transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/30 bg-gray-900/20'
        }`}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center text-white">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading media files...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredFiles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60 p-8">
              {mediaFiles.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No media files yet</h3>
                  <p className="text-white/40 mb-6">
                    Upload your first images and videos to get started
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Files
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No files found</h3>
                  <p className="text-white/40">
                    Try adjusting your search or filter criteria
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Media Grid/List */}
        {!isLoading && filteredFiles.length > 0 && (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredFiles.map(file => (
                  <MediaFileCard
                    key={file.id}
                    file={file}
                    onSelect={() => toggleFileSelection(file)}
                    onPreview={() => setShowPreview(file)}
                    onEdit={() => setEditingFile(file)}
                    multiSelect={multiSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map(file => (
                  <MediaFileListItem
                    key={file.id}
                    file={file}
                    onSelect={() => toggleFileSelection(file)}
                    onPreview={() => setShowPreview(file)}
                    onEdit={() => setEditingFile(file)}
                    multiSelect={multiSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
            <div className="text-center text-white">
              <Upload className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
              <p className="text-white/80">Release to upload your files</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.includes('image') && allowedTypes.includes('video') 
          ? 'image/*,video/*' 
          : allowedTypes.includes('image') 
            ? 'image/*' 
            : 'video/*'
        }
        onChange={(e) => {
          if (e.target.files) {
            handleBulkUpload(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Preview Modal */}
      {showPreview && (
        <MediaPreviewModal
          file={showPreview}
          onClose={() => setShowPreview(null)}
        />
      )}

      {/* Edit Modal */}
      {editingFile && (
        <MediaEditModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onSave={(updatedFile) => {
            setMediaFiles(prev => prev.map(f => 
              f.id === updatedFile.id ? updatedFile : f
            ));
            onMediaUpdate?.(updatedFile);
            setEditingFile(null);
          }}
        />
      )}
    </div>
  );
}

// Media File Card Component for Grid View
function MediaFileCard({ 
  file, 
  onSelect, 
  onPreview, 
  onEdit, 
  multiSelect 
}: {
  file: MediaFile;
  onSelect: () => void;
  onPreview: () => void;
  onEdit: () => void;
  multiSelect: boolean;
}) {
  return (
    <div className={`relative group bg-gray-800 rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] ${
      file.selected ? 'border-blue-400 ring-2 ring-blue-400/30' : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Selection Checkbox */}
      {multiSelect && (
        <button
          onClick={onSelect}
          className="absolute top-2 left-2 z-10 p-1 bg-black/50 backdrop-blur-sm rounded transition-colors hover:bg-black/70"
        >
          {file.selected ? (
            <CheckSquare className="w-4 h-4 text-blue-400" />
          ) : (
            <Square className="w-4 h-4 text-white/60" />
          )}
        </button>
      )}

      {/* File Preview */}
      <div className="aspect-square bg-gray-900 flex items-center justify-center">
        {file.type === 'image' ? (
          <img
            src={file.url}
            alt={file.metadata?.altText || file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white/40">
            <VideoIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="text-xs text-center">{file.name}</p>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3">
        <h4 className="text-white font-medium text-sm truncate mb-1">{file.name}</h4>
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{file.type}</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <button
            onClick={onPreview}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Media File List Item Component for List View
function MediaFileListItem({ 
  file, 
  onSelect, 
  onPreview, 
  onEdit, 
  multiSelect 
}: {
  file: MediaFile;
  onSelect: () => void;
  onPreview: () => void;
  onEdit: () => void;
  multiSelect: boolean;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border transition-all duration-300 hover:bg-gray-800/70 ${
      file.selected ? 'border-blue-400 bg-blue-500/10' : 'border-white/10'
    }`}>
      {/* Selection Checkbox */}
      {multiSelect && (
        <button
          onClick={onSelect}
          className="flex-shrink-0"
        >
          {file.selected ? (
            <CheckSquare className="w-5 h-5 text-blue-400" />
          ) : (
            <Square className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
          )}
        </button>
      )}

      {/* File Icon/Thumbnail */}
      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {file.type === 'image' ? (
          <img
            src={file.url}
            alt={file.metadata?.altText || file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <VideoIcon className="w-6 h-6 text-white/40" />
        )}
      </div>

      {/* File Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{file.name}</h4>
        <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
          <span className="capitalize">{file.type}</span>
          <span>{formatFileSize(file.size)}</span>
          <span>{formatDate(file.uploadedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onPreview}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Media Preview Modal Component
function MediaPreviewModal({ 
  file, 
  onClose 
}: {
  file: MediaFile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] bg-gray-900/95 rounded-2xl overflow-hidden border border-white/20">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {file.type === 'image' ? (
            <img
              src={file.url}
              alt={file.metadata?.altText || file.name}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
          ) : (
            <video
              src={file.url}
              controls
              className="max-w-full max-h-[70vh] mx-auto"
            />
          )}
          
          <div className="mt-6 bg-black/50 rounded-xl p-4">
            <h3 className="text-white font-semibold text-lg mb-2">{file.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Type:</span>
                <span className="text-white ml-2 capitalize">{file.type}</span>
              </div>
              <div>
                <span className="text-white/60">Size:</span>
                <span className="text-white ml-2">{formatFileSize(file.size)}</span>
              </div>
              <div>
                <span className="text-white/60">Uploaded:</span>
                <span className="text-white ml-2">{formatDate(file.uploadedAt)}</span>
              </div>
              {file.metadata?.width && file.metadata?.height && (
                <div>
                  <span className="text-white/60">Dimensions:</span>
                  <span className="text-white ml-2">{file.metadata.width} × {file.metadata.height}</span>
                </div>
              )}
            </div>
            
            {file.metadata?.altText && (
              <div className="mt-4">
                <span className="text-white/60">Description:</span>
                <p className="text-white mt-1">{file.metadata.altText}</p>
              </div>
            )}
            
            {file.tags && file.tags.length > 0 && (
              <div className="mt-4">
                <span className="text-white/60">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {file.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Media Edit Modal Component
function MediaEditModal({ 
  file, 
  onClose, 
  onSave 
}: {
  file: MediaFile;
  onClose: () => void;
  onSave: (file: MediaFile) => void;
}) {
  const [name, setName] = useState(file.name);
  const [title, setTitle] = useState(file.metadata?.title || '');
  const [altText, setAltText] = useState(file.metadata?.altText || '');
  const [description, setDescription] = useState(file.metadata?.description || '');
  const [tags, setTags] = useState(file.tags?.join(', ') || '');

  const handleSave = () => {
    const updatedFile: MediaFile = {
      ...file,
      name,
      metadata: {
        ...file.metadata,
        title,
        altText,
        description
      },
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    onSave(updatedFile);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gray-900/95 rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Edit Media File</h3>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
          
          {/* Alt Text (for images) */}
          {file.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Alt Text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this image for accessibility..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </div>
          )}
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
            <p className="text-xs text-white/50 mt-1">Separate tags with commas</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}