'use client';

import { useState, useRef } from 'react';
import { Upload, X, Edit3 } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import HydrationSafe from '@/components/ui/HydrationSafe';

interface SimpleCMSSlotProps {
  slotId: string;
  currentUrl?: string;
  defaultUrl?: string;
  onUpload?: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 간단하고 편리한 CMS 슬롯 컴포넌트
 * - 이미지가 있을 때: 삭제 & 교체 기능
 * - 이미지가 없을 때: 업로드 기능
 */
export default function SimpleCMSSlot({
  slotId,
  currentUrl,
  defaultUrl,
  onUpload,
  onDelete,
  alt,
  className = '',
  children
}: SimpleCMSSlotProps) {
  const { isAuthenticated } = useSimpleAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 관리자가 아니면 일반 콘텐츠만 표시
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const hasImage = currentUrl || defaultUrl;
  const imageUrl = currentUrl || defaultUrl;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = confirm('이미지를 삭제하시겠습니까?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <HydrationSafe>
      <div className={`relative group ${className}`}>
        {/* 기본 콘텐츠 */}
        {children}
        
        {/* CMS 컨트롤 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2">
            {hasImage ? (
              // 이미지가 있을 때: 교체 & 삭제 버튼
              <>
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                  title="이미지 교체"
                >
                  <Edit3 size={12} />
                  {isUploading ? '업로드 중...' : '교체'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                  title="이미지 삭제"
                >
                  <X size={12} />
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </>
            ) : (
              // 이미지가 없을 때: 업로드 버튼
              <button
                onClick={triggerFileSelect}
                disabled={isUploading}
                className="flex items-center gap-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                title="이미지 업로드"
              >
                <Upload size={14} />
                {isUploading ? '업로드 중...' : '이미지 추가'}
              </button>
            )}
          </div>
        </div>

        {/* 파일 입력 (숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label={`Upload image for ${slotId}`}
        />

        {/* 슬롯 정보 표시 (개발 모드) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 left-0 bg-black/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {slotId}
          </div>
        )}
      </div>
    </HydrationSafe>
  );
}

/**
 * 비디오용 간단한 CMS 슬롯
 */
export function VideoCMSSlot({
  slotId,
  currentUrl,
  defaultUrl,
  onUpload,
  onDelete,
  className = '',
  children
}: SimpleCMSSlotProps) {
  const { isAuthenticated } = useSimpleAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const hasVideo = currentUrl || defaultUrl;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = confirm('비디오를 삭제하시겠습니까?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <HydrationSafe>
      <div className={`relative group ${className}`}>
        {children}
        
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            {hasVideo ? (
              <>
                <button
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  <Edit3 size={12} />
                  {isUploading ? '업로드 중...' : '교체'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  <X size={12} />
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </>
            ) : (
              <button
                onClick={triggerFileSelect}
                disabled={isUploading}
                className="flex items-center gap-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                <Upload size={14} />
                {isUploading ? '업로드 중...' : '비디오 추가'}
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 left-0 bg-black/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {slotId}
          </div>
        )}
      </div>
    </HydrationSafe>
  );
}