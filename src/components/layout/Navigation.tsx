'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// HTML redux6 버전과 완전 동일한 Navigation 컴포넌트
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effect - HTML 버전과 동일
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지별 제목 매핑 (HTML 버전과 동일)
  const getPageTitle = () => {
    switch (pathname) {
      case '/about/collective':
        return 'COLLECTIVE';
      case '/about/visual-art':
        return 'VISUAL ART';
      case '/about/fashion-film':
        return 'FASHION FILM';
      case '/about/installation':
        return 'PROCESS';
      case '/about/memory':
        return 'MEMORY';
      case '/designers':
        return 'DESIGNERS';
      case '/exhibitions':
        return 'EXHIBITIONS';
      case '/contact':
        return 'CONTACT';
      default:
        return null;
    }
  };

  // Back 버튼 핸들러
  const handleGoBack = () => {
    router.push('/');
  };

  // Home 버튼 핸들러
  const handleGoHome = () => {
    router.push('/');
  };

  // 모바일 메뉴 토글 (HTML 버전에서는 구현되지 않음)
  const toggleMobileMenu = () => {
    // HTML 버전에서는 빈 함수
    console.log('Mobile menu toggle - not implemented in HTML version');
  };

  const pageTitle = getPageTitle();
  const showBackButton = pathname !== '/';
  
  // 페이지별 다른 테마 적용 (HTML 버전 기준)
  const isDarkTheme = pathname === '/about/installation' || pathname === '/about/memory';

  return (
    <>
      {/* Navigation - HTML redux6 버전과 완전 동일 */}
      <nav 
        id="navbar"
        className={`
          fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out
          ${scrolled 
            ? 'py-[15px] px-10 shadow-[0_2px_20px_rgba(0,0,0,0.1)]' 
            : 'py-5 px-10'
          }
          ${isDarkTheme 
            ? scrolled 
              ? 'bg-black/95 backdrop-blur-[10px] mix-blend-normal border-b border-white/10'
              : 'bg-transparent mix-blend-difference'
            : scrolled
              ? 'bg-white/95 backdrop-blur-[10px] border-b border-black/10'
              : 'bg-white/95 backdrop-blur-[10px] border-b border-black/10'
          }
        `}
        style={{
          // mix-blend-mode는 CSS로 직접 적용 (Tailwind CSS 제한)
          mixBlendMode: isDarkTheme && !scrolled ? 'difference' : 'normal'
        }}
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          {/* Left Section */}
          <div className="nav-left flex items-center gap-10">
            {showBackButton && (
              <button 
                className={`
                  back-button text-xl cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:-translate-x-[5px]
                  ${isDarkTheme ? 'text-white' : 'text-black'}
                `}
                onClick={handleGoBack}
                aria-label="Go back"
              >
                ←
              </button>
            )}
            
            {pageTitle && (
              <span 
                className={`
                  page-title text-lg font-medium tracking-[2px] uppercase
                  ${isDarkTheme ? 'text-white' : 'text-black'}
                  max-[768px]:hidden
                `}
              >
                {pageTitle}
              </span>
            )}
          </div>

          {/* Logo - Center/Right */}
          <button
            className={`
              logo font-['Playfair_Display'] text-2xl font-bold tracking-[2px] cursor-pointer 
              transition-opacity duration-300 ease-in-out hover:opacity-70
              ${isDarkTheme ? 'text-white' : 'text-black'}
            `}
            onClick={handleGoHome}
            aria-label="Go to home"
          >
            REDUX
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={`
              menu-toggle hidden flex-col gap-[5px] z-[1001] cursor-pointer
              max-[768px]:flex
            `}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span 
              className={`
                w-[25px] h-[2px] transition-all duration-300 ease-in-out
                ${isDarkTheme ? 'bg-white' : 'bg-black'}
              `}
            ></span>
            <span 
              className={`
                w-[25px] h-[2px] transition-all duration-300 ease-in-out
                ${isDarkTheme ? 'bg-white' : 'bg-black'}
              `}
            ></span>
            <span 
              className={`
                w-[25px] h-[2px] transition-all duration-300 ease-in-out
                ${isDarkTheme ? 'bg-white' : 'bg-black'}
              `}
            ></span>
          </button>
        </div>
      </nav>

      {/* Noise Overlay - HTML 버전과 동일 */}
      <div className="noise-overlay"></div>
    </>
  );
}

// 타입 정의 (TypeScript 호환성)
export interface NavigationProps {
  className?: string;
}

// 네비게이션 유틸리티 함수들
export const navigationUtils = {
  // 스크롤 시 네비게이션 상태 변경
  updateScrollState: (scrollY: number) => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  },

  // 페이지 변경 시 네비게이션 초기화
  resetNavigation: () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.remove('scrolled');
    }
  }
};

// CSS 클래스명 상수 (유지보수 용이성)
export const NAV_CLASSES = {
  base: 'fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out',
  scrolled: 'py-[15px] px-10 shadow-[0_2px_20px_rgba(0,0,0,0.1)]',
  normal: 'py-5 px-10',
  lightTheme: {
    base: 'bg-white/95 backdrop-blur-[10px] border-b border-black/10',
    text: 'text-black'
  },
  darkTheme: {
    base: 'bg-black/95 backdrop-blur-[10px] mix-blend-normal border-b border-white/10',
    transparent: 'bg-transparent mix-blend-difference',
    text: 'text-white'
  }
} as const;