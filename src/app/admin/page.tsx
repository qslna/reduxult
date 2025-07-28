'use client';

import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import SimpleLoginModal from '@/components/cms/SimpleLoginModal';
import { Shield, LogOut } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, showLoginModal, setShowLoginModal, login, logout } = useSimpleAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-['Playfair_Display']">REDUX Admin</h1>
          <p className="text-gray-400 mb-8 font-['Inter']">관리자 권한으로 로그인하여 콘텐츠를 관리하세요</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-['Inter'] font-medium"
          >
            로그인
          </button>
        </div>

        <SimpleLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={login}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 font-['Playfair_Display']">관리자 모드 활성화</h1>
        <p className="text-gray-400 mb-8 font-['Inter']">
          관리자 권한으로 로그인되었습니다.<br />
          각 페이지에서 이미지 및 동영상 관리가 가능합니다.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-['Inter'] font-medium"
          >
            메인페이지로 이동
          </button>
          
          <button
            onClick={logout}
            className="w-full px-8 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-colors font-['Inter'] font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}