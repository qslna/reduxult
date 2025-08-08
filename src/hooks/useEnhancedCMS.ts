/**
 * 보안 강화된 CMS Hook
 * 서버사이드 백엔드와 localStorage fallback을 지원하는 개선된 CMS 훅
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cmsBackend, CMSBackendResponse } from '@/lib/cms-backend';

interface UseEnhancedCMSOptions {
  slotId: string;
  initialValue?: string | string[];
  type?: 'single' | 'gallery';
  fallbackToLocal?: boolean;
}

interface EnhancedCMSReturn {
  currentValue: string | string[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isBackendAvailable: boolean;
  handleUpload: (newValue: string | string[]) => Promise<boolean>;
  handleDelete: () => Promise<boolean>;
  refresh: () => Promise<void>;
  syncToLocal: () => Promise<boolean>;
  getBackendHealth: () => Promise<CMSBackendResponse>;
}

export function useEnhancedCMS({
  slotId,
  initialValue,
  type = 'single',
  fallbackToLocal = true
}: UseEnhancedCMSOptions): EnhancedCMSReturn {
  
  const [currentValue, setCurrentValue] = useState<string | string[] | undefined>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setIsError(false);
    setError(null);
  }, []);

  // 백엔드 상태 확인
  const checkBackendHealth = useCallback(async (): Promise<CMSBackendResponse> => {
    try {
      const health = await cmsBackend.checkHealth();
      setIsBackendAvailable(health.success);
      return health;
    } catch (error) {
      setIsBackendAvailable(false);
      return {
        success: false,
        error: 'Backend health check failed'
      };
    }
  }, []);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const result = await cmsBackend.loadData(slotId);
      
      if (result.success && result.data !== null) {
        setCurrentValue(result.data);
        setIsBackendAvailable(true);
      } else if (result.data === null) {
        // 서버에 데이터가 없는 경우 초기값 사용
        setCurrentValue(initialValue);
        setIsBackendAvailable(true);
      } else {
        throw new Error(result.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Enhanced CMS Load Error:', error);
      
      setIsError(true);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsBackendAvailable(false);
      
      // Fallback to localStorage if enabled
      if (fallbackToLocal && typeof window !== 'undefined') {
        const stored = localStorage.getItem(`redux-cms-${slotId}`);
        if (stored) {
          try {
            const parsedData = JSON.parse(stored);
            setCurrentValue(parsedData.data || stored);
          } catch {
            setCurrentValue(stored);
          }
        } else {
          setCurrentValue(initialValue);
        }
      } else {
        setCurrentValue(initialValue);
      }
    } finally {
      setIsLoading(false);
    }
  }, [slotId, initialValue, fallbackToLocal, clearError]);

  // 데이터 업로드/저장
  const handleUpload = useCallback(async (newValue: string | string[]): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const result = await cmsBackend.saveData(slotId, newValue, type);
      
      if (result.success) {
        setCurrentValue(newValue);
        setIsBackendAvailable(true);
        
        // 성공 시 로컬에도 백업 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem(`redux-cms-${slotId}`, JSON.stringify({
            data: newValue,
            type,
            lastModified: new Date().toISOString(),
            backup: true
          }));
        }
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Enhanced CMS Upload Error:', error);
      
      setIsError(true);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setIsBackendAvailable(false);
      
      // Fallback to localStorage if enabled
      if (fallbackToLocal && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`redux-cms-${slotId}`, JSON.stringify({
            data: newValue,
            type,
            lastModified: new Date().toISOString(),
            fallback: true
          }));
          setCurrentValue(newValue);
          return true;
        } catch (fallbackError) {
          console.error('LocalStorage fallback failed:', fallbackError);
        }
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [slotId, type, fallbackToLocal, clearError]);

  // 데이터 삭제
  const handleDelete = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const result = await cmsBackend.deleteData(slotId);
      
      if (result.success) {
        setCurrentValue(initialValue);
        setIsBackendAvailable(true);
        
        // 로컬 스토리지에서도 삭제
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`redux-cms-${slotId}`);
        }
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete data');
      }
    } catch (error) {
      console.error('Enhanced CMS Delete Error:', error);
      
      setIsError(true);
      setError(error instanceof Error ? error.message : 'Delete failed');
      setIsBackendAvailable(false);
      
      // Fallback to localStorage deletion if enabled
      if (fallbackToLocal && typeof window !== 'undefined') {
        localStorage.removeItem(`redux-cms-${slotId}`);
        setCurrentValue(initialValue);
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [slotId, initialValue, fallbackToLocal, clearError]);

  // 데이터 새로고침
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // 서버 데이터를 로컬로 동기화
  const syncToLocal = useCallback(async (): Promise<boolean> => {
    try {
      const result = await cmsBackend.syncToLocal();
      return result.success;
    } catch (error) {
      console.error('Sync to local failed:', error);
      return false;
    }
  }, []);

  // 초기 데이터 로드 및 백엔드 상태 확인
  useEffect(() => {
    const initialize = async () => {
      await checkBackendHealth();
      await loadData();
    };

    initialize();
  }, [checkBackendHealth, loadData]);

  return {
    currentValue,
    isLoading,
    isError,
    error,
    isBackendAvailable,
    handleUpload,
    handleDelete,
    refresh,
    syncToLocal,
    getBackendHealth: checkBackendHealth
  };
}

/**
 * Gallery용 Enhanced CMS Hook
 */
export function useEnhancedGalleryCMS(slotId: string, initialImages: string[] = []) {
  return useEnhancedCMS({
    slotId,
    initialValue: initialImages,
    type: 'gallery',
    fallbackToLocal: true
  });
}

/**
 * Single Image/Video용 Enhanced CMS Hook  
 */
export function useEnhancedSingleCMS(slotId: string, initialUrl?: string) {
  return useEnhancedCMS({
    slotId,
    initialValue: initialUrl,
    type: 'single',
    fallbackToLocal: true
  });
}