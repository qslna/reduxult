'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import { useAdmin } from '@/hooks/useAdmin';

interface SimpleImageManagerProps {
  src: string;
  alt: string;
  className?: string;
  folder: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function SimpleImageManager({
  src,
  alt,
  className = '',
  folder,
  sizes,
  fill = false,
  width,
  height,
  priority = false
}: SimpleImageManagerProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isUploading, setIsUploading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();
  const { success, error } = useToast();
  
  // Fallback image
  const fallbackSrc = '/images/designer-placeholder.jpg';

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSrc(data.url);
        success('이미지가 성공적으로 업로드되었습니다.');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClick = () => {
    if (isAdmin) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <Image
        src={hasError ? fallbackSrc : currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={`${className} ${isAdmin ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
        onError={() => {
          console.error(`Failed to load image: ${currentSrc}`);
          setHasError(true);
        }}
      />
      
      {/* Admin Overlay */}
      {isAdmin && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        >
          {isUploading ? (
            <motion.div
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <motion.button
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
            >
              📁
            </motion.button>
          )}
        </motion.div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}