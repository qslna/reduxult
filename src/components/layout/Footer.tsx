'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// HTML redux6 버전과 완전 동일한 Footer 컴포넌트
export default function Footer() {
  const pathname = usePathname();

  // 페이지별 Footer 표시 여부 결정 (HTML 버전 기준)
  const shouldShowFooter = () => {
    // Memory 페이지는 Footer 없음 (HTML 버전과 동일)
    if (pathname === '/about/memory') {
      return false;
    }
    return true;
  };

  // Footer 타입 결정
  const getFooterType = () => {
    // 홈페이지는 Full Footer (네비게이션 + 저작권)
    if (pathname === '/') {
      return 'full';
    }
    // 나머지 페이지는 Simple Footer (저작권만)
    return 'simple';
  };

  if (!shouldShowFooter()) {
    return null;
  }

  const footerType = getFooterType();

  if (footerType === 'simple') {
    return (
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10">
        <p className="text-sm text-white/60">
          &copy; {new Date().getFullYear()} REDUX. All rights reserved.
        </p>
      </footer>
    );
  }

  // Full Footer for homepage
  return (
    <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10">
      <div className="footer-content max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-10 max-[1024px]:flex-col max-[1024px]:text-center">
        <ul className="footer-nav flex gap-[30px] list-none max-[1024px]:flex-col max-[1024px]:gap-[15px]">
          <li>
            <Link 
              href="/about"
              className="text-white no-underline text-[13px] tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 max-[768px]:text-xs"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/designers"
              className="text-white no-underline text-[13px] tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 max-[768px]:text-xs"
            >
              Designers
            </Link>
          </li>
          <li>
            <Link 
              href="/exhibitions"
              className="text-white no-underline text-[13px] tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 max-[768px]:text-xs"
            >
              Exhibitions
            </Link>
          </li>
          <li>
            <Link 
              href="/contact"
              className="text-white no-underline text-[13px] tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 max-[768px]:text-xs"
            >
              Contact
            </Link>
          </li>
        </ul>
        
        <div className="footer-info text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} REDUX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// 타입 정의 (TypeScript 호환성)
export interface FooterProps {
  className?: string;
}

// Footer 유틸리티 함수들
export const footerUtils = {
  // 페이지별 Footer 표시 여부 확인
  shouldShowFooter: (pathname: string): boolean => {
    return pathname !== '/about/memory';
  },

  // Footer 타입 확인
  getFooterType: (pathname: string): 'full' | 'simple' => {
    return pathname === '/' ? 'full' : 'simple';
  }
};

// CSS 클래스명 상수 (유지보수 용이성)
export const FOOTER_CLASSES = {
  base: 'py-[60px] px-10 bg-black text-white text-center border-t border-white/10',
  fullFooter: {
    content: 'footer-content max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-10 max-[1024px]:flex-col max-[1024px]:text-center',
    nav: 'footer-nav flex gap-[30px] list-none max-[1024px]:flex-col max-[1024px]:gap-[15px]',
    link: 'text-white no-underline text-[13px] tracking-[1px] uppercase transition-opacity duration-300 hover:opacity-70 max-[768px]:text-xs',
    info: 'footer-info text-xs text-white/60'
  },
  simpleFooter: {
    text: 'text-sm text-white/60'
  }
} as const;