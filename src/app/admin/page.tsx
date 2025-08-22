'use client';

import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';
import SimpleLoginModal from '../../components/cms/SimpleLoginModal';
import CMSBackendStatus from '../../components/admin/CMSBackendStatus';
import { Shield, LogOut, Server } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

// CMS 상태 컴포넌트 에러 시 대체 컴포넌트
function CMSStatusFallback() {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Server className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">CMS 백엔드 상태</h3>
      </div>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-3">
        <p className="text-yellow-300 text-sm">
          백엔드 상태를 확인할 수 없습니다. 로컬 저장소 모드로 작동 중입니다.
        </p>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-['Playfair_Display']">REDUX 관리자 패널</h1>
          <p className="text-gray-400 mb-8 font-['Inter']">
            관리자 권한으로 로그인되었습니다. 시스템 상태를 확인하고 콘텐츠를 관리하세요.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-['Inter'] font-medium"
            >
              메인페이지로 이동
            </button>
            
            <button
              onClick={logout}
              className="px-8 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-colors font-['Inter'] font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* CMS 백엔드 상태 - 에러 방지 */}
        <div className="mb-8">
          <ErrorBoundary fallback={<CMSStatusFallback />}>
            <CMSBackendStatus />
          </ErrorBoundary>
        </div>

        {/* 추가 관리 기능들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">콘텐츠 관리</h3>
            <p className="text-gray-400 text-sm mb-4">각 페이지에서 이미지 및 동영상을 관리할 수 있습니다.</p>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/designers')}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
              >
                디자이너 프로필
              </button>
              <button 
                onClick={() => router.push('/about')}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
              >
                About 섹션
              </button>
              <button 
                onClick={() => router.push('/exhibitions')}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
              >
                전시 갤러리
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">시스템 정보</h3>
            <p className="text-gray-400 text-sm mb-4">현재 시스템의 상태와 정보를 확인합니다.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">버전:</span>
                <span className="text-white">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">환경:</span>
                <span className="text-white">{process.env.NODE_ENV}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">빌드:</span>
                <span className="text-white">Production</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">보안 상태</h3>
            <p className="text-gray-400 text-sm mb-4">시스템 보안 상태를 확인합니다.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">관리자 인증</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white">백엔드 보안</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">HTTPS 연결</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}