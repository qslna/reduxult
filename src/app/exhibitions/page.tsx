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

      {/* Exhibition Hero - 디자이너 웹사이트답게 비대칭 디자인 */}
      <section className="exhibition-hero relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* 비대칭 기하학 요소들 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[15%] right-[8%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-[25deg] animate-[slideIn_2s_ease_forwards]"></div>
          <div className="absolute bottom-[20%] left-[12%] w-[120px] h-[120px] border border-white/10 rounded-full animate-[float_8s_infinite_ease-in-out]"></div>
          <div className="absolute top-[40%] left-[5%] w-[2px] h-[200px] bg-gradient-to-b from-white/30 to-transparent animate-[slideIn_2s_ease_forwards] [animation-delay:0.5s]"></div>
          
          {/* 노이즈 패턴 */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.6"/%3E%3C/svg%3E")',
          }}></div>
        </div>
        
        <div className="exhibition-hero-content relative z-10 text-center px-10">
          {/* 비대칭 라인 */}
          <div className="absolute -top-[100px] left-1/2 transform -translate-x-1/2 w-[1px] h-[80px] bg-gradient-to-b from-transparent to-white/40 animate-[dropIn_1.5s_ease_forwards]"></div>
          
          <h1 className="exhibition-hero-title font-['Playfair_Display'] font-bold text-white mb-8 leading-[0.85] opacity-0 animate-[glitchIn_2s_ease_forwards]" 
              style={{ 
                fontSize: 'clamp(60px, 12vw, 180px)', 
                letterSpacing: '-0.02em',
                textShadow: '0 0 30px rgba(255,255,255,0.1), 3px 3px 0px rgba(255,255,255,0.03)'
              }}>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.2s]" style={{'--i': 1} as React.CSSProperties}>E</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.3s]" style={{'--i': 2} as React.CSSProperties}>X</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.4s]" style={{'--i': 3} as React.CSSProperties}>H</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.5s]" style={{'--i': 4} as React.CSSProperties}>I</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.6s]" style={{'--i': 5} as React.CSSProperties}>B</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.7s]" style={{'--i': 6} as React.CSSProperties}>I</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.8s]" style={{'--i': 7} as React.CSSProperties}>T</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:0.9s]" style={{'--i': 8} as React.CSSProperties}>I</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:1.0s]" style={{'--i': 9} as React.CSSProperties}>O</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:1.1s]" style={{'--i': 10} as React.CSSProperties}>N</span>
            <span className="inline-block animate-[letterReveal_0.8s_ease_forwards] [animation-delay:1.2s]" style={{'--i': 11} as React.CSSProperties}>S</span>
          </h1>
          
          {/* 비대칭 서브타이틀 */}
          <div className="relative">
            <div className="absolute -left-[150px] top-1/2 transform -translate-y-1/2 w-[100px] h-[1px] bg-gradient-to-r from-transparent to-white/40 opacity-0 animate-[slideInLeft_1s_ease_forwards] [animation-delay:1.5s] max-[768px]:hidden"></div>
            <p className="exhibition-hero-subtitle font-['Inter'] text-white/80 tracking-[0.4em] uppercase opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:1.3s]" style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 300
            }}>
              Redefining Fashion Through Space
            </p>
            <div className="absolute -right-[150px] top-1/2 transform -translate-y-1/2 w-[100px] h-[1px] bg-gradient-to-l from-transparent to-white/40 opacity-0 animate-[slideInRight_1s_ease_forwards] [animation-delay:1.5s] max-[768px]:hidden"></div>
          </div>
          
          {/* 비대칭 네비게이션 하인트 */}
          <div className="absolute -bottom-[50px] left-1/2 transform -translate-x-1/2 opacity-0 animate-[bounceIn_1s_ease_forwards] [animation-delay:2s]">
            <div className="w-[1px] h-[30px] bg-gradient-to-b from-white/60 to-transparent mx-auto mb-2"></div>
            <div className="text-white/60 text-xs tracking-[2px] uppercase">Scroll</div>
          </div>
        </div>
      </section>

      {/* Exhibition Timeline - HTML 버전과 완전 동일 */}
      <section className="exhibition-timeline py-[120px] relative">
        <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-[1px] bg-[--gray-light] transform -translate-x-1/2 max-[768px]:hidden"></div>
        
        {/* Exhibition 1: CINE MODE - 아원가르드 디자인 */}
        <div className="exhibition-item relative mb-0" id="cine-mode">
          <div className="exhibition-content relative">
            {/* 비대칭 비주얼 레이아웃 */}
            <div className="grid grid-cols-12 gap-0 min-h-screen relative">
              {/* 이미지 섹션 - 비대칭 */}
              <div className="exhibition-visual col-span-7 relative overflow-hidden bg-black max-[1024px]:col-span-12">
                <div className="relative h-screen max-[1024px]:h-[70vh]">
                  <OptimizedImage 
                    src="/images/exhibitions/cinemode/1.jpg" 
                    alt="CINE MODE Exhibition" 
                    fill={true}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={true}
                    className="object-cover transition-all duration-[2000ms] ease-out hover:scale-110 hover:rotate-[1deg]"
                    style={{
                      filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
                    }}
                  />
                  
                  {/* 오버레이 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/20"></div>
                  
                  {/* 다이나믹 요소들 */}
                  <div className="absolute bottom-10 left-10 z-10">
                    <div className="w-[60px] h-[1px] bg-white/60 mb-4 animate-[expandWidth_2s_ease_forwards]"></div>
                    <div className="text-white/80 font-['Inter'] text-sm tracking-[3px] uppercase font-light">Exhibition 01</div>
                  </div>
                  
                  <div className="absolute top-10 right-10 z-10">
                    <div className="w-[40px] h-[40px] border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-[8px] h-[8px] bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 텍스트 섹션 - 비대칭 배치 */}
              <div className="exhibition-info col-span-5 relative flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white px-12 py-20 max-[1024px]:col-span-12 max-[1024px]:px-8 max-[1024px]:py-16">
                {/* 기하학적 대형 숫자 */}
                <div className="absolute -top-8 -left-4 text-[280px] font-thin text-black/[0.03] leading-none z-0 max-[1024px]:text-[180px] max-[1024px]:-top-4">
                  01
                </div>
                
                {/* 비대칭 데코레이션 */}
                <div className="absolute top-16 right-8 w-[120px] h-[1px] bg-gradient-to-r from-black/20 to-transparent transform rotate-12"></div>
                <div className="absolute bottom-20 left-0 w-[2px] h-[100px] bg-gradient-to-b from-black/10 to-transparent"></div>
                
                <div className="relative z-10">
                  {/* 날짜 및 상태 */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="exhibition-date font-['JetBrains_Mono'] text-xs tracking-[2px] text-gray-500 uppercase font-medium bg-black/5 px-3 py-1 rounded-full">
                      2025.03.03 - 03.08
                    </span>
                    <span className="w-[6px] h-[6px] bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-600 font-medium uppercase tracking-wide">Completed</span>
                  </div>
                  
                  {/* 전시 제목 */}
                  <h2 className="exhibition-title font-['Playfair_Display'] font-bold text-black mb-8 leading-[0.9] tracking-[-0.02em]" 
                      style={{ fontSize: 'clamp(42px, 6vw, 72px)' }}>
                    CINE<br />
                    <span className="text-gray-600">MODE</span>
                  </h2>
                  
                  {/* 설명 */}
                  <div className="space-y-4 mb-10">
                    <p className="exhibition-description font-['Inter'] text-gray-700 leading-[1.7] font-light" style={{ fontSize: 'clamp(15px, 2vw, 17px)' }}>
                      REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
                      영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
                    </p>
                    <p className="font-['Inter'] text-gray-600 leading-[1.7] font-light text-sm">
                      6인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 시각적 서사를 경험할 수 있습니다.
                    </p>
                  </div>
                  
                  {/* 전시 세부 정보 - 개선된 디자인 */}
                  <div className="exhibition-specs grid grid-cols-2 gap-6 mb-12 max-[768px]:grid-cols-1">
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Location</div>
                      <div className="text-sm text-gray-700 font-medium">Seoul, South Korea</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Type</div>
                      <div className="text-sm text-gray-700 font-medium">Fashion Film</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Participants</div>
                      <div className="text-sm text-gray-700 font-medium">6 Designers</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Curator</div>
                      <div className="text-sm text-gray-700 font-medium">REDUX Collective</div>
                    </div>
                  </div>
                  
                  {/* CTA 버튼 - 향상된 디자인 */}
                  <a 
                    href="/about/fashion-film" 
                    className="exhibition-cta group inline-flex items-center gap-3 bg-black text-white px-8 py-4 no-underline text-sm tracking-[1px] uppercase font-medium relative overflow-hidden transition-all duration-500 ease-out hover:bg-gray-900 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <span className="relative z-10">Explore Exhibition</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CINE MODE Gallery Section - 레르스비블릱 디자인 */}
        <div className="exhibition-gallery relative mb-0 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* 배경 노이즈 */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }}></div>
          
          <div className="gallery-content relative z-10 py-32">
            {/* 비대칭 헤더 */}
            <div className="relative mb-20 px-10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 items-end gap-8">
                  <div className="col-span-8 max-[768px]:col-span-12">
                    <div className="relative">
                      {/* 데코레이티브 라인 */}
                      <div className="absolute -top-8 left-0 w-[200px] h-[1px] bg-gradient-to-r from-white/40 to-transparent"></div>
                      
                      <h3 className="font-['Playfair_Display'] text-white mb-6 leading-[0.9] font-bold" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
                        CINE MODE<br />
                        <span className="text-white/60 font-light">Gallery</span>
                      </h3>
                    </div>
                  </div>
                  <div className="col-span-4 max-[768px]:col-span-12">
                    <p className="font-['Inter'] text-white/70 leading-[1.6] text-right max-[768px]:text-left" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                      Behind The Scenes &<br />
                      Exhibition Moments
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 비대칭 갤러리 레이아웃 */}
            <div className="gallery-grid px-10">
              <div className="max-w-7xl mx-auto">
                {/* 비대칭 그리드 시스템 */}
                <div className="grid grid-cols-12 gap-4 auto-rows-[200px] max-[768px]:auto-rows-[150px]">
                  
                  {/* 이미지 1 - 대형 */}
                  <div 
                    className="col-span-6 row-span-2 group cursor-pointer relative overflow-hidden max-[768px]:col-span-12 max-[768px]:row-span-1"
                    onClick={() => openLightbox('/images/exhibitions/cinemode/1.jpg', 'CINE MODE 전시 메인 비주얼')}
                  >
                    <OptimizedImage 
                      src="/images/exhibitions/cinemode/1.jpg" 
                      alt="CINE MODE Gallery 1" 
                      fill={true}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:rotate-[2deg]"
                    />
                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-sm font-medium tracking-wider uppercase">Main Exhibition</div>
                      <div className="text-xs text-white/80 mt-1">Opening Night</div>
                    </div>
                    {/* 클릭 인디케이터 */}
                    <div className="absolute top-6 right-6 w-8 h-8 border border-white/40 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 이미지 2 - 중형 */}
                  <div 
                    className="col-span-3 row-span-1 group cursor-pointer relative overflow-hidden max-[768px]:col-span-6"
                    onClick={() => openLightbox('/images/exhibitions/cinemode/2.jpg', 'CINE MODE 전시 방문객 경험')}
                  >
                    <OptimizedImage 
                      src="/images/exhibitions/cinemode/2.jpg" 
                      alt="CINE MODE Gallery 2" 
                      fill={true}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-all duration-[1000ms] ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="text-xs font-medium tracking-wide uppercase">Visitor Experience</div>
                    </div>
                  </div>
                  
                  {/* 이미지 3 - 중형 */}
                  <div 
                    className="col-span-3 row-span-1 group cursor-pointer relative overflow-hidden max-[768px]:col-span-6"
                    onClick={() => openLightbox('/images/exhibitions/cinemode/3.jpg', 'CINE MODE 전시 디테일')}
                  >
                    <OptimizedImage 
                      src="/images/exhibitions/cinemode/3.jpg" 
                      alt="CINE MODE Gallery 3" 
                      fill={true}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-all duration-[1000ms] ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="text-xs font-medium tracking-wide uppercase">Exhibition Detail</div>
                    </div>
                  </div>
                  
                  {/* 이미지 4 - 와이드 */}
                  <div 
                    className="col-span-6 row-span-1 group cursor-pointer relative overflow-hidden max-[768px]:col-span-12"
                    onClick={() => openLightbox('/images/exhibitions/cinemode/4.jpg', 'CINE MODE 비하인드 심')}
                  >
                    <OptimizedImage 
                      src="/images/exhibitions/cinemode/4.jpg" 
                      alt="CINE MODE Gallery 4" 
                      fill={true}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-all duration-[1000ms] ease-out group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="text-xs font-medium tracking-wide uppercase">Behind The Scenes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 비대칭 디코레이티브 요소 */}
            <div className="absolute bottom-20 right-10 opacity-20">
              <div className="w-[150px] h-[150px] border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-[100px] h-[100px] border border-white/10 rounded-full flex items-center justify-center">
                  <div className="w-[50px] h-[50px] border border-white/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exhibition 2: THE ROOM OF [ ] - 환상적 디자인 */}
        <div className="exhibition-item relative mb-0" id="the-room">
          <div className="exhibition-content relative bg-gradient-to-br from-white via-gray-50 to-gray-100">
            {/* 비대칭 레이아웃 - 리버스 */}
            <div className="grid grid-cols-12 gap-0 min-h-screen relative">
              {/* 텍스트 섹션 먼저 (RTL 효과) */}
              <div className="exhibition-info col-span-5 relative flex flex-col justify-center px-12 py-20 max-[1024px]:col-span-12 max-[1024px]:px-8 max-[1024px]:py-16">
                {/* 비대칭 배경 요소들 */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute top-12 left-8 w-[160px] h-[1px] bg-gradient-to-r from-transparent to-black/15 transform -rotate-12"></div>
                  <div className="absolute bottom-16 right-0 w-[2px] h-[120px] bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="absolute top-1/2 right-8 w-[80px] h-[80px] border border-black/5 rounded-full transform translate-y-[-50%]"></div>
                </div>
                
                {/* 기하학적 대형 숫자 - 오른쪽 */}
                <div className="absolute -top-8 -right-8 text-[280px] font-thin text-black/[0.02] leading-none z-0 max-[1024px]:text-[180px] max-[1024px]:-top-4 max-[1024px]:-right-4">
                  02
                </div>
                
                <div className="relative z-10">
                  {/* 날짜 및 상태 - 예정된 전시 */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="exhibition-date font-['JetBrains_Mono'] text-xs tracking-[2px] text-gray-600 uppercase font-medium bg-orange-100 px-3 py-1 rounded-full">
                      2025.12 - 2026.01
                    </span>
                    <span className="w-[6px] h-[6px] bg-orange-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-orange-600 font-medium uppercase tracking-wide">Upcoming</span>
                  </div>
                  
                  {/* 전시 제목 - 특별한 타이포그래피 */}
                  <h2 className="exhibition-title font-['Playfair_Display'] font-bold text-black mb-8 leading-[0.85] tracking-[-0.03em]" 
                      style={{ fontSize: 'clamp(38px, 6vw, 68px)' }}>
                    THE ROOM<br />OF 
                    <span className="inline-flex items-center gap-2">
                      <span className="w-[40px] h-[40px] border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-light" style={{ fontSize: 'clamp(16px, 3vw, 24px)' }}>[  ]</span>
                    </span>
                  </h2>
                  
                  {/* 설명 - 개선된 타이포그래피 */}
                  <div className="space-y-4 mb-10">
                    <p className="exhibition-description font-['Inter'] text-gray-700 leading-[1.7] font-light" style={{ fontSize: 'clamp(15px, 2vw, 17px)' }}>
                      패션 필름, 텍스타일 아트, 인터랙션 디자인, 공간 인스톨레이션 등 다양한 매체를 통해 각 디자이너의 서로 다른 컨셉으로 전시를 풀어냅니다.
                    </p>
                    <p className="font-['Inter'] text-gray-600 leading-[1.7] font-light text-sm">
                      빈 공간 [ ] 안에 각자의 이야기를 채워나가는 실험적인 전시입니다.
                    </p>
                  </div>
                  
                  {/* 전시 세부 정보 */}
                  <div className="exhibition-specs grid grid-cols-2 gap-6 mb-12 max-[768px]:grid-cols-1">
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Location</div>
                      <div className="text-sm text-gray-700 font-medium">TBA</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Type</div>
                      <div className="text-sm text-gray-700 font-medium">Multimedia</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Duration</div>
                      <div className="text-sm text-gray-700 font-medium">1 Month</div>
                    </div>
                    <div className="spec-item">
                      <div className="text-xs text-gray-400 uppercase tracking-[1px] mb-1 font-medium">Special</div>
                      <div className="text-sm text-gray-700 font-medium">Interactive</div>
                    </div>
                  </div>
                  
                  {/* CTA 버튼 - Coming Soon 스타일 */}
                  <button 
                    className="exhibition-cta group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 text-sm tracking-[1px] uppercase font-medium relative overflow-hidden transition-all duration-500 ease-out hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                    onClick={comingSoonAlert}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="relative z-10">Coming Soon</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
              
              {/* 이미지 섹션 - 대형 */}
              <div className="exhibition-visual col-span-7 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 max-[1024px]:col-span-12">
                <div className="relative h-screen max-[1024px]:h-[70vh]">
                  <OptimizedImage 
                    src="/images/exhibitions/theroom/1.jpg" 
                    alt="THE ROOM OF [ ] Exhibition" 
                    fill={true}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={false}
                    className="object-cover transition-all duration-[2000ms] ease-out hover:scale-105 hover:rotate-[-1deg]"
                    style={{
                      filter: 'contrast(1.05) brightness(0.95) saturate(1.1)'
                    }}
                  />
                  
                  {/* 오버레이 효과 - 더 미묘한 */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-orange-500/5"></div>
                  
                  {/* 다이나믹 요소들 */}
                  <div className="absolute top-10 left-10 z-10">
                    <div className="w-[50px] h-[50px] border-2 border-white/40 rounded-sm flex items-center justify-center backdrop-blur-sm text-white font-light">
                      [  ]
                    </div>
                  </div>
                  
                  <div className="absolute bottom-10 right-10 z-10">
                    <div className="text-white/80 font-['Inter'] text-sm tracking-[3px] uppercase font-light text-right">
                      Exhibition 02<br />
                      <span className="text-xs text-white/60">Conceptual</span>
                    </div>
                    <div className="w-[60px] h-[1px] bg-white/60 mt-4 ml-auto animate-[expandWidth_2s_ease_forwards]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THE ROOM Gallery Section - 컨셉추얼 디자인 */}
        <div className="exhibition-gallery relative mb-0 bg-gradient-to-t from-orange-50 via-white to-gray-50 overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[10%] w-[100px] h-[100px] border border-orange-200/40 rounded-sm transform rotate-12"></div>
            <div className="absolute bottom-[30%] right-[15%] w-[60px] h-[60px] border border-orange-200/30 rounded-sm transform -rotate-45"></div>
            <div className="absolute top-[50%] right-[5%] w-[1px] h-[200px] bg-gradient-to-b from-orange-200/20 to-transparent transform rotate-12"></div>
          </div>
          
          <div className="gallery-content relative z-10 py-32">
            {/* 컬셉추얼 헤더 */}
            <div className="relative mb-20 px-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto">
                  {/* 데코레이티브 요소 */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-[40px] h-[1px] bg-gradient-to-r from-transparent to-orange-300"></div>
                    <div className="w-[30px] h-[30px] border border-orange-300/60 rounded-sm flex items-center justify-center text-orange-500 font-light text-sm">[ ]</div>
                    <div className="w-[40px] h-[1px] bg-gradient-to-l from-transparent to-orange-300"></div>
                  </div>
                  
                  <h3 className="font-['Playfair_Display'] text-black mb-6 leading-[0.9] font-bold text-center" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
                    THE ROOM OF <span className="inline-flex items-center mx-2">
                      <span className="w-[50px] h-[50px] border-2 border-orange-400/60 rounded-sm flex items-center justify-center text-2xl font-light text-orange-500" style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>[  ]</span>
                    </span><br />
                    <span className="text-gray-600 font-light">Conceptual Preview</span>
                  </h3>
                  
                  <p className="font-['Inter'] text-gray-600 leading-[1.6] max-w-2xl mx-auto" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                    Conceptual Visualizations & Artistic Explorations<br />
                    예술적 가능성을 탐구하는 컨셉추얼 비주얼리제이션
                  </p>
                </div>
              </div>
            </div>
            
            {/* 컬셉추얼 갤러리 레이아웃 */}
            <div className="gallery-grid px-10">
              <div className="max-w-6xl mx-auto">
                {/* 미니멀한 그리드 */}
                <div className="grid grid-cols-12 gap-8 max-[768px]:gap-4">
                  
                  {/* 이미지 1 - 직사각형 */}
                  <div className="col-span-4 max-[768px]:col-span-12">
                    <div 
                      className="aspect-[3/4] group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                      onClick={() => openLightbox('/images/exhibitions/theroom/1.jpg', 'THE ROOM 컨셉추얼 비주얼 1')}
                    >
                      <OptimizedImage 
                        src="/images/exhibitions/theroom/1.jpg" 
                        alt="THE ROOM Gallery 1" 
                        fill={true}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:brightness-105"
                      />
                      
                      {/* 비대칭 호버 오버레이 */}
                      <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/0 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="text-xs font-medium tracking-wider uppercase">Concept 01</div>
                        </div>
                        {/* 컨셉추얼 아이콘 */}
                        <div className="absolute top-6 right-6 w-[24px] h-[24px] border border-white/50 rounded-sm flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-[8px] h-[8px] bg-white/70 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 컬셉추얼 설명 */}
                    <div className="mt-4 px-2">
                      <h4 className="font-['Inter'] text-sm font-medium text-black mb-2 tracking-wide uppercase">Spatial Concept</h4>
                      <p className="font-['Inter'] text-xs text-gray-600 leading-[1.5]">
                        공간의 비움과 채움을 통한 전시 컨셉
                      </p>
                    </div>
                  </div>
                  
                  {/* 이미지 2 - 가로형 */}
                  <div className="col-span-8 max-[768px]:col-span-12">
                    <div 
                      className="aspect-[4/3] group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                      onClick={() => openLightbox('/images/exhibitions/theroom/2.jpg', 'THE ROOM 컨셉추얼 비주얼 2')}
                    >
                      <OptimizedImage 
                        src="/images/exhibitions/theroom/2.jpg" 
                        alt="THE ROOM Gallery 2" 
                        fill={true}
                        sizes="(max-width: 768px) 100vw, 67vw"
                        className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:brightness-105"
                      />
                      
                      <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-orange-500/0 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="text-xs font-medium tracking-wider uppercase">Interactive Design</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 px-2">
                      <h4 className="font-['Inter'] text-sm font-medium text-black mb-2 tracking-wide uppercase">Interactive Experience</h4>
                      <p className="font-['Inter'] text-xs text-gray-600 leading-[1.5]">
                        관객 참여를 통한 다이나믹 전시 경험 디자인
                      </p>
                    </div>
                  </div>
                  
                  {/* 이미지 3 - 사각형 */}
                  <div className="col-span-12 max-[768px]:col-span-12">
                    <div 
                      className="aspect-[21/9] group cursor-pointer relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 max-[768px]:aspect-[4/3]"
                      onClick={() => openLightbox('/images/exhibitions/theroom/3.jpg', 'THE ROOM 컨셉추얼 비주얼 3')}
                    >
                      <OptimizedImage 
                        src="/images/exhibitions/theroom/3.jpg" 
                        alt="THE ROOM Gallery 3" 
                        fill={true}
                        sizes="100vw"
                        className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:brightness-105"
                      />
                      
                      <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/0 via-transparent to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="text-sm font-medium tracking-wider uppercase">Installation Preview</div>
                          <div className="text-xs text-white/80 mt-1">전체적인 설치 공간 비전</div>
                        </div>
                        
                        {/* 파노라마 형태의 비주얼을 위한 전용 아이콘 */}
                        <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-[20px] h-[20px] border border-white/50 rounded-sm"></div>
                          <div className="w-[20px] h-[20px] border border-white/50 rounded-sm"></div>
                          <div className="w-[20px] h-[20px] border border-white/50 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 px-2 text-center">
                      <h4 className="font-['Inter'] text-sm font-medium text-black mb-2 tracking-wide uppercase">Overall Vision</h4>
                      <p className="font-['Inter'] text-xs text-gray-600 leading-[1.5] max-w-2xl mx-auto">
                        6인의 디자이너가 각자의 색깔로 채워나갈 빈 공간의 전체적인 비전과 공간 구성
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Exhibitions Section - 비전 섹션 */}
      <section className="future-exhibitions relative py-32 bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
        {/* 배경 아트 워크 */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[5%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45 animate-[slideIn_3s_ease_forwards]"></div>
          <div className="absolute bottom-[20%] right-[8%] w-[200px] h-[200px] border border-white/5 rounded-full animate-[float_12s_infinite_ease-in-out]"></div>
          <div className="absolute top-[60%] left-[10%] w-[1px] h-[150px] bg-gradient-to-b from-white/20 to-transparent animate-[dropIn_2s_ease_forwards] [animation-delay:1s]"></div>
        </div>
        
        <div className="future-content relative z-10 text-center px-10">
          <div className="max-w-6xl mx-auto">
            {/* 제목 섹션 */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-[60px] h-[1px] bg-gradient-to-r from-transparent to-white/40"></div>
                <div className="text-white/60 font-['JetBrains_Mono'] text-xs tracking-[3px] uppercase">2026 & Beyond</div>
                <div className="w-[60px] h-[1px] bg-gradient-to-l from-transparent to-white/40"></div>
              </div>
              
              <h2 className="future-title font-['Playfair_Display'] font-bold text-white mb-8 leading-[0.9]" style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>
                FUTURE<br />
                <span className="text-white/70 font-light">EXHIBITIONS</span>
              </h2>
            </div>
            
            {/* 설명 섹션 */}
            <div className="mb-16">
              <p className="future-description font-['Inter'] text-white/80 leading-[1.8] max-w-3xl mx-auto mb-8" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)' }}>
                REDUX는 계속해서 새로운 형태의 전시를 준비하고 있습니다.
              </p>
              <p className="font-['Inter'] text-white/60 leading-[1.7] max-w-2xl mx-auto" style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>
                패션과 예술의 경계를 넘나들며, 관객과 함께 만들어가는 특별한 경험을 선사하겠습니다.
              </p>
            </div>
            
            {/* 예정된 전시 미리보기 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="future-item group">
                <div className="w-[80px] h-[80px] border-2 border-white/20 rounded-sm mx-auto mb-6 flex items-center justify-center backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:scale-110">
                  <div className="w-[40px] h-[40px] border border-white/30 rounded-sm flex items-center justify-center">
                    <div className="w-[20px] h-[20px] bg-white/20 rounded-sm"></div>
                  </div>
                </div>
                <h3 className="font-['Inter'] text-lg font-medium text-white mb-3 tracking-wide uppercase">Immersive Fashion</h3>
                <p className="font-['Inter'] text-sm text-white/60 leading-[1.6]">
                  VR/AR 기술을 활용한<br />
                  몰입형 패션 경험
                </p>
              </div>
              
              <div className="future-item group">
                <div className="w-[80px] h-[80px] border-2 border-white/20 rounded-sm mx-auto mb-6 flex items-center justify-center backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:scale-110">
                  <div className="w-[40px] h-[40px] border border-white/30 rounded-sm flex items-center justify-center">
                    <div className="w-[20px] h-[20px] bg-white/20 rounded-sm"></div>
                  </div>
                </div>
                <h3 className="font-['Inter'] text-lg font-medium text-white mb-3 tracking-wide uppercase">Digital Couture</h3>
                <p className="font-['Inter'] text-sm text-white/60 leading-[1.6]">
                  디지털 패션과<br />
                  NFT 아트워크 전시
                </p>
              </div>
              
              <div className="future-item group">
                <div className="w-[80px] h-[80px] border-2 border-white/20 rounded-sm mx-auto mb-6 flex items-center justify-center backdrop-blur-sm transition-all duration-500 group-hover:border-white/40 group-hover:scale-110">
                  <div className="w-[40px] h-[40px] border border-white/30 rounded-sm flex items-center justify-center">
                    <div className="w-[20px] h-[20px] bg-white/20 rounded-sm"></div>
                  </div>
                </div>
                <h3 className="font-['Inter'] text-lg font-medium text-white mb-3 tracking-wide uppercase">Global Collaboration</h3>
                <p className="font-['Inter'] text-sm text-white/60 leading-[1.6]">
                  세계 아티스트와의<br />
                  국제 콜라보레이션
                </p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="mt-16">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-3 bg-white/10 text-white px-8 py-4 backdrop-blur-sm border border-white/20 text-sm tracking-[1px] uppercase font-medium transition-all duration-500 hover:bg-white/20 hover:scale-[1.02] hover:border-white/40"
              >
                <span>Stay Updated</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26c.3.16.67.16.97 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-white text-black text-center border-t border-black/10">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[10000] flex items-center justify-center transition-all duration-500 animate-[modalFadeIn_0.4s_ease_forwards]"
          onClick={handleLightboxClick}
        >
          <div className="lightbox-content max-w-[92vw] max-h-[92vh] relative animate-[modalSlideIn_0.5s_ease_forwards]">
            {/* Enhanced close button */}
            <button 
              className="absolute -top-14 right-0 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:rotate-90 z-50 group"
              onClick={closeLightbox}
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image navigation hints */}
            <div className="absolute -top-14 left-0 text-white/60 text-xs tracking-wider uppercase font-light">
              Press ESC to close
            </div>
            
            <div className="relative group">
              <OptimizedImage 
                src={currentImage}
                alt={currentAlt}
                width={1200}
                height={800}
                priority={true}
                sizes="92vw"
                className="max-w-full max-h-[92vh] object-contain shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
                style={{
                  filter: 'contrast(1.05) brightness(1.02)'
                }}
              />
              
              {/* Enhanced image info */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 text-white text-sm font-light tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-[6px] h-[6px] bg-white/60 rounded-full animate-pulse"></div>
                  <span>{currentAlt}</span>
                </div>
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-[20px] h-[20px] border-l-2 border-t-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 w-[20px] h-[20px] border-r-2 border-t-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-[20px] h-[20px] border-l-2 border-b-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 w-[20px] h-[20px] border-r-2 border-b-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitchIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(10px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.02);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes letterReveal {
          0% {
            opacity: 0;
            transform: translateY(100px) rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
        
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes dropIn {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes expandWidth {
          0% {
            width: 0;
          }
          100% {
            width: 60px;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes modalFadeIn {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          100% {
            opacity: 1;
            backdrop-filter: blur(20px);
          }
        }
        
        @keyframes modalSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        /* Custom CSS Variables for animations */
        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --gray-light: #F5F5F5;
          --gray-medium: #999999;
          --gray-dark: #333333;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .exhibition-hero-title {
            font-size: clamp(40px, 10vw, 80px) !important;
          }
          
          .exhibition-hero-subtitle {
            font-size: clamp(12px, 3vw, 16px) !important;
            letter-spacing: 0.2em !important;
          }
          
          .lightbox-content {
            max-width: 95vw !important;
            max-h-95vh !important;
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
