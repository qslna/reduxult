'use client';

import { useState, useEffect } from 'react';
import { 
  X, Settings, Image as ImageIcon, Video, Briefcase, Eye, EyeOff, 
  Upload, Search, Grid, List, 
  Download, Trash2, Move, Copy, BarChart3, Activity, Shield, User
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import ModernLoginModal from './ModernLoginModal';
import useContentStore from '@/store/useContentStore';
import useCMSStore from '@/store/useCMSStore';

interface MediaGridProps {
  onUpload: () => void;
}

function MediaGrid({ onUpload }: MediaGridProps) {
  const {
    // media, // Commented out as it's not used directly
    selectedMedia,
    currentFolder,
    searchQuery,
    filters,
    getFilteredMedia,
    selectMedia,
    deselectMedia,
    clearSelection,
    setSearchQuery,
    setFilters,
    setCurrentFolder,
    folders,
    getMediaStats
  } = useCMSStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const filteredMedia = getFilteredMedia();
  const stats = getMediaStats();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Media Library</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{stats.total} items</span>
              <span>•</span>
              <span>{stats.images} images</span>
              <span>•</span>
              <span>{stats.videos} videos</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            </button>
            <button
              onClick={onUpload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ type: e.target.value as 'image' | 'video' || undefined })}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <select
            value={currentFolder}
            onChange={(e) => setCurrentFolder(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(folders).map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selection Actions */}
        {selectedMedia.length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-blue-600/20 rounded-lg">
            <span className="text-sm text-blue-300">
              {selectedMedia.length} item{selectedMedia.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button className="p-1 text-blue-300 hover:text-white transition-colors">
                <Copy size={14} />
              </button>
              <button className="p-1 text-blue-300 hover:text-white transition-colors">
                <Move size={14} />
              </button>
              <button className="p-1 text-blue-300 hover:text-white transition-colors">
                <Download size={14} />
              </button>
              <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 size={14} />
              </button>
              <button
                onClick={clearSelection}
                className="p-1 text-gray-400 hover:text-white transition-colors ml-2"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredMedia.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No media found</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedMedia.includes(item.id)
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                    : 'hover:scale-105'
                }`}
                onClick={() => selectedMedia.includes(item.id) ? deselectMedia(item.id) : selectMedia(item.id)}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || 'Media item'}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Video size={24} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {item.type} • {Math.round(item.size / 1024)}KB
                    </p>
                  </div>
                </div>
                {selectedMedia.includes(item.id) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedMedia.includes(item.id)
                    ? 'bg-blue-600/20 border border-blue-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => selectedMedia.includes(item.id) ? deselectMedia(item.id) : selectMedia(item.id)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.alt || item.title || 'Media item'}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Video size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-sm">
                    {item.type} • {Math.round(item.size / 1024)}KB • {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { activities, getMediaStats } = useCMSStore();
  const stats = getMediaStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Dashboard</h3>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Media</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <ImageIcon className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Images</p>
                <p className="text-2xl font-bold text-white">{stats.images}</p>
              </div>
              <ImageIcon className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Videos</p>
                <p className="text-2xl font-bold text-white">{stats.videos}</p>
              </div>
              <Video className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage</p>
                <p className="text-2xl font-bold text-white">
                  {(stats.totalSize / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
              <BarChart3 className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={20} />
            Recent Activity
          </h4>
          <div className="space-y-3 max-h-64 overflow-auto">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-white">{activity.details}</p>
                  <p className="text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { 
    isAuthenticated, 
    isAdmin, 
    user, 
    showLoginModal, 
    setShowLoginModal, 
    logout, 
    requestAdminAccess,
    hasPermission
  } = useAdminAuth();
  
  const { initializeData } = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';
    input.click();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'content', label: 'Content', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            onClick={requestAdminAccess}
            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield size={20} className="text-white" />
          </motion.button>
        </div>
        
        <ModernLoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      {/* Admin Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={20} className="text-white" />
          
          {/* User indicator */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {user?.avatar || '👤'}
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {user?.username} • {user?.role.replace('_', ' ')}
          </div>
        </motion.button>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-gray-900 border-l border-gray-700 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                    {user?.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
                    <p className="text-sm text-gray-400">{user?.username} • {user?.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 mt-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'media' && <MediaGrid onUpload={handleUpload} />}
              {activeTab === 'content' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Management</h3>
                  <p className="text-gray-400">Content management tools coming soon...</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                  <p className="text-gray-400">Settings panel coming soon...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}