'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useResponsive, useContainerQuery } from '@/hooks/useResponsive';
import { responsiveUtils } from '@/lib/responsive-design';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'eager' | 'lazy';
  // 반응형 설정
  responsive?: {
    mobile?: { width?: number; height?: number; quality?: number };
    tablet?: { width?: number; height?: number; quality?: number };
    desktop?: { width?: number; height?: number; quality?: number };
  };
  // ImageKit 최적화 설정
  imageKit?: {
    transformation?: Record<string, any>;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    progressive?: boolean;
  };
  // 성능 최적화
  optimization?: {
    lazyLoading?: boolean;
    preload?: boolean;
    criticalResource?: boolean;
  };
  // 접근성
  accessibility?: {
    decorative?: boolean;
    longDescription?: string;
  };
  // 에러 처리
  onError?: (error: Error) => void;
  onLoad?: () => void;
  fallbackSrc?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  responsive,
  imageKit,
  optimization,
  accessibility,
  onError,
  onLoad,
  fallbackSrc
}: ResponsiveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isDesktop, screenWidth } = useResponsive();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // 컨테이너 기반 반응형 체크
  const isSmallContainer = useContainerQuery(containerRef, '(max-width: 500px)');

  // 현재 디바이스에 맞는 이미지 설정 가져오기
  const getCurrentImageConfig = () => {
    if (!responsive) return { width, height, quality };

    if (isMobile && responsive.mobile) {
      return {
        width: responsive.mobile.width || width,
        height: responsive.mobile.height || height,
        quality: responsive.mobile.quality || quality
      };
    }
    
    if (isTablet && responsive.tablet) {
      return {
        width: responsive.tablet.width || width,
        height: responsive.tablet.height || height,
        quality: responsive.tablet.quality || quality
      };
    }
    
    if (isDesktop && responsive.desktop) {
      return {
        width: responsive.desktop.width || width,
        height: responsive.desktop.height || height,
        quality: responsive.desktop.quality || quality
      };
    }

    return { width, height, quality };
  };

  const currentConfig = getCurrentImageConfig();

  // ImageKit URL 최적화
  const getOptimizedImageUrl = (originalSrc: string) => {
    if (!originalSrc.includes('imagekit.io') && !imageKit) {
      return originalSrc;
    }

    try {
      const url = new URL(originalSrc);
      const params = new URLSearchParams();

      // 기본 최적화 파라미터
      if (currentConfig.width) {
        params.set('w', currentConfig.width.toString());
      }
      if (currentConfig.height) {
        params.set('h', currentConfig.height.toString());
      }
      if (currentConfig.quality) {
        params.set('q', currentConfig.quality.toString());
      }

      // 포맷 최적화
      if (imageKit?.format) {
        params.set('f', imageKit.format);
      } else {
        // 브라우저 지원에 따른 자동 포맷
        if (typeof window !== 'undefined') {
          const canvas = document.createElement('canvas');
          if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            params.set('f', 'webp');
          }
        }
      }

      // Progressive JPEG
      if (imageKit?.progressive !== false) {
        params.set('pr', 'true');
      }

      // 추가 ImageKit 변환
      if (imageKit?.transformation) {
        Object.entries(imageKit.transformation).forEach(([key, value]) => {
          params.set(key, String(value));
        });
      }

      // DPR (Device Pixel Ratio) 최적화
      if (typeof window !== 'undefined' && window.devicePixelRatio > 1) {
        params.set('dpr', Math.min(window.devicePixelRatio, 2).toString());
      }

      return `${url.origin}${url.pathname}?${params.toString()}`;
    } catch (error) {
      console.warn('이미지 URL 최적화 실패:', error);
      return originalSrc;
    }
  };

  // 반응형 sizes 속성 생성
  const getResponsiveSizes = () => {
    if (sizes) return sizes;

    if (fill) {
      return '100vw';
    }

    // 컨테이너 기반 사이즈
    if (isSmallContainer) {
      return '(max-width: 500px) 100vw, 500px';
    }

    // 기본 반응형 사이즈
    return `
      (max-width: 640px) 100vw,
      (max-width: 768px) 50vw,
      (max-width: 1024px) 33vw,
      25vw
    `.replace(/\s+/g, ' ').trim();
  };

  // 블러 플레이스홀더 생성
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    if (placeholder !== 'blur') return undefined;

    // 간단한 SVG 블러 플레이스홀더
    const svg = `
      <svg width="${currentConfig.width || 40}" height="${currentConfig.height || 40}" 
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };

  // 에러 처리
  const handleImageError = () => {
    setImageError(true);
    
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setImageError(false);
    } else if (onError) {
      onError(new Error(`이미지 로드 실패: ${src}`));
    }
  };

  // 로드 완료 처리
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  // 레이지 로딩 최적화
  const shouldPreload = () => {
    if (priority) return true;
    if (optimization?.preload) return true;
    if (optimization?.criticalResource) return true;
    return false;
  };

  // 성능 힌트 추가
  useEffect(() => {
    if (shouldPreload() && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedImageUrl(imageSrc);
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [imageSrc]);

  // 접근성 속성
  const getAccessibilityProps = () => {
    const props: Record<string, any> = {
      alt: accessibility?.decorative ? '' : alt
    };

    if (accessibility?.decorative) {
      props['aria-hidden'] = true;
      props.role = 'presentation';
    }

    if (accessibility?.longDescription) {
      props['aria-describedby'] = 'image-description';
    }

    return props;
  };

  // 컨테이너 스타일
  const containerStyle = aspectRatio 
    ? { aspectRatio }
    : undefined;

  const optimizedSrc = getOptimizedImageUrl(imageSrc);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={containerStyle}
    >
      {/* 이미지 */}
      <Image
        src={optimizedSrc}
        alt={alt}
        {...getAccessibilityProps()}
        fill={fill}
        width={!fill ? currentConfig.width : undefined}
        height={!fill ? currentConfig.height : undefined}
        quality={currentConfig.quality}
        priority={shouldPreload()}
        loading={shouldPreload() ? 'eager' : loading}
        sizes={getResponsiveSizes()}
        placeholder={placeholder}
        blurDataURL={getBlurDataURL()}
        className={`
          ${objectFit ? `object-${objectFit}` : ''}
          ${objectPosition ? `object-${objectPosition}` : ''}
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          objectFit,
          objectPosition
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* 로딩 인디케이터 */}
      {!isLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* 에러 상태 */}
      {imageError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">이미지를 불러올 수 없습니다</p>
          </div>
        </div>
      )}

      {/* 긴 설명 (접근성) */}
      {accessibility?.longDescription && (
        <div id="image-description" className="sr-only">
          {accessibility.longDescription}
        </div>
      )}
    </div>
  );
}

// 갤러리용 반응형 이미지 컴포넌트
export function ResponsiveGalleryImage({
  src,
  alt,
  className = '',
  index = 0,
  ...props
}: ResponsiveImageProps & { index?: number }) {
  const { isMobile, isTablet } = useResponsive();

  const galleryConfig = {
    responsive: {
      mobile: {
        width: 400,
        height: 300,
        quality: 80
      },
      tablet: {
        width: 600,
        height: 450,
        quality: 85
      },
      desktop: {
        width: 800,
        height: 600,
        quality: 90
      }
    },
    optimization: {
      lazyLoading: index > 3, // 처음 4개 이미지는 즉시 로드
      preload: index < 2,     // 처음 2개 이미지는 프리로드
    },
    imageKit: {
      format: 'auto' as const,
      progressive: true
    }
  };

  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      className={`gallery-image ${className}`}
      aspectRatio="4/3"
      {...galleryConfig}
      {...props}
    />
  );
}

// 히어로 이미지용 컴포넌트
export function ResponsiveHeroImage({
  src,
  alt,
  className = '',
  ...props
}: ResponsiveImageProps) {
  const heroConfig = {
    fill: true,
    priority: true,
    quality: 95,
    sizes: '100vw',
    objectFit: 'cover' as const,
    objectPosition: 'center',
    optimization: {
      criticalResource: true,
      preload: true
    },
    imageKit: {
      format: 'auto' as const,
      progressive: true,
      transformation: {
        'f': 'auto',
        'q': '95'
      }
    }
  };

  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      className={`hero-image ${className}`}
      {...heroConfig}
      {...props}
    />
  );
}