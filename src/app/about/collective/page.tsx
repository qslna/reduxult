'use client';

import AboutCategoryDetail from '@/components/about/AboutCategoryDetail';
import useContentStore from '@/store/useContentStore';

export default function CollectivePage() {
  const { categories } = useContentStore();
  const category = categories.find(c => c.id === 'collective');
  
  if (!category) {
    return null;
  }
  
  return <AboutCategoryDetail category={category} />;
}