'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';

// HTML redux6 about-visual-art.html과 완전 동일한 Visual Art 페이지 구현
export default function VisualArtPage() {
  const router = useRouter();

  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 초기화
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 50);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.visual-item').forEach(item => {
      observer.observe(item);
    });
    
    // GSAP 애니메이션
    if (typeof window !== 'undefined' && window.gsap) {
      // Process items animation
      window.gsap.utils.toArray('.process-item').forEach((item: any, i: number) => {
        window.gsap.from(item, {
          y: 80,
          opacity: 0,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%'
          }
        });
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // HTML 버전과 동일한 내비게이션 함수들
  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <>
      {/* Navigation - HTML 버전과 동일 */}
      <nav className="fixed top-0 left-0 w-full py-5 px-10 bg-white/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-black/10 scrolled:py-[15px] scrolled:px-10 scrolled:shadow-[0_2px_20px_rgba(0,0,0,0.1)]">
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button text-xl cursor-pointer transition-all duration-300 ease-in-out text-black hover:transform hover:-translate-x-[5px]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title text-lg font-medium tracking-[2px] text-black max-[768px]:hidden">
              VISUAL ART
            </span>
          </div>
          <div 
            className="logo text-2xl font-bold tracking-[2px] cursor-pointer transition-opacity duration-300 ease-in-out text-black hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-[--gray-light] overflow-hidden">
        <div className="hero-bg absolute top-0 left-0 w-full h-full opacity-10">
          <div className="hero-pattern absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-[patternMove_20s_linear_infinite]"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, var(--primary-black) 35px, var(--primary-black) 70px)'
               }}>
          </div>
        </div>
        <div className="hero-content text-center z-[1]">
          <h1 
            className="hero-title font-thin uppercase text-black opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.2em]"
            style={{ fontSize: 'clamp(60px, 10vw, 160px)' }}
          >
            Visual Art
          </h1>
          <p className="hero-subtitle text-base tracking-[3px] text-[--gray-medium] mt-5 opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.3s]">
            Beyond Fashion, Into Art
          </p>
        </div>
      </section>

      {/* Visual Grid Section - HTML 버전과 완전 동일 */}
      <section className="visual-grid-section py-[120px] px-10 bg-white">
        <div className="section-intro max-w-[800px] mx-auto mb-[120px] text-center">
          <h2 className="text-4xl font-light tracking-[3px] text-black mb-[30px]">
            시각적 경험의 확장
          </h2>
          <p className="text-base leading-[2] text-[--gray-dark]">
            REDUX는 패션을 넘어 다양한 시각 예술로 표현의 영역을 확장합니다.
            각 작품은 우리의 철학과 감성을 담아 새로운 시각적 언어를 만들어냅니다.
          </p>
        </div>
        
        <div className="visual-grid grid grid-cols-12 gap-10 max-w-[1600px] mx-auto max-[1024px]:grid-cols-6 max-[1024px]:gap-5 max-[768px]:grid-cols-1 max-[768px]:gap-5">
          
          {/* Visual Item 1: METAMORPHOSIS */}
          <div className="visual-item col-span-8 [aspect-ratio:16/9] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-6 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/METAMORPHOSIS.jpg" 
              alt="Visual Art 1" 
              fill={true}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 67vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                METAMORPHOSIS
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                변화와 진화의 순간을 포착한 비주얼 시리즈
              </p>
            </div>
          </div>

          {/* Visual Item 2: SHADOW PLAY */}
          <div className="visual-item col-span-4 [aspect-ratio:3/4] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-3 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/SHADOW PLAY.jpg" 
              alt="Visual Art 2" 
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                SHADOW PLAY
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                빛과 그림자의 대비
              </p>
            </div>
          </div>

          {/* Visual Item 3: TEXTURE STUDY */}
          <div className="visual-item col-span-4 [aspect-ratio:1] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-3 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/TEXTURE STUDY.jpg" 
              alt="Visual Art 3" 
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                TEXTURE STUDY
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                질감의 깊이를 탐구
              </p>
            </div>
          </div>

          {/* Visual Item 4: COLOR THEORY */}
          <div className="visual-item col-span-4 [aspect-ratio:1] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-3 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/COLOR THEORY.jpg" 
              alt="Visual Art 4" 
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                COLOR THEORY
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                색채의 감정적 표현
              </p>
            </div>
          </div>

          {/* Visual Item 5: FORM & VOID */}
          <div className="visual-item col-span-4 [aspect-ratio:3/4] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-3 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/FORM & VOID.jpg" 
              alt="Visual Art 5" 
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                FORM & VOID
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                형태와 공간의 관계
              </p>
            </div>
          </div>

          {/* Visual Item 6: DIGITAL DREAMS */}
          <div className="visual-item col-span-6 [aspect-ratio:4/3] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-6 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/DIGITAL DREAMS.jpg" 
              alt="Visual Art 6"
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                DIGITAL DREAMS
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                디지털 매체의 가능성
              </p>
            </div>
          </div>

          {/* Visual Item 7: ANALOG MEMORIES */}
          <div className="visual-item col-span-6 [aspect-ratio:4/3] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-6 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/ANALOG MEMORIES.jpg" 
              alt="Visual Art 7"
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                ANALOG MEMORIES
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                아날로그의 따뜻함
              </p>
            </div>
          </div>

          {/* Visual Item 8: COLLECTIVE VISION */}
          <div className="visual-item col-span-12 [aspect-ratio:21/9] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-6 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]">
            <OptimizedImage 
              src="/images/visual-art/COLLECTIVE VISION.jpg" 
              alt="Visual Art 8"
              fill={true}
              sizes="100vw"
              className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
            />
            <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
              <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                COLLECTIVE VISION
              </h3>
              <p className="visual-description text-sm leading-[1.6] opacity-80">
                6인 6색의 시각적 하모니
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - HTML 버전과 완전 동일 */}
      <section className="process-section py-[120px] px-10 bg-[--gray-light]">
        <h2 className="process-title text-5xl font-light tracking-[4px] text-center mb-20 text-black">
          CREATIVE PROCESS
        </h2>
        <div className="process-grid grid grid-cols-3 gap-[60px] max-w-[1200px] mx-auto max-[1024px]:grid-cols-1 max-[1024px]:gap-[60px]">
          
          <div className="process-item text-center">
            <div className="process-number text-[80px] font-thin text-[--gray-medium] opacity-30 mb-5">
              01
            </div>
            <h3 className="process-name text-2xl font-light tracking-[2px] mb-5 text-black">
              CONCEPT
            </h3>
            <p className="process-description text-sm leading-[1.8] text-[--gray-dark]">
              아이디어의 시작부터 컨셉 정립까지,
              끊임없는 대화와 실험을 통해
              우리만의 시각적 언어를 만듭니다.
            </p>
          </div>
          
          <div className="process-item text-center">
            <div className="process-number text-[80px] font-thin text-[--gray-medium] opacity-30 mb-5">
              02
            </div>
            <h3 className="process-name text-2xl font-light tracking-[2px] mb-5 text-black">
              CREATION
            </h3>
            <p className="process-description text-sm leading-[1.8] text-[--gray-dark]">
              다양한 매체와 기법을 활용하여
              컨셉을 시각적으로 구현하고
              새로운 표현의 가능성을 탐구합니다.
            </p>
          </div>
          
          <div className="process-item text-center">
            <div className="process-number text-[80px] font-thin text-[--gray-medium] opacity-30 mb-5">
              03
            </div>
            <h3 className="process-name text-2xl font-light tracking-[2px] mb-5 text-black">
              CONNECTION
            </h3>
            <p className="process-description text-sm leading-[1.8] text-[--gray-dark]">
              작품을 통해 관객과 소통하고
              감정적 연결을 만들어내며
              기억에 남을 순간을 디자인합니다.
            </p>
          </div>
        </div>
      </section>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(70px, 70px); }
        }
        
        @keyframes heroFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes revealItem {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .visual-item.revealed {
          animation: revealItem 0.8s ease forwards;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(40px, 8vw, 80px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .visual-grid-section {
            padding: 80px 20px;
          }
          
          .process-section {
            padding: 80px 20px;
          }
        }
      `}</style>
    </>
  );
}

// GSAP 타입 확장
declare global {
  interface Window {
    gsap: any;
  }
}