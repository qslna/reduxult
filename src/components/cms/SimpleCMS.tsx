'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

interface SimpleCMSProps {
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
 * 단순하고 직관적인 CMS 컴포넌트
 * - 드래그 앤 드롭 업로드
 * - 클릭 한 번으로 삭제
 * - 즉시 미리보기
 * - 개발 지식 없이 사용 가능
 */
export default function SimpleCMS({
  slotId,
  currentUrl,
  type = 'any',
  onUpload,
  onDelete,
  isAdminMode = false,
  className = '',
  placeholder = '이미지를 업로드하세요'
}: SimpleCMSProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 처리
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // 파일 타입 검증
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
      // 임시로 파일을 base64로 변환하여 localStorage에 저장
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // localStorage에 저장
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
      alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsUploading(false);
    }
  }, [slotId, type, onUpload]);

  // 파일 선택 처리
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    handleFileUpload(files[0]);
  }, [handleFileUpload]);

  // 드래그 앤 드롭 처리
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // 삭제 처리
  const handleDelete = useCallback(() => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      localStorage.removeItem(`redux-cms-${slotId}`);
      setPreviewUrl(undefined);
      onDelete?.();
    }
  }, [slotId, onDelete]);

  // 파일 입력 트리거
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 미디어 렌더링
  const renderMedia = useCallback((url: string) => {
    if (url.includes('video') || url.endsWith('.mp4') || url.endsWith('.webm')) {
      return (
        <video
          src={url}
          className="w-full h-full object-cover"
          controls
          muted
          playsInline
        />
      );
    }
    
    return (
      <img
        src={url}
        alt={`Content for ${slotId}`}
        className="w-full h-full object-cover"
      />
    );
  }, [slotId]);

  // 관리자 모드가 아닐 때는 단순히 미디어만 표시
  if (!isAdminMode) {
    return (
      <div className={`simple-cms-display ${className}`}>
        {previewUrl && renderMedia(previewUrl)}
      </div>
    );
  }

  return (
    <div className={`simple-cms-admin relative ${className}`}>
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
        // 미디어가 있을 때 - 미리보기 + 삭제 버튼
        <div className="relative group">
          <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            {renderMedia(previewUrl)}
          </div>
          
          {/* 삭제 버튼 */}
          <button
            onClick={handleDelete}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            title="삭제"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 교체 버튼 */}
          <button
            onClick={triggerFileInput}
            className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
          >
            교체
          </button>
        </div>
      ) : (
        // 미디어가 없을 때 - 업로드 영역
        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
            isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">업로드 중...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                {type === 'video' ? (
                  <Video className="w-6 h-6 text-gray-500" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              
              <p className="text-sm font-medium text-gray-700 mb-1">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 text-center px-4">
                클릭하거나 파일을 드래그해서 업로드
              </p>
              
              {type !== 'any' && (
                <p className="text-xs text-gray-400 mt-1">
                  {type === 'image' ? '이미지만' : '동영상만'} 업로드 가능
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}