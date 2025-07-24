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
    'cursor-pointer transition-opacity duration-300 ease-in-out',
    'text-center py-[10px] px-5 w-full max-w-[300px]'
  );

  const submenuClass = layoutUtils.combineClasses(
    'mobile-submenu',
    'flex-col gap-[15px] mt-5 pl-5 w-full',
    isOpen ? 'active flex' : 'hidden'
  );

  return (
    <div 
      className={triggerClass}
      style={{ 
        '--i': index + 1, 
        animationDelay: `calc(var(--i) * 0.1s)` 
      } as React.CSSProperties}
    >
      <span onClick={onToggle}>{label}</span>
      <div className={submenuClass}>
        {items.map((item, itemIndex) => (
          <NavLink
            key={itemIndex}
            href={item.href}
            variant="mobile"
            className="mobile-submenu-item text-base opacity-70 py-2 px-4 text-left hover:opacity-100"
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
    'menu-toggle hidden flex-col gap-[5px] relative w-[30px] h-5',
    'cursor-pointer p-[10px] -m-[10px]',
    `z-[${DESIGN_TOKENS.zIndex.modal + 1}]`,
    'max-[768px]:flex',
    className
  );

  const lineClass = 'w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute';

  return (
    <div 
      className={toggleClass}
      onClick={onToggle}
      style={{
        mixBlendMode: isOpen ? 'normal' : 'difference'
      }}
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
    </div>
  );
}