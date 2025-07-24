'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

// HTML redux6 index.html의 showcase-preview 섹션과 완전 동일한 구현
export default function ShowcaseSection() {
  
  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 (모바일이 아닌 경우에만)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile && typeof window !== 'undefined') {
      // GSAP이 로드되면 애니메이션 실행
      const timer = setTimeout(() => {
        if (window.gsap) {
          window.gsap.utils.toArray('.showcase-item').forEach((item: any, index: number) => {
            window.gsap.from(item, {
              scale: 0.8,
              opacity: 0,
              duration: 0.6,
              delay: index * 0.05,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 15%'
              }
            });
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="showcase-preview py-[120px] px-10 bg-white">
      <div className="showcase-container max-w-[1600px] mx-auto">
        {/* 헤더 - HTML 버전과 동일 */}
        <div className="showcase-header text-center mb-20">
          <h2 className="showcase-title font-['Playfair_Display'] font-semibold mb-5 leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)' }}>
            SIX DESIGNERS, ONE VISION
          </h2>
          <p className="showcase-subtitle text-base text-[--gray-medium] tracking-[2px]">
            Fashion Designer Collective
          </p>
        </div>

        {/* 쇼케이스 그리드 - HTML 버전과 완전 동일한 구조 */}
        <div 
          className="showcase-grid grid grid-cols-4 gap-[2px] bg-[--gray-light] p-[2px] max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-8 max-[480px]:p-4"
          data-redux-gallery="main-showcase"
          data-manageable="true"
          data-fixed-slots="8"
        >
          {/* 디자이너 1: Kim Bomin */}
          <Link 
            href="/designers/kimbomin"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 0 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/profile/Kim Bomin.webp" 
              alt="Kim Bomin" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                KIM BOMIN
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Creative Director
              </div>
            </div>
          </Link>

          {/* 디자이너 2: Park Parang */}
          <Link 
            href="/designers/parkparang"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 1 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/profile/Park Parang.jpg" 
              alt="Park Parang" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                PARK PARANG
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Visual Artist
              </div>
            </div>
          </Link>

          {/* 디자이너 3: Lee Taehyeon */}
          <Link 
            href="/designers/leetaehyeon"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 2 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/designers/leetaehyeon/leetaehyeon-Profile.jpg" 
              alt="Lee Taehyeon" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                LEE TAEHYEON
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Fashion Designer
              </div>
            </div>
          </Link>

          {/* 디자이너 4: Choi Eunsol */}
          <Link 
            href="/designers/choieunsol"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 3 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/designers/choieunsol/choieunsol-Profile.jpeg" 
              alt="Choi Eunsol" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                CHOI EUNSOL
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Art Director
              </div>
            </div>
          </Link>

          {/* 디자이너 5: Hwang Jinsu */}
          <Link 
            href="/designers/hwangjinsu"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 4 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/profile/Hwang Jinsu.jpg" 
              alt="Hwang Jinsu" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                HWANG JINSU
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Film Director
              </div>
            </div>
          </Link>

          {/* 디자이너 6: Kim Gyeongsu */}
          <Link 
            href="/designers/kimgyeongsu"
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 5 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/profile/Kim Gyeongsu.webp" 
              alt="Kim Gyeongsu" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                KIM GYEONGSU
              </div>
              <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                Installation Artist
              </div>
            </div>
          </Link>

          {/* 전시 1: CINE MODE */}
          <Link 
            href="/exhibitions#cine-mode"
            className="showcase-item exhibition-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 6 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/exhibitions/cinemode/1.jpg" 
              alt="CINE MODE" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div 
                className="showcase-name cine-mode font-['Inter'] font-medium mb-[5px] tracking-[0.02em] font-medium"
                style={{ 
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  background: 'linear-gradient(135deg, var(--accent-mocha), var(--accent-warm))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                CINE MODE
              </div>
              <div 
                className="showcase-role exhibition-date text-xs tracking-[1px] uppercase font-medium"
                style={{ 
                  background: 'linear-gradient(135deg, var(--accent-mocha), var(--accent-warm))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                2025.03
              </div>
            </div>
          </Link>

          {/* 전시 2: THE ROOM OF [] */}
          <Link 
            href="/exhibitions#the-room"
            className="showcase-item exhibition-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{ '--index': 7 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <OptimizedImage 
              src="/images/exhibitions/theroom/1.jpg" 
              alt="THE ROOM" 
              fill={true}
              priority={true}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
            />
            <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
              <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                   style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                THE ROOM OF [ ]
              </div>
              <div 
                className="showcase-role exhibition-date text-xs tracking-[1px] uppercase font-medium"
                style={{ 
                  background: 'linear-gradient(135deg, var(--accent-mocha), var(--accent-warm))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                2025.12
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 타입 정의
export interface ShowcaseSectionProps {
  className?: string;
}

// 쇼케이스 섹션 유틸리티 함수들
export const showcaseUtils = {
  // 모바일 감지 (HTML 버전과 동일)
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // GSAP 애니메이션 초기화
  initAnimations: () => {
    const isMobile = showcaseUtils.isMobile();
    if (!isMobile && typeof window !== 'undefined' && window.gsap) {
      window.gsap.utils.toArray('.showcase-item').forEach((item: any, index: number) => {
        window.gsap.from(item, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.05,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 15%'
          }
        });
      });
    }
  }
};

// CSS 클래스명 상수
export const SHOWCASE_CLASSES = {
  section: 'showcase-preview py-[120px] px-10 bg-white',
  container: 'showcase-container max-w-[1600px] mx-auto',
  header: {
    base: 'showcase-header text-center mb-20',
    title: 'showcase-title font-[\'Playfair_Display\'] font-semibold mb-5 leading-[1.1] tracking-[-0.02em]',
    subtitle: 'showcase-subtitle text-base text-[--gray-medium] tracking-[2px]'
  },
  grid: 'showcase-grid grid grid-cols-4 gap-[2px] bg-[--gray-light] p-[2px] max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-8 max-[480px]:p-4',
  item: {
    base: 'showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
    exhibition: 'exhibition-item',
    image: 'w-full h-full object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]',
    overlay: 'showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100',
    name: 'showcase-name font-[\'Inter\'] font-medium mb-[5px] tracking-[0.02em]',
    role: 'showcase-role text-xs text-white/70 tracking-[1px] uppercase'
  }
} as const;

// GSAP 타입 확장 (window 객체에 GSAP 추가)
declare global {
  interface Window {
    gsap: any;
  }
}