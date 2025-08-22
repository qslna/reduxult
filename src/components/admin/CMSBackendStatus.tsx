/**
 * CMS 백엔드 상태 모니터링 컴포넌트
 * 보안 강화된 백엔드의 상태와 성능을 실시간으로 확인
 */

'use client';

import { useState, useEffect } from 'react';
import { Server, Database, AlertCircle, CheckCircle, RefreshCw, Cloud } from 'lucide-react';
import { cmsBackend, CMSBackendResponse } from '../../lib/cms-backend';

interface BackendHealthData {
  server: {
    status: string;
    uptime: number;
    uptimeReadable: string;
    memory: {
      used: string;
      total: string;
      external: string;
    };
  };
  cms: {
    totalSlots: number;
    storageType: string;
    lastCheck: string;
  };
}

export default function CMSBackendStatus() {
  const [healthData, setHealthData] = useState<BackendHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  // 백엔드 상태 확인
  const checkBackendHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cmsBackend.checkHealth();
      
      if (response.success && response.data) {
        setHealthData(response.data);
        setIsBackendOnline(true);
        setLastChecked(new Date().toLocaleTimeString());
        setError(null);
        console.log('✅ CMS 백엔드 상태 정상:', response.data);
      } else {
        // 백엔드가 없어도 앱이 작동하도록 graceful fallback
        setIsBackendOnline(false);
        setHealthData(null);
        setError('백엔드 오프라인 - localStorage 모드로 작동 중');
        console.warn('⚠️ CMS 백엔드 응답 문제:', response);
      }
    } catch (err) {
      // 네트워크 에러나 기타 에러도 graceful 처리
      setIsBackendOnline(false);
      setHealthData(null);
      setError('백엔드 연결 불가 - 로컬 저장소 모드');
      console.warn('CMS Backend unavailable, using fallback mode:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 동기화
  const handleSync = async () => {
    try {
      const result = await cmsBackend.syncToLocal();
      if (result.success) {
        alert('데이터 동기화가 완료되었습니다.');
        await checkBackendHealth(); // 상태 새로고침
      } else {
        alert('동기화 실패: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('동기화 오류: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // 자동 상태 확인 (30초마다)
  useEffect(() => {
    checkBackendHealth();
    
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !healthData) {
    return (
      <div 
        className="bg-gray-900 rounded-lg p-6 animate-fade-in"
      >
        <div className="flex items-center space-x-2 mb-4">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <h3 className="text-lg font-semibold text-white">백엔드 상태 확인 중...</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-900 rounded-lg p-6 space-y-4 animate-fade-in"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">CMS 백엔드 상태</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={checkBackendHealth}
            disabled={isLoading}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
            title="상태 새로고침"
          >
            <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSync}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition-colors"
            title="서버 데이터를 로컬로 동기화"
          >
            <Cloud className="w-4 h-4 inline mr-1" />
            동기화
          </button>
        </div>
      </div>

      {/* 백엔드 상태 */}
      <div className="flex items-center space-x-2">
        {isBackendOnline ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        
        <span className="text-white">
          백엔드: <span className={`font-medium ${isBackendOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isBackendOnline ? 'Online' : 'Offline'}
          </span>
        </span>
        
        {lastChecked && (
          <span className="text-gray-400 text-sm">
            (마지막 확인: {lastChecked})
          </span>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 백엔드가 오프라인일 때 */}
      {!isBackendOnline && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm">
              백엔드가 오프라인입니다. localStorage fallback을 사용 중입니다.
            </span>
          </div>
        </div>
      )}

      {/* 서버 정보 */}
      {healthData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 서버 상태 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Server className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-medium text-white">서버</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">상태:</span>
                <span className="text-white">{healthData.server.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">가동시간:</span>
                <span className="text-white">{healthData.server.uptimeReadable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">메모리 사용:</span>
                <span className="text-white">{healthData.server.memory.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">전체 메모리:</span>
                <span className="text-white">{healthData.server.memory.total}</span>
              </div>
            </div>
          </div>

          {/* CMS 정보 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Database className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-medium text-white">CMS</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">총 슬롯:</span>
                <span className="text-white">{healthData.cms.totalSlots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">저장소 타입:</span>
                <span className="text-white capitalize">{healthData.cms.storageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">마지막 확인:</span>
                <span className="text-white text-xs">
                  {new Date(healthData.cms.lastCheck).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 권장사항 */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-300 mb-2">💡 권장사항</h4>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• 프로덕션 환경에서는 Vercel KV 또는 데이터베이스 사용 권장</li>
          <li>• 정기적으로 데이터 동기화를 수행하세요</li>
          <li>• 백엔드 오프라인 시 데이터 손실 위험이 있습니다</li>
        </ul>
      </div>
    </div>
  );
}