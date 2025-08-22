'use client';

import { useState, useEffect } from 'react';
import { Settings, Search, Filter, BarChart3, X, LogOut } from 'lucide-react';
import { mediaSlots, getCMSStats, getSlotsByPriority, getSlotsByCategory, type MediaSlot as MediaSlotType } from '@/lib/cms-config';
import MediaSlot from './MediaSlot';
import SimpleLoginModal from './SimpleLoginModal';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface CMSManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CMSManager({ isOpen, onClose }: CMSManagerProps) {
  const [slots, setSlots] = useState<MediaSlotType[]>(mediaSlots);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [showStats, setShowStats] = useState(true);

  const { isAuthenticated, showLoginModal, setShowLoginModal, login, logout } = useSimpleAuth();

  // 통계 계산
  const stats = getCMSStats();

  // 필터링된 슬롯들
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = slot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         slot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || slot.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || slot.category === selectedCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // 우선순위별로 그룹화
  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    const priority = slot.priority;
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(slot);
    return acc;
  }, {} as Record<number, MediaSlotType[]>);

  const handleFileUpdate = (slotId: string, files: string[]) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, currentFiles: files }
        : slot
    ));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <SimpleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    );
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 animate-fade-in">
          {/* 헤더 */}
          <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    REDUX CMS 관리
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    이미지 및 동영상 콘텐츠 관리 시스템
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={`p-2 rounded-lg transition-colors ${
                    showStats 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 통계 */}
            {showStats && (
              <div
                className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 animate-fade-in"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalSlots}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      총 슬롯
                    </div>
                  </div>
                  
                  {[1, 2, 3, 4, 5].map(priority => (
                    <div key={priority} className="bg-white dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.byPriority[priority as keyof typeof stats.byPriority]}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        우선순위 {priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 필터 및 검색 */}
            <div className="px-6 py-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="슬롯 이름 또는 설명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">모든 우선순위</option>
                    <option value={1}>우선순위 1 (최고)</option>
                    <option value={2}>우선순위 2 (높음)</option>
                    <option value={3}>우선순위 3 (중간)</option>
                    <option value={4}>우선순위 4 (낮음)</option>
                    <option value={5}>우선순위 5 (최낮음)</option>
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">모든 카테고리</option>
                    {Object.keys(stats.byCategory).map(category => (
                      <option key={category} value={category}>
                        {category} ({stats.byCategory[category]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredSlots.length}개의 슬롯이 표시됨
              </div>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
            {Object.keys(groupedSlots).length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map(priority => {
                  if (!groupedSlots[priority]?.length) return null;
                  
                  return (
                    <div
                      key={priority}
                      className="animate-fade-in"
                    >
                      <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                        priority === 1 ? 'text-red-600 dark:text-red-400' :
                        priority === 2 ? 'text-orange-600 dark:text-orange-400' :
                        priority === 3 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          priority === 1 ? 'bg-red-500' :
                          priority === 2 ? 'bg-orange-500' :
                          priority === 3 ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          {priority}
                        </span>
                        우선순위 {priority} 
                        {priority === 1 && '⭐ 최고 우선순위'}
                        ({groupedSlots[priority].length}개)
                      </h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {groupedSlots[priority].map(slot => (
                          <MediaSlot
                            key={slot.id}
                            slot={slot}
                            currentFiles={slot.currentFiles}
                            onFilesUpdate={(files) => handleFileUpdate(slot.id, files)}
                            isAdminMode={true}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}