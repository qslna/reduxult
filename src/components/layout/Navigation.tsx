'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * REDUX Navigation Component
 * 완전히 재구축된 네비게이션 시스템 - HTML 버전의 모든 기능 포함
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  // 페이지 타입 확인
  const isHomePage = pathname === '/';
  const aboutSubPages = [
    '/about/fashion-film',
    '/about/visual-art', 
    '/about/memory',
    '/about/installation',
    '/about/collective'
  ];
  const isAboutSubPage = aboutSubPages.includes(pathname);
  
  // About 서브페이지에서는 네비게이션을 렌더링하지 않음
  if (isAboutSubPage) {
    return null;
  }

  // Scroll effect with performance optimization
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu toggle with body scroll lock
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuActive(prev => {
      const newState = !prev;
      
      if (newState) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        setActiveSubmenu(null);
      }
      
      return newState;
    });
  }, []);

  // Toggle submenu
  const toggleSubmenu = useCallback((menu: string) => {
    setActiveSubmenu(prev => prev === menu ? null : menu);
  }, []);

  // Close mobile menu on navigation
  const closeMobileMenu = useCallback(() => {
    setMobileMenuActive(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    setActiveSubmenu(null);
  }, []);

  // ESC key handler for mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuActive) {
        closeMobileMenu();
      }
    };

    if (mobileMenuActive) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [mobileMenuActive, closeMobileMenu]);

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav 
        className={`redux-nav ${scrolled ? 'redux-nav--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="redux-nav__container">
          {/* Logo */}
          <Link href="/" className="redux-nav__logo" aria-label="REDUX Home">
            REDUX
          </Link>

          {/* Desktop Menu */}
          <ul className="redux-nav__menu" role="menubar">
            {/* About Menu */}
            <li className="redux-nav__item" role="none">
              <Link 
                href="/about" 
                className="redux-nav__link"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
              >
                About
              </Link>
              <div className="redux-nav__dropdown" role="menu" aria-label="About submenu">
                <Link href="/about/fashion-film" className="redux-nav__dropdown-item" role="menuitem">Fashion Film</Link>
                <Link href="/about/memory" className="redux-nav__dropdown-item" role="menuitem">Memory</Link>
                <Link href="/about/visual-art" className="redux-nav__dropdown-item" role="menuitem">Visual Art</Link>
                <Link href="/about/installation" className="redux-nav__dropdown-item" role="menuitem">Process</Link>
                <Link href="/about/collective" className="redux-nav__dropdown-item" role="menuitem">Collective</Link>
              </div>
            </li>

            {/* Designers Menu */}
            <li className="redux-nav__item" role="none">
              <Link 
                href="/designers" 
                className="redux-nav__link"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Designers
              </Link>
              <div className="redux-nav__dropdown" role="menu" aria-label="Designers submenu">
                <Link href="/designers/kimbomin" className="redux-nav__dropdown-item" role="menuitem">Kim Bomin</Link>
                <Link href="/designers/parkparang" className="redux-nav__dropdown-item" role="menuitem">Park Parang</Link>
                <Link href="/designers/leetaehyeon" className="redux-nav__dropdown-item" role="menuitem">Lee Taehyeon</Link>
                <Link href="/designers/choieunsol" className="redux-nav__dropdown-item" role="menuitem">Choi Eunsol</Link>
                <Link href="/designers/hwangjinsu" className="redux-nav__dropdown-item" role="menuitem">Hwang Jinsu</Link>
                <Link href="/designers/kimgyeongsu" className="redux-nav__dropdown-item" role="menuitem">Kim Gyeongsu</Link>
              </div>
            </li>

            {/* Exhibitions Menu */}
            <li className="redux-nav__item" role="none">
              <Link 
                href="/exhibitions" 
                className="redux-nav__link"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Exhibitions
              </Link>
              <div className="redux-nav__dropdown" role="menu" aria-label="Exhibitions submenu">
                <Link href="/exhibitions#cine-mode" className="redux-nav__dropdown-item" role="menuitem">CINE MODE</Link>
                <Link href="/exhibitions#the-room" className="redux-nav__dropdown-item" role="menuitem">THE ROOM OF [ ]</Link>
              </div>
            </li>

            {/* Contact Menu */}
            <li className="redux-nav__item" role="none">
              <Link href="/contact" className="redux-nav__link" role="menuitem">Contact</Link>
            </li>

            {/* Admin Menu */}
            <li className="redux-nav__item" role="none">
              <Link href="/admin" className="redux-nav__link" role="menuitem">Admin</Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button 
            className={`redux-nav__toggle ${mobileMenuActive ? 'redux-nav__toggle--active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={mobileMenuActive ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuActive}
            aria-controls="mobile-menu"
          >
            <span className="redux-nav__toggle-line" />
            <span className="redux-nav__toggle-line" />
            <span className="redux-nav__toggle-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`redux-nav__mobile ${mobileMenuActive ? 'redux-nav__mobile--active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="redux-nav__mobile-content">
          <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
          
          {/* About Mobile Menu */}
          <div className="redux-nav__mobile-item">
            <button 
              onClick={() => toggleSubmenu('about')}
              className="redux-nav__mobile-button"
              aria-expanded={activeSubmenu === 'about'}
              aria-controls="mobile-about-submenu"
            >
              About
            </button>
            <div 
              id="mobile-about-submenu"
              className={`redux-nav__mobile-submenu ${activeSubmenu === 'about' ? 'redux-nav__mobile-submenu--active' : ''}`}
            >
              <Link href="/about" onClick={closeMobileMenu}>About REDUX</Link>
              <Link href="/about/fashion-film" onClick={closeMobileMenu}>Fashion Film</Link>
              <Link href="/about/memory" onClick={closeMobileMenu}>Memory</Link>
              <Link href="/about/visual-art" onClick={closeMobileMenu}>Visual Art</Link>
              <Link href="/about/installation" onClick={closeMobileMenu}>Process</Link>
              <Link href="/about/collective" onClick={closeMobileMenu}>Collective</Link>
            </div>
          </div>

          {/* Designers Mobile Menu */}
          <div className="redux-nav__mobile-item">
            <button 
              onClick={() => toggleSubmenu('designers')}
              className="redux-nav__mobile-button"
              aria-expanded={activeSubmenu === 'designers'}
              aria-controls="mobile-designers-submenu"
            >
              Designers
            </button>
            <div 
              id="mobile-designers-submenu"
              className={`redux-nav__mobile-submenu ${activeSubmenu === 'designers' ? 'redux-nav__mobile-submenu--active' : ''}`}
            >
              <Link href="/designers" onClick={closeMobileMenu}>All Designers</Link>
              <Link href="/designers/kimbomin" onClick={closeMobileMenu}>Kim Bomin</Link>
              <Link href="/designers/parkparang" onClick={closeMobileMenu}>Park Parang</Link>
              <Link href="/designers/leetaehyeon" onClick={closeMobileMenu}>Lee Taehyeon</Link>
              <Link href="/designers/choieunsol" onClick={closeMobileMenu}>Choi Eunsol</Link>
              <Link href="/designers/hwangjinsu" onClick={closeMobileMenu}>Hwang Jinsu</Link>
              <Link href="/designers/kimgyeongsu" onClick={closeMobileMenu}>Kim Gyeongsu</Link>
            </div>
          </div>

          {/* Exhibitions Mobile Menu */}
          <div className="redux-nav__mobile-item">
            <Link href="/exhibitions" onClick={closeMobileMenu}>Exhibitions</Link>
          </div>

          {/* Contact Mobile Menu */}
          <div className="redux-nav__mobile-item">
            <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>
          </div>

          {/* Admin Mobile Menu */}
          <div className="redux-nav__mobile-item">
            <Link href="/admin" onClick={closeMobileMenu}>Admin</Link>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div 
          className="redux-nav__mobile-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      </div>

      {/* Enhanced CSS with BEM naming */}
      <style jsx global>{`
        /* Screen reader only utility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Navigation Variables */
        :root {
          --nav-transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          --nav-transition-fast: all 0.2s ease;
          --nav-blur: blur(20px);
          --nav-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          --nav-z-index: 1000;
        }

        /* Navigation Base */
        .redux-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          z-index: var(--nav-z-index);
          transition: var(--nav-transition);
          isolation: isolate;
          
          /* Dynamic styles based on page */
          mix-blend-mode: ${isHomePage ? 'difference' : 'normal'};
          background: ${
            isHomePage 
              ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)' 
              : 'rgba(255, 255, 255, 0.95)'
          };
          backdrop-filter: ${isHomePage ? 'blur(5px)' : 'var(--nav-blur)'};
          border-bottom: ${isHomePage ? 'none' : '1px solid rgba(0, 0, 0, 0.08)'};
        }

        .redux-nav--scrolled {
          padding: 15px 40px;
          background: ${
            isHomePage 
              ? 'rgba(0, 0, 0, 0.9)' 
              : 'rgba(255, 255, 255, 0.98)'
          };
          box-shadow: ${isHomePage ? 'none' : 'var(--nav-shadow)'};
          backdrop-filter: var(--nav-blur);
        }

        /* Navigation Container */
        .redux-nav__container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
        }

        /* Logo */
        .redux-nav__logo {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 800;
          letter-spacing: 0.05em;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          text-decoration: none;
          transition: var(--nav-transition);
          cursor: pointer;
          position: relative;
          z-index: 2;
        }

        .redux-nav__logo:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }

        /* Desktop Menu */
        .redux-nav__menu {
          display: flex;
          gap: clamp(20px, 4vw, 40px);
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .redux-nav__item {
          position: relative;
        }

        .redux-nav__link {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: clamp(13px, 1.2vw, 15px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          text-decoration: none;
          padding: 8px 0;
          display: block;
          transition: var(--nav-transition);
          position: relative;
          cursor: pointer;
        }

        /* Enhanced hover effects */
        .redux-nav__link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-mocha), var(--accent-warm));
          transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .redux-nav__item:hover .redux-nav__link::after {
          width: 100%;
        }

        .redux-nav__item:hover .redux-nav__link {
          color: ${isHomePage ? 'var(--accent-mocha)' : 'var(--accent-deep)'};
          transform: translateY(-1px);
        }

        /* Dropdown Menu */
        .redux-nav__dropdown {
          position: absolute;
          top: calc(100% + 15px);
          left: 50%;
          transform: translateX(-50%);
          background: ${
            isHomePage 
              ? 'rgba(0, 0, 0, 0.95)' 
              : 'rgba(255, 255, 255, 0.98)'
          };
          backdrop-filter: blur(20px);
          min-width: 200px;
          padding: 20px 0;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid ${
            isHomePage 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(0, 0, 0, 0.08)'
          };
          box-shadow: ${
            isHomePage 
              ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
              : '0 10px 40px rgba(0, 0, 0, 0.1)'
          };
          border-radius: 8px;
        }

        .redux-nav__item:hover .redux-nav__dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0px);
        }

        .redux-nav__dropdown-item {
          display: block;
          padding: 12px 25px;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          text-decoration: none;
          transition: var(--nav-transition-fast);
          position: relative;
        }

        .redux-nav__dropdown-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(180deg, var(--accent-mocha), var(--accent-warm));
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .redux-nav__dropdown-item:hover {
          background: ${
            isHomePage 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)'
          };
          padding-left: 35px;
          color: ${isHomePage ? 'var(--accent-mocha)' : 'var(--accent-deep)'};
        }

        .redux-nav__dropdown-item:hover::before {
          transform: scaleY(1);
        }

        /* Mobile Menu Toggle */
        .redux-nav__toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          position: relative;
          z-index: 1001;
        }

        .redux-nav__toggle-line {
          width: 100%;
          height: 2px;
          background: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          transform-origin: center;
        }

        .redux-nav__toggle--active .redux-nav__toggle-line:nth-child(1) {
          transform: rotate(45deg) translateY(9px);
        }

        .redux-nav__toggle--active .redux-nav__toggle-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .redux-nav__toggle--active .redux-nav__toggle-line:nth-child(3) {
          transform: rotate(-45deg) translateY(-9px);
        }

        /* Mobile Menu */
        .redux-nav__mobile {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: none;
        }

        .redux-nav__mobile--active {
          transform: translateX(0);
        }

        .redux-nav__mobile-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 25px;
          padding: 80px 20px 40px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .redux-nav__mobile-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: -1;
        }

        .redux-nav__mobile-item {
          text-align: center;
          width: 100%;
          max-width: 320px;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: calc(var(--index, 0) * 0.1s);
        }

        .redux-nav__mobile--active .redux-nav__mobile-item {
          --index: 1;
        }

        .redux-nav__mobile--active .redux-nav__mobile-item:nth-child(2) { --index: 2; }
        .redux-nav__mobile--active .redux-nav__mobile-item:nth-child(3) { --index: 3; }
        .redux-nav__mobile--active .redux-nav__mobile-item:nth-child(4) { --index: 4; }
        .redux-nav__mobile--active .redux-nav__mobile-item:nth-child(5) { --index: 5; }
        .redux-nav__mobile--active .redux-nav__mobile-item:nth-child(6) { --index: 6; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .redux-nav__mobile-button,
        .redux-nav__mobile-item > a {
          font-family: 'Inter', sans-serif;
          font-size: clamp(18px, 4vw, 22px);
          font-weight: 300;
          color: var(--primary-white);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 15px 25px;
          display: block;
          width: 100%;
          transition: all 0.3s ease;
          border-radius: 8px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .redux-nav__mobile-button:hover,
        .redux-nav__mobile-item > a:hover,
        .redux-nav__mobile-button:focus,
        .redux-nav__mobile-item > a:focus {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.02);
          outline: none;
        }

        .redux-nav__mobile-submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          margin-top: 10px;
        }

        .redux-nav__mobile-submenu--active {
          max-height: 400px;
        }

        .redux-nav__mobile-submenu a {
          font-size: 16px;
          font-weight: 300;
          color: var(--primary-white);
          opacity: 0.8;
          text-decoration: none;
          padding: 12px 25px;
          display: block;
          transition: all 0.3s ease;
          border-radius: 6px;
          margin: 2px 0;
        }

        .redux-nav__mobile-submenu a:hover,
        .redux-nav__mobile-submenu a:focus {
          opacity: 1;
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(5px);
          outline: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .redux-nav {
            padding: 15px 20px;
          }
          
          .redux-nav--scrolled {
            padding: 12px 20px;
          }
          
          .redux-nav__menu {
            display: none;
          }
          
          .redux-nav__toggle {
            display: flex;
          }
          
          .redux-nav__mobile {
            display: block;
          }

          .redux-nav__logo {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .redux-nav {
            padding: 12px 15px;
          }
          
          .redux-nav--scrolled {
            padding: 10px 15px;
          }

          .redux-nav__mobile-content {
            padding: 60px 15px 30px;
            gap: 20px;
          }

          .redux-nav__mobile-button,
          .redux-nav__mobile-item > a {
            font-size: 18px;
            padding: 12px 20px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .redux-nav__link::after {
            background: currentColor;
          }
          
          .redux-nav__dropdown {
            border-width: 2px;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .redux-nav,
          .redux-nav__logo,
          .redux-nav__link,
          .redux-nav__dropdown,
          .redux-nav__dropdown-item,
          .redux-nav__toggle-line,
          .redux-nav__mobile,
          .redux-nav__mobile-button,
          .redux-nav__mobile-submenu {
            transition: none;
          }
          
          .redux-nav__mobile-item {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}