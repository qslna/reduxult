'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MemoryGallery from '@/components/about/MemoryGallery';
import { aboutCategories } from '@/data/categories';
import useContentStore from '@/store/useContentStore';

export default function MemoryPage() {
  const [memoryImages, setMemoryImages] = useState<string[]>([]);
  const { updateCategory } = useContentStore();
  
  useEffect(() => {
    const memoryCategory = aboutCategories.find(c => c.id === 'memory');
    if (memoryCategory?.images) {
      setMemoryImages(memoryCategory.images);
    }
  }, []);
  
  const handleImagesUpdate = (newImages: string[]) => {
    setMemoryImages(newImages);
    updateCategory('memory', { images: newImages });
  };
  
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/about" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>
        </div>
      </div>
      
      <MemoryGallery
        images={memoryImages}
        title="Memory"
        description="A visual archive of collective memories and shared experiences that shape our creative journey."
        onImagesUpdate={handleImagesUpdate}
      />
    </div>
  );
}