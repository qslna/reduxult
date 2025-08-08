'use client';

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

// 동적으로 EditableImage 로드
const EditableImageComponent = lazy(() => import('./EditableImage'));

interface LazyEditableImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  category?: string;
  enableCMS?: boolean;
  onImageUpdate?: (newSrc: string) => void;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * 지연 로딩된 EditableImage 컴포넌트
 * CMS 모드에서만 로드되므로 초기 번들 크기를 줄임
 */
export default function LazyEditableImage(props: LazyEditableImageProps) {
  if (!props.enableCMS) {
    // CMS 모드가 아니면 일반 이미지 컴포넌트 사용
    const OptimizedImage = require('@/components/ui/OptimizedImage').default;
    return (
      <OptimizedImage
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        priority={props.priority}
        sizes={props.sizes}
        className={props.className}
      />
    );
  }

  return (
    <Suspense 
      fallback={
        <div className={`relative ${props.className || ''}`}>
          <Skeleton 
            className="w-full h-full bg-gray-800" 
          />
        </div>
      }
    >
      <EditableImageComponent {...props} />
    </Suspense>
  );
}