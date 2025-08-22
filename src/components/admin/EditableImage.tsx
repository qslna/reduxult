'use client';

import { useState, useRef } from 'react';
import { Edit3, Upload, Loader2 } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  category?: string;
  enableCMS?: boolean;
  onImageUpdate?: (newSrc: string) => void;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function EditableImage({
  src,
  alt,
  className = '',
  sizes,
  category = 'general',
  enableCMS = false,
  onImageUpdate,
  width,
  height,
  priority = false
}: EditableImageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (enableCMS) {
      setIsEditing(true);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('folder', `/redux/${category}`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onImageUpdate?.(result.url);
      setIsEditing(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="editable-image-container relative group">
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`${className} ${enableCMS ? 'cursor-pointer' : ''}`}
        onClick={handleImageClick}
      />

      {/* CMS Edit Overlay */}
      {enableCMS && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleImageClick}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="이미지 변경"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in"
          >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                이미지 변경
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">업로드 중...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        새 이미지 선택
                      </button>
                      <p className="text-sm text-gray-500">JPG, PNG, WebP 지원</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}