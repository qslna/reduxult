'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initGSAPAnimations, animations, gsap } from '@/lib/gsap';
import OptimizedImage from '@/components/ui/OptimizedImage';

// HTML redux6 exhibitions.html과 완전 동일한 Exhibitions 페이지 구현
export default function ExhibitionsPage() {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentAlt, setCurrentAlt] = useState('');

  useEffect(() => {
    // HTML 버전과 동일한 스크롤 네비게이션 효과
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // HTML 버전과 동일한 GSAP 애니메이션
    initGSAPAnimations(() => {
      // Timeline animation
      animations.timelineProgress('.timeline-line', {
        trigger: '.exhibition-timeline',
        start: 'top center',
        end: 'bottom center',
        scrub: true
      });
      
      // Exhibition items animation
      animations.exhibitionItemAnimation('.exhibition-item');
    });

    // Smooth scroll for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        const target = document.querySelector(href || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const comingSoonAlert = () => {
    alert('Coming Soon');
    return false;
  };

  const openLightbox = (imageSrc: string, imageAlt: string) => {
    setCurrentImage(imageSrc);
    setCurrentAlt(imageAlt);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>

      {/* Exhibition Hero - HTML 버전과 완전 동일 */}
      <section className="exhibition-hero mt-20 py-[100px] px-10 bg-[--gray-light] text-center relative overflow-hidden">
        <div className="exhibition-hero-content relative z-[1]">
          <h1 
            className="exhibition-hero-title font-light tracking-[0.2em] mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            EXHIBITIONS
          </h1>
          <p className="exhibition-hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s]">
            Moments We Create
          </p>
        </div>
      </section>

      {/* Exhibition Timeline - HTML 버전과 완전 동일 */}
      <section className="exhibition-timeline py-[120px] relative">
        <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-[1px] bg-[--gray-light] transform -translate-x-1/2 max-[768px]:hidden"></div>
        
        {/* Exhibition 1: CINE MODE */}
        <div className="exhibition-item relative mb-0" id="cine-mode">
          <div className="exhibition-content grid grid-cols-2 min-h-screen items-center max-[1024px]:grid-cols-1">
            <div className="exhibition-visual relative h-screen overflow-hidden bg-[--gray-dark] max-[1024px]:h-[60vh] max-[768px]:h-[50vh]">
              <OptimizedImage 
                src="/images/exhibitions/cinemode/1.jpg" 
                alt="CINE MODE Exhibition" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={true}
                className="object-cover transition-transform duration-[1500ms] ease-in-out hover:scale-105"
              />
            </div>
            <div className="exhibition-info py-20 px-20 bg-white relative max-[1024px]:py-[60px] max-[768px]:py-10 max-[768px]:px-5">
              <span className="exhibition-number absolute -top-[60px] right-0 text-[200px] font-thin text-black/5 z-0 max-[768px]:text-[100px] max-[768px]:-top-[30px]">
                01
              </span>
              <p className="exhibition-date text-sm tracking-[2px] text-[--gray-medium] mb-5 uppercase">
                2025.03.03 - 2025.03.08
              </p>
              <h2 
                className="exhibition-title font-light tracking-[3px] mb-[30px] leading-[1.2]"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
              >
                CINE MODE
              </h2>
              <p className="exhibition-description text-base leading-[1.8] text-[--gray-dark] mb-10 max-w-[500px]">
                REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
                영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
                6인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 
                시각적 서사를 경험할 수 있습니다.
              </p>
              <ul className="exhibition-details list-none mb-[60px]">
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Location: Seoul, South Korea
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Type: Fashion Film Exhibition
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Participants: 6 Designers
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Curator: REDUX Collective
                </li>
              </ul>
              <a 
                href="/about/fashion-film" 
                className="exhibition-cta inline-block py-[15px] px-10 border-2 border-black text-black no-underline text-sm tracking-[2px] uppercase relative overflow-hidden transition-all duration-300 ease-in-out hover:text-white before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-black before:transition-[left_0.3s_ease] before:-z-[1] hover:before:left-0"
              >
                View Exhibition
              </a>
            </div>
          </div>
        </div>

        {/* CINE MODE Gallery Section */}
        <div className="exhibition-gallery relative mb-0 bg-black py-20">
          <div className="gallery-content max-w-7xl mx-auto px-10">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-light tracking-wider text-white mb-4">
                CINE MODE Gallery
              </h3>
              <p className="text-lg text-gray-400 tracking-wider">
                Behind The Scenes & Exhibition Moments
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/cinemode/1.jpg', 'CINE MODE Gallery 1')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/cinemode/1.jpg" 
                  alt="CINE MODE Gallery 1" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div 
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/cinemode/2.jpg', 'CINE MODE Gallery 2')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/cinemode/2.jpg" 
                  alt="CINE MODE Gallery 2" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div 
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/cinemode/3.jpg', 'CINE MODE Gallery 3')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/cinemode/3.jpg" 
                  alt="CINE MODE Gallery 3" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div 
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/cinemode/4.jpg', 'CINE MODE Gallery 4')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/cinemode/4.jpg" 
                  alt="CINE MODE Gallery 4" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Exhibition 2: THE ROOM OF [ ] */}
        <div className="exhibition-item relative mb-0" id="the-room">
          <div className="exhibition-content grid grid-cols-2 min-h-screen items-center [direction:rtl] max-[1024px]:grid-cols-1 max-[1024px]:[direction:ltr]">
            <div className="exhibition-visual relative h-screen overflow-hidden bg-[--gray-dark] [direction:ltr] max-[1024px]:h-[60vh] max-[768px]:h-[50vh]">
              <OptimizedImage 
                src="/images/exhibitions/theroom/1.jpg" 
                alt="THE ROOM OF [ ] Exhibition" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
                className="object-cover transition-transform duration-[1500ms] ease-in-out hover:scale-105"
              />
            </div>
            <div className="exhibition-info py-20 px-20 bg-[--gray-light] relative [direction:ltr] max-[1024px]:py-[60px] max-[768px]:py-10 max-[768px]:px-5">
              <span className="exhibition-number absolute -top-[60px] right-0 text-[200px] font-thin text-black/5 z-0 max-[768px]:text-[100px] max-[768px]:-top-[30px]">
                02
              </span>
              <p className="exhibition-date text-sm tracking-[2px] text-[--gray-medium] mb-5 uppercase">
                2025.12 - 2026.01 (Upcoming)
              </p>
              <h2 
                className="exhibition-title font-light tracking-[3px] mb-[30px] leading-[1.2]"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
              >
                THE ROOM OF [&nbsp;&nbsp;]
              </h2>
              <p className="exhibition-description text-base leading-[1.8] text-[--gray-dark] mb-10 max-w-[500px]">
                패션 필름, 텍스타일 아트, 인터랙션 디자인, 공간 인스톨레이션 등 
                다양한 매체를 통해 각 디자이너의 서로 다른 컨셉으로 전시를 풀어냅니다.
                빈 공간 [ ] 안에 각자의 이야기를 채워나가는 실험적인 전시입니다.
              </p>
              <ul className="exhibition-details list-none mb-[60px]">
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Location: To be announced
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Type: Multimedia Installation
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Duration: 1 Month
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Special: Interactive Experience
                </li>
              </ul>
              <a 
                href="#" 
                className="exhibition-cta inline-block py-[15px] px-10 border-2 border-black text-black no-underline text-sm tracking-[2px] uppercase relative overflow-hidden transition-all duration-300 ease-in-out hover:text-white before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-black before:transition-[left_0.3s_ease] before:-z-[1] hover:before:left-0"
                onClick={comingSoonAlert}
              >
                Coming Soon
              </a>
            </div>
          </div>
        </div>

        {/* THE ROOM Gallery Section */}
        <div className="exhibition-gallery relative mb-0 bg-gray-100 py-20">
          <div className="gallery-content max-w-7xl mx-auto px-10">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-light tracking-wider text-black mb-4">
                THE ROOM OF [&nbsp;&nbsp;] Preview
              </h3>
              <p className="text-lg text-gray-600 tracking-wider">
                Conceptual Visualizations & Artistic Explorations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/theroom/1.jpg', 'THE ROOM Gallery 1')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/theroom/1.jpg" 
                  alt="THE ROOM Gallery 1" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div 
                className="aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/theroom/2.jpg', 'THE ROOM Gallery 2')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/theroom/2.jpg" 
                  alt="THE ROOM Gallery 2" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div 
                className="aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openLightbox('/images/exhibitions/theroom/3.jpg', 'THE ROOM Gallery 3')}
              >
                <OptimizedImage 
                  src="/images/exhibitions/theroom/3.jpg" 
                  alt="THE ROOM Gallery 3" 
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section - HTML 버전과 완전 동일 */}
      <section className="coming-soon py-[120px] px-10 text-center bg-black text-white relative overflow-hidden">
        <div className="coming-soon-content relative z-[1] max-w-[800px] mx-auto">
          <h2 className="coming-soon-title text-5xl font-light tracking-[4px] mb-[30px]">
            FUTURE EXHIBITIONS
          </h2>
          <p className="coming-soon-text text-lg leading-[1.8] opacity-80">
            REDUX는 계속해서 새로운 형태의 전시를 준비하고 있습니다.<br />
            패션과 예술의 경계를 넘나들며, 관객과 함께 만들어가는<br />
            특별한 경험을 선사하겠습니다.
          </p>
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-white text-black text-center border-t border-black/10">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[10000] flex items-center justify-center transition-opacity duration-400"
          onClick={handleLightboxClick}
        >
          <div className="lightbox-content max-w-[90vw] max-h-[90vh] relative">
            {/* Close button */}
            <button 
              className="absolute -top-16 right-0 text-white text-2xl w-12 h-12 flex items-center justify-center transition-all duration-300 hover:text-gray-300 hover:scale-110 z-50"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            <div className="relative">
              <OptimizedImage 
                src={currentImage}
                alt={currentAlt}
                width={1200}
                height={800}
                priority={true}
                sizes="90vw"
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
              />
              
              {/* Image title */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-light tracking-wider">
                {currentAlt}
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

