'use client';

import { useState, useRef, useEffect } from 'react';
import { DESIGN_TOKENS, layoutUtils } from '@/lib/design-system';
import NavLink from './NavLink';

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Dropdown component - 드롭다운 메뉴 컴포넌트
 * 데스크톱 네비게이션에서 사용
 */
export default function Dropdown({ 
  trigger, 
  items, 
  className,
  align = 'center' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter/leave for hover effect
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to prevent flickering
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  const dropdownClass = layoutUtils.combineClasses(
    'absolute top-full mt-5 min-w-[180px] py-[15px]',
    'bg-black/95 backdrop-blur-[10px] border border-white/10',
    'transition-all duration-300 ease-in-out',
    getAlignmentClasses(),
    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
    `z-[${DESIGN_TOKENS.zIndex.dropdown}]`
  );

  const containerClass = layoutUtils.combineClasses(
    'relative',
    className
  );

  return (
    <div 
      ref={dropdownRef}
      className={containerClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      <div className={dropdownClass}>
        {items.map((item, index) => (
          <NavLink
            key={index}
            href={item.href}
            variant="dropdown"
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/**
 * MobileAccordion component - 모바일 아코디언 메뉴
 */
interface MobileAccordionProps {
  label: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

export function MobileAccordion({ 
  label, 
  items, 
  isOpen, 
  onToggle,
  index 
}: MobileAccordionProps) {
  const triggerClass = layoutUtils.combineClasses(
    'mobile-menu-item',
    'text-[clamp(20px,5vw,24px)] text-white tracking-[2px]',
    'cursor-pointer transition-all duration-300 ease-in-out',
    'text-center py-[15px] px-5 w-full max-w-[300px]',
    'min-h-[44px] flex items-center justify-center', // Ensure 44px touch target
    'rounded-md hover:bg-white/10 focus:bg-white/10',
    'active:scale-95 active:bg-white/20' // Touch feedback
  );

  const submenuClass = layoutUtils.combineClasses(
    'mobile-submenu',
    'flex-col gap-[10px] mt-3 w-full',
    'transition-all duration-300 ease-in-out',
    isOpen ? 'active flex opacity-100 max-h-[500px]' : 'hidden opacity-0 max-h-0'
  );

  return (
    <div 
      className="w-full"
      style={{ 
        '--i': index + 1, 
        animationDelay: `calc(var(--i) * 0.1s)` 
      } as React.CSSProperties}
    >
      <button 
        className={triggerClass}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${label} menu`}
        type="button"
      >
        {label}
        <span 
          className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      <div className={submenuClass}>
        {items.map((item, itemIndex) => (
          <NavLink
            key={itemIndex}
            href={item.href}
            variant="mobile"
            className="mobile-submenu-item text-base text-white/70 
                     py-3 px-6 text-center 
                     min-h-[44px] flex items-center justify-center
                     rounded-md transition-all duration-300 ease-in-out
                     hover:text-white hover:bg-white/10 
                     focus:text-white focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30
                     active:scale-95 active:bg-white/20"
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/**
 * MobileMenuToggle component - 모바일 메뉴 토글 버튼
 */
interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileMenuToggle({ 
  isOpen, 
  onToggle, 
  className 
}: MobileMenuToggleProps) {
  const toggleClass = layoutUtils.combineClasses(
    'menu-toggle hidden flex-col justify-center items-center relative',
    'w-[44px] h-[44px] min-w-[44px] min-h-[44px]', // Ensure 44px minimum touch target
    'cursor-pointer rounded-md',
    'z-[10000]',
    'max-[768px]:flex',
    'hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30',
    'transition-all duration-300 ease-in-out',
    'active:scale-95', // Touch feedback
    className
  );

  const lineClass = 'w-[24px] h-[2px] bg-white transition-all duration-300 ease-in-out absolute';

  return (
    <button 
      className={toggleClass}
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      type="button"
    >
      <span 
        className={layoutUtils.combineClasses(
          lineClass,
          isOpen 
            ? 'top-1/2 -translate-y-1/2 rotate-45' 
            : 'top-0'
        )}
      />
      <span 
        className={layoutUtils.combineClasses(
          lineClass,
          'top-1/2 -translate-y-1/2',
          isOpen ? 'opacity-0' : 'opacity-100'
        )}
      />
      <span 
        className={layoutUtils.combineClasses(
          lineClass,
          isOpen 
            ? 'bottom-1/2 translate-y-1/2 -rotate-45' 
            : 'bottom-0'
        )}
      />
    </button>
  );
}