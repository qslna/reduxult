'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// HTML redux6 index.html과 완전 동일한 Navigation 컴포넌트
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

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

  // Mobile menu toggle - HTML 버전과 동일
  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
    
    if (!mobileMenuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Close all submenus when closing main menu
      setActiveSubmenu(null);
    }
  };

  // Toggle submenu - HTML 버전과 동일
  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (mobileMenuActive) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [mobileMenuActive]);

  return (
    <>
      {/* Noise Overlay - HTML 버전과 동일 */}
      <div className="noise-overlay"></div>

      {/* Navigation - HTML redux6 버전과 완전 동일 */}
      <nav 
        id="navbar"
        className={`
          fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out isolation-isolate
          ${scrolled ? 'p-[15px_40px]' : 'p-[20px_40px]'}
        `}
        style={{
          mixBlendMode: 'difference'
        }}
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          {/* Logo */}
          <Link 
            href="/" 
            className="logo font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em] text-white transition-all duration-300 ease-in-out cursor-pointer no-underline hover:opacity-70 hover:scale-[1.02]"
            style={{
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            REDUX
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-menu flex gap-10 list-none max-[768px]:hidden">
            {/* About Menu */}
            <li className="nav-item relative">
              <Link 
                href="/about" 
                className="text-white no-underline block py-[5px] font-['Inter'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                About
              </Link>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10">
                <Link href="/about/fashion-film" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Fashion Film</Link>
                <Link href="/about/memory" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Memory</Link>
                <Link href="/about/visual-art" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Visual Art</Link>
                <Link href="/about/installation" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Process</Link>
                <Link href="/about/collective" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Collective</Link>
              </div>
            </li>

            {/* Designers Menu */}
            <li className="nav-item relative">
              <Link 
                href="/designers" 
                className="text-white no-underline block py-[5px] font-['Inter'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                Designers
              </Link>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10">
                <Link href="/designers/kimbomin" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Kim Bomin</Link>
                <Link href="/designers/parkparang" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Park Parang</Link>
                <Link href="/designers/leetaehyeon" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Lee Taehyeon</Link>
                <Link href="/designers/choieunsol" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Choi Eunsol</Link>
                <Link href="/designers/hwangjinsu" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Hwang Jinsu</Link>
                <Link href="/designers/kimgyeongsu" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">Kim Gyeongsu</Link>
              </div>
            </li>

            {/* Exhibitions Menu */}
            <li className="nav-item relative">
              <Link 
                href="/exhibitions" 
                className="text-white no-underline block py-[5px] font-['Inter'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                Exhibitions
              </Link>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10">
                <Link href="/exhibitions#cine-mode" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">CINE MODE</Link>
                <Link href="/exhibitions#the-room" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">THE ROOM OF [ ]</Link>
              </div>
            </li>

            {/* Contact Menu */}
            <li className="nav-item relative">
              <Link 
                href="/contact" 
                className="text-white no-underline block py-[5px] font-['Inter'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                Contact
              </Link>
            </li>

            {/* Admin Menu */}
            <li className="nav-item relative">
              <Link 
                href="/admin" 
                className="text-white no-underline block py-[5px] font-['Inter'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                Admin
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <div 
            className={`
              menu-toggle hidden flex-col gap-[5px] z-[1001] relative w-[30px] h-5 cursor-pointer p-[10px] -m-[10px]
              max-[768px]:flex
              ${mobileMenuActive ? 'active' : ''}
            `}
            id="menuToggle"
            onClick={toggleMobileMenu}
            style={{
              mixBlendMode: mobileMenuActive ? 'normal' : 'difference'
            }}
          >
            <span 
              className={`
                w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute
                ${mobileMenuActive 
                  ? 'top-1/2 -translate-y-1/2 rotate-45' 
                  : 'top-0'
                }
              `}
            ></span>
            <span 
              className={`
                w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute top-1/2 -translate-y-1/2
                ${mobileMenuActive ? 'opacity-0' : 'opacity-100'}
              `}
            ></span>
            <span 
              className={`
                w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute
                ${mobileMenuActive 
                  ? 'bottom-1/2 translate-y-1/2 -rotate-45' 
                  : 'bottom-0'
                }
              `}
            ></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - HTML 버전과 완전 동일 */}
      <div 
        className={`
          mobile-menu hidden fixed top-0 left-0 w-full h-screen bg-black z-[999] transition-transform duration-500 ease-in-out overflow-y-auto
          max-[768px]:block max-[768px]:p-6 max-[768px]:bg-black/95 max-[768px]:backdrop-blur-[20px]
          ${mobileMenuActive ? 'transform-none active' : 'translate-x-full'}
        `}
        id="mobileMenu"
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="mobile-menu-content flex flex-col justify-center items-center min-h-screen gap-[30px] py-20 px-5">
          {/* About Mobile Menu */}
          <div className="mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]" 
               style={{'--i': 1, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties}>
            <span onClick={() => toggleSubmenu('about')}>About</span>
            <div className={`mobile-submenu ${activeSubmenu === 'about' ? 'active flex' : 'hidden'} flex-col gap-[15px] mt-5 pl-5 w-full`} id="aboutSubmenu">
              <Link href="/about" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">About REDUX</Link>
              <Link href="/about/fashion-film" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Fashion Film</Link>
              <Link href="/about/memory" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Memory</Link>
              <Link href="/about/visual-art" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Visual Art</Link>
              <Link href="/about/installation" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Process</Link>
              <Link href="/about/collective" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Collective</Link>
            </div>
          </div>

          {/* Designers Mobile Menu */}
          <div className="mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]" 
               style={{'--i': 2, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties}>
            <span onClick={() => toggleSubmenu('designers')}>Designers</span>
            <div className={`mobile-submenu ${activeSubmenu === 'designers' ? 'active flex' : 'hidden'} flex-col gap-[15px] mt-5 pl-5 w-full`} id="designersSubmenu">
              <Link href="/designers" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">All Designers</Link>
              <Link href="/designers/kimbomin" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Kim Bomin</Link>
              <Link href="/designers/parkparang" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Park Parang</Link>
              <Link href="/designers/leetaehyeon" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Lee Taehyeon</Link>
              <Link href="/designers/choieunsol" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Choi Eunsol</Link>
              <Link href="/designers/hwangjinsu" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Hwang Jinsu</Link>
              <Link href="/designers/kimgyeongsu" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100">Kim Gyeongsu</Link>
            </div>
          </div>

          {/* Exhibitions Mobile Menu */}
          <div className="mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]" 
               style={{'--i': 3, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties}>
            <Link href="/exhibitions" className="no-underline text-inherit">Exhibitions</Link>
          </div>

          {/* Contact Mobile Menu */}
          <div className="mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]" 
               style={{'--i': 4, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties}>
            <Link href="/contact" className="no-underline text-inherit">Contact</Link>
          </div>

          {/* Admin Mobile Menu */}
          <div className="mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]" 
               style={{'--i': 5, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties}>
            <Link href="/admin" className="no-underline text-inherit">Admin</Link>
          </div>
        </div>
      </div>
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
  base: 'fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out isolation-isolate',
  scrolled: 'p-[15px_40px]',
  normal: 'p-[20px_40px]',
  container: 'nav-container flex justify-between items-center max-w-[1600px] mx-auto',
  logo: 'logo font-[\'Playfair_Display\'] text-2xl font-extrabold tracking-[0.05em] text-white transition-all duration-300 ease-in-out cursor-pointer no-underline hover:opacity-70 hover:scale-[1.02]',
  menu: 'nav-menu flex gap-10 list-none max-[768px]:hidden',
  item: 'nav-item relative',
  link: 'text-white no-underline block py-[5px] font-[\'Inter\'] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase transition-all duration-300 ease-in-out cursor-pointer hover:text-[--accent-mocha]',
  dropdown: {
    menu: 'dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10',
    item: 'dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]'
  },
  mobile: {
    toggle: 'menu-toggle hidden flex-col gap-[5px] z-[1001] relative w-[30px] h-5 cursor-pointer p-[10px] -m-[10px] max-[768px]:flex',
    menu: 'mobile-menu hidden fixed top-0 left-0 w-full h-screen bg-black z-[999] transition-transform duration-500 ease-in-out overflow-y-auto max-[768px]:block max-[768px]:p-6 max-[768px]:bg-black/95 max-[768px]:backdrop-blur-[20px]',
    content: 'mobile-menu-content flex flex-col justify-center items-center min-h-screen gap-[30px] py-20 px-5',
    item: 'mobile-menu-item text-[clamp(20px,5vw,24px)] text-white tracking-[2px] opacity-0 translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center no-underline py-[10px] px-5 w-full max-w-[300px]',
    submenu: 'mobile-submenu flex-col gap-[15px] mt-5 pl-5 w-full',
    submenuItem: 'mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out py-2 px-4 text-left hover:opacity-100'
  }
} as const;