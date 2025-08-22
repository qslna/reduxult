'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';
import { useRouter } from 'next/navigation';

/**
 * 모바일 전용 관리자 패널
 * 로그아웃 및 주요 관리 기능 제공
 */
export default function MobileAdminPanel() {
  const { isAuthenticated, logout } = useSimpleAuth();
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 모바일에서만 표시 (768px 이하)
    const checkMobile = () => {
      setIsVisible(window.innerWidth <= 768 && isAuthenticated);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isAuthenticated]);

  if (!isVisible) return null;

  const handleLogout = () => {
    logout();
    setIsPanelOpen(false);
    router.push('/');
  };

  const navigateToAdmin = () => {
    setIsPanelOpen(false);
    router.push('/admin');
  };

  const navigateToPage = (path: string) => {
    setIsPanelOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Floating Admin Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed bottom-6 right-6 z-[1001] w-14 h-14 bg-amber-300 hover:bg-amber-400 text-black rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="관리자 패널 열기"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isPanelOpen ? 'rotate-45' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Mobile Admin Panel */}
      {isPanelOpen && (
        <>
          {/* Backdrop - \uc624\ubc84\ub808\uc774\ub97c \uc218\uc815\ud558\uc5ec \ud22c\uba85\ud558\uac8c \ub9cc\ub4ec */}
          <div 
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPanelOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-white/20 rounded-t-3xl p-6 transform transition-transform duration-300 translate-y-0">
            <div className="flex flex-col space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">관리자 패널</h3>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="w-8 h-8 text-white/60 hover:text-white transition-colors"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={navigateToAdmin}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-center"
                >
                  <svg className="w-6 h-6 text-amber-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-xs font-medium">관리자</span>
                </button>

                <button
                  onClick={() => navigateToPage('/about')}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-center"
                >
                  <svg className="w-6 h-6 text-amber-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white text-xs font-medium">About</span>
                </button>

                <button
                  onClick={() => navigateToPage('/designers')}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-center"
                >
                  <svg className="w-6 h-6 text-amber-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-white text-xs font-medium">Designers</span>
                </button>

                <button
                  onClick={() => navigateToPage('/exhibitions')}
                  className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-center"
                >
                  <svg className="w-6 h-6 text-amber-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-xs font-medium">Exhibitions</span>
                </button>
              </div>

              {/* Logout Button */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>로그아웃</span>
                </button>
              </div>

              {/* Status Info */}
              <div className="text-center pt-2">
                <p className="text-white/50 text-xs">
                  관리자 모드에서 로그인 중
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}