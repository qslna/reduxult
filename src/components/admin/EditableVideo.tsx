'use client';

import { useState, useRef } from 'react';
import { Edit3, Upload, Loader2 } from 'lucide-react';

interface EditableVideoProps {
  src: string;
  className?: string;
  category?: string;
  enableCMS?: boolean;
  onUpdate?: (newSrc: string) => void;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function EditableVideo({
  src,
  className = '',
  category = 'general',
  enableCMS = false,
  onUpdate,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false
}: EditableVideoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoClick = () => {
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
      onUpdate?.(result.url);
      setIsEditing(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('비디오 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="editable-video-container relative group">
      <video
        src={src}
        className={`${className} ${enableCMS ? 'cursor-pointer' : ''}`}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onClick={handleVideoClick}
      />

      {/* CMS Edit Overlay */}
      {enableCMS && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleVideoClick}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="비디오 변경"
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
                비디오 변경
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
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
                        새 비디오 선택
                      </button>
                      <p className="text-sm text-gray-500">MP4, WebM, MOV 지원</p>
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