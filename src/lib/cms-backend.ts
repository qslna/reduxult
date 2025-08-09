/**
 * 보안 강화된 CMS 백엔드 시스템
 * localStorage 취약점을 해결하기 위한 서버사이드 데이터 저장소
 */

export interface CMSData {
  slotId: string;
  data: string | string[];
  type: 'single' | 'gallery';
  lastModified: string;
  version: number;
}

export interface CMSBackendResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class CMSBackend {
  private baseUrl: string;
  private isServerSide: boolean;

  constructor() {
    this.isServerSide = typeof window === 'undefined';
    this.baseUrl = this.isServerSide 
      ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      : '';
  }

  /**
   * 서버사이드 데이터 저장 (API 경유)
   */
  async saveData(slotId: string, data: string | string[], type: 'single' | 'gallery' = 'single'): Promise<CMSBackendResponse> {
    try {
      const response = await fetch('/api/cms/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId,
          data,
          type,
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save data');
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('CMS Backend Save Error:', error);
      
      // Fallback to localStorage for development/offline use
      if (!this.isServerSide) {
        return this.fallbackToLocalStorage('save', slotId, data, type);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 서버사이드 데이터 로드 (API 경유)
   */
  async loadData(slotId: string): Promise<CMSBackendResponse> {
    try {
      const response = await fetch(`/api/cms/load?slotId=${encodeURIComponent(slotId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('CMS Backend Load Error:', error);
      
      // Fallback to localStorage for development/offline use
      if (!this.isServerSide) {
        return this.fallbackToLocalStorage('load', slotId);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 모든 CMS 데이터 로드
   */
  async loadAllData(): Promise<CMSBackendResponse> {
    try {
      const response = await fetch('/api/cms/load-all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load all data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('CMS Backend Load All Error:', error);
      
      // Fallback to localStorage
      if (!this.isServerSide) {
        return this.fallbackToLocalStorage('loadAll');
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 데이터 삭제
   */
  async deleteData(slotId: string): Promise<CMSBackendResponse> {
    try {
      const response = await fetch('/api/cms/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId,
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete data');
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('CMS Backend Delete Error:', error);
      
      // Fallback to localStorage
      if (!this.isServerSide) {
        return this.fallbackToLocalStorage('delete', slotId);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * localStorage fallback (개발 환경 또는 오프라인 시)
   */
  private fallbackToLocalStorage(
    action: 'save' | 'load' | 'loadAll' | 'delete', 
    slotId?: string, 
    data?: string | string[], 
    type?: 'single' | 'gallery'
  ): CMSBackendResponse {
    const STORAGE_PREFIX = 'redux-cms-';
    
    try {
      switch (action) {
        case 'save':
          if (!slotId || data === undefined) {
            throw new Error('Missing slotId or data for save operation');
          }
          
          const saveData: CMSData = {
            slotId,
            data,
            type: type || 'single',
            lastModified: new Date().toISOString(),
            version: 1
          };
          
          localStorage.setItem(STORAGE_PREFIX + slotId, JSON.stringify(saveData));
          
          return {
            success: true,
            data: saveData
          };

        case 'load':
          if (!slotId) {
            throw new Error('Missing slotId for load operation');
          }
          
          const stored = localStorage.getItem(STORAGE_PREFIX + slotId);
          if (!stored) {
            return {
              success: false,
              error: 'Data not found'
            };
          }
          
          const parsedData: CMSData = JSON.parse(stored);
          
          return {
            success: true,
            data: parsedData.data
          };

        case 'loadAll':
          const allData: Record<string, any> = {};
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
              const slotKey = key.replace(STORAGE_PREFIX, '');
              const stored = localStorage.getItem(key);
              if (stored) {
                const parsedData: CMSData = JSON.parse(stored);
                allData[slotKey] = parsedData.data;
              }
            }
          }
          
          return {
            success: true,
            data: allData
          };

        case 'delete':
          if (!slotId) {
            throw new Error('Missing slotId for delete operation');
          }
          
          localStorage.removeItem(STORAGE_PREFIX + slotId);
          
          return {
            success: true,
            data: { deleted: true }
          };

        default:
          throw new Error('Unknown action');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LocalStorage fallback error'
      };
    }
  }

  /**
   * 데이터 동기화 (서버 → 로컬)
   */
  async syncToLocal(): Promise<CMSBackendResponse> {
    const allDataResult = await this.loadAllData();
    
    if (!allDataResult.success || !allDataResult.data) {
      return allDataResult;
    }

    try {
      // 서버 데이터를 로컬에 동기화
      Object.entries(allDataResult.data).forEach(([slotId, data]) => {
        const saveData: CMSData = {
          slotId,
          data: data as string | string[],
          type: Array.isArray(data) ? 'gallery' : 'single',
          lastModified: new Date().toISOString(),
          version: 1
        };
        
        localStorage.setItem(`redux-cms-${slotId}`, JSON.stringify(saveData));
      });

      return {
        success: true,
        data: { synced: Object.keys(allDataResult.data).length }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync error'
      };
    }
  }

  /**
   * 백엔드 상태 확인
   */
  async checkHealth(): Promise<CMSBackendResponse> {
    try {
      const response = await fetch('/api/cms/health', {
        method: 'GET',
      });

      const result = await response.json();
      
      return {
        success: response.ok && result.success,
        data: result.data || result
      };
    } catch (error) {
      return {
        success: false,
        error: 'Backend not available, using localStorage fallback'
      };
    }
  }
}

// Singleton instance
export const cmsBackend = new CMSBackend();

/**
 * React Hook for CMS Backend
 */
export function useCMSBackend() {
  return {
    saveData: cmsBackend.saveData.bind(cmsBackend),
    loadData: cmsBackend.loadData.bind(cmsBackend),
    loadAllData: cmsBackend.loadAllData.bind(cmsBackend),
    deleteData: cmsBackend.deleteData.bind(cmsBackend),
    syncToLocal: cmsBackend.syncToLocal.bind(cmsBackend),
    checkHealth: cmsBackend.checkHealth.bind(cmsBackend)
  };
}

export default cmsBackend;