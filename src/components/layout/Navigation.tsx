'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// HTML redux6 index.html과 완전 동일한 Navigation 컴포넌트 - 페이지별 스타일 적용
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  // 홈페이지인지 확인 (HTML 버전과 동일한 로직)
  const isHomePage = pathname === '/';

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

      {/* Navigation - HTML redux6 버전과 완전 동일 - 페이지별 스타일 적용 */}
      <nav 
        id="navbar"
        className={scrolled ? 'scrolled' : ''}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: scrolled ? '15px 40px' : '20px 40px',
          zIndex: 1000,
          mixBlendMode: isHomePage ? 'difference' : 'normal',
          background: isHomePage ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: isHomePage ? 'none' : 'blur(10px)',
          borderBottom: isHomePage ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: isHomePage ? 'none' : (scrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none'),
          transition: 'all 0.3s ease',
          isolation: 'isolate'
        }}
      >
        <div className="nav-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <Link href="/" className="logo" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: isHomePage ? 'var(--primary-white)' : '#000',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
            REDUX
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-menu" style={{
            display: 'flex',
            gap: '40px',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {/* About Menu */}
            <li className="nav-item" style={{
              position: 'relative'
            }}>
              <Link href="/about" style={{
                color: isHomePage ? 'var(--primary-white)' : '#000',
                textDecoration: 'none',
                display: 'block',
                padding: '5px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                willChange: 'transform, opacity, filter'
              }}>About</Link>
              <div className="dropdown-menu" style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isHomePage ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                minWidth: '180px',
                padding: '15px 0',
                marginTop: '20px',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.3s ease',
                border: isHomePage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isHomePage ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <Link 
                  href="/about/fashion-film" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Fashion Film</Link>
                <Link 
                  href="/about/memory" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Memory</Link>
                <Link 
                  href="/about/visual-art" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Visual Art</Link>
                <Link 
                  href="/about/installation" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Process</Link>
                <Link 
                  href="/about/collective" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Collective</Link>
              </div>
            </li>

            {/* Designers Menu */}
            <li className="nav-item" style={{
              position: 'relative'
            }}>
              <Link href="/designers" style={{
                color: 'var(--primary-white)',
                textDecoration: 'none',
                display: 'block',
                padding: '5px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                willChange: 'transform, opacity, filter'
              }}>Designers</Link>
              <div className="dropdown-menu" style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isHomePage ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                minWidth: '180px',
                padding: '15px 0',
                marginTop: '20px',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.3s ease',
                border: isHomePage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isHomePage ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <Link 
                  href="/designers/kimbomin" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Kim Bomin</Link>
                <Link 
                  href="/designers/parkparang" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Park Parang</Link>
                <Link 
                  href="/designers/leetaehyeon" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Lee Taehyeon</Link>
                <Link 
                  href="/designers/choieunsol" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Choi Eunsol</Link>
                <Link 
                  href="/designers/hwangjinsu" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Hwang Jinsu</Link>
                <Link 
                  href="/designers/kimgyeongsu" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >Kim Gyeongsu</Link>
              </div>
            </li>

            {/* Exhibitions Menu */}
            <li className="nav-item" style={{
              position: 'relative'
            }}>
              <Link href="/exhibitions" style={{
                color: 'var(--primary-white)',
                textDecoration: 'none',
                display: 'block',
                padding: '5px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                willChange: 'transform, opacity, filter'
              }}>Exhibitions</Link>
              <div className="dropdown-menu" style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isHomePage ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                minWidth: '180px',
                padding: '15px 0',
                marginTop: '20px',
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.3s ease',
                border: isHomePage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isHomePage ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <Link 
                  href="/exhibitions#cine-mode" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >CINE MODE</Link>
                <Link 
                  href="/exhibitions#the-room" 
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 25px',
                    color: isHomePage ? 'var(--primary-white)' : '#000',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >THE ROOM OF [ ]</Link>
              </div>
            </li>

            {/* Contact Menu */}
            <li className="nav-item" style={{
              position: 'relative'
            }}>
              <Link href="/contact" style={{
                color: 'var(--primary-white)',
                textDecoration: 'none',
                display: 'block',
                padding: '5px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                willChange: 'transform, opacity, filter'
              }}>Contact</Link>
            </li>

            {/* Admin Menu */}
            <li className="nav-item" style={{
              position: 'relative'
            }}>
              <Link href="/admin" style={{
                color: 'var(--primary-white)',
                textDecoration: 'none',
                display: 'block',
                padding: '5px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                willChange: 'transform, opacity, filter'
              }}>Admin</Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <div 
            className={`menu-toggle ${mobileMenuActive ? 'active' : ''}`}
            id="menuToggle"
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 1001,
              position: 'relative',
              width: '30px',
              height: '20px',
              cursor: 'pointer',
              mixBlendMode: (mobileMenuActive || !isHomePage) ? 'normal' : 'difference',
              padding: '10px',
              margin: '-10px'
            }}
          >
            <span style={{
              width: '100%',
              height: '2px',
              background: isHomePage ? 'var(--primary-white)' : '#000',
              transition: 'all 0.3s ease',
              position: 'absolute',
              top: mobileMenuActive ? '50%' : '0',
              transform: mobileMenuActive ? 'translateY(-50%) rotate(45deg)' : 'none'
            }}></span>
            <span style={{
              width: '100%',
              height: '2px',
              background: isHomePage ? 'var(--primary-white)' : '#000',
              transition: 'all 0.3s ease',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: mobileMenuActive ? 0 : 1
            }}></span>
            <span style={{
              width: '100%',
              height: '2px',
              background: isHomePage ? 'var(--primary-white)' : '#000',
              transition: 'all 0.3s ease',
              position: 'absolute',
              bottom: mobileMenuActive ? '50%' : '0',
              transform: mobileMenuActive ? 'translateY(50%) rotate(-45deg)' : 'none'
            }}></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - HTML 버전과 완전 동일 */}
      <div 
        className={`mobile-menu ${mobileMenuActive ? 'active' : ''}`}
        id="mobileMenu"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: isHomePage ? 'var(--primary-black)' : '#fff',
          zIndex: 999,
          transform: mobileMenuActive ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s ease',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="mobile-menu-content" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: '30px',
          padding: '80px 20px 40px'
        }}>
          {/* About Mobile Menu */}
          <div className="mobile-menu-item" style={{'--i': 1} as React.CSSProperties}>
            <span onClick={() => toggleSubmenu('about')} style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: 'var(--primary-white)',
              letterSpacing: '2px',
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '300px',
              display: 'block'
            }}>About</span>
            <div className={`mobile-submenu ${activeSubmenu === 'about' ? 'active' : ''}`} id="aboutSubmenu" style={{
              display: activeSubmenu === 'about' ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '20px',
              paddingLeft: '20px',
              width: '100%'
            }}>
              <Link href="/about" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>About REDUX</Link>
              <Link href="/about/fashion-film" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Fashion Film</Link>
              <Link href="/about/memory" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Memory</Link>
              <Link href="/about/visual-art" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Visual Art</Link>
              <Link href="/about/installation" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Process</Link>
              <Link href="/about/collective" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Collective</Link>
            </div>
          </div>

          {/* Designers Mobile Menu */}
          <div className="mobile-menu-item" style={{'--i': 2} as React.CSSProperties}>
            <span onClick={() => toggleSubmenu('designers')} style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: 'var(--primary-white)',
              letterSpacing: '2px',
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '300px',
              display: 'block'
            }}>Designers</span>
            <div className={`mobile-submenu ${activeSubmenu === 'designers' ? 'active' : ''}`} id="designersSubmenu" style={{
              display: activeSubmenu === 'designers' ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '20px',
              paddingLeft: '20px',
              width: '100%'
            }}>
              <Link href="/designers" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>All Designers</Link>
              <Link href="/designers/kimbomin" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Kim Bomin</Link>
              <Link href="/designers/parkparang" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Park Parang</Link>
              <Link href="/designers/leetaehyeon" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Lee Taehyeon</Link>
              <Link href="/designers/choieunsol" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Choi Eunsol</Link>
              <Link href="/designers/hwangjinsu" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Hwang Jinsu</Link>
              <Link href="/designers/kimgyeongsu" className="mobile-submenu-item" onClick={() => setMobileMenuActive(false)} style={{
                fontSize: '16px',
                color: 'var(--primary-white)',
                opacity: 0.7,
                textDecoration: 'none',
                transition: 'opacity 0.3s ease',
                padding: '8px 16px',
                textAlign: 'left'
              }}>Kim Gyeongsu</Link>
            </div>
          </div>

          {/* Exhibitions Mobile Menu */}
          <div className="mobile-menu-item" style={{'--i': 3} as React.CSSProperties}>
            <Link href="/exhibitions" onClick={() => setMobileMenuActive(false)} style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: 'var(--primary-white)',
              letterSpacing: '2px',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '300px',
              display: 'block'
            }}>Exhibitions</Link>
          </div>

          {/* Contact Mobile Menu */}
          <div className="mobile-menu-item" style={{'--i': 4} as React.CSSProperties}>
            <Link href="/contact" onClick={() => setMobileMenuActive(false)} style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: 'var(--primary-white)',
              letterSpacing: '2px',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '300px',
              display: 'block'
            }}>Contact</Link>
          </div>

          {/* Admin Mobile Menu */}
          <div className="mobile-menu-item" style={{'--i': 5} as React.CSSProperties}>
            <Link href="/admin" onClick={() => setMobileMenuActive(false)} style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: 'var(--primary-white)',
              letterSpacing: '2px',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '300px',
              display: 'block'
            }}>Admin</Link>
          </div>
        </div>
      </div>

      {/* CSS for hover effects and responsive behavior */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-menu {
            display: none !important;
          }
          
          .menu-toggle {
            display: flex !important;
          }
          
          .mobile-menu {
            display: block !important;
            padding: 1.5rem !important;
            background: rgba(0,0,0,0.95) !important;
            backdrop-filter: blur(20px) !important;
          }
        }

        .nav-item:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          margin-top: 10px !important;
        }

        .nav-item::after {
          content: '' !important;
          position: absolute !important;
          width: 0 !important;
          height: 1px !important;
          bottom: -4px !important;
          left: 0 !important;
          background: linear-gradient(90deg, var(--accent-mocha), var(--accent-warm)) !important;
          transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }

        .nav-item:hover::after {
          width: 100% !important;
        }

        .nav-item:hover,
        .nav-item:hover a {
          color: var(--accent-mocha) !important;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          padding-left: 30px !important;
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid rgba(0, 0, 0, 0.95);
        }

        .logo:hover {
          opacity: 0.7 !important;
          transform: scale(1.02) !important;
        }

        .mobile-menu-item:hover {
          opacity: 0.7 !important;
        }

        .mobile-submenu-item:hover {
          opacity: 1 !important;
        }

        .mobile-menu-item {
          opacity: 0;
          transform: translateY(20px);
          animation: mobileMenuFade 0.5s ease forwards;
          animation-delay: calc(var(--i) * 0.1s);
        }

        @keyframes mobileMenuFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}