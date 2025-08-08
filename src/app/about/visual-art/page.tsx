'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCMSSlot } from '@/hooks/useCMSSlot';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import MediaSlot from '@/components/cms/MediaSlot';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SubPageNavigation from '@/components/layout/SubPageNavigation';

// HTML redux6 about-visual-art.html과 완전 동일한 Visual Art 페이지 구현
export default function VisualArtPage() {
  const router = useRouter();
  // Client-side only state
  const [isClient, setIsClient] = useState(false);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const { slot: visualArtSlot, currentFiles: galleryImages, updateFiles: updateGalleryImages } = useCMSSlot('about-visualart-gallery');
  
  // Visual art item metadata (titles and descriptions)
  const visualArtMeta = [
    { title: 'METAMORPHOSIS', description: '변화와 진화의 순간을 포착한 비주얼 시리즈', gridClass: 'col-span-8' },
    { title: 'SHADOW PLAY', description: '빛과 그림자의 대비', gridClass: 'col-span-4' },
    { title: 'TEXTURE STUDY', description: '질감의 깊이를 탐구', gridClass: 'col-span-4' },
    { title: 'COLOR THEORY', description: '색채의 감정적 표현', gridClass: 'col-span-4' },
    { title: 'FORM & VOID', description: '형태와 공간의 관계', gridClass: 'col-span-4' },
    { title: 'DIGITAL DREAMS', description: '디지털 매체의 가능성', gridClass: 'col-span-6' },
    { title: 'ANALOG MEMORIES', description: '아날로그의 따뜻함', gridClass: 'col-span-6' },
    { title: 'COLLECTIVE VISION', description: '5인 5색의 시각적 하모니', gridClass: 'col-span-12' }
  ];

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Intersection Observer 애니메이션 - 클라이언트에서만
  useEffect(() => {
    if (!isClient) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const visualObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 50);
        }
      });
    }, observerOptions);
    
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-fade-in-up');
          }, index * 200);
        }
      });
    }, { threshold: 0.2 });

    const visualItems = document.querySelectorAll('.visual-item');
    const processItems = document.querySelectorAll('.process-item');
    
    visualItems.forEach(item => visualObserver.observe(item));
    processItems.forEach(item => processObserver.observe(item));

    return () => {
      visualObserver.disconnect();
      processObserver.disconnect();
    };
  }, [isClient]);


  // 서버 사이드 렌더링 중에는 null 반환 - 로딩 화면 없이
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Navigation - About 서브페이지용 통일된 네비게이션 */}
      <SubPageNavigation pageTitle="Visual Art" />

      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-[--gray-light] overflow-hidden pt-[100px]">
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
          {/* Dynamic Visual Art Items from CMS */}
          {galleryImages.map((image, index) => {
            const meta = visualArtMeta[index] || { 
              title: `VISUAL ART ${index + 1}`, 
              description: '시각적 표현의 새로운 가능성', 
              gridClass: 'col-span-6' 
            };
            
            return (
              <div 
                key={index}
                className={`visual-item ${meta.gridClass} [aspect-ratio:16/9] relative overflow-hidden bg-[--gray-light] cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards] max-[1024px]:col-span-6 max-[768px]:col-span-1 max-[768px]:[aspect-ratio:4/3]`}
              >
                <OptimizedImage 
                  src={image}
                  alt={`Visual Art ${index + 1}`}
                  fill={true}
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 67vw"
                  className="object-cover transition-transform duration-[1s] ease-in-out [filter:contrast(0.9)] hover:transform hover:scale-105 hover:[filter:contrast(1.1)]"
                />
                <div className="visual-overlay absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-500 ease-in-out p-10 text-center hover:opacity-100">
                  <h3 className="visual-title text-2xl font-light tracking-[2px] mb-[10px]">
                    {meta.title}
                  </h3>
                  <p className="visual-description text-sm leading-[1.6] opacity-80">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
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

      {/* CMS Admin Interface - Only visible to authenticated users */}
      {isAuthenticated && visualArtSlot && (
        <section className="cms-admin-section py-[80px] px-10 bg-gray-50">
          <div 
            className="max-w-[1600px] mx-auto"
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                color: '#000',
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '24px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                🎨 Visual Art Gallery Management
              </div>
              
              <MediaSlot
                slot={visualArtSlot}
                currentFiles={galleryImages}
                onFilesUpdate={updateGalleryImages}
                isAdminMode={true}
                className="visual-art-cms-slot"
              />
            </div>
          </div>
        </section>
      )}

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
        
        /* Process items animation */
        .process-item {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .process-item.animate-fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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