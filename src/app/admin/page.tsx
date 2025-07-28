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
    <div className="min-h-screen bg-black">
      {/* 간단한 헤더 */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-white hover:text-gray-300 transition-colors font-['Playfair_Display'] text-2xl font-bold"
              >
                REDUX
              </button>
              <span className="text-gray-400 font-['Inter'] text-sm">Admin</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors font-['Inter']"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-['Playfair_Display']">관리자 모드</h2>
          <p className="text-gray-400 mb-12 font-['Inter'] max-w-2xl mx-auto">
            각 페이지를 방문하여 이미지와 비디오를 직접 관리할 수 있습니다. 
            각 페이지에서 CMS 기능이 활성화됩니다.
          </p>
          
          {/* 페이지 링크 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/')}
              className="p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">메인 페이지</h3>
              <p className="text-gray-400 text-sm">Hero 섹션 및 디자이너 쇼케이스 관리</p>
            </button>
            
            <button
              onClick={() => router.push('/designers')}
              className="p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">디자이너</h3>
              <p className="text-gray-400 text-sm">디자이너 프로필 및 포트폴리오 관리</p>
            </button>
            
            <button
              onClick={() => router.push('/about')}
              className="p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">About</h3>
              <p className="text-gray-400 text-sm">About 카테고리 갤러리 관리</p>
            </button>
            
            <button
              onClick={() => router.push('/exhibitions')}
              className="p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">전시</h3>
              <p className="text-gray-400 text-sm">전시 갤러리 및 미디어 관리</p>
            </button>
            
            <button
              onClick={() => router.push('/contact')}
              className="p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2 font-['Inter']">연락처</h3>
              <p className="text-gray-400 text-sm">연락처 페이지 콘텐츠 관리</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}