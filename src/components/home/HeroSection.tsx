'use client';

import { useEffect, useState, useRef } from 'react';

// HTML redux6 index.html과 완전 동일한 HeroSection 구현
export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoClosed, setVideoClosed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Mobile detection (HTML 버전과 동일)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const video = videoRef.current;
    if (video) {
      if (isMobile) {
        // 모바일 비디오 처리 (HTML 버전과 동일)
        video.setAttribute('controls', 'false');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Auto-play was prevented');
            handleVideoError();
          });
        }
      } else {
        // 데스크탑 비디오 처리
        video.addEventListener('loadeddata', () => {
          console.log('비디오 로드 완료');
        });
        
        video.addEventListener('canplay', () => {
          video.play().then(() => {
            console.log('비디오 재생 성공');
          }).catch(err => {
            console.error('비디오 재생 실패:', err);
            handleVideoError();
          });
        });
      }
      
      video.addEventListener('error', (e) => {
        console.error('비디오 에러:', e);
        handleVideoError();
      });
    }
  }, []);

  // 비디오 에러 처리 함수 (HTML 버전과 동일)
  const handleVideoError = () => {
    setIsVideoPlaying(false);
    setVideoClosed(true);
    if (heroRef.current) {
      heroRef.current.classList.add('video-closed');
    }
  };

  // 비디오 닫기 함수 (HTML 버전과 동일)
  const closeVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    
    setIsVideoPlaying(false);
    setVideoClosed(true);
    
    if (heroRef.current) {
      heroRef.current.classList.add('video-closed');
    }
  };

  // 비디오 재생 함수 (HTML 버전과 동일)
  const playVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsVideoPlaying(true);
        setVideoClosed(false);
        
        if (heroRef.current) {
          heroRef.current.classList.remove('video-closed');
        }
      }).catch(err => {
        console.error('비디오 재생 실패:', err);
        handleVideoError();
      });
    }
  };

  return (
    <section 
      ref={heroRef}
      className={`hero relative w-full h-screen overflow-hidden ${videoClosed ? 'video-closed' : ''}`}
      style={{
        // HTML 버전과 동일한 배경 설정
        background: videoClosed 
          ? 'url(/images/hero-background/background.png) center/cover no-repeat' 
          : 'transparent'
      }}
    >
      {/* 비디오 컨테이너 - HTML 버전과 동일 */}
      <div 
        className={`hero-video-container absolute top-0 left-0 w-full h-full transition-opacity duration-[800ms] ease-in-out block z-[2] ${
          !isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        id="heroVideoContainer"
      >
        <video
          ref={videoRef}
          className="hero-video w-full h-full object-cover brightness-[0.8] absolute top-0 left-0 z-[1]"
          id="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/VIDEO/main.mp4.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
        
        {/* 비디오 닫기 버튼 - HTML 버전과 동일 */}
        <button 
          className="video-close-btn absolute top-10 right-10 w-[70px] h-[70px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out z-[5] outline-none hover:bg-white/20 hover:scale-110"
          onClick={closeVideo}
          title="Close Video"
        >
          <span className="text-white text-[40px] font-light leading-none flex items-center justify-center w-full h-full">
            ×
          </span>
        </button>
      </div>

      {/* 비디오 재생 버튼 - HTML 버전과 동일 */}
      <button 
        className={`video-play-btn absolute top-10 right-10 w-[70px] h-[70px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out z-[4] text-white outline-none hover:bg-white/20 hover:scale-110 ${
          isVideoPlaying ? 'hidden' : 'flex'
        }`}
        id="videoPlayBtn"
        onClick={playVideo}
        title="Play Video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-[3px]">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>

      {/* 히어로 콘텐츠 - HTML 버전과 동일한 mix-blend-mode 적용 */}
      <div 
        className="hero-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[3] w-[90%] max-w-[1200px] px-5"
        style={{ 
          mixBlendMode: 'difference',
          isolation: 'isolate'
        }}
      >
        {/* 메인 타이틀 - HTML 버전과 동일한 개별 글자 애니메이션 */}
        <h1 className="hero-title font-['Playfair_Display'] font-bold text-white mb-5 overflow-hidden leading-[0.9] tracking-[-0.03em]" 
            style={{ 
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              textShadow: '0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05)'
            }}>
          <span style={{'--i': 1, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">R</span>
          <span style={{'--i': 2, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">E</span>
          <span style={{'--i': 3, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">D</span>
          <span style={{'--i': 4, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">U</span>
          <span style={{'--i': 5, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">X</span>
        </h1>

        {/* 서브타이틀 - HTML 버전과 동일한 "THE ROOM OF [ ]" */}
        <p className="hero-subtitle typewriter-text font-['Inter'] font-medium text-white uppercase tracking-[0.4em] opacity-0 animate-[fadeInSequential_1s_cubic-bezier(0.25,0.8,0.25,1)_forwards] mix-blend-normal z-[100] relative bg-black/20 px-3 py-[6px] rounded-[3px] backdrop-blur-[5px]"
           style={{
             fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
             animationDelay: '0.3s',
             textShadow: '0 0 15px rgba(255,255,255,0.4)'
           }}>
          THE ROOM OF <span className="room-bracket text-[--accent-mocha] font-light" 
                           style={{textShadow: '0 0 30px rgba(183,175,163,0.6)'}}>[</span>
          {' '}<span className="room-bracket text-[--accent-mocha] font-light" 
                     style={{textShadow: '0 0 30px rgba(183,175,163,0.6)'}}>]</span>
        </p>

        {/* CTA 버튼 - HTML 버전과 동일 */}
        <div className="hero-cta mt-10">
          <a 
            href="/about" 
            className="cta-button primary inline-block px-8 py-4 bg-transparent border border-white/30 text-white text-sm tracking-[2px] uppercase transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] backdrop-blur-[5px] hover:bg-white/10 hover:border-white/50 hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
          >
            DISCOVER REDUX
          </a>
        </div>
      </div>

      {/* 라디얼 그라디언트 오버레이 - HTML 버전과 동일 */}
      <div 
        className={`absolute -top-1/2 -left-1/2 w-[200%] h-[200%] z-[1] opacity-0 transform rotate-[-15deg] transition-opacity duration-[1.5s] ease-in-out delay-300 ${
          videoClosed ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 30%)'
        }}
      />
    </section>
  );
}

// 타입 정의
export interface HeroSectionProps {
  className?: string;
}

// 히어로 섹션 유틸리티 함수들
export const heroUtils = {
  // 모바일 감지 (HTML 버전과 동일)
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 비디오 상태 관리
  handleVideoError: (setIsVideoPlaying: (playing: boolean) => void, setVideoClosed: (closed: boolean) => void) => {
    setIsVideoPlaying(false);
    setVideoClosed(true);
  }
};

// CSS 클래스명 상수
export const HERO_CLASSES = {
  base: 'hero relative w-full h-screen overflow-hidden',
  videoClosed: 'video-closed',
  videoContainer: 'hero-video-container absolute top-0 left-0 w-full h-full transition-opacity duration-[800ms] ease-in-out block z-[2]',
  video: 'hero-video w-full h-full object-cover brightness-[0.8] absolute top-0 left-0 z-[1]',
  closeBtn: 'video-close-btn absolute top-10 right-10 w-[70px] h-[70px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out z-[5] outline-none hover:bg-white/20 hover:scale-110',
  playBtn: 'video-play-btn absolute top-10 right-10 w-[70px] h-[70px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out z-[4] text-white outline-none hover:bg-white/20 hover:scale-110',
  content: {
    base: 'hero-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[3] w-[90%] max-w-[1200px] px-5',
    title: 'hero-title font-[\'Playfair_Display\'] font-bold text-white mb-5 overflow-hidden leading-[0.9] tracking-[-0.03em]',
    subtitle: 'hero-subtitle typewriter-text font-[\'Inter\'] font-medium text-white uppercase tracking-[0.4em] opacity-0 animate-[fadeInSequential_1s_cubic-bezier(0.25,0.8,0.25,1)_forwards] mix-blend-normal z-[100] relative bg-black/20 px-3 py-[6px] rounded-[3px] backdrop-blur-[5px]',
    cta: 'cta-button primary inline-block px-8 py-4 bg-transparent border border-white/30 text-white text-sm tracking-[2px] uppercase transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] backdrop-blur-[5px] hover:bg-white/10 hover:border-white/50 hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]'
  }
} as const;