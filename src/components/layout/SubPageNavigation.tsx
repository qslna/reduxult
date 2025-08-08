'use client';

import { useRouter } from 'next/navigation';

interface SubPageNavigationProps {
  pageTitle: string;
  parentTitle?: string;
  parentPath?: string;
  className?: string;
}

/**
 * About 하위 페이지용 통합 네비게이션 컴포넌트
 * UX 편의성을 위한 일관된 네비게이션 제공
 */
export default function SubPageNavigation({ 
  pageTitle, 
  parentTitle = "About", 
  parentPath = "/about",
  className = "" 
}: SubPageNavigationProps) {
  const router = useRouter();

  return (
    <nav className={`fixed top-0 left-0 w-full py-4 px-6 bg-black/95 backdrop-blur-md z-[1000] border-b border-white/10 ${className}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left navigation */}
        <div className="flex items-center space-x-6">
          {/* Back button with better UX */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-amber-300 transition-all duration-300 cursor-pointer group"
            aria-label="뒤로가기"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white transition-colors tracking-wider uppercase font-medium"
            >
              Home
            </button>
            <span className="text-white/30">/</span>
            <button
              onClick={() => router.push(parentPath)}
              className="text-amber-300 hover:text-amber-200 transition-colors tracking-wider uppercase font-medium"
            >
              {parentTitle}
            </button>
            <span className="text-white/30">/</span>
            <span className="text-white/70 tracking-wider uppercase">{pageTitle}</span>
          </div>
        </div>

        {/* Right - Logo */}
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-bold text-white hover:text-amber-300 transition-all duration-300 font-['Playfair_Display'] tracking-wider hover:scale-105"
        >
          REDUX
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white hover:text-amber-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">{pageTitle}</span>
        </button>
        
        <button
          onClick={() => router.push('/')}
          className="text-lg font-bold text-white font-['Playfair_Display']"
        >
          REDUX
        </button>
      </div>
    </nav>
  );
}