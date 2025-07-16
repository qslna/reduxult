'use client';

import AboutCategoryDetail from '@/components/about/AboutCategoryDetail';
import useContentStore from '@/store/useContentStore';

export default function MemoryPage() {
  const { categories } = useContentStore();
  const category = categories.find(c => c.id === 'memory');
  
  if (!category) {
    return null;
  }
  
  return <AboutCategoryDetail category={category} />;
}