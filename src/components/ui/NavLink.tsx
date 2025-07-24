import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPONENT_STYLES, TYPOGRAPHY, layoutUtils } from '@/lib/design-system';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'dropdown' | 'mobile' | 'footer';
  isActive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * NavLink component - 네비게이션 링크 컴포넌트
 * 다양한 스타일 변형과 활성 상태 지원
 */
export default function NavLink({ 
  href, 
  children, 
  className,
  variant = 'primary',
  isActive,
  onClick,
  style
}: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          'block py-[5px] font-light text-[clamp(0.875rem,1.5vw,1rem)] tracking-[0.1em] uppercase',
          'hover:text-[--accent-mocha]',
          'transition-all duration-300 ease-in-out',
          active ? 'text-[--accent-mocha]' : ''
        );
        
      case 'dropdown':
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          'block py-[10px] px-[25px] text-xs tracking-[1px] uppercase',
          'whitespace-nowrap hover:bg-white/10 hover:pl-[30px]',
          'transition-all duration-300 ease-in-out'
        );
        
      case 'mobile':
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          'text-[clamp(20px,5vw,24px)] tracking-[2px] py-[10px] px-5',
          'transition-opacity duration-300 ease-in-out',
          active ? 'text-[--accent-mocha]' : ''
        );
        
      case 'footer':
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          'text-[13px] tracking-[1px] uppercase',
          'hover:opacity-70 transition-opacity duration-300',
          'max-[768px]:text-xs'
        );
        
      default:
        return COMPONENT_STYLES.link.base;
    }
  };

  const linkClass = layoutUtils.combineClasses(
    getVariantClasses(),
    className
  );

  return (
    <Link 
      href={href} 
      className={linkClass}
      style={style}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

/**
 * ExternalLink component - 외부 링크 컴포넌트
 */
interface ExternalLinkProps extends Omit<NavLinkProps, 'href'> {
  href: string;
  target?: string;
  rel?: string;
}

export function ExternalLink({ 
  href, 
  children, 
  target = '_blank',
  rel = 'noopener noreferrer',
  className,
  variant = 'primary',
  onClick
}: ExternalLinkProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'footer':
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          COMPONENT_STYLES.link.underline,
          'text-sm tracking-[1px]',
          'hover:opacity-70 transition-opacity duration-300',
          'max-[480px]:text-[13px]'
        );
        
      default:
        return layoutUtils.combineClasses(
          COMPONENT_STYLES.link.base,
          COMPONENT_STYLES.link.underline
        );
    }
  };

  const linkClass = layoutUtils.combineClasses(
    getVariantClasses(),
    className
  );

  return (
    <a 
      href={href}
      target={target}
      rel={rel}
      className={linkClass}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

/**
 * ButtonLink component - 버튼 스타일 링크 컴포넌트
 */
interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function ButtonLink({ 
  href, 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  onClick
}: ButtonLinkProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-[12px] px-[40px] text-xs';
      case 'lg':
        return 'py-[20px] px-[80px] text-base';
      default:
        return 'py-[15px] px-[60px] text-sm';
    }
  };

  const buttonClass = layoutUtils.combineClasses(
    COMPONENT_STYLES.button.base,
    variant === 'primary' ? COMPONENT_STYLES.button.primary : COMPONENT_STYLES.button.secondary,
    getSizeClasses(),
    TYPOGRAPHY.ui.button,
    className
  );

  return (
    <Link 
      href={href} 
      className={buttonClass}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}