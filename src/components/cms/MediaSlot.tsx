'use client';

import { useState, useRef, useCallback } from 'react';
import { Plus, Minus, Upload, Video, Image as ImageIcon, Loader2, Check, Trash2, CheckSquare } from 'lucide-react';
import type { MediaSlot as MediaSlotType } from '../../lib/cms-config';

interface MediaSlotProps {
  slot: MediaSlotType;
  currentFiles: string[];
  onFilesUpdate: (files: string[]) => void;
  isAdminMode?: boolean;
  className?: string;
}

export default function MediaSlot({ 
  slot, 
  currentFiles,
  onFilesUpdate,
  isAdminMode = false, 
  className = '' 
}: MediaSlotProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 파일 검증
        if (!slot.supportedFormats.includes(file.type.split('/')[1])) {
          throw new Error(`Unsupported format. Allowed: ${slot.supportedFormats.join(', ')}`);
        }

        // ImageKit 업로드 로직 (추후 구현)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('folder', `/redux/${slot.category}`);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      let newFiles: string[];
      if (slot.type === 'gallery') {
        newFiles = [...currentFiles, ...uploadedUrls];
        if (slot.maxFiles && newFiles.length > slot.maxFiles) {
          newFiles = newFiles.slice(-slot.maxFiles);
        }
      } else {
        newFiles = [uploadedUrls[0]];
      }

      onFilesUpdate?.(newFiles);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [slot, currentFiles, onFilesUpdate]);

  const handleFileRemove = useCallback((index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index);
    onFilesUpdate?.(newFiles);
  }, [currentFiles, onFilesUpdate]);

  const handleBatchDelete = useCallback(() => {
    const newFiles = currentFiles.filter((_, index) => !selectedFiles.includes(index));
    onFilesUpdate?.(newFiles);
    setSelectedFiles([]);
    setIsSelectionMode(false);
  }, [currentFiles, selectedFiles, onFilesUpdate]);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.length === currentFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(currentFiles.map((_, index) => index));
    }
  }, [currentFiles, selectedFiles]);

  const handleFileToggle = useCallback((index: number) => {
    setSelectedFiles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

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
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const renderMedia = useCallback((url: string, index: number) => {
    switch (slot.type) {
      case 'single-video':
        return (
          <video 
            src={url} 
            className="w-full h-32 object-cover rounded-lg"
            controls
            muted
          />
        );
      
      case 'google-drive-video':
        return (
          <iframe
            src={`https://drive.google.com/file/d/${url}/preview`}
            className="w-full h-32 rounded-lg"
            allowFullScreen
          />
        );
      
      default:
        return (
          <img 
            src={url} 
            alt={`${slot.name} ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        );
    }
  }, [slot]);

  const getIcon = () => {
    switch (slot.type) {
      case 'single-video':
      case 'google-drive-video':
        return Video;
      default:
        return ImageIcon;
    }
  };

  const Icon = getIcon();

  if (!isAdminMode) {
    // 일반 사용자용 미디어 표시
    return (
      <div className={`media-slot ${className}`}>
        {currentFiles.length > 0 && (
          <div className={slot.type === 'gallery' ? 'grid grid-cols-2 gap-2' : ''}>
            {currentFiles.map((url, index) => (
              <div key={index}>
                {renderMedia(url, index)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`media-slot-admin bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 transition-all ${className}`}>
      {/* 슬롯 정보 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {slot.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {slot.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            slot.priority === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
            slot.priority === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
            slot.priority === 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            P{slot.priority}
          </span>
          
          {slot.type === 'gallery' && slot.maxFiles && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentFiles.length}/{slot.maxFiles}
            </span>
          )}
        </div>
      </div>

      {/* Instagram 스타일 갤러리 헤더 */}
      {currentFiles.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentFiles.length}개 항목
            </span>
            
            {slot.type === 'gallery' && currentFiles.length > 1 && (
              <div className="flex items-center gap-2">
                {isSelectionMode && (
                  <>
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <CheckSquare className="w-3 h-3" />
                      {selectedFiles.length === currentFiles.length ? '전체 해제' : '전체 선택'}
                    </button>
                    
                    {selectedFiles.length > 0 && (
                      <button
                        onClick={handleBatchDelete}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        선택 삭제 ({selectedFiles.length})
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsSelectionMode(false);
                        setSelectedFiles([]);
                      }}
                      className="px-3 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      취소
                    </button>
                  </>
                )}
                
                {!isSelectionMode && (
                  <button
                    onClick={() => setIsSelectionMode(true)}
                    className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    선택
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Instagram 스타일 그리드 */}
          <div className={`${slot.type === 'gallery' ? 'grid grid-cols-3 gap-1' : ''}`}>
            {currentFiles.map((url, index) => (
              <div
                key={index}
                className="relative group animate-fade-in"
              >
                <div 
                  className={`relative overflow-hidden rounded-lg ${
                    slot.type === 'gallery' ? 'aspect-square' : 'h-32'
                  } ${isSelectionMode ? 'cursor-pointer' : ''}`}
                  onClick={isSelectionMode ? () => handleFileToggle(index) : undefined}
                >
                  {renderMedia(url, index)}
                  
                  {/* 선택 체크박스 (Instagram 스타일) */}
                  {isSelectionMode && slot.type === 'gallery' && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                        selectedFiles.includes(index) 
                          ? 'bg-blue-500' 
                          : 'bg-black bg-opacity-30'
                      }`}>
                        {selectedFiles.includes(index) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 개별 삭제 버튼 */}
                  {!isSelectionMode && (
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={slot.type === 'gallery'}
          accept={slot.supportedFormats.map(f => `.${f}`).join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-7 h-7" />
            </button>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {slot.type === 'gallery' ? '사진 추가' : `${slot.type.includes('video') ? '동영상' : '이미지'} 추가`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                드래그 앤 드롭하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                지원 형식: {slot.supportedFormats.join(', ')}
              </p>
              {slot.type === 'gallery' && slot.maxFiles && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  최대 {slot.maxFiles}개 파일
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Google Drive 특별 처리 */}
      {slot.type === 'google-drive-video' && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-2">
            <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Google Drive 동영상 업로드
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Google Drive 동영상의 경우 파일 ID만 입력하세요
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                예: 1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}