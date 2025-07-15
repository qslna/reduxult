'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 간단한 인증 (실제로는 서버 인증 필요)
    if (password === 'redux2024') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    onClose();
  };

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isAuthenticated ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관리자 비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-white/30 focus:outline-none transition-colors"
                        placeholder="비밀번호를 입력하세요"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    로그인
                  </button>
                </form>
              ) : (
                // Admin Content
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">콘텐츠 관리</h3>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>

                  {/* Upload Section */}
                  <div className="border border-white/10 rounded-lg p-6">
                    <h4 className="text-lg font-medium mb-4">이미지 업로드</h4>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                      <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400 mb-2">
                        클릭하거나 드래그하여 이미지를 업로드하세요
                      </p>
                      <p className="text-sm text-gray-500">
                        지원 형식: JPG, PNG, WebP (최대 10MB)
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <div className="text-left">
                        <h5 className="font-medium mb-1">디자이너 관리</h5>
                        <p className="text-sm text-gray-400">
                          프로필 이미지 및 포트폴리오 수정
                        </p>
                      </div>
                    </button>
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <div className="text-left">
                        <h5 className="font-medium mb-1">프로젝트 관리</h5>
                        <p className="text-sm text-gray-400">
                          프로젝트 이미지 및 정보 수정
                        </p>
                      </div>
                    </button>
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <div className="text-left">
                        <h5 className="font-medium mb-1">About 섹션</h5>
                        <p className="text-sm text-gray-400">
                          카테고리별 이미지 관리
                        </p>
                      </div>
                    </button>
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <div className="text-left">
                        <h5 className="font-medium mb-1">Fashion Film</h5>
                        <p className="text-sm text-gray-400">
                          비디오 링크 및 썸네일 관리
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                      <strong>사용 방법:</strong> 각 페이지에서 편집 모드를 활성화하면 
                      이미지를 직접 클릭하여 교체하거나 삭제할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}