'use client';

import { useState, useEffect } from 'react';

interface CMSSlot {
  id: string;
  url?: string;
  type: 'image' | 'video' | 'any';
  label: string;
}

/**
 * 간단한 CMS 상태 관리 Hook
 * 로컬 스토리지에 저장하여 새로고침 시에도 유지
 */
export function useSimpleCMS(slotId: string, initialUrl?: string) {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(initialUrl);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지 키
  const storageKey = `redux-cms-${slotId}`;

  // 초기화 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          // 기존 JSON 형태이면 파싱, 아니면 직접 URL로 사용
          if (stored.startsWith('{')) {
            const data = JSON.parse(stored);
            setCurrentUrl(data.url);
          } else {
            setCurrentUrl(stored);
          }
        } catch (error) {
          // JSON 파싱 실패 시 직접 URL로 사용
          setCurrentUrl(stored);
        }
      }
    }
  }, [storageKey]);

  // URL 업데이트
  const updateUrl = (newUrl: string) => {
    setCurrentUrl(newUrl);
    
    // 로컬 스토리지에 직접 URL 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newUrl);
    }
  };

  // URL 삭제
  const deleteUrl = () => {
    setCurrentUrl(undefined);
    
    // 로컬 스토리지에서 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  // 모든 CMS 데이터 초기화 (관리자용)
  const clearAllCMS = () => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('redux-cms-')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // 파일 업로드 핸들러 (URL 받아서 저장)
  const handleUpload = (url: string) => {
    updateUrl(url);
  };

  // 파일 삭제 핸들러
  const handleDelete = () => {
    deleteUrl();
  };

  return {
    currentUrl,
    updateUrl,
    deleteUrl,
    clearAllCMS,
    isLoading,
    setIsLoading,
    handleUpload,
    handleDelete
  };
}

/**
 * 갤러리 타입 CMS Hook (다중 이미지 관리)
 */
export function useGalleryCMS(slotId: string, initialImages?: string[]) {
  const [currentImages, setCurrentImages] = useState<string[]>(initialImages || []);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지 키
  const storageKey = `redux-gallery-${slotId}`;

  // 초기화 시 로컬 스토리지에서 갤러리 데이터 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            setCurrentImages(data);
          }
        } catch (error) {
          console.warn('Failed to parse gallery data:', error);
        }
      }
    }
  }, [storageKey]);

  // 갤러리 업데이트
  const updateGallery = (newImages: string[]) => {
    setCurrentImages(newImages);
    
    // 로컬 스토리지에 갤러리 데이터 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newImages));
    }
  };

  // 이미지 추가
  const addImage = (url: string) => {
    const newImages = [...currentImages, url];
    updateGallery(newImages);
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    updateGallery(newImages);
  };

  // 이미지 순서 변경
  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...currentImages];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    updateGallery(newImages);
  };

  // 갤러리 초기화
  const clearGallery = () => {
    setCurrentImages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  // 파일 업로드 핸들러 (갤러리에 추가)
  const handleUpload = (url: string) => {
    try {
      console.log(`useGalleryCMS handleUpload for ${slotId}:`, url);
      if (url && url.trim() !== '') {
        addImage(url.trim());
        console.log(`Upload successful for ${slotId}, new images:`, currentImages.length + 1);
      } else {
        console.error('Invalid URL provided to handleUpload:', url);
      }
    } catch (error) {
      console.error('Error in handleUpload:', error);
    }
  };

  // 파일 삭제 핸들러
  const handleDelete = (index?: number) => {
    try {
      console.log(`useGalleryCMS handleDelete for ${slotId}:`, index);
      if (typeof index === 'number') {
        removeImage(index);
        console.log(`Delete successful for ${slotId}, remaining images:`, currentImages.length - 1);
      } else {
        clearGallery();
        console.log(`Gallery cleared for ${slotId}`);
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  return {
    currentImages,
    updateGallery,
    addImage,
    removeImage,
    reorderImages,
    clearGallery,
    isLoading,
    setIsLoading,
    handleUpload,
    handleDelete
  };
}

/**
 * 모든 CMS 슬롯 정보를 가져오는 Hook
 */
export function useAllCMSSlots() {
  const [slots, setSlots] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      const cmsSlots: Record<string, string> = {};
      
      keys.forEach(key => {
        if (key.startsWith('redux-cms-')) {
          try {
            const stored = localStorage.getItem(key) || '';
            const slotId = key.replace('redux-cms-', '');
            
            // JSON 형태이면 파싱, 아니면 직접 URL로 사용
            if (stored.startsWith('{')) {
              const data = JSON.parse(stored);
              cmsSlots[slotId] = data.url;
            } else {
              cmsSlots[slotId] = stored;
            }
          } catch (error) {
            // JSON 파싱 실패 시 직접 URL로 사용
            const stored = localStorage.getItem(key) || '';
            const slotId = key.replace('redux-cms-', '');
            cmsSlots[slotId] = stored;
          }
        }
      });
      
      setSlots(cmsSlots);
    }
  }, []);

  return slots;
}