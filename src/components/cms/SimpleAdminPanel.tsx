'use client';

import { useState } from 'react';
import { Settings, X, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { useSimpleAuth } from '../../hooks/useSimpleAuth';
import { useAllCMSSlots } from '../../hooks/useSimpleCMS';
import SimpleLoginModal from './SimpleLoginModal';

interface SimpleAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 단순하고 직관적인 관리자 패널
 * - 모든 CMS 슬롯 한눈에 보기
 * - 빠른 삭제 기능
 * - 실시간 미리보기
 */
export default function SimpleAdminPanel({ isOpen, onClose }: SimpleAdminPanelProps) {
  const [previewMode, setPreviewMode] = useState(true);
  const { isAuthenticated, showLoginModal, setShowLoginModal, login, logout } = useSimpleAuth();
  const allSlots = useAllCMSSlots();

  // 인증되지 않은 경우 로그인 모달 표시
  if (!isAuthenticated) {
    return (
      <SimpleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    );
  }

  const slotCount = Object.keys(allSlots).length;

  const handleClearAll = () => {
    if (window.confirm('정말 모든 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('redux-cms-')) {
            localStorage.removeItem(key);
          }
        });
        window.location.reload(); // 페이지 새로고침으로 변경사항 반영
      }
    }
  };

  const handleSlotDelete = (slotId: string) => {
    if (window.confirm(`${slotId} 슬롯의 이미지를 삭제하시겠습니까?`)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`redux-cms-${slotId}`);
        window.location.reload(); // 페이지 새로고침으로 변경사항 반영
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl overflow-hidden animate-slide-in-right">
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-gray-700" />
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      간단 CMS 관리
                    </h1>
                    <p className="text-sm text-gray-600">
                      {slotCount}개의 이미지 슬롯
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={previewMode ? '미리보기 숨기기' : '미리보기 보이기'}
                  >
                    {previewMode ? (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="로그아웃"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="닫기"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* 전체 삭제 버튼 */}
              {slotCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  모든 이미지 삭제
                </button>
              )}
            </div>

            {/* 콘텐츠 */}
            <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
              {slotCount === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    아직 업로드된 이미지가 없습니다
                  </h3>
                  <p className="text-gray-600 text-sm">
                    각 페이지에서 이미지를 업로드하면 여기에 표시됩니다
                  </p>
                </div>
              ) : (
                Object.entries(allSlots).map(([slotId, url]) => (
                  <div
                    key={slotId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fade-in"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {slotId}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {url}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleSlotDelete(slotId)}
                        className="ml-2 p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {previewMode && (
                      <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                        {url.includes('video') || url.endsWith('.mp4') ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={url}
                            alt={slotId}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}