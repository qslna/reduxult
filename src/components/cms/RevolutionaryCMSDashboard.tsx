'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  Upload, 
  Settings, 
  BarChart3, 
  Users, 
  Image as ImageIcon, 
  Video as VideoIcon,
  Calendar,
  Tag,
  Search,
  Filter,
  Bell,
  User,
  LogOut,
  Home,
  FolderOpen,
  Heart,
  Eye,
  Download,
  Star,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import InstagramStyleMediaGrid from './InstagramStyleMediaGrid';
import ImageSlotManager, { ImageSlot } from './ImageSlotManager';
import BulkMediaManager from './BulkMediaManager';
import VideoSlotManager from './VideoSlotManager';
import { MicroInteraction, StaggerContainer } from '@/components/ui/PageTransition';

/**
 * Phase 3: Revolutionary CMS Dashboard
 * Instagram-inspired admin interface with modern design
 */

interface DashboardStats {
  totalMedia: number;
  totalViews: number;
  totalLikes: number;
  storageUsed: number;
  storageLimit: number;
  recentUploads: number;
  popularTags: { tag: string; count: number }[];
  weeklyStats: { day: string; uploads: number; views: number }[];
}

interface CMSNotification {
  id: string;
  type: 'upload' | 'like' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

type DashboardView = 'overview' | 'media' | 'slots' | 'analytics' | 'settings';
type MediaLayout = 'grid' | 'masonry' | 'stories';

export default function RevolutionaryCMSDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [mediaLayout, setMediaLayout] = useState<MediaLayout>('masonry');
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<CMSNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalMedia: 1247,
        totalViews: 45890,
        totalLikes: 3254,
        storageUsed: 2.4, // GB
        storageLimit: 10, // GB
        recentUploads: 23,
        popularTags: [
          { tag: 'fashion', count: 156 },
          { tag: 'portrait', count: 134 },
          { tag: 'editorial', count: 98 },
          { tag: 'street-style', count: 87 },
          { tag: 'black-white', count: 76 }
        ],
        weeklyStats: [
          { day: 'Mon', uploads: 12, views: 1234 },
          { day: 'Tue', uploads: 8, views: 987 },
          { day: 'Wed', uploads: 15, views: 1456 },
          { day: 'Thu', uploads: 11, views: 1123 },
          { day: 'Fri', uploads: 19, views: 1789 },
          { day: 'Sat', uploads: 6, views: 543 },
          { day: 'Sun', uploads: 4, views: 321 }
        ]
      });

      setNotifications([
        {
          id: '1',
          type: 'upload',
          title: 'New Upload',
          message: '5 new images added to Fashion Collection',
          timestamp: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: '2',
          type: 'like',
          title: 'Popular Content',
          message: 'Your image "Sunset Portrait" reached 1K likes',
          timestamp: new Date(Date.now() - 7200000),
          read: false
        },
        {
          id: '3',
          type: 'system',
          title: 'Storage Alert',
          message: 'You are using 70% of your storage quota',
          timestamp: new Date(Date.now() - 86400000),
          read: true
        }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'media', label: 'Media Library', icon: ImageIcon, badge: stats?.recentUploads },
    { id: 'slots', label: 'Image Slots', icon: Grid, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">REDUX CMS</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {sidebarItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as DashboardView)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white/60 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <NotificationsDropdown 
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium hidden md:block">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 p-4 z-40">
          <div className="flex justify-around">
            {sidebarItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as DashboardView)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  currentView === item.id ? 'text-blue-400' : 'text-white/60'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'overview' && <OverviewDashboard stats={stats!} />}
              {currentView === 'media' && (
                <MediaLibraryView 
                  layout={mediaLayout} 
                  onLayoutChange={setMediaLayout}
                />
              )}
              {currentView === 'slots' && <ImageSlotsView />}
              {currentView === 'analytics' && <AnalyticsView stats={stats!} />}
              {currentView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Dashboard Loader Component
function DashboardLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Loading CMS Dashboard</h2>
        <p className="text-white/60">Preparing your media management experience...</p>
        
        <div className="mt-6 w-64 bg-white/10 rounded-full h-2 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Notifications Dropdown Component
function NotificationsDropdown({ 
  notifications, 
  onClose 
}: { 
  notifications: CMSNotification[]; 
  onClose: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Notifications</h3>
        <span className="text-xs text-white/60">
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded-xl border transition-all ${
              notification.read 
                ? 'bg-white/5 border-white/10' 
                : 'bg-blue-500/10 border-blue-400/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.read ? 'bg-white/30' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                <p className="text-white/70 text-xs mt-1">{notification.message}</p>
                <span className="text-white/50 text-xs">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-white/60">Welcome back! Here's what's happening with your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Media"
          value={stats.totalMedia}
          change="+12%"
          icon={ImageIcon}
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          change="+8%"
          icon={Eye}
          color="from-green-500 to-green-600"
        />
        <StatsCard
          title="Total Likes"
          value={stats.totalLikes}
          change="+15%"
          icon={Heart}
          color="from-red-500 to-red-600"
        />
        <StatsCard
          title="Storage Used"
          value={`${stats.storageUsed}/${stats.storageLimit} GB`}
          change={`${Math.round((stats.storageUsed / stats.storageLimit) * 100)}%`}
          icon={FolderOpen}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="xl:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold text-lg mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.weeklyStats.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-blue-500/20 rounded-t"
                    style={{ height: `${(day.uploads / 20) * 100}px` }}
                  />
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(day.uploads / 20) * 80}px` }}
                  />
                </div>
                <span className="text-white/60 text-xs">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold text-lg mb-4">Popular Tags</h3>
          <div className="space-y-3">
            {stats.popularTags.map((tag, index) => (
              <div key={tag.tag} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-yellow-400 to-orange-500' :
                    index === 1 ? 'from-blue-400 to-blue-500' :
                    index === 2 ? 'from-green-400 to-green-500' :
                    'from-purple-400 to-purple-500'
                  }`} />
                  <span className="text-white text-sm">#{tag.tag}</span>
                </div>
                <span className="text-white/60 text-sm">{tag.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  icon: any; 
  color: string; 
}) {
  return (
    <MicroInteraction>
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-green-400 text-sm font-medium">{change}</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-white/60 text-sm">{title}</div>
        </div>
      </div>
    </MicroInteraction>
  );
}

// Media Library View Component
function MediaLibraryView({ 
  layout, 
  onLayoutChange 
}: { 
  layout: MediaLayout; 
  onLayoutChange: (layout: MediaLayout) => void; 
}) {
  // Mock media items
  const mediaItems = [
    {
      id: '1',
      url: '/images/profile/placeholder.jpg',
      type: 'image' as const,
      title: 'Fashion Portrait Session',
      description: 'Studio portrait session with natural lighting',
      tags: ['portrait', 'fashion', 'studio'],
      uploadedAt: new Date(2024, 0, 15),
      size: 2048576,
      dimensions: { width: 1920, height: 1080 },
      likes: 142,
      isLiked: false,
      isFavorited: true,
      views: 1205,
      author: { name: 'Redux Team', avatar: '' },
      usage: { usedIn: ['home-page', 'about-section'], lastUsed: new Date() }
    },
    // Add more mock items...
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Media Library</h2>
          <p className="text-white/60">Manage your images and videos with Instagram-style interface</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['grid', 'masonry', 'stories'] as MediaLayout[]).map(layoutOption => (
              <button
                key={layoutOption}
                onClick={() => onLayoutChange(layoutOption)}
                className={`px-3 py-2 rounded text-sm transition-all capitalize ${
                  layout === layoutOption 
                    ? 'bg-blue-600 text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {layoutOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <InstagramStyleMediaGrid
        items={mediaItems}
        layout={layout}
        showStats={true}
        onItemSelect={(item) => console.log('Selected:', item)}
        onItemLike={(item) => console.log('Liked:', item)}
        onItemFavorite={(item) => console.log('Favorited:', item)}
      />
    </div>
  );
}

// Image Slots View Component
function ImageSlotsView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Image Slots Management</h2>
      <div className="text-white/60 mb-8">Coming soon: Advanced image slot management interface</div>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ stats }: { stats: DashboardStats }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h2>
      <div className="text-white/60 mb-8">Detailed analytics and insights coming soon</div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">CMS Settings</h2>
      <div className="text-white/60 mb-8">Configuration options coming soon</div>
    </div>
  );
}