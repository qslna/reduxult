'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useImageKit } from '@/lib/imagekit-client';
import { buildImageKitUrl } from '@/lib/imagekit';
import Image from 'next/image';

interface VideoThumbnailManagerProps {
  videoId: string;
  videoTitle: string;
  thumbnailKey: string;
  fallbackThumbnail: string;
  onThumbnailUpdate?: (thumbnailUrl: string) => void;
}

export default function VideoThumbnailManager({
  videoId,
  videoTitle,
  thumbnailKey,
  fallbackThumbnail,
  onThumbnailUpdate
}: VideoThumbnailManagerProps) {
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { uploadFile, deleteFile, listFiles } = useImageKit();

  // 현재 썸네일 로드
  useEffect(() => {
    loadCurrentThumbnail();
  }, [thumbnailKey]);

  const loadCurrentThumbnail = async () => {
    try {
      const files = await listFiles(`fashion-film`);
      const thumbnailFile = files.find(file => 
        file.name.includes(thumbnailKey) || file.filePath.includes(thumbnailKey)
      );
      
      if (thumbnailFile) {
        setCurrentThumbnail(thumbnailFile.url);
      }
    } catch (error) {
      console.error('썸네일 로드 실패:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      setUploadError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    uploadThumbnail(file);
  };

  const uploadThumbnail = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // 기존 썸네일 삭제
      if (currentThumbnail) {
        await handleDeleteThumbnail(false);
      }

      // 새 썸네일 업로드
      const result = await uploadFile(
        file, 
        `fashion-film/${thumbnailKey}`,
        { 
          tags: ['fashion-film', 'thumbnail', videoId],
          customMetadata: {
            videoId,
            videoTitle,
            thumbnailFor: videoId
          }
        }
      );

      if (result.success && result.data?.url) {
        setCurrentThumbnail(result.data.url);
        onThumbnailUpdate?.(result.data.url);
        setPreviewImage(null);
      } else {
        throw new Error(result.error || '업로드 실패');
      }
    } catch (error) {
      console.error('썸네일 업로드 실패:', error);
      setUploadError(error instanceof Error ? error.message : '업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteThumbnail = async (showConfirm = true) => {
    if (showConfirm && !confirm('썸네일을 삭제하시겠습니까?')) return;

    try {
      if (currentThumbnail) {
        const result = await deleteFile(currentThumbnail);
        if (result.success) {
          setCurrentThumbnail(null);
          onThumbnailUpdate?.('');
        }
      }
    } catch (error) {
      console.error('썸네일 삭제 실패:', error);
      setUploadError('삭제에 실패했습니다.');
    }
  };

  const getThumbnailUrl = () => {
    if (previewImage) return previewImage;
    if (currentThumbnail) return buildImageKitUrl(currentThumbnail, { width: 400, height: 225, quality: 80 });
    return fallbackThumbnail;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {videoTitle} 썸네일
        </h3>
        <div className="flex gap-2">
          {currentThumbnail && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(currentThumbnail, '_blank')}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              title="원본 보기"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}
          {currentThumbnail && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteThumbnail()}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* 썸네일 미리보기 */}
      <div className="relative aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
        <Image
          src={getThumbnailUrl()}
          alt={`${videoTitle} 썸네일`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        
        {/* 업로드 상태 오버레이 */}
        <AnimatePresence>
          {(isUploading || previewImage) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              {isUploading ? (
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm">업로드 중...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">미리보기</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 업로드 버튼 */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id={`thumbnail-upload-${videoId}`}
        />
        <label
          htmlFor={`thumbnail-upload-${videoId}`}
          className={`
            flex items-center justify-center gap-2 w-full p-3 rounded-lg border-2 border-dashed transition-colors
            ${isUploading 
              ? 'border-gray-600 bg-gray-800 cursor-not-allowed' 
              : 'border-gray-600 hover:border-white/40 hover:bg-white/5 cursor-pointer'
            }
          `}
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">
            {isUploading ? '업로드 중...' : '썸네일 업로드'}
          </span>
        </label>
      </div>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-900/50 border border-red-600/50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{uploadError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 상태 정보 */}
      <div className="mt-3 text-xs text-gray-500">
        <p>파일 형식: JPG, PNG, WebP (최대 5MB)</p>
        <p>권장 해상도: 1280x720 또는 16:9 비율</p>
      </div>
    </div>
  );
}