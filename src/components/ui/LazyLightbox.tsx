'use client';

import { lazy, Suspense } from 'react';

// 동적으로 Lightbox 로드
const LightboxComponent = lazy(() => import('./Lightbox'));

interface LazyLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * 지연 로딩된 라이트박스
 * 사용자가 이미지를 클릭할 때만 로드
 */
export default function LazyLightbox(props: LazyLightboxProps) {
  if (!props.isOpen) return null;

  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LightboxComponent {...props} />
    </Suspense>
  );
}