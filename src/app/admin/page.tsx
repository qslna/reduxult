'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/components/ToastProvider';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SimpleImageManager from '@/components/SimpleImageManager';

interface BulkUploadFile {
  file: File;
  preview: string;
  folder: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface ImageOptimizationSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'original' | 'webp' | 'jpg' | 'png';
}

const folderOptions = [
  { value: 'designers', label: 'Designers' },
  { value: 'about', label: 'About' },
  { value: 'exhibitions', label: 'Exhibitions' },
  { value: 'contact', label: 'Contact' },
  { value: 'memory', label: 'Memory' },
  { value: 'visual-art', label: 'Visual Art' },
  { value: 'collective', label: 'Collective' },
  { value: 'fashion-film', label: 'Fashion Film' },
  { value: 'installation', label: 'Installation' }
];

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'bulk' | 'optimize' | 'manage'>('login');
  const [bulkFiles, setBulkFiles] = useState<BulkUploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('designers');
  const [isUploading, setIsUploading] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState<ImageOptimizationSettings>({
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'webp'
  });
  
  const { isAdmin, adminData, login, logout } = useAdmin();
  const { success, error, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const loginSuccess = login(username, password);
    
    if (loginSuccess) {
      success('로그인 성공! 이제 이미지를 관리할 수 있습니다.');
      setUsername('');
      setPassword('');
      setActiveTab('manage');
    } else {
      error('로그인 실패. 사용자명과 비밀번호를 확인해주세요.');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('login');
    setBulkFiles([]);
    info('로그아웃되었습니다.');
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newFiles: BulkUploadFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      folder: selectedFolder,
      status: 'pending',
      progress: 0
    }));

    setBulkFiles(prev => [...prev, ...newFiles]);
  }, [selectedFolder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newFiles: BulkUploadFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      folder: selectedFolder,
      status: 'pending',
      progress: 0
    }));

    setBulkFiles(prev => [...prev, ...newFiles]);
  }, [selectedFolder]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setBulkFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadBulkFiles = async () => {
    if (bulkFiles.length === 0) return;
    
    setIsUploading(true);
    
    for (let i = 0; i < bulkFiles.length; i++) {
      setBulkFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'uploading', progress: 0 } : file
      ));

      try {
        const formData = new FormData();
        formData.append('file', bulkFiles[i].file);
        formData.append('folder', bulkFiles[i].folder);

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setBulkFiles(prev => prev.map((file, index) => 
            index === i ? { ...file, progress } : file
          ));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const response = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          setBulkFiles(prev => prev.map((file, index) => 
            index === i ? { ...file, status: 'success', progress: 100 } : file
          ));
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        setBulkFiles(prev => prev.map((file, index) => 
          index === i ? { 
            ...file, 
            status: 'error', 
            error: err instanceof Error ? err.message : 'Upload failed'
          } : file
        ));
      }
    }
    
    setIsUploading(false);
    success(`${bulkFiles.filter(f => f.status === 'success').length}개 파일이 성공적으로 업로드되었습니다.`);
  };

  const clearCompletedFiles = () => {
    setBulkFiles(prev => {
      const toRemove = prev.filter(file => file.status === 'success' || file.status === 'error');
      toRemove.forEach(file => URL.revokeObjectURL(file.preview));
      return prev.filter(file => file.status === 'pending' || file.status === 'uploading');
    });
  };

  if (!isAdmin && activeTab !== 'login') {
    setActiveTab('login');
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wider text-black mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest">
              Advanced Image Management Portal
            </p>
          </motion.div>

          {/* Tabs */}
          {isAdmin && (
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'manage', label: '이미지 관리' },
                  { id: 'bulk', label: '일괄 업로드' },
                  { id: 'optimize', label: '최적화 설정' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'login' && !isAdmin && (
              <motion.div
                key="login"
                className="max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <h2 className="text-xl font-medium text-center text-black mb-6">
                    관리자 로그인
                  </h2>
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        사용자명
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="admin"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        비밀번호
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          로그인 중...
                        </div>
                      ) : (
                        '로그인'
                      )}
                    </motion.button>
                  </form>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      <strong>데모 계정:</strong><br />
                      사용자명: admin<br />
                      비밀번호: redux2025
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'manage' && isAdmin && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-medium text-black mb-2">
                        환영합니다, {adminData?.username}님!
                      </h2>
                      <p className="text-gray-600 text-sm">
                        웹사이트의 모든 이미지를 관리할 수 있습니다.
                      </p>
                    </div>
                    <motion.button
                      onClick={handleLogout}
                      className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      로그아웃
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-3">✅ 활성화된 기능</h3>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• 개별 이미지 업로드 및 교체</li>
                        <li>• 이미지 삭제 및 복구</li>
                        <li>• 일괄 업로드 (최대 50개)</li>
                        <li>• 실시간 미리보기</li>
                        <li>• 드래그앤드롭 업로드</li>
                        <li>• 이미지 최적화</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-3">📝 사용 방법</h3>
                      <ol className="text-sm text-blue-700 space-y-2">
                        <li>1. 개별 이미지: 이미지에 마우스를 올려 관리 버튼 사용</li>
                        <li>2. 일괄 업로드: "일괄 업로드" 탭에서 여러 파일 선택</li>
                        <li>3. 최적화 설정: "최적화 설정" 탭에서 품질 조정</li>
                        <li>4. 폴더별 관리: 각 섹션별로 이미지 분류</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bulk' && isAdmin && (
              <motion.div
                key="bulk"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <h2 className="text-xl font-medium text-black mb-6">일괄 이미지 업로드</h2>
                  
                  {/* Folder Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업로드 폴더
                    </label>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {folderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-black transition-colors duration-200"
                  >
                    <div className="space-y-4">
                      <div className="text-6xl">📁</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          이미지를 드래그하여 놓거나 클릭하여 선택하세요
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG, WebP 파일 지원 (최대 50개)
                        </p>
                      </div>
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        파일 선택
                      </motion.button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* File List */}
                  {bulkFiles.length > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-black">
                          선택된 파일 ({bulkFiles.length}개)
                        </h3>
                        <div className="space-x-3">
                          <button
                            onClick={clearCompletedFiles}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            완료된 파일 제거
                          </button>
                          <motion.button
                            onClick={uploadBulkFiles}
                            disabled={isUploading || bulkFiles.every(f => f.status !== 'pending')}
                            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            whileHover={{ scale: isUploading ? 1 : 1.02 }}
                            whileTap={{ scale: isUploading ? 1 : 0.98 }}
                          >
                            {isUploading ? '업로드 중...' : '전체 업로드'}
                          </motion.button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {bulkFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            className="relative bg-gray-50 rounded-lg p-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
                              <img
                                src={file.preview}
                                alt={file.file.name}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Status Overlay */}
                              {file.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="text-white text-center">
                                    <motion.div
                                      className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    />
                                    <div className="text-sm">{file.progress}%</div>
                                  </div>
                                </div>
                              )}
                              
                              {file.status === 'success' && (
                                <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                                  <div className="text-white text-2xl">✓</div>
                                </div>
                              )}
                              
                              {file.status === 'error' && (
                                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                                  <div className="text-white text-2xl">✗</div>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-600 truncate mb-2">
                              {file.file.name}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {(file.file.size / 1024 / 1024).toFixed(1)}MB
                              </span>
                              
                              {file.status === 'pending' && (
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  제거
                                </button>
                              )}
                              
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                file.status === 'pending' ? 'bg-gray-200 text-gray-700' :
                                file.status === 'uploading' ? 'bg-blue-200 text-blue-700' :
                                file.status === 'success' ? 'bg-green-200 text-green-700' :
                                'bg-red-200 text-red-700'
                              }`}>
                                {file.status === 'pending' ? '대기중' :
                                 file.status === 'uploading' ? '업로드중' :
                                 file.status === 'success' ? '완료' : '실패'}
                              </span>
                            </div>
                            
                            {file.error && (
                              <div className="text-xs text-red-600 mt-2">
                                {file.error}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'optimize' && isAdmin && (
              <motion.div
                key="optimize"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <h2 className="text-xl font-medium text-black mb-6">이미지 최적화 설정</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">품질 설정</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            이미지 품질: {optimizationSettings.quality}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={optimizationSettings.quality}
                            onChange={(e) => setOptimizationSettings(prev => ({
                              ...prev,
                              quality: parseInt(e.target.value)
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>낮음</span>
                            <span>높음</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            최대 너비 (px)
                          </label>
                          <input
                            type="number"
                            value={optimizationSettings.maxWidth}
                            onChange={(e) => setOptimizationSettings(prev => ({
                              ...prev,
                              maxWidth: parseInt(e.target.value)
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            min="100"
                            max="4000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            최대 높이 (px)
                          </label>
                          <input
                            type="number"
                            value={optimizationSettings.maxHeight}
                            onChange={(e) => setOptimizationSettings(prev => ({
                              ...prev,
                              maxHeight: parseInt(e.target.value)
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            min="100"
                            max="4000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            출력 형식
                          </label>
                          <select
                            value={optimizationSettings.format}
                            onChange={(e) => setOptimizationSettings(prev => ({
                              ...prev,
                              format: e.target.value as any
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="original">원본 유지</option>
                            <option value="webp">WebP (권장)</option>
                            <option value="jpg">JPEG</option>
                            <option value="png">PNG</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">미리보기</h3>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">품질:</span>
                            <span className="text-sm font-medium">{optimizationSettings.quality}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">최대 해상도:</span>
                            <span className="text-sm font-medium">
                              {optimizationSettings.maxWidth} × {optimizationSettings.maxHeight}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">형식:</span>
                            <span className="text-sm font-medium uppercase">
                              {optimizationSettings.format}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">💡 최적화 팁</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• WebP 형식은 파일 크기를 30-50% 줄일 수 있습니다</li>
                            <li>• 품질 85%는 최적의 균형점입니다</li>
                            <li>• 웹용 이미지는 1920px 이하를 권장합니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      onClick={() => success('설정이 저장되었습니다.')}
                      className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      설정 저장
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}