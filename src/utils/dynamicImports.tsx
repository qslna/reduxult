/**
 * Dynamic Imports Utility for Performance Optimization
 * 필요할 때만 라이브러리를 로드하여 초기 번들 크기를 줄임
 */

// Lucide React 아이콘 동적 import
export const loadLucideIcons = () => {
  return import('lucide-react');
};

// Animation utilities 동적 import
export const loadAnimations = () => {
  return import('@/lib/animations');
};

// 특정 아이콘들을 동적으로 로드
export const loadCommonIcons = async () => {
  const lucide = await loadLucideIcons();
  return {
    Edit3: lucide.Edit3,
    Upload: lucide.Upload,
    Loader2: lucide.Loader2,
    X: lucide.X,
    Settings: lucide.Settings,
    Search: lucide.Search,
    Filter: lucide.Filter,
    BarChart3: lucide.BarChart3,
    LogOut: lucide.LogOut,
    Shield: lucide.Shield,
  };
};

// 관리자 전용 컴포넌트들 동적 로드
export const loadAdminComponents = async () => {
  const [
    { default: CMSManager },
    { default: EditableImage },
    { default: MediaSlot }
  ] = await Promise.all([
    import('@/components/cms/CMSManager'),
    import('@/components/admin/EditableImage'),
    import('@/components/cms/MediaSlot')
  ]);
  
  return { CMSManager, EditableImage, MediaSlot };
};

// UI 컴포넌트들 동적 로드
export const loadUIComponents = async () => {
  const [
    { default: ImageGallery },
    { default: Lightbox }
  ] = await Promise.all([
    import('@/components/ui/ImageGallery'),
    import('@/components/ui/Lightbox')
  ]);
  
  return { ImageGallery, Lightbox };
};

// 페이지 컴포넌트들 동적 로드
export const loadPageComponents = {
  loadAboutContent: () => import('@/components/about/AboutContent'),
  loadContactForm: () => import('@/components/contact/ContactForm'),
  loadExhibitionsTimeline: () => import('@/components/exhibitions/ExhibitionsTimeline'),
};

// 청크 이름을 지정한 동적 import
export const loadWithChunkName = (
  importFunction: () => Promise<any>,
  chunkName: string
) => {
  return importFunction();
};

// 조건부 로딩 유틸리티
export const conditionalLoad = async <T,>(
  condition: boolean,
  loader: () => Promise<T>
): Promise<T | null> => {
  if (condition) {
    return await loader();
  }
  return null;
};

// React import 추가
import React from 'react';

// 지연 로딩 HOC 팩토리 (타입 단순화)
export const createLazyComponent = (
  loader: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(loader);
  
  const LazyWrapper = (props: any) => (
    <React.Suspense fallback={fallback ? React.createElement(fallback) : null}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  
  LazyWrapper.displayName = 'LazyWrapper';
  return LazyWrapper;
};