/**
 * 접근성이 향상된 이미지 컴포넌트
 * alt 텍스트, 로딩 상태, 키보드 네비게이션 지원
 */

'use client';

import { useState } from 'react';
import OptimizedImage from './OptimizedImage';

interface AccessibleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  priority?: boolean;
  sizes?: string;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export default function AccessibleImage({
  src,
  alt,
  width,
  height,
  className = '',
  onClick,
  onKeyDown,
  priority = false,
  sizes,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}: AccessibleImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter 또는 Space 키로 클릭 동작 실행
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-800 text-gray-400 ${className}`}
        style={width && height ? { width, height } : {}}
        role="img"
        aria-label={alt || '이미지를 불러올 수 없습니다'}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-sm">이미지를 불러올 수 없습니다</div>
          {alt && <div className="text-xs mt-1 opacity-70">{alt}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 로딩 상태 */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse"
          role="status"
          aria-label="이미지 로딩 중"
        >
          <div className="text-gray-400">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                className="opacity-75"
              />
            </svg>
          </div>
        </div>
      )}

      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-pointer' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? (tabIndex ?? 0) : -1}
        role={role || (onClick ? 'button' : 'img')}
        aria-label={ariaLabel || (onClick ? `${alt} - 클릭하여 확대` : undefined)}
        aria-describedby={ariaDescribedby}
      />

      {/* 스크린리더용 추가 정보 */}
      {onClick && (
        <span className="sr-only">
          스페이스바 또는 엔터키를 눌러 이미지를 확대할 수 있습니다.
        </span>
      )}
    </div>
  );
}