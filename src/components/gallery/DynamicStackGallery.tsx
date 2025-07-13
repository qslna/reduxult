'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface DynamicStackGalleryProps {
  /** 연결된 하위 페이지/폴더 (예: 'visual-art', 'collective' 등) */
  sourceFolder: string;
  /** 표시할 최대 이미지 수 */
  maxItems?: number;
  /** 갤러리 제목 */
  title?: string;
  /** 커스텀 클래스 */
  className?: string;
  /** 클릭 시 이동할 페이지 */
  href?: string;
  /** 스택 효과 스타일 */
  stackStyle?: 'default' | 'spread' | 'minimal';
}

interface ImageItem {
  url: string;
  fileId: string;
  name: string;
  path: string;
}

export default function DynamicStackGallery({
  sourceFolder,
  maxItems = 5,
  title,
  className = '',
  href,
  stackStyle = 'default'
}: DynamicStackGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  // 하위 폴더의 이미지들을 실시간으로 가져오기
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/imagekit/list?folder=${sourceFolder}`);
      
      if (!response.ok) {
        throw new Error('이미지를 불러올 수 없습니다');
      }
      
      const data = await response.json();
      
      // ImageKit에서 가져온 이미지들을 변환
      const imageItems: ImageItem[] = data.files
        ?.filter((file: any) => file.type === 'file' && 
          /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file.name))
        .map((file: any) => ({
          url: file.url,
          fileId: file.fileId,
          name: file.name,
          path: file.filePath
        }))
        .slice(0, maxItems) || [];
      
      setImages(imageItems);
    } catch (err) {
      console.error('이미지 로드 오류:', err);
      setError(err instanceof Error ? err.message : '이미지 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [sourceFolder, maxItems]);

  // 이미지 업로드
  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', sourceFolder);

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      // 업로드 후 이미지 목록 새로고침
      await fetchImages();
    } catch (err) {
      console.error('업로드 오류:', err);
      setError('업로드에 실패했습니다');
    } finally {
      setUploading(false);
    }
  };

  // 이미지 삭제
  const handleDelete = async (fileId: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch('/api/imagekit/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error('삭제 실패');
      }

      // 삭제 후 이미지 목록 새로고침
      await fetchImages();
    } catch (err) {
      console.error('삭제 오류:', err);
      setError('삭제에 실패했습니다');
    }
  };

  const stackVariants = {
    default: {
      spread: 15,
      rotation: 8,
      scale: 0.95
    },
    spread: {
      spread: 25,
      rotation: 12,
      scale: 0.9
    },
    minimal: {
      spread: 8,
      rotation: 4,
      scale: 0.98
    }
  };

  const currentStyle = stackVariants[stackStyle];

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchImages}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center text-white">
          {title}
        </h3>
      )}

      {/* 관리자 업로드 버튼 */}
      {isAdmin && (
        <div className="mb-4">
          <label className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="text-sm">
              {uploading ? '업로드 중...' : '이미지 추가'}
            </span>
          </label>
        </div>
      )}

      {/* 스택 갤러리 */}
      <div 
        className="relative w-full aspect-square max-w-sm mx-auto cursor-pointer group"
        onClick={handleClick}
      >
        <AnimatePresence>
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center"
            >
              <div className="text-center text-white/50">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">이미지가 없습니다</p>
              </div>
            </motion.div>
          ) : (
            images.map((image, index) => (
              <motion.div
                key={image.fileId}
                className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotate: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 1 - (index * 0.1), 
                  scale: currentStyle.scale - (index * 0.02),
                  rotate: (index - Math.floor(images.length / 2)) * currentStyle.rotation,
                  x: (index - Math.floor(images.length / 2)) * currentStyle.spread,
                  y: index * 3,
                  zIndex: images.length - index
                }}
                whileHover={{ 
                  scale: (currentStyle.scale - (index * 0.02)) * 1.02,
                  transition: { duration: 0.2 }
                }}
                style={{ zIndex: images.length - index }}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* 관리자 삭제 버튼 */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.fileId);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* 호버 오버레이 */}
        {href && (
          <motion.div 
            className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <span className="text-white font-medium">클릭하여 보기</span>
          </motion.div>
        )}
      </div>

      {/* 이미지 카운트 */}
      <div className="text-center mt-4">
        <span className="text-xs text-white/60">
          {images.length}개 이미지
        </span>
      </div>
    </div>
  );
}