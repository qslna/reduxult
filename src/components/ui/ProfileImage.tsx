'use client';

import Image from 'next/image';
import { cn } from '@/utils/cn';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-24 h-24', // 96px
  md: 'w-32 h-32', // 128px
  lg: 'w-48 h-48', // 192px
  xl: 'w-64 h-64'  // 256px
};

export default function ProfileImage({
  src,
  alt,
  size = 'md',
  className
}: ProfileImageProps) {
  const imageSrc = src || '/images/designer-placeholder.jpg';
  
  return (
    <div className={cn(
      'relative rounded-full overflow-hidden bg-gray-900',
      sizeMap[size],
      className
    )}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/designer-placeholder.jpg';
        }}
      />
    </div>
  );
}