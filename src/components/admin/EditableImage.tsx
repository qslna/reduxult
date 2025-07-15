'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  onUpdate?: (newSrc: string) => void;
  onDelete?: () => void;
  category?: string;
}

export default function EditableImage({
  src,
  alt,
  className = '',
  objectFit = 'cover',
  sizes,
  onUpdate,
  onDelete,
  category = 'general'
}: EditableImageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 관리자 인증 상태 확인
    const checkEditMode = () => {
      const auth = localStorage.getItem('adminAuth');
      setIsEditMode(auth === 'true');
    };

    checkEditMode();
    window.addEventListener('storage', checkEditMode);
    
    return () => window.removeEventListener('storage', checkEditMode);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    // 파일 형식 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, WebP 형식만 지원됩니다.');
      return;
    }

    setIsUploading(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('folder', `/redux/${category}`);

      // Base64로 변환하여 업로드
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          
          const response = await fetch('/api/imagekit/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              folder: `/redux/${category}`,
            }),
          });

          if (!response.ok) {
            throw new Error('업로드 실패');
          }

          const data = await response.json();
          
          if (onUpdate) {
            onUpdate(data.url);
          }
          
          alert('이미지가 성공적으로 업로드되었습니다.');
        } catch (error) {
          console.error('Upload error:', error);
          alert('이미지 업로드에 실패했습니다.');
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      alert('파일 처리 중 오류가 발생했습니다.');
      setIsUploading(false);
    }

    // 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    if (window.confirm('이 이미지를 삭제하시겠습니까?')) {
      if (onDelete) {
        onDelete();
      }
    }
  };

  return (
    <div 
      className="relative h-full w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`}`}
        sizes={sizes}
      />

      {/* Edit Overlay */}
      <AnimatePresence>
        {isEditMode && isHovered && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4"
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              title="이미지 변경"
            >
              <Edit2 size={20} />
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-3 bg-red-600/20 hover:bg-red-600/30 rounded-full backdrop-blur-sm transition-colors"
                title="이미지 삭제"
              >
                <Trash2 size={20} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Loading */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">업로드 중...</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}