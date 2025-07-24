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
  
  // 홈페이지인지 확인
  const isHomePage = pathname === '/';
  
  // About 서브페이지 여부 확인 - 이 페이지들은 자체 네비게이션을 가짐
  const aboutSubPages = [
    '/about/fashion-film',
    '/about/visual-art', 
    '/about/memory',
    '/about/installation',
    '/about/collective'
  ];
  const isAboutSubPage = aboutSubPages.includes(pathname);
  
  // About 서브페이지에서는 네비게이션을 렙더링하지 않음
  if (isAboutSubPage) {
    return null;
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
    
    if (!mobileMenuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveSubmenu(null);
    }
  };

  // Toggle submenu
  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <nav 
        id="navbar"
        className={`nav ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="nav-container">
          {/* Logo */}
          <Link href="/" className="logo">
            REDUX
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-menu">
            {/* About Menu */}
            <li className="nav-item">
              <Link href="/about">About</Link>
              <div className="dropdown-menu">
                <Link href="/about/fashion-film" className="dropdown-item">Fashion Film</Link>
                <Link href="/about/memory" className="dropdown-item">Memory</Link>
                <Link href="/about/visual-art" className="dropdown-item">Visual Art</Link>
                <Link href="/about/installation" className="dropdown-item">Process</Link>
                <Link href="/about/collective" className="dropdown-item">Collective</Link>
              </div>
            </li>

            {/* Designers Menu */}
            <li className="nav-item">
              <Link href="/designers">Designers</Link>
              <div className="dropdown-menu">
                <Link href="/designers/kimbomin" className="dropdown-item">Kim Bomin</Link>
                <Link href="/designers/parkparang" className="dropdown-item">Park Parang</Link>
                <Link href="/designers/leetaehyeon" className="dropdown-item">Lee Taehyeon</Link>
                <Link href="/designers/choieunsol" className="dropdown-item">Choi Eunsol</Link>
                <Link href="/designers/hwangjinsu" className="dropdown-item">Hwang Jinsu</Link>
                <Link href="/designers/kimgyeongsu" className="dropdown-item">Kim Gyeongsu</Link>
              </div>
            </li>

            {/* Exhibitions Menu */}
            <li className="nav-item">
              <Link href="/exhibitions">Exhibitions</Link>
              <div className="dropdown-menu">
                <Link href="/exhibitions#cine-mode" className="dropdown-item">CINE MODE</Link>
                <Link href="/exhibitions#the-room" className="dropdown-item">THE ROOM OF [ ]</Link>
              </div>
            </li>

            {/* Contact Menu */}
            <li className="nav-item">
              <Link href="/contact">Contact</Link>
            </li>

            {/* Admin Menu */}
            <li className="nav-item">
              <Link href="/admin">Admin</Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <div 
            className={`menu-toggle ${mobileMenuActive ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuActive ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {/* About Mobile Menu */}
          <div className="mobile-menu-item">
            <span onClick={() => toggleSubmenu('about')}>About</span>
            <div className={`mobile-submenu ${activeSubmenu === 'about' ? 'active' : ''}`}>
              <Link href="/about" onClick={() => setMobileMenuActive(false)}>About REDUX</Link>
              <Link href="/about/fashion-film" onClick={() => setMobileMenuActive(false)}>Fashion Film</Link>
              <Link href="/about/memory" onClick={() => setMobileMenuActive(false)}>Memory</Link>
              <Link href="/about/visual-art" onClick={() => setMobileMenuActive(false)}>Visual Art</Link>
              <Link href="/about/installation" onClick={() => setMobileMenuActive(false)}>Process</Link>
              <Link href="/about/collective" onClick={() => setMobileMenuActive(false)}>Collective</Link>
            </div>
          </div>

          {/* Designers Mobile Menu */}
          <div className="mobile-menu-item">
            <span onClick={() => toggleSubmenu('designers')}>Designers</span>
            <div className={`mobile-submenu ${activeSubmenu === 'designers' ? 'active' : ''}`}>
              <Link href="/designers" onClick={() => setMobileMenuActive(false)}>All Designers</Link>
              <Link href="/designers/kimbomin" onClick={() => setMobileMenuActive(false)}>Kim Bomin</Link>
              <Link href="/designers/parkparang" onClick={() => setMobileMenuActive(false)}>Park Parang</Link>
              <Link href="/designers/leetaehyeon" onClick={() => setMobileMenuActive(false)}>Lee Taehyeon</Link>
              <Link href="/designers/choieunsol" onClick={() => setMobileMenuActive(false)}>Choi Eunsol</Link>
              <Link href="/designers/hwangjinsu" onClick={() => setMobileMenuActive(false)}>Hwang Jinsu</Link>
              <Link href="/designers/kimgyeongsu" onClick={() => setMobileMenuActive(false)}>Kim Gyeongsu</Link>
            </div>
          </div>

          {/* Exhibitions Mobile Menu */}
          <div className="mobile-menu-item">
            <Link href="/exhibitions" onClick={() => setMobileMenuActive(false)}>Exhibitions</Link>
          </div>

          {/* Contact Mobile Menu */}
          <div className="mobile-menu-item">
            <Link href="/contact" onClick={() => setMobileMenuActive(false)}>Contact</Link>
          </div>

          {/* Admin Mobile Menu */}
          <div className="mobile-menu-item">
            <Link href="/admin" onClick={() => setMobileMenuActive(false)}>Admin</Link>
          </div>
        </div>
      </div>

      {/* CSS Styles - HTML 버전과 완전 동일 */}
      <style jsx global>{`
        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --accent-deep: #9A9086;
          --accent-neutral: #F8F6F4;
          --gray-100: #F8F8F8;
          --gray-200: #E8E8E8;
          --gray-300: #D0D0D0;
          --gray-400: #A0A0A0;
          --gray-500: #707070;
          --gray-600: #505050;
          --gray-700: #303030;
          --gray-800: #202020;
          --gray-900: #101010;
        }

        /* Noise Overlay */
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.03;
          z-index: 1;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px),
            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px);
        }

        /* Navigation - 강화된 호버 효과 */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          z-index: 1000;
          mix-blend-mode: ${isHomePage ? 'difference' : 'normal'};
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          isolation: isolate;
          background: ${isHomePage ? 'transparent' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: ${isHomePage ? 'none' : 'blur(10px)'};
          border-bottom: ${isHomePage ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};
        }

        .nav.scrolled {
          padding: 15px 40px;
          box-shadow: ${isHomePage ? 'none' : '0 2px 20px rgba(0, 0, 0, 0.1)'};
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
        }

        .logo {
          font-family: 'Playfair Display', serif !important;
          font-size: 24px;
          font-weight: 800 !important;
          letter-spacing: 0.05em !important;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          cursor: pointer;
          text-decoration: none;
        }

        .logo:hover {
          opacity: 0.7;
          transform: scale(1.02) !important;
        }

        .nav-menu {
          display: flex;
          gap: 40px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          position: relative;
          font-family: 'Inter', sans-serif !important;
          font-weight: 300 !important;
          font-size: clamp(0.875rem, 1.5vw, 1rem) !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-item a {
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          text-decoration: none;
          display: block;
          padding: 5px 0;
          transition: all 0.3s ease;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          transition: width 0.3s ease;
        }

        .nav-item:hover::before {
          width: 100%;
        }

        .nav-item:hover,
        .nav-item:hover a {
          opacity: 0.7;
          transform: translateY(-1px);
        }
        
        /* 드롭다운 호버 효과 강화 */
        .nav-item:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          margin-top: 10px;
          transform: translateX(-50%) translateY(0);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: ${isHomePage ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
          backdrop-filter: blur(10px);
          min-width: 180px;
          padding: 15px 0;
          margin-top: 20px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          border: 1px solid ${isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          box-shadow: ${isHomePage ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.1)'};
        }

        .nav-item:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          margin-top: 10px;
        }

        .dropdown-item {
          display: block;
          padding: 10px 25px;
          color: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: ${isHomePage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          padding-left: 30px;
          transform: translateX(5px);
        }

        /* Mobile Menu Toggle */
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          width: 30px;
          height: 20px;
          position: relative;
        }

        .menu-toggle span {
          width: 100%;
          height: 2px;
          background: ${isHomePage ? 'var(--primary-white)' : 'var(--primary-black)'};
          transition: all 0.3s ease;
          position: absolute;
        }

        .menu-toggle span:nth-child(1) {
          top: 0;
        }

        .menu-toggle span:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }

        .menu-toggle span:nth-child(3) {
          bottom: 0;
        }

        .menu-toggle.active span:nth-child(1) {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        .menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle.active span:nth-child(3) {
          bottom: 50%;
          transform: translateY(50%) rotate(-45deg);
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.5s ease;
          overflow-y: auto;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          gap: 30px;
          padding: 80px 20px 40px;
        }

        .mobile-menu-item {
          text-align: center;
          width: 100%;
          max-width: 300px;
        }

        .mobile-menu-item > span,
        .mobile-menu-item > a {
          font-size: clamp(20px, 5vw, 24px);
          color: var(--primary-white);
          letter-spacing: 2px;
          cursor: pointer;
          text-decoration: none;
          padding: 10px 20px;
          display: block;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-item:hover > span,
        .mobile-menu-item:hover > a {
          opacity: 0.7;
        }

        .mobile-submenu {
          display: none;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
          padding-left: 20px;
        }

        .mobile-submenu.active {
          display: flex;
        }

        .mobile-submenu a {
          font-size: 16px;
          color: var(--primary-white);
          opacity: 0.7;
          text-decoration: none;
          transition: opacity 0.3s ease;
          padding: 8px 16px;
          text-align: left;
        }

        .mobile-submenu a:hover {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          
          .menu-toggle {
            display: flex;
          }
          
          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </>
  );
}