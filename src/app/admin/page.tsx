'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Image, 
  Video, 
  Users, 
  BarChart3, 
  Shield,
  Database,
  Monitor,
  Palette,
  Upload,
  Download
} from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import SimpleLoginModal from '@/components/cms/SimpleLoginModal';
import { getCMSStats } from '@/lib/cms-config';
import { db } from '@/lib/db';

export default function AdminPage() {
  const { isAuthenticated, showLoginModal, setShowLoginModal, login, logout } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [dbStats, setDbStats] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const cmsStats = getCMSStats();
      const databaseStats = await db.getStats();
      setStats(cmsStats);
      setDbStats(databaseStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">REDUX Admin</h1>
          <p className="text-gray-400 mb-6">관리자 권한이 필요합니다</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

  const adminTabs = [
    { id: 'dashboard', name: '대시보드', icon: BarChart3 },
    { id: 'media', name: '미디어 관리', icon: Image },
    { id: 'content', name: '콘텐츠 관리', icon: Monitor },
    { id: 'users', name: '사용자 관리', icon: Users },
    { id: 'settings', name: '설정', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">REDUX Admin</h1>
                <p className="text-sm text-gray-400">콘텐츠 관리 시스템</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <nav className="w-64 bg-gray-800 min-h-[calc(100vh-80px)]">
          <div className="p-4">
            <div className="space-y-2">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">대시보드</h2>
                
                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats && (
                    <>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Database className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">총 미디어 슬롯</p>
                            <p className="text-2xl font-bold text-white">{stats.totalSlots}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">이미지 슬롯</p>
                            <p className="text-2xl font-bold text-white">{stats.byType['single-image'] + stats.byType['gallery']}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">비디오 슬롯</p>
                            <p className="text-2xl font-bold text-white">{stats.byType['single-video'] + stats.byType['google-drive-video']}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">우선순위 1</p>
                            <p className="text-2xl font-bold text-white">{stats.byPriority[1]}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 카테고리별 통계 */}
                {stats && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">카테고리별 슬롯 분포</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(stats.byCategory).map(([category, count]) => (
                        <div key={category} className="text-center">
                          <p className="text-2xl font-bold text-blue-400">{count as number}</p>
                          <p className="text-sm text-gray-400 capitalize">{category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">미디어 관리</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-300 text-center py-8">
                    미디어 관리 기능은 각 페이지의 CMS 인터페이스를 통해 이용할 수 있습니다.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      메인 페이지로 이동
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">콘텐츠 관리</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-300 text-center py-8">
                    콘텐츠 관리 기능이 곧 추가됩니다.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">사용자 관리</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-300 text-center py-8">
                    현재 단일 관리자 계정만 지원됩니다.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">설정</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        사이트 테마
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option value="dark">다크</option>
                        <option value="light">라이트</option>
                        <option value="auto">자동</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        언어
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        설정 저장
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}