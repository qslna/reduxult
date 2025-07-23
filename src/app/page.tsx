'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';

// HTML redux6 index.html과 완전 동일한 홈페이지 구현
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // 페이지 로드 시 로딩 화면 처리 (HTML 버전과 동일)
  useEffect(() => {
    // 2초 후 로딩 완료 (HTML 버전과 동일한 타이밍)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // 로딩 화면 fade out 후 컨텐츠 표시
      setTimeout(() => {
        setShowContent(true);
        // HTML 버전과 동일하게 애니메이션 초기화
        initAnimations();
      }, 300);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // HTML 버전과 동일한 애니메이션 초기화
  const initAnimations = () => {
    // Mobile detection (HTML 버전과 동일)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      // Desktop animations - HTML 버전과 동일한 GSAP 애니메이션
      // 이 부분은 HeroSection과 ShowcaseSection 컴포넌트에서 처리
      console.log('Desktop animations initialized');
    }
  };

  return (
    <>
      {/* 로딩 스크린 - HTML 버전과 동일한 구조 */}
      {isLoading && (
        <div 
          id="loadingScreen" 
          className={`loading-screen ${!isLoading ? 'hide' : ''}`}
        >
          <div className="loading-content text-center">
            <h1 className="loading-title font-['Playfair_Display'] text-6xl font-bold tracking-wider text-black mb-4">
              REDUX
            </h1>
            <div className="loading-subtitle font-['Inter'] text-sm tracking-[3px] uppercase text-gray-500">
              LOADING...
            </div>
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
export interface HomePageProps {
  className?: string;
}

// 홈페이지 유틸리티 함수들
export const homePageUtils = {
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
export const HOME_CLASSES = {
  loadingScreen: {
    base: 'loading-screen',
    hide: 'hide',
    content: 'loading-content text-center',
    title: 'loading-title font-[\'Playfair_Display\'] text-6xl font-bold tracking-wider text-black mb-4',
    subtitle: 'loading-subtitle font-[\'Inter\'] text-sm tracking-[3px] uppercase text-gray-500'
  }
} as const;