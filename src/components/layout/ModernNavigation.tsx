'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DESIGN_TOKENS, COMMON_CLASSES, layoutUtils } from '@/lib/design-system';
import { navigationItems, mobileNavigationItems } from '@/data/navigation';
import NavLink from '@/components/ui/NavLink';
import Dropdown, { MobileAccordion, MobileMenuToggle } from '@/components/ui/Dropdown';

/**
 * ModernNavigation component - 모던한 네비게이션 컴포넌트
 * 디자인 시스템을 사용하여 재구축된 네비게이션
 */
export default function ModernNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Scroll effect handling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu body scroll lock
  useEffect(() => {
    if (mobileMenuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveSubmenu(null);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuActive]);

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setMobileMenuActive(!mobileMenuActive);
  };

  // Mobile submenu toggle handler
  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const navClass = layoutUtils.combineClasses(
    COMMON_CLASSES.nav,
    scrolled ? 'p-[15px_40px]' : 'p-[20px_40px]'
  );

  const containerClass = layoutUtils.combineClasses(
    'nav-container flex justify-between items-center max-w-[1600px] mx-auto'
  );

  const logoClass = layoutUtils.combineClasses(
    "font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em]",
    'text-white transition-all duration-300 ease-in-out',
    'cursor-pointer no-underline hover:opacity-70 hover:scale-[1.02]'
  );

  const desktopMenuClass = layoutUtils.combineClasses(
    'nav-menu flex gap-10 list-none max-[768px]:hidden'
  );

  const mobileMenuClass = layoutUtils.combineClasses(
    'mobile-menu fixed top-0 left-0 w-full h-screen',
    'bg-black/95 backdrop-blur-[20px]',
    'z-[9999]',
    'transition-transform duration-500 ease-in-out overflow-y-auto',
    'hidden max-[768px]:block p-6',
    mobileMenuActive ? 'translate-x-0' : 'translate-x-full'
  );

  const mobileContentClass = layoutUtils.combineClasses(
    'mobile-menu-content flex flex-col justify-center items-center',
    'min-h-screen gap-[30px] py-20 px-5'
  );

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav 
        className={navClass}
        style={{ 
          background: scrolled 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div className={containerClass}>
          {/* Logo */}
          <Link 
            href="/" 
            className={logoClass}
            style={{
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            REDUX
          </Link>

          {/* Desktop Menu */}
          <ul className={desktopMenuClass}>
            {navigationItems.map((item, index) => (
              <li key={index} className="nav-item relative">
                {item.dropdown ? (
                  <Dropdown
                    trigger={
                      <NavLink
                        href={item.href}
                        variant="primary"
                        style={{
                          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          willChange: 'transform, opacity, filter'
                        }}
                      >
                        {item.label}
                      </NavLink>
                    }
                    items={item.dropdown}
                    align="center"
                  />
                ) : (
                  <NavLink
                    href={item.href}
                    variant="primary"
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      willChange: 'transform, opacity, filter'
                    }}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
            
            {/* Admin Menu */}
            <li className="nav-item relative">
              <NavLink
                href="/admin"
                variant="primary"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  willChange: 'transform, opacity, filter'
                }}
              >
                Admin
              </NavLink>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle
            isOpen={mobileMenuActive}
            onToggle={toggleMobileMenu}
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={mobileMenuClass}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className={mobileContentClass}>
          {mobileNavigationItems.map((item, index) => (
            item.dropdown ? (
              <MobileAccordion
                key={index}
                label={item.label}
                items={item.dropdown}
                isOpen={activeSubmenu === item.label.toLowerCase()}
                onToggle={() => toggleSubmenu(item.label.toLowerCase())}
                index={index}
              />
            ) : (
              <div 
                key={index}
                className="mobile-menu-item w-full"
                style={{ 
                  '--i': index + 1, 
                  animationDelay: `calc(var(--i) * 0.1s)` 
                } as React.CSSProperties}
              >
                <NavLink
                  href={item.href}
                  variant="mobile"
                  className="text-[clamp(20px,5vw,24px)] text-white tracking-[2px] 
                           min-h-[44px] flex items-center justify-center
                           py-[15px] px-5 w-full max-w-[300px] mx-auto
                           rounded-md transition-all duration-300 ease-in-out
                           hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30
                           active:scale-95 active:bg-white/20
                           no-underline text-center"
                  onClick={() => setMobileMenuActive(false)}
                >
                  {item.label}
                </NavLink>
              </div>
            )
          ))}

          {/* Admin Mobile Menu */}
          <div 
            className="mobile-menu-item w-full"
            style={{ 
              '--i': mobileNavigationItems.length + 1, 
              animationDelay: `calc(var(--i) * 0.1s)` 
            } as React.CSSProperties}
          >
            <NavLink
              href="/admin"
              variant="mobile"
              className="text-[clamp(20px,5vw,24px)] text-white tracking-[2px] 
                       min-h-[44px] flex items-center justify-center
                       py-[15px] px-5 w-full max-w-[300px] mx-auto
                       rounded-md transition-all duration-300 ease-in-out
                       hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30
                       active:scale-95 active:bg-white/20
                       no-underline text-center"
              onClick={() => setMobileMenuActive(false)}
            >
              Admin
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Legacy Navigation component wrapper
 * 기존 Navigation 컴포넌트와의 호환성 유지
 */
export { ModernNavigation as Navigation };