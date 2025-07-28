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