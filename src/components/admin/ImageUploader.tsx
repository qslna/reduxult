'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { uploadImage } from '@/lib/imagekit';
import { cn } from '@/utils/cn';

interface ImageUploaderProps {
  currentImage?: string;
  currentImages?: string[];
  onImageChange?: (url: string) => void;
  onImagesChange?: (urls: string[]) => void;
  folder: string;
  aspectRatio?: 'square' | '3/4' | '16/9' | '4/3';
  multiple?: boolean;
  maxImages?: number;
}

export default function ImageUploader({
  currentImage,
  currentImages = [],
  onImageChange,
  onImagesChange,
  folder,
  aspectRatio = '3/4',
  multiple = false,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    'square': 'aspect-square',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      if (multiple && onImagesChange) {
        // Multiple image upload
        const uploadPromises = Array.from(files).slice(0, maxImages - currentImages.length).map((file) => {
          if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 업로드 가능합니다.');
          }
          return uploadImage(file, folder);
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results
          .filter((result) => result.success && result.url)
          .map((result) => result.url!);

        if (successfulUploads.length > 0) {
          onImagesChange([...currentImages, ...successfulUploads]);
        }

        // Check for any errors
        const failedUploads = results.filter((result) => !result.success);
        if (failedUploads.length > 0) {
          setError(`${failedUploads.length}개의 이미지 업로드 실패`);
        }
      } else if (onImageChange) {
        // Single image upload
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드 가능합니다.');
        }

        const result = await uploadImage(file, folder);
        if (result.success && result.url) {
          onImageChange(result.url);
        } else {
          setError(result.error || '업로드 실패');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류 발생');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    if (multiple && onImagesChange) {
      const newImages = [...currentImages];
      newImages.splice(index, 1);
      onImagesChange(newImages);
    }
  };

  // Single image mode
  if (!multiple) {
    return (
      <div className="space-y-4">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg bg-gray-900 transition-all cursor-pointer',
            aspectRatioClasses[aspectRatio],
            dragOver && 'ring-2 ring-white ring-offset-2 ring-offset-black',
            uploading && 'opacity-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentImage ? (
            <>
              <Image
                src={currentImage}
                alt="Current image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">클릭하여 변경</p>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Upload className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">이미지를 드래그하거나</p>
                <p className="text-sm">클릭하여 업로드</p>
              </div>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // Multiple images mode
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-900 group',
              aspectRatioClasses[aspectRatio]
            )}
          >
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {currentImages.length < maxImages && (
          <div
            className={cn(
              'relative overflow-hidden rounded-lg bg-gray-900 border-2 border-dashed border-gray-700 transition-all cursor-pointer',
              aspectRatioClasses[aspectRatio],
              dragOver && 'ring-2 ring-white ring-offset-2 ring-offset-black',
              uploading && 'opacity-50'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">이미지 추가</p>
                <p className="text-xs">{currentImages.length}/{maxImages}</p>
              </div>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={uploading}
      />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}