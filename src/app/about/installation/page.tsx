'use client';

import AboutCategoryDetail from '@/components/about/AboutCategoryDetail';
import useContentStore from '@/store/useContentStore';

export default function InstallationPage() {
  const { categories } = useContentStore();
  const category = categories.find(c => c.id === 'installation');
  
  if (!category) {
    return null;
  }
  
  return <AboutCategoryDetail category={category} />;
}