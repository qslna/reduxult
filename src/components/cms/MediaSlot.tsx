'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Upload, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { MediaSlot as MediaSlotType } from '@/lib/cms-config';

interface MediaSlotProps {
  slot: MediaSlotType;
  isAdminMode?: boolean;
  onFileUpdate?: (slotId: string, files: string[]) => void;
  className?: string;
}

export default function MediaSlot({ 
  slot, 
  isAdminMode = false, 
  onFileUpdate,
  className = '' 
}: MediaSlotProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
        newFiles = [...slot.currentFiles, ...uploadedUrls];
        if (slot.maxFiles && newFiles.length > slot.maxFiles) {
          newFiles = newFiles.slice(-slot.maxFiles);
        }
      } else {
        newFiles = [uploadedUrls[0]];
      }

      onFileUpdate?.(slot.id, newFiles);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [slot, onFileUpdate]);

  const handleFileRemove = useCallback((index: number) => {
    const newFiles = slot.currentFiles.filter((_, i) => i !== index);
    onFileUpdate?.(slot.id, newFiles);
  }, [slot, onFileUpdate]);

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
        {slot.currentFiles.length > 0 && (
          <div className={slot.type === 'gallery' ? 'grid grid-cols-2 gap-2' : ''}>
            {slot.currentFiles.map((url, index) => (
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
              {slot.currentFiles.length}/{slot.maxFiles}
            </span>
          )}
        </div>
      </div>

      {/* 현재 파일들 */}
      {slot.currentFiles.length > 0 && (
        <div className={`mb-3 ${slot.type === 'gallery' ? 'grid grid-cols-3 gap-2' : ''}`}>
          {slot.currentFiles.map((url, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {renderMedia(url, index)}
              
              {/* 삭제 버튼 */}
              <button
                onClick={() => handleFileRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Minus className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
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
              className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {slot.type === 'gallery' ? 'Add images' : `Add ${slot.type.includes('video') ? 'video' : 'image'}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                {slot.supportedFormats.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Google Drive 특별 처리 */}
      {slot.type === 'google-drive-video' && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Google Drive 동영상의 경우 파일 ID만 입력하세요
          </p>
        </div>
      )}
    </div>
  );
}