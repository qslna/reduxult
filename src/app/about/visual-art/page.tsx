'use client';

import AboutCategoryDetail from '@/components/about/AboutCategoryDetail';
import useContentStore from '@/store/useContentStore';

export default function VisualArtPage() {
  const { categories } = useContentStore();
  const category = categories.find(c => c.id === 'visual-art');
  
  if (!category) {
    return null;
  }
  
  return <AboutCategoryDetail category={category} />;
}