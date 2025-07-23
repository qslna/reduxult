'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Grid, List, Search, Filter } from 'lucide-react';
import EditableImage from '@/components/admin/EditableImage';
import Lightbox from '@/components/ui/Lightbox';
import InstagramStyleImageManager from '@/components/admin/InstagramStyleImageManager';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginModal from '@/components/admin/AdminLoginModal';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

interface MemoryGalleryProps {
  images: string[];
  title?: string;
  description?: string;
  onImagesUpdate?: (images: string[]) => void;
}

export default function MemoryGallery({
  images = [],
  title = 'Memory',
  description = 'A visual archive of collective memories and shared experiences.',
  onImagesUpdate
}: MemoryGalleryProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const masonryRef = useRef<HTMLDivElement>(null);
  
  const { 
    isAuthenticated, 
    showLoginModal, 
    setShowLoginModal, 
    attemptLogin, 
    requestAdminAccess 
  } = useAdminAuth();

  // Convert image URLs to ImageItem objects
  useEffect(() => {
    const items = images.map((url, index) => ({
      id: `memory-${index}`,
      url,
      name: `Memory ${index + 1}`,
    }));
    setImageItems(items);
  }, [images]);

  // Masonry layout effect
  useEffect(() => {
    if (viewMode === 'masonry' && masonryRef.current && imageItems.length > 0) {
      const resizeGridItem = (item: HTMLElement) => {
        const grid = masonryRef.current;
        if (!grid) return;
        
        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        const rowSpan = Math.ceil((item.querySelector('.content')?.getBoundingClientRect().height! + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = `span ${rowSpan}`;
      };

      const resizeAllGridItems = () => {
        const allItems = masonryRef.current?.querySelectorAll('.masonry-item');
        if (allItems) {
          allItems.forEach((item) => resizeGridItem(item as HTMLElement));
        }
      };

      // Resize on load and resize
      setTimeout(resizeAllGridItems, 100);
      window.addEventListener('resize', resizeAllGridItems);
      
      return () => window.removeEventListener('resize', resizeAllGridItems);
    }
  }, [viewMode, imageItems]);

  const handleImagesChange = (newImages: ImageItem[]) => {
    setImageItems(newImages);
    const urls = newImages.map(img => img.url);
    onImagesUpdate?.(urls);
  };

  const filteredImages = imageItems.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {description}
              </p>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowManager(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Manage Photos
              </button>
            )}
            
            {!isAuthenticated && (
              <button
                onClick={requestAdminAccess}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredImages.length} memories
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'masonry' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-8">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No memories yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your memory collection
            </p>
            {!isAuthenticated ? (
              <button
                onClick={requestAdminAccess}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Access
              </button>
            ) : (
              <button
                onClick={() => setShowManager(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Memories
              </button>
            )}
          </div>
        ) : viewMode === 'masonry' ? (
          <div
            ref={masonryRef}
            className="masonry-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gridAutoRows: '10px',
              gridGap: '16px'
            }}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="masonry-item cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openLightbox(index)}
              >
                <div className="content relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <EditableImage
                    src={image.url}
                    alt={image.name}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    category="memory"
                    enableCMS={isAuthenticated}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h4 className="font-medium">{image.name}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="aspect-square cursor-pointer group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
              >
                <EditableImage
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  category="memory"
                  enableCMS={isAuthenticated}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h4 className="font-medium text-sm">{image.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredImages.map(img => img.url)}
            currentIndex={lightboxIndex}
            isOpen={true}
            onClose={closeLightbox}
            onNext={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
            onPrevious={() => setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)}
          />
        )}
      </AnimatePresence>

      {/* Image Manager Modal */}
      <AnimatePresence>
        {showManager && isAuthenticated && (
          <InstagramStyleImageManager
            images={imageItems}
            onImagesChange={handleImagesChange}
            maxImages={100}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 p-6 overflow-auto"
          />
        )}
      </AnimatePresence>
      
      {showManager && isAuthenticated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowManager(false)}
          className="fixed top-6 right-6 z-60 w-12 h-12 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={attemptLogin}
      />
    </div>
  );
}