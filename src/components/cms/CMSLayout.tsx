'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import { DESIGN_TOKENS, layoutUtils } from '@/lib/design-system';
import { LogOut, User, Settings, Database, Image, FileText, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface CMSLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function CMSLayout({ children, title = 'CMS Dashboard' }: CMSLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, refreshAuth } = useCMSAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else {
        refreshAuth();
      }
    }
  }, [isAuthenticated, isLoading, router, refreshAuth]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Database,
      active: false
    },
    {
      label: 'Content',
      href: '/admin/content',
      icon: FileText,
      active: true
    },
    {
      label: 'Media',
      href: '/admin/media',
      icon: Image,
      active: false
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: User,
      active: false,
      adminOnly: true
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      active: false,
      superAdminOnly: true
    }
  ];

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.superAdminOnly && user.role !== 'SUPER_ADMIN') return false;
    if (item.adminOnly && !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={layoutUtils.combineClasses(
        'fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700',
        'transform transition-transform duration-300 ease-in-out z-50',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">REDUX CMS</h1>
        </div>

        <nav className="p-4 space-y-2">
          {filteredSidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={layoutUtils.combineClasses(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-gray-700',
                  item.active ? 'bg-blue-600 text-white' : 'text-gray-300'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Welcome, {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}