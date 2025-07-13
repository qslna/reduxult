'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Plus, X, Upload, Loader2, Grid, Layers, 
  Image as ImageIcon, Video, Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import Image from 'next/image';
import { getDefaultImages, uploadImageClient, saveImageToStorage, listImagesClient, deleteImageClient } from '@/lib/imagekit-client';

interface MediaItem {
  url: string;
  fileId: string;
  name: string;
  path: string;
  type?: 'image' | 'video';
  thumbnail?: string;
}

interface StaticGalleryProps {
  /** 갤러리 폴더 경로 */
  folder: string;
  /** 갤러리 레이아웃 */
  layout?: 'grid' | 'stack' | 'masonry' | 'carousel';
  /** 표시할 최대 아이템 수 */
  maxItems?: number;
  /** 갤러리 제목 */
  title?: string;
  /** 커스텀 클래스 */
  className?: string;
  /** 업로드 허용 파일 타입 */
  acceptedTypes?: 'images' | 'videos' | 'all';
  /** 그리드 컬럼 수 */
  columns?: number;
  /** 스택 스타일 */
  stackStyle?: 'default' | 'spread' | 'minimal';
  /** 클릭 시 이동할 URL */
  href?: string;
}

export default function StaticGallery({
  folder,
  layout = 'grid',
  maxItems,
  title,
  className = '',
  acceptedTypes = 'all',
  columns = 3,
  stackStyle = 'default',
  href
}: StaticGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();

  // Hydration 에러 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration 에러 방지: 클라이언트에서만 렌더링
  if (!mounted) {
    return (
      <div className={`min-h-[200px] bg-gray-900/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      </div>
    );
  }

  // 미디어 아이템 가져오기
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 기본 이미지와 로컬 스토리지 이미지 결합
      const defaultImages = getDefaultImages(folder);
      const storedImages = await listImagesClient(folder);
      
      const allImages = [...defaultImages, ...storedImages];
      
      const mediaItems: MediaItem[] = allImages
        .filter((item: any) => {
          const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(item.name);
          const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(item.name) || item.type === 'video';
          
          if (acceptedTypes === 'images') return isImage;
          if (acceptedTypes === 'videos') return isVideo;
          return isImage || isVideo;
        })
        .map((item: any) => {
          const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(item.name) || item.type === 'video';
          return {
            url: item.url,
            fileId: item.fileId,
            name: item.name,
            path: item.path,
            type: isVideo ? 'video' : 'image',
            thumbnail: isVideo ? item.url : item.url
          };
        });
      
      const limitedItems = maxItems ? mediaItems.slice(0, maxItems) : mediaItems;
      setItems(limitedItems);
    } catch (err) {
      console.error('미디어 로드 오류:', err);
      setError('미디어를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [folder, maxItems, acceptedTypes]);

  // 파일 업로드
  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 클라이언트 사이드 업로드 시뮬레이션 (실제로는 ImageKit에 업로드)
        const uploadData = {
          url: URL.createObjectURL(file),
          fileId: `uploaded-${Date.now()}-${i}`,
          name: file.name,
          path: `/${folder}/${file.name}`,
          uploadedAt: new Date().toISOString()
        };

        // 로컬 스토리지에 저장
        saveImageToStorage(uploadData, folder);
      }

      await fetchItems();
    } catch (err) {
      console.error('업로드 오류:', err);
      setError('업로드에 실패했습니다');
    } finally {
      setUploading(false);
    }
  };

  // 아이템 삭제
  const handleDelete = async (fileId: string, itemName: string) => {
    if (!confirm(`'${itemName}'을(를) 삭제하시겠습니까?`)) return;

    try {
      await deleteImageClient(fileId, folder);
      await fetchItems();
    } catch (err) {
      console.error('삭제 오류:', err);
      setError('삭제에 실패했습니다');
    }
  };

  // 비디오 컨트롤
  const toggleVideo = (fileId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleMute = (fileId: string) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const getAcceptAttribute = () => {
    switch (acceptedTypes) {
      case 'images': return 'image/*';
      case 'videos': return 'video/*';
      default: return 'image/*,video/*';
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`;
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4';
      case 'carousel':
        return 'flex gap-4 overflow-x-auto pb-4';
      case 'stack':
        return 'relative w-full max-w-sm mx-auto';
      default:
        return 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const handleContainerClick = () => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
          <p className="text-red-300">{error}</p>
        </div>
        <button 
          onClick={fetchItems}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 스택 레이아웃 렌더링
  if (layout === 'stack') {
    const stackVariants = {
      default: { spread: 15, rotation: 8, scale: 0.95 },
      spread: { spread: 25, rotation: 12, scale: 0.9 },
      minimal: { spread: 8, rotation: 4, scale: 0.98 }
    };
    
    const currentStyle = stackVariants[stackStyle];

    return (
      <div className={className}>
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-center text-white">
            {title}
          </h3>
        )}

        {/* 관리자 업로드 */}
        {isAdmin && (
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptAttribute()}
              multiple
              onChange={(e) => {
                if (e.target.files) handleUpload(e.target.files);
              }}
              className="hidden"
              disabled={uploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="text-sm">
                {uploading ? '업로드 중...' : '미디어 추가'}
              </span>
            </button>
          </div>
        )}

        {/* 스택 갤러리 */}
        <div 
          className="relative w-full aspect-square group cursor-pointer"
          onClick={handleContainerClick}
        >
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center"
              >
                <div className="text-center text-white/50">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">미디어가 없습니다</p>
                </div>
              </motion.div>
            ) : (
              items.map((item, index) => (
                <motion.div
                  key={item.fileId}
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-xl cursor-pointer"
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8,
                    rotate: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: 1 - (index * 0.1), 
                    scale: currentStyle.scale - (index * 0.02),
                    rotate: (index - Math.floor(items.length / 2)) * currentStyle.rotation,
                    x: (index - Math.floor(items.length / 2)) * currentStyle.spread,
                    y: index * 3,
                    zIndex: items.length - index
                  }}
                  whileHover={{ 
                    scale: (currentStyle.scale - (index * 0.02)) * 1.02,
                    transition: { duration: 0.2 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  style={{ zIndex: items.length - index }}
                >
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full bg-black">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  )}
                  
                  {/* 관리자 삭제 버튼 */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.fileId, item.name);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* 호버 오버레이 */}
          {href && (
            <motion.div 
              className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              <span className="text-white font-medium">클릭하여 보기</span>
            </motion.div>
          )}
        </div>

        <div className="text-center mt-4">
          <span className="text-xs text-white/60">
            {items.length}개 미디어
          </span>
        </div>
      </div>
    );
  }

  // 다른 레이아웃들 렌더링 (그리드, 카루셀 등)
  return (
    <div className={className}>
      {title && (
        <h3 className="text-2xl font-bold mb-6 text-center text-white">
          {title}
        </h3>
      )}

      {/* 관리자 업로드 */}
      {isAdmin && (
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptAttribute()}
            multiple
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files);
            }}
            className="hidden"
            disabled={uploading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {uploading ? '업로드 중...' : '미디어 추가'}
          </button>
        </div>
      )}

      {/* 갤러리 그리드 */}
      <div className={getLayoutClasses()}>
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`col-span-full flex items-center justify-center p-12 border-2 border-dashed border-white/30 rounded-lg`}
            >
              <div className="text-center text-white/50">
                <Upload className="w-12 h-12 mx-auto mb-4" />
                <p>미디어가 없습니다</p>
                {isAdmin && (
                  <p className="text-sm mt-2">위의 버튼을 클릭하여 추가하세요</p>
                )}
              </div>
            </motion.div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.fileId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className={`relative group cursor-pointer ${
                  layout === 'carousel' ? 'flex-shrink-0 w-64' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted={mutedVideos.has(item.fileId)}
                        autoPlay={playingVideos.has(item.fileId)}
                        loop
                        playsInline
                      />
                      
                      {/* 비디오 컨트롤 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideo(item.fileId);
                            }}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full"
                          >
                            {playingVideos.has(item.fileId) ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute(item.fileId);
                            }}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full"
                          >
                            {mutedVideos.has(item.fileId) ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* 비디오 아이콘 */}
                      <div className="absolute top-2 left-2">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  )}
                  
                  {/* 관리자 삭제 버튼 */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.fileId, item.name);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
                
                {/* 아이템 정보 */}
                <div className="mt-2">
                  <p className="text-sm text-white/80 truncate">{item.name}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg"
                />
              ) : (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  unoptimized
                />
              )}
              
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}