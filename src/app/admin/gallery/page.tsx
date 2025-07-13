'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Settings,
  Grid,
  List,
  Filter,
  Search,
  Plus,
  Archive
} from 'lucide-react';
import GalleryManager from '@/components/gallery/GalleryManager';
import AdminGallery from '@/components/gallery/AdminGallery';
import { GalleryImage } from '@/types';
import { cn } from '@/utils/cn';

// Gallery categories for the site
const GALLERY_CATEGORIES = [
  { id: 'homepage-hero', name: 'Homepage Hero', description: 'Main hero section images' },
  { id: 'visual-art', name: 'Visual Art', description: 'Visual art portfolio images' },
  { id: 'collective', name: 'Collective', description: 'Collective portfolio images' },
  { id: 'fashion-film', name: 'Fashion Film', description: 'Fashion film thumbnails and images' },
  { id: 'installation', name: 'Installation', description: 'Installation art images' },
  { id: 'memory', name: 'Memory', description: 'Memory project images' },
  { id: 'designer-profiles', name: 'Designer Profiles', description: 'Individual designer portfolio images' },
  { id: 'about-showcase', name: 'About Showcase', description: 'About section showcase images' },
  { id: 'general', name: 'General Gallery', description: 'General purpose images' },
];

const DESIGNERS = ['collective', 'hwangjinsu', 'choieunsol', 'parkparang', 'leetaehyeon', 'kimbomin', 'kimgyeongsu'];
const CATEGORIES = ['Gallery', 'Portfolio', 'Cinema', 'Personal', 'Visual Art', 'Fashion Film', 'Installation', 'Memory', 'Collective'];

export default function AdminGalleryPage() {
  const { user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('homepage-hero');
  const [galleries, setGalleries] = useState<Record<string, GalleryImage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalGalleries: 0,
    totalSize: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      redirect('/admin');
    }
  }, [user, loading]);

  // Load gallery data
  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    setIsLoading(true);
    try {
      // Initialize galleries with empty arrays
      const initialGalleries: Record<string, GalleryImage[]> = {};
      GALLERY_CATEGORIES.forEach(category => {
        initialGalleries[category.id] = [];
      });

      // Here you would load actual data from your backend/API
      // For now, we'll start with empty galleries
      setGalleries(initialGalleries);
      
      // Calculate stats
      const totalImages = Object.values(initialGalleries).reduce((sum, gallery) => sum + gallery.length, 0);
      setStats({
        totalImages,
        totalGalleries: Object.keys(initialGalleries).length,
        totalSize: 0 // Would calculate from actual image data
      });
    } catch (error) {
      console.error('Failed to load gallery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryUpdate = (categoryId: string, images: GalleryImage[]) => {
    setGalleries(prev => ({
      ...prev,
      [categoryId]: images
    }));

    // Update stats
    const totalImages = Object.values({
      ...galleries,
      [categoryId]: images
    }).reduce((sum, gallery) => sum + gallery.length, 0);
    
    setStats(prev => ({
      ...prev,
      totalImages
    }));
  };

  const selectedGalleryInfo = GALLERY_CATEGORIES.find(cat => cat.id === selectedCategory);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Gallery Management</h1>
          <p className="text-gray-400">
            Manage all gallery images across the Redux website
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Images</p>
                <p className="text-2xl font-bold">{stats.totalImages}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Galleries</p>
                <p className="text-2xl font-bold">{stats.totalGalleries}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <Archive className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Gallery Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Gallery Categories</h3>
              <div className="space-y-2">
                {GALLERY_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                    <div className="text-xs mt-1">
                      {galleries[category.id]?.length || 0} images
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Gallery Management Area */}
          <div className="lg:col-span-3">
            {selectedGalleryInfo && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Category Header */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedGalleryInfo.name}</h2>
                      <p className="text-gray-400">{selectedGalleryInfo.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        {galleries[selectedCategory]?.length || 0} images
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Upload size={16} />
                      Bulk Upload
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      <Download size={16} />
                      Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>
                </div>

                {/* Gallery Manager */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <GalleryManager
                    images={galleries[selectedCategory] || []}
                    onImagesChange={(images) => handleGalleryUpdate(selectedCategory, images)}
                    title=""
                    folder={selectedCategory}
                    isAdmin={true}
                    categories={CATEGORIES}
                    designers={DESIGNERS}
                  />
                </div>

                {/* Alternative: Simple Admin Gallery */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <AdminGallery
                    images={galleries[selectedCategory] || []}
                    onImagesChange={(images) => handleGalleryUpdate(selectedCategory, images)}
                    title="Grid View"
                    folder={selectedCategory}
                    isAdmin={true}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}