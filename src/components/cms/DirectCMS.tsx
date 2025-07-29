'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Plus, Upload } from 'lucide-react';

interface DirectCMSProps {
  /** 슬롯의 고유 ID */
  slotId: string;
  /** 현재 이미지/동영상 URL */
  currentUrl?: string;
  /** 미디어 타입 */
  type?: 'image' | 'video' | 'any';
  /** 업로드 완료 콜백 */
  onUpload?: (url: string) => void;
  /** 삭제 완료 콜백 */
  onDelete?: () => void;
  /** 관리자 모드 여부 */
  isAdminMode?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
}

/**
 * 직접 편집 CMS - 세로칸 없이 이미지에 직접 버튼 표시
 */
export default function DirectCMS({
  slotId,
  currentUrl,
  type = 'any',
  onUpload,
  onDelete,
  isAdminMode = false,
  className = '',
  placeholder = '이미지'
}: DirectCMSProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 처리
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (type === 'image' && !isImage) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    if (type === 'video' && !isVideo) {
      alert('동영상 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`redux-cms-${slotId}`, base64String);
        setPreviewUrl(base64String);
        onUpload?.(base64String);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        throw new Error('파일 읽기에 실패했습니다.');
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다.');
      setIsUploading(false);
    }
  }, [slotId, type, onUpload]);

  // 삭제 처리
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('삭제하시겠습니까?')) {
      localStorage.removeItem(`redux-cms-${slotId}`);
      setPreviewUrl(undefined);
      onDelete?.();
    }
  }, [slotId, onDelete]);

  // 파일 선택 트리거
  const triggerFileInput = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  // 파일 선택 처리
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    handleFileUpload(files[0]);
  }, [handleFileUpload]);

  // 관리자 모드가 아닐 때는 버튼 표시 안함
  if (!isAdminMode) {
    return null;
  }

  return (
    <div className={`direct-cms ${className}`}>
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={
          type === 'image' ? 'image/*' : 
          type === 'video' ? 'video/*' : 
          'image/*,video/*'
        }
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {previewUrl ? (
        // 이미지가 있을 때 - 삭제(-) 버튼과 교체 버튼 (모바일 최적화)
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="w-7 h-7 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors touch-manipulation"
            style={{ minWidth: '28px', minHeight: '28px' }}
            title="삭제"
          >
            <X className="w-4 h-4 md:w-3 md:h-3" />
          </button>
          <button
            onClick={triggerFileInput}
            className="px-3 py-2 md:px-2 md:py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors touch-manipulation"
            style={{ minHeight: '28px' }}
            title="교체"
          >
            교체
          </button>
        </div>
      ) : (
        // 이미지가 없을 때 - 추가(+) 버튼 (모바일 최적화)
        <button
          onClick={triggerFileInput}
          disabled={isUploading}
          className="w-7 h-7 md:w-6 md:h-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors touch-manipulation"
          style={{ minWidth: '28px', minHeight: '28px' }}
          title={`${placeholder} 추가`}
        >
          {isUploading ? (
            <div className="w-4 h-4 md:w-3 md:h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4 md:w-3 md:h-3" />
          )}
        </button>
      )}
    </div>
  );
}