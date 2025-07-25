'use client';

import { useEffect, useState } from 'react';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import InstagramStyleMediaGrid from '@/components/cms/InstagramStyleMediaGrid';

export default function AdminMediaPage() {
  const { isAuthenticated, isLoading } = useCMSAuthStore();
  
  // Mock media items for demonstration
  const [mediaItems] = useState([
    {
      id: '1',
      url: '/images/profile/placeholder.jpg',
      type: 'image' as const,
      title: 'Fashion Portrait Session',
      description: 'Studio portrait session with natural lighting',
      tags: ['portrait', 'fashion', 'studio'],
      uploadedAt: new Date(2024, 0, 15),
      size: 2048576,
      dimensions: { width: 1920, height: 1080 },
      likes: 142,
      isLiked: false,
      isFavorited: true,
      views: 1205,
      author: { name: 'Redux Team', avatar: '' },
      usage: { usedIn: ['home-page', 'about-section'], lastUsed: new Date() }
    },
    {
      id: '2',
      url: '/images/about/visual-art/placeholder.jpg',
      type: 'image' as const,
      title: 'Visual Art Showcase',
      description: 'Contemporary art exhibition piece',
      tags: ['visual-art', 'exhibition', 'contemporary'],
      uploadedAt: new Date(2024, 0, 10),
      size: 3145728,
      dimensions: { width: 1920, height: 1080 },
      likes: 89,
      isLiked: false,
      isFavorited: false,
      views: 543,
      author: { name: 'Redux Team', avatar: '' },
      usage: { usedIn: ['about-page'], lastUsed: new Date() }
    },
    {
      id: '3',
      url: '/images/about/fashion-film/placeholder.jpg',
      type: 'image' as const,
      title: 'Fashion Film Still',
      description: 'Behind the scenes from latest fashion film',
      tags: ['fashion-film', 'bts', 'video'],
      uploadedAt: new Date(2024, 0, 5),
      size: 1572864,
      dimensions: { width: 1920, height: 1080 },
      likes: 256,
      isLiked: true,
      isFavorited: true,
      views: 892,
      author: { name: 'Redux Team', avatar: '' },
      usage: { usedIn: ['fashion-film-page'], lastUsed: new Date() }
    }
  ]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading media library...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-white/60">
            Manage your images and videos with Instagram-style interface
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <InstagramStyleMediaGrid
          items={mediaItems}
          layout="masonry"
          showStats={true}
          onItemSelect={(item) => console.log('Selected:', item)}
          onItemLike={(item) => console.log('Liked:', item)}
          onItemFavorite={(item) => console.log('Favorited:', item)}
        />
      </div>
    </div>
  );
}