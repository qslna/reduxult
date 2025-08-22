'use client';

import { lazy, Suspense } from 'react';
import { Skeleton } from './Skeleton';

// 동적으로 ImageGallery 로드
const ImageGalleryComponent = lazy(() => import('./ImageGallery'));

interface LazyImageGalleryProps {
  images: string[];
  columns?: 2 | 3 | 4;
  gap?: number;
  category?: string;
  editable?: boolean;
  onImagesUpdate?: (images: string[]) => void;
}

/**
 * 지연 로딩된 이미지 갤러리
 * Framer Motion과 Lightbox를 포함하므로 초기 로딩 시에는 제외
 */
export default function LazyImageGallery(props: LazyImageGalleryProps) {
  const { columns = 3, gap = 6 } = props;
  
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3', 
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  const fallbackGrid = (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-${gap}`}>
      {Array.from({ length: Math.min(props.images.length, 6) }, (_, index) => (
        <div key={index} className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <Skeleton className="w-full h-full bg-gray-800" />
        </div>
      ))}
    </div>
  );

  return (
    <Suspense fallback={fallbackGrid}>
      <ImageGalleryComponent {...props} />
    </Suspense>
  );
}