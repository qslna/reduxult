'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { buildImageKitUrl } from '@/lib/imagekit';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shadowColor?: string;
  showBorder?: boolean;
}

const sizeMap = {
  sm: { width: 150, height: 150 },
  md: { width: 250, height: 250 },
  lg: { width: 350, height: 350 },
  xl: { width: 450, height: 450 }
};

export default function ProfileImage({
  src,
  alt,
  size = 'lg',
  className,
  shadowColor = '#666666',
  showBorder = true
}: ProfileImageProps) {
  const { width, height } = sizeMap[size];
  
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Minimalist shadow effect */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${shadowColor}20 0%, transparent 60%)`,
          filter: 'blur(40px)',
          transform: 'translateY(30px) scale(0.8)',
          opacity: 0.5
        }}
      />
      
      {/* Additional subtle glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${shadowColor}10 0%, transparent 70%)`,
          filter: 'blur(60px)',
          transform: 'translateY(40px) scale(0.9)',
          opacity: 0.3
        }}
      />
      
      {/* Main image container */}
      <div 
        className={cn(
          'relative overflow-hidden',
          size === 'sm' && 'w-[150px] h-[150px]',
          size === 'md' && 'w-[250px] h-[250px]',
          size === 'lg' && 'w-[350px] h-[350px]',
          size === 'xl' && 'w-[450px] h-[450px]',
          showBorder && 'border-2 border-white/10',
          'rounded-full'
        )}
      >
        <Image
          src={buildImageKitUrl(src, {
            width,
            height,
            quality: 90,
            format: 'webp',
            crop: 'maintain_ratio',
            focus: 'face'
          })}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${width}px`}
        />
        
        {/* Subtle overlay gradient */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, transparent 60%, ${shadowColor}05 100%)`
          }}
        />
      </div>
    </motion.div>
  );
}