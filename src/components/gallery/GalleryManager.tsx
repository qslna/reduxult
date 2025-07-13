'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Upload, 
  Download, 
  Trash2, 
  Grid, 
  List, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Eye,
  EyeOff,
  Copy,
  Move,
  Archive,
  Star,
  StarOff
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { buildImageKitUrl } from '@/lib/imagekit';
import { GalleryImage } from '@/types';

interface GalleryManagerProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  title?: string;
  folder?: string;
  isAdmin?: boolean;
  categories?: string[];
  designers?: string[];
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'category' | 'designer';
type SortOrder = 'asc' | 'desc';

export default function GalleryManager({
  images,
  onImagesChange,
  title = 'Gallery Manager',
  folder = 'gallery',
  isAdmin = false,
  categories = [],
  designers = []
}: GalleryManagerProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort images
  const filteredAndSortedImages = images
    .filter(image => {
      if (!showHidden && image.name.startsWith('_hidden_')) return false;
      if (searchQuery && !image.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory && image.category !== selectedCategory) return false;
      if (selectedDesigner && image.designer !== selectedDesigner) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'designer':
          comparison = a.designer.localeCompare(b.designer);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSelectImage = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === filteredAndSortedImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredAndSortedImages.map(img => img.id)));
    }
  };

  const handleBulkUpload = useCallback(async (files: FileList) => {
    if (!files.length || !isAdmin) return;
    
    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
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
      } catch (err) {
        console.error('Upload error:', err);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as GalleryImage[];
    
    if (successfulUploads.length > 0) {
      onImagesChange([...images, ...successfulUploads]);
    }
    
    setIsUploading(false);
  }, [images, onImagesChange, folder, isAdmin]);

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

      onImagesChange(images.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());
    } catch (err) {
      console.error('Bulk delete error:', err);
    }
  };

  const handleBulkHide = () => {
    if (!isAdmin || selectedImages.size === 0) return;

    const updatedImages = images.map(img => {
      if (selectedImages.has(img.id)) {
        return {
          ...img,
          name: img.name.startsWith('_hidden_') ? img.name.slice(8) : `_hidden_${img.name}`
        };
      }
      return img;
    });

    onImagesChange(updatedImages);
    setSelectedImages(new Set());
  };

  const handleBulkCategory = (category: string) => {
    if (!isAdmin || selectedImages.size === 0) return;

    const updatedImages = images.map(img => {
      if (selectedImages.has(img.id)) {
        return { ...img, category };
      }
      return img;
    });

    onImagesChange(updatedImages);
    setSelectedImages(new Set());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleBulkUpload(files);
    }
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {filteredAndSortedImages.length} images
            {selectedImages.size > 0 && ` (${selectedImages.size} selected)`}
          </span>
          {isAdmin && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedDesigner}
          onChange={(e) => setSelectedDesigner(e.target.value)}
          className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Designers</option>
          {designers.map(designer => (
            <option key={designer} value={designer}>{designer}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="designer">Designer</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>

        {/* View Mode */}
        <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 transition-colors",
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 transition-colors",
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            <List size={16} />
          </button>
        </div>

        {/* Show Hidden */}
        <button
          onClick={() => setShowHidden(!showHidden)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
            showHidden 
              ? 'bg-blue-600 text-white border-blue-500' 
              : 'bg-gray-700 text-gray-400 border-gray-600 hover:text-white'
          )}
        >
          {showHidden ? <Eye size={16} /> : <EyeOff size={16} />}
          Hidden
        </button>
      </div>

      {/* Bulk Actions */}
      {isAdmin && selectedImages.size > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-900/50 rounded-lg border border-blue-700">
          <span className="text-sm text-blue-200 mr-4">
            {selectedImages.size} selected
          </span>
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            {selectedImages.size === filteredAndSortedImages.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleBulkHide}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Toggle Hidden
          </button>
          <select
            onChange={(e) => e.target.value && handleBulkCategory(e.target.value)}
            className="px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600"
            defaultValue=""
          >
            <option value="">Change Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {/* Images Grid/List */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' 
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
          : "grid-cols-1"
      )}>
        <AnimatePresence>
          {filteredAndSortedImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative group bg-gray-800 rounded-lg overflow-hidden",
                selectedImages.has(image.id) && "ring-2 ring-blue-500",
                viewMode === 'list' && "flex items-center p-4"
              )}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-square">
                    <Image
                      src={buildImageKitUrl(image.url, {
                        width: 200,
                        height: 200,
                        quality: 85,
                        format: 'webp'
                      })}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedImages.has(image.id)}
                          onChange={() => handleSelectImage(image.id)}
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                    {image.name.startsWith('_hidden_') && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                        Hidden
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-white truncate">{image.name}</h4>
                    <p className="text-xs text-gray-400">{image.category}</p>
                    <p className="text-xs text-gray-500">{image.designer}</p>
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
                    <p className="text-xs text-gray-400">{image.category} • {image.designer}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdmin && (
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => handleSelectImage(image.id)}
                      className="w-5 h-5"
                    />
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-medium text-white mb-2">No images found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
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