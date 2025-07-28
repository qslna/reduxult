'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import SimpleAdminPanel from './SimpleAdminPanel';
import SimpleLoginModal from './SimpleLoginModal';

/**
 * 단순한 플로팅 CMS 버튼
 * 화면 우하단에 고정되어 관리자 패널 접근 제공
 */
export default function SimpleFloatingCMS() {
  const [showPanel, setShowPanel] = useState(false);
  const { isAuthenticated, showLoginModal, setShowLoginModal, login } = useSimpleAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      setShowPanel(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="CMS 관리"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* 로그인 모달 */}
      <SimpleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />

      {/* 관리자 패널 */}
      <SimpleAdminPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </>
  );
}