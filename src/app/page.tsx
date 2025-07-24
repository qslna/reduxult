'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import { useResponsive, useReducedMotion } from '@/hooks/useResponsive';
import { RESPONSIVE_CLASSES } from '@/lib/responsive-design';

// HTML redux6 index.html과 완전 동일한 홈페이지 구현
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // 반응형 상태 및 접근성 설정
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const prefersReducedMotion = useReducedMotion();

  // 페이지 로드 시 로딩 화면 처리 (반응형 및 접근성 고려)
  useEffect(() => {
    // 모션 축소 모드에서는 로딩 시간 단축
    const loadingDuration = prefersReducedMotion ? 500 : 2000;
    const transitionDuration = prefersReducedMotion ? 100 : 300;
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
        // 디바이스별 최적화된 애니메이션 초기화
        initAnimations();
      }, transitionDuration);
    }, loadingDuration);

    return () => clearTimeout(loadingTimer);
  }, [prefersReducedMotion]);

  // 반응형 및 접근성을 고려한 애니메이션 초기화
  const initAnimations = () => {
    // 모션 축소 모드에서는 애니메이션 비활성화
    if (prefersReducedMotion) {
      console.log('애니메이션이 접근성 설정에 의해 비활성화됨');
      return;
    }
    
    // 데스크탑에서만 고급 애니메이션 활성화
    if (isDesktop) {
      console.log('데스크탑 애니메이션 초기화됨');
      // GSAP 애니메이션은 각 컴포넌트에서 처리
    } else if (isTablet) {
      console.log('태블릿 최적화 애니메이션 초기화됨');
    } else {
      console.log('모바일 최적화 애니메이션 초기화됨');
    }
  };

  return (
    <>
      {/* 반응형 로딩 스크린 */}
      {isLoading && (
        <div 
          id="loadingScreen" 
          className={`loading-screen ${!isLoading ? 'hide' : ''}`}
          role="status"
          aria-label="페이지 로딩 중"
        >
          <div className="loading-content text-center">
            <h1 className={`
              loading-title font-['Playfair_Display'] font-bold tracking-wider text-black mb-4
              ${isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'}
            `}>
              REDUX
            </h1>
            <div className={`
              loading-subtitle font-['Inter'] uppercase text-gray-500
              ${isMobile ? 'text-xs tracking-[2px]' : 'text-sm tracking-[3px]'}
            `}>
              LOADING...
            </div>
            {!prefersReducedMotion && (
              <div className="loading-spinner mt-4" aria-hidden="true">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 - HTML 버전과 완전 동일한 구조 */}
      {showContent && (
        <>
          {/* Hero Section with Video */}
          <HeroSection />
          
          {/* Showcase Grid Section */}
          <ShowcaseSection />
        </>
      )}
    </>
  );
}

// 타입 정의
interface HomePageProps {
  className?: string;
}

// 홈페이지 유틸리티 함수들
const homePageUtils = {
  // 모바일 감지 (HTML 버전과 동일)
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 애니메이션 초기화
  initAnimations: () => {
    const isMobile = homePageUtils.isMobile();
    if (!isMobile && typeof window !== 'undefined') {
      // GSAP 애니메이션 초기화 로직
      console.log('Animations initialized for desktop');
    }
  },

  // 스크롤 이벤트 처리 (HTML 버전과 동일)
  handleScroll: () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
};

// CSS 클래스명 상수
const HOME_CLASSES = {
  loadingScreen: {
    base: 'loading-screen',
    hide: 'hide',
    content: 'loading-content text-center',
    title: 'loading-title font-[\'Playfair_Display\'] text-6xl font-bold tracking-wider text-black mb-4',
    subtitle: 'loading-subtitle font-[\'Inter\'] text-sm tracking-[3px] uppercase text-gray-500'
  }
} as const;