'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Home, Users, Info, Mail, Eye, User } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const navigationItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home
  },
  {
    label: 'About',
    href: '/about',
    icon: Info,
    submenu: [
      { label: 'Overview', href: '/about' },
      { label: 'Collective', href: '/about/collective' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Installation', href: '/about/installation' },
      { label: 'Memory', href: '/about/memory' },
      { label: 'Fashion Film', href: '/about/fashion-film' }
    ]
  },
  {
    label: 'Designers',
    href: '/designers',
    icon: Users,
    submenu: [
      { label: 'All Designers', href: '/designers' },
      { label: '황진수', href: '/designers/hwangjinsu' },
      { label: '최은솔', href: '/designers/choieunsol' },
      { label: '박파랑', href: '/designers/parkparang' },
      { label: '이태현', href: '/designers/leetaehyeon' },
      { label: '김보민', href: '/designers/kimbomin' },
      { label: '김경수', href: '/designers/kimgyeongsu' }
    ]
  },
  {
    label: 'Exhibitions',
    href: '/exhibitions',
    icon: Eye
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: Mail
  }
];

export default function UniversalNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 변경 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleSubmenuToggle = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-lg border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/" 
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
              >
                REDUX
              </Link>
            </motion.div>

            {/* 데스크톱 메뉴 */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                      isActivePath(item.href)
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.submenu && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* 서브메뉴 */}
                  {item.submenu && (
                    <AnimatePresence>
                      {activeSubmenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 py-2 w-48 bg-black/90 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl"
                          onMouseLeave={() => setActiveSubmenu(null)}
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActivePath(subItem.href)
                                  ? 'text-white bg-white/10'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              {/* 관리자 링크 */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors rounded-lg hover:bg-yellow-500/10"
                >
                  <User className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white hover:text-gray-300 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* 메뉴 패널 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-lg border-l border-white/10 overflow-y-auto"
            >
              <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* 메뉴 아이템들 */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors flex-1 ${
                            isActivePath(item.href)
                              ? 'text-white bg-white/10'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                        
                        {item.submenu && (
                          <button
                            onClick={() => handleSubmenuToggle(item.label)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: activeSubmenu === item.label ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                        )}
                      </div>

                      {/* 모바일 서브메뉴 */}
                      <AnimatePresence>
                        {item.submenu && activeSubmenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 mt-2 space-y-1 border-l border-white/10 pl-4"
                          >
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActivePath(subItem.href)
                                    ? 'text-white bg-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* 관리자 링크 (모바일) */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 네비게이션 높이만큼 스페이서 */}
      <div className="h-16" />
    </>
  );
}