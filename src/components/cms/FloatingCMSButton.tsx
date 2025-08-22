'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import LazyCMSManager from './LazyCMSManager';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';
import { measureChunkLoading } from '../../utils/performanceMonitor';

export default function FloatingCMSButton() {
  const [showCMS, setShowCMS] = useState(false);
  const { requestAdminAccess } = useSimpleAuth();

  const handleCMSOpen = async () => {
    requestAdminAccess();
    
    // 성능 모니터링과 함께 CMS 매니저 열기
    try {
      await measureChunkLoading('cms-manager', async () => {
        // CMS 매니저가 로드되기 전에 상태 업데이트
        setShowCMS(true);
        return Promise.resolve();
      });
    } catch (error) {
      console.warn('CMS Manager loading failed:', error);
      setShowCMS(true); // 에러가 있어도 UI는 표시
    }
  };

  const handleCMSClose = () => {
    setShowCMS(false);
  };

  return (
    <>
      {/* Floating CMS Button */}
      <button
        onClick={handleCMSOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group animate-scale-in-delayed"
        aria-label="Open CMS Manager"
      >
        <Settings className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          CMS 관리
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>

      {/* CMS Manager - 지연 로딩됨 */}
      <LazyCMSManager isOpen={showCMS} onClose={handleCMSClose} />
    </>
  );
}