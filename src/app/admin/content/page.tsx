'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { getAllPageConfigs, PageEditorConfig } from '@/data/pageConfigs';
import { Plus, FileText, Users, Calendar, Settings, Edit3, Eye, Monitor, Smartphone, Tablet, Globe, Image as ImageIcon, Type, Video, Layout } from 'lucide-react';

export default function AdminContentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useCMSAuthStore();
  const [pageConfigs, setPageConfigs] = useState<PageEditorConfig[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    loadPageConfigs();
  }, []);

  const loadPageConfigs = async () => {
    try {
      setIsLoadingPages(true);
      // Get all available page configurations
      const configs = getAllPageConfigs();
      setPageConfigs(configs);
    } catch (error) {
      console.error('Failed to load page configs:', error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading content management...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getIconForPageType = (pageId: string) => {
    switch (pageId) {
      case 'home':
        return Monitor;
      case 'about':
        return FileText;
      case 'designers':
        return Users;
      case 'contact':
        return Globe;
      case 'exhibitions':
        return Calendar;
      default:
        return Layout;
    }
  };

  const getColorForPageType = (pageId: string) => {
    switch (pageId) {
      case 'home':
        return 'blue';
      case 'about':
        return 'purple';
      case 'designers':
        return 'green';
      case 'contact':
        return 'orange';
      case 'exhibitions':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getElementTypeStats = (config: PageEditorConfig) => {
    const stats = { text: 0, image: 0, video: 0, other: 0 };
    config.editableElements.forEach((element: any) => {
      if (element.type === 'text') stats.text++;
      else if (element.type === 'image') stats.image++;
      else if (element.type === 'video') stats.video++;
      else stats.other++;
    });
    return stats;
  };

  if (isLoadingPages) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading page configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            Page Content Editor
          </h1>
          <p className="text-white/60">
            Edit content for all pages with Instagram-style visual editor
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageConfigs.map((pageConfig) => {
            const Icon = getIconForPageType(pageConfig.pageId);
            const color = getColorForPageType(pageConfig.pageId);
            const stats = getElementTypeStats(pageConfig);
            
            const colorClasses = {
              blue: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
              green: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
              purple: 'from-purple-500/20 to-pink-500/20 border-purple-400/30',
              orange: 'from-orange-500/20 to-yellow-500/20 border-orange-400/30',
              red: 'from-red-500/20 to-rose-500/20 border-red-400/30',
              gray: 'from-gray-500/20 to-slate-500/20 border-gray-400/30'
            };

            return (
              <div
                key={pageConfig.pageId}
                className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl p-6 border hover:scale-105 transition-all duration-200 cursor-pointer group`}
                onClick={() => router.push(`/admin/content/editor/${pageConfig.pageId}`)}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    color === 'blue' ? 'from-blue-500 to-cyan-600' :
                    color === 'green' ? 'from-green-500 to-emerald-600' :
                    color === 'purple' ? 'from-purple-500 to-pink-600' :
                    color === 'orange' ? 'from-orange-500 to-yellow-600' :
                    color === 'red' ? 'from-red-500 to-rose-600' :
                    'from-gray-500 to-slate-600'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(pageConfig.previewUrl, '_blank');
                      }}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Preview Page"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/content/editor/${pageConfig.pageId}`);
                      }}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Page"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {pageConfig.pageName}
                </h3>
                
                <p className="text-white/60 text-sm mb-4">
                  {pageConfig.sections.length} sections • {pageConfig.editableElements.length} elements
                </p>

                {/* Element Type Stats */}
                <div className="flex items-center gap-3 mb-4">
                  {stats.text > 0 && (
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Type className="w-3 h-3" />
                      <span>{stats.text}</span>
                    </div>
                  )}
                  {stats.image > 0 && (
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <ImageIcon className="w-3 h-3" />
                      <span>{stats.image}</span>
                    </div>
                  )}
                  {stats.video > 0 && (
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Video className="w-3 h-3" />
                      <span>{stats.video}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Last edited: Never
                  </span>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                      Edit Page
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Content Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {pageConfigs.reduce((sum, config) => sum + config.editableElements.length, 0)}
              </div>
              <div className="text-white/60 text-sm">Total Elements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{pageConfigs.length}</div>
              <div className="text-white/60 text-sm">Editable Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {pageConfigs.reduce((sum, config) => sum + config.sections.length, 0)}
              </div>
              <div className="text-white/60 text-sm">Page Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {pageConfigs.reduce((sum, config) => sum + config.editableElements.filter((el: any) => el.type === 'text').length, 0)}
              </div>
              <div className="text-white/60 text-sm">Text Elements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}