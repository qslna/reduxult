import Image from 'next/image';
import { useState } from 'react';
import { layoutUtils } from '@/lib/design-system';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component - Next.js Image 컴포넌트 래퍼
 * 이미지 최적화, 레이지 로딩, 그리고 일관된 스타일링 제공
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  style,
  onClick,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  const imageClass = layoutUtils.combineClasses(
    'transition-opacity duration-300 ease-in-out',
    isLoading ? 'opacity-0' : 'opacity-100',
    hasError ? 'opacity-50' : '',
    className
  );

  // Generate default sizes if not provided
  const defaultSizes = fill 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : undefined;

  const imageProps = {
    src,
    alt,
    className: imageClass,
    quality,
    priority,
    placeholder,
    blurDataURL,
    style,
    onClick,
    onLoad: handleLoad,
    onError: handleError,
    sizes: sizes || defaultSizes,
    ...(fill ? { fill: true } : { width, height })
  };

  return (
    <div className={layoutUtils.combineClasses(
      'relative overflow-hidden',
      fill ? 'w-full h-full' : ''
    )}>
      {hasError ? (
        <div className={layoutUtils.combineClasses(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          fill ? 'absolute inset-0' : 'w-full h-full'
        )}>
          <span className="text-sm">이미지 로드 실패</span>
        </div>
      ) : (
        <Image {...imageProps} />
      )}
      
      {isLoading && !hasError && (
        <div className={layoutUtils.combineClasses(
          'absolute inset-0 flex items-center justify-center',
          'bg-gray-900/10 animate-pulse'
        )}>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * GalleryImage component - 갤러리용 최적화된 이미지
 */
interface GalleryImageProps extends Omit<OptimizedImageProps, 'fill' | 'sizes'> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

export function GalleryImage({
  aspectRatio = 'landscape',
  className,
  ...props
}: GalleryImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  const containerClass = layoutUtils.combineClasses(
    'relative overflow-hidden rounded-lg',
    aspectClasses[aspectRatio],
    className
  );

  return (
    <div className={containerClass}>
      <OptimizedImage
        {...props}
        fill={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

/**
 * HeroImage component - 히어로 섹션용 이미지
 */
interface HeroImageProps extends Omit<OptimizedImageProps, 'fill' | 'sizes' | 'priority'> {
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroImage({
  overlay = false,
  overlayOpacity = 0.3,
  className,
  ...props
}: HeroImageProps) {
  const containerClass = layoutUtils.combineClasses(
    'relative w-full h-full overflow-hidden',
    className
  );

  return (
    <div className={containerClass}>
      <OptimizedImage
        {...props}
        fill={true}
        priority={true}
        sizes="100vw"
        className="object-cover w-full h-full"
      />
      
      {overlay && (
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

/**
 * ProfileImage component - 프로필 이미지용 컴포넌트
 */
interface ProfileImageProps extends Omit<OptimizedImageProps, 'fill'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
}

export function ProfileImage({
  size = 'md',
  rounded = true,
  className,
  ...props
}: ProfileImageProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const containerClass = layoutUtils.combineClasses(
    'relative overflow-hidden',
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded-lg',
    className
  );

  return (
    <div className={containerClass}>
      <OptimizedImage
        {...props}
        fill={true}
        sizes="(max-width: 768px) 100px, 200px"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

/**
 * BackgroundImage component - 배경 이미지용 컴포넌트
 */
interface BackgroundImageProps extends Omit<OptimizedImageProps, 'fill' | 'alt'> {
  children?: React.ReactNode;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

export function BackgroundImage({
  children,
  overlay = false,
  overlayColor = 'black',
  overlayOpacity = 0.5,
  className,
  ...props
}: BackgroundImageProps) {
  const containerClass = layoutUtils.combineClasses(
    'relative w-full h-full',
    className
  );

  return (
    <div className={containerClass}>
      <OptimizedImage
        {...props}
        alt=""
        fill={true}
        sizes="100vw"
        className="object-cover w-full h-full -z-10"
      />
      
      {overlay && (
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundColor: overlayColor,
            opacity: overlayOpacity 
          }}
        />
      )}
      
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}

// Utility functions for image optimization
export const imageUtils = {
  // Generate blur data URL for placeholder
  generateBlurDataURL: (width: number = 10, height: number = 10): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  },

  // Get responsive sizes string
  getResponsiveSizes: (breakpoints: Record<string, string>): string => {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ');
  },

  // Check if image should be priority loaded
  shouldBePriority: (index: number, isAboveFold: boolean = false): boolean => {
    return isAboveFold || index < 3;
  }
};