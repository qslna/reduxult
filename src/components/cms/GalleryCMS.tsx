'use client';

import { useState } from 'react';
import { X, Plus, Upload, Grid, Move } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface GalleryCMSProps {
  slotId: string;
  currentImages: string[];
  onUpload: (url: string) => void;
  onDelete: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  isAdminMode: boolean;
  className?: string;
  maxImages?: number;
}

export default function GalleryCMS({
  slotId,
  currentImages,
  onUpload,
  onDelete,
  onReorder,
  isAdminMode,
  className = '',
  maxImages = 50
}: GalleryCMSProps) {
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpload = () => {
    if (uploadUrl.trim() && currentImages.length < maxImages) {
      onUpload(uploadUrl.trim());
      setUploadUrl('');
      setIsUploadMode(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && onReorder && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  if (!isAdminMode) {
    return null;
  }

  return (
    <div className={`gallery-cms ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid size={16} className="text-amber-300" />
          <span className="text-sm font-medium text-white">
            갤러리 관리 ({currentImages.length}/{maxImages})
          </span>
        </div>
        <button
          onClick={() => setIsUploadMode(!isUploadMode)}
          className="flex items-center gap-1 px-3 py-1 bg-amber-300/20 hover:bg-amber-300/30 rounded text-xs text-amber-300 transition-colors"
        >
          <Plus size={12} />
          추가
        </button>
      </div>

      {/* 업로드 모드 */}
      {isUploadMode && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Upload size={14} className="text-amber-300" />
            <span className="text-xs text-white">이미지 URL 추가</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              placeholder="이미지 URL을 입력하세요..."
              className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:border-amber-300 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleUpload()}
            />
            <button
              onClick={handleUpload}
              disabled={!uploadUrl.trim() || currentImages.length >= maxImages}
              className="px-3 py-2 bg-amber-300 hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs text-black font-medium transition-colors"
            >
              추가
            </button>
          </div>
        </div>
      )}

      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
        {currentImages.map((image, index) => (
          <div
            key={`${slotId}-${index}`}
            className="relative group cursor-move"
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="aspect-square bg-gray-800 rounded overflow-hidden">
              <OptimizedImage
                src={image}
                alt={`Gallery ${index + 1}`}
                fill={true}
                sizes="64px"
                className="object-cover"
              />
            </div>
            
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => onDelete(index)}
                  className="p-1 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
                  title="삭제"
                >
                  <X size={12} />
                </button>
                <div className="p-1 bg-gray-700 rounded text-white" title="이동">
                  <Move size={12} />
                </div>
              </div>
            </div>
            
            {/* 인덱스 */}
            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* 빈 슬롯들 */}
        {currentImages.length < 8 && [...Array(Math.min(8 - currentImages.length, maxImages - currentImages.length))].map((_, index) => (
          <div
            key={`empty-${index}`}
            className="aspect-square bg-gray-800/30 border-2 border-dashed border-gray-600 rounded flex items-center justify-center"
          >
            <Plus size={16} className="text-gray-500" />
          </div>
        ))}
      </div>

      {/* 안내 메시지 */}
      {currentImages.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Grid size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">갤러리가 비어있습니다</p>
          <p className="text-xs">이미지를 추가해보세요</p>
        </div>
      )}
      
      {currentImages.length > 0 && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          드래그하여 순서 변경 가능
        </div>
      )}
    </div>
  );
}