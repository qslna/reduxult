'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { DESIGN_TOKENS, layoutUtils } from '@/lib/design-system';
import { 
  LogOut, 
  Settings, 
  Database, 
  Image, 
  FileText, 
  Menu, 
  Video,
  Home,
  Users,
  BarChart3,
  Sparkles,
  Circle
} from 'lucide-react';
import Link from 'next/link';

interface CMSLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CMSLayout({ children, title = 'CMS Dashboard' }: CMSLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useCMSAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70 font-medium">Initializing REDUX CMS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Home,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      isActive: pathname === '/admin'
    },
    {
      label: 'Content',
      href: '/admin/content',
      icon: FileText,
      gradient: 'from-emerald-500/20 to-green-500/20',
      isActive: pathname.startsWith('/admin/content')
    },
    {
      label: 'Media',
      href: '/admin/media',
      icon: Image,
      gradient: 'from-violet-500/20 to-purple-500/20',
      isActive: pathname.startsWith('/admin/media')
    },
    {
      label: 'Videos',
      href: '/admin/videos',
      icon: Video,
      gradient: 'from-rose-500/20 to-pink-500/20',
      isActive: pathname.startsWith('/admin/videos')
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      gradient: 'from-orange-500/20 to-yellow-500/20',
      isActive: pathname.startsWith('/admin/analytics')
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      gradient: 'from-gray-500/20 to-slate-500/20',
      isActive: pathname.startsWith('/admin/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Glassmorphism Sidebar */}
      <div className={layoutUtils.combineClasses(
        'fixed top-0 left-0 h-full w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10',
        'transform transition-transform duration-500 ease-out z-50',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Sidebar Header */}
        <div className="relative overflow-hidden p-6 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">REDUX</h1>
              <p className="text-xs text-white/60 font-medium tracking-wider">CONTENT MANAGEMENT</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative overflow-hidden flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  item.isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setSidebarOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    item.isActive 
                      ? 'bg-blue-500/30 border border-blue-400/50' 
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  
                  {item.isActive && (
                    <div className="ml-auto">
                      <Circle className="w-2 h-2 fill-blue-400 text-blue-400" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Admin Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center relative">
                <Users className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">REDUX Admin</p>
                <p className="text-xs text-white/60 truncate">Administrator</p>
              </div>
            </div>
            
            <div className="text-xs text-white/50 mb-3">
              <div className="flex items-center gap-1">
                <Circle className="w-1 h-1 fill-green-400 text-green-400" />
                <span>Online • {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-72">
        {/* Modern Header */}
        <header className="relative overflow-hidden bg-gray-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-sm text-white/60">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">System Online</span>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-white">Welcome back</p>
                <p className="text-xs text-white/60">Redux Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        nav a {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}