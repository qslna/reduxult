'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SubPageNavigationProps {
  pageTitle: string;
  parentTitle?: string;
  parentPath?: string;
  className?: string;
}

/**
 * About 하위 페이지용 통합 네비게이션 컴포넌트
 * 모바일 최적화된 UX 편의성을 위한 일관된 네비게이션 제공
 */
export default function SubPageNavigation({ 
  pageTitle, 
  parentTitle = "About", 
  parentPath = "/about",
  className = "" 
}: SubPageNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 페이지 이동 시 메뉴 자동 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // body 스크롤 복원
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }, [pathname]);

  // 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // cleanup
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full py-3 px-4 bg-black/95 backdrop-blur-md z-[1000] border-b border-white/10 ${className}`}>
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto">
          {/* Left navigation */}
          <div className="flex items-center space-x-6">
            {/* Back button with better UX */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-amber-300 transition-all duration-300 cursor-pointer group"
              aria-label="뒤로가기"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Breadcrumb navigation */}
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push('/')}
                className="text-white/70 hover:text-white transition-colors tracking-wider uppercase font-medium"
              >
                Home
              </button>
              <span className="text-white/30">/</span>
              <button
                onClick={() => router.push(parentPath)}
                className="text-amber-300 hover:text-amber-200 transition-colors tracking-wider uppercase font-medium"
              >
                {parentTitle}
              </button>
              <span className="text-white/30">/</span>
              <span className="text-white/70 tracking-wider uppercase">{pageTitle}</span>
            </div>
          </div>

          {/* Right - Logo */}
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-white hover:text-amber-300 transition-all duration-300 font-['Playfair_Display'] tracking-wider hover:scale-105"
          >
            REDUX
          </button>
        </div>

        {/* Mobile Navigation Header */}
        <div className="md:hidden flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white hover:text-amber-300 transition-colors min-h-[44px] min-w-[44px] -ml-2 pl-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{pageTitle}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/')}
              className="text-xl font-bold text-white font-['Playfair_Display'] min-h-[44px] px-2"
            >
              REDUX
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="flex flex-col items-center justify-center w-[44px] h-[44px] text-white hover:text-amber-300 transition-colors"
              aria-label="메뉴 열기"
            >
              <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current mt-1 transition duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current mt-1 transform transition duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[999] bg-black/95 backdrop-blur-md">
          <div className="pt-20 px-4">
            <div className="space-y-4">
              {/* Quick Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-left py-4 px-6 text-white hover:text-amber-300 transition-colors border-b border-white/10 text-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full text-left py-4 px-6 text-amber-300 hover:text-amber-200 transition-colors border-b border-white/10 text-lg"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/designers')}
                  className="w-full text-left py-4 px-6 text-white hover:text-amber-300 transition-colors border-b border-white/10 text-lg"
                >
                  Designers
                </button>
                <button
                  onClick={() => navigate('/exhibitions')}
                  className="w-full text-left py-4 px-6 text-white hover:text-amber-300 transition-colors border-b border-white/10 text-lg"
                >
                  Exhibitions
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full text-left py-4 px-6 text-white hover:text-amber-300 transition-colors border-b border-white/10 text-lg"
                >
                  Contact
                </button>
              </div>

              {/* About Submenu */}
              {parentTitle === "About" && (
                <div className="mt-8">
                  <h3 className="text-amber-300 font-semibold text-sm uppercase tracking-wider px-6 py-2">
                    About Pages
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => navigate('/about/fashion-film')}
                      className={`w-full text-left py-3 px-8 text-white hover:text-amber-300 transition-colors ${pageTitle === 'Fashion Film' ? 'bg-white/10 text-amber-300' : ''}`}
                    >
                      Fashion Film
                    </button>
                    <button
                      onClick={() => navigate('/about/memory')}
                      className={`w-full text-left py-3 px-8 text-white hover:text-amber-300 transition-colors ${pageTitle === 'Memory' ? 'bg-white/10 text-amber-300' : ''}`}
                    >
                      Memory
                    </button>
                    <button
                      onClick={() => navigate('/about/visual-art')}
                      className={`w-full text-left py-3 px-8 text-white hover:text-amber-300 transition-colors ${pageTitle === 'Visual Art' ? 'bg-white/10 text-amber-300' : ''}`}
                    >
                      Visual Art
                    </button>
                    <button
                      onClick={() => navigate('/about/installation')}
                      className={`w-full text-left py-3 px-8 text-white hover:text-amber-300 transition-colors ${pageTitle === 'Process' ? 'bg-white/10 text-amber-300' : ''}`}
                    >
                      Process
                    </button>
                    <button
                      onClick={() => navigate('/about/collective')}
                      className={`w-full text-left py-3 px-8 text-white hover:text-amber-300 transition-colors ${pageTitle === 'Collective' ? 'bg-white/10 text-amber-300' : ''}`}
                    >
                      Collective
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}