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
    <>
      <section 
        ref={heroRef}
        className={`hero ${videoClosed ? 'video-closed' : ''}`}
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#0a0a0a url("/images/hero-background/background.png") center/cover no-repeat'
        }}
      >
        {/* 비디오 컨테이너 - HTML 버전과 동일 */}
        <div 
          className={`hero-video-container ${!isVideoPlaying ? 'hidden' : ''}`}
          id="heroVideoContainer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 0.8s ease',
            display: 'block',
            zIndex: 2,
            opacity: !isVideoPlaying ? 0 : 1,
            pointerEvents: !isVideoPlaying ? 'none' : 'auto'
          }}
        >
          <video
            ref={videoRef}
            className="hero-video"
            id="heroVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.8)',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1
            }}
          >
            <source src="/VIDEO/main.mp4.mp4" type="video/mp4" />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
          
          {/* 비디오 닫기 버튼 - HTML 버전과 동일 */}
          <button 
            className="video-close-btn"
            onClick={closeVideo}
            title="Close Video"
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '70px',
              height: '70px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: 5,
              outline: 'none'
            }}
          >
            <span style={{
              color: 'var(--primary-white)',
              fontSize: '40px',
              fontWeight: 300,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>×</span>
          </button>
        </div>

        {/* 비디오 재생 버튼 - HTML 버전과 동일 */}
        <button 
          className="video-play-btn"
          id="videoPlayBtn"
          onClick={playVideo}
          title="Play Video"
          style={{ 
            display: isVideoPlaying ? 'none' : 'flex',
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '70px',
            height: '70px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 4,
            color: 'var(--primary-white)',
            outline: 'none'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
            marginLeft: '3px'
          }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>

        {/* 히어로 콘텐츠 - HTML 버전과 동일한 mix-blend-mode 적용 */}
        <div className="hero-content" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 3,
          mixBlendMode: 'difference',
          width: '90%',
          maxWidth: '1200px',
          isolation: 'isolate',
          padding: '0 20px'
        }}>
          {/* 메인 타이틀 - HTML 버전과 동일한 개별 글자 애니메이션 */}
          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            color: 'var(--primary-white)',
            marginBottom: '20px',
            overflow: 'hidden',
            textShadow: '0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05)',
            animation: 'fadeInSequential 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}>
            <span style={{'--i': 1, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">R</span>
            <span style={{'--i': 2, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">E</span>
            <span style={{'--i': 3, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">D</span>
            <span style={{'--i': 4, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">U</span>
            <span style={{'--i': 5, animationDelay: 'calc(var(--i) * 0.1s)'} as React.CSSProperties} className="inline-block transform translate-y-full animate-[revealText_1s_ease_forwards]">X</span>
          </h1>

          {/* 서브타이틀 - HTML 버전과 동일한 "THE ROOM OF [ ]" */}
          <p className="hero-subtitle typewriter-text" style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--primary-white)',
            opacity: 0,
            animation: 'fadeInSequential 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
            animationDelay: '0.3s',
            textShadow: '0 0 15px rgba(255,255,255,0.4)',
            mixBlendMode: 'normal',
            zIndex: 100,
            position: 'relative',
            background: 'rgba(0,0,0,0.2)',
            padding: '6px 12px',
            borderRadius: '3px',
            backdropFilter: 'blur(5px)'
          }}>
            THE ROOM OF <span className="room-bracket" style={{
              color: 'var(--accent-mocha)',
              fontWeight: 300,
              textShadow: '0 0 30px rgba(183,175,163,0.6)'
            }}>[</span> <span className="room-bracket" style={{
              color: 'var(--accent-mocha)',
              fontWeight: 300,
              textShadow: '0 0 30px rgba(183,175,163,0.6)'
            }}>]</span>
          </p>

          {/* CTA 버튼 - HTML 버전과 동일 */}
          <div className="hero-cta" style={{
            marginTop: '60px',
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            animation: 'fadeInUp 1s ease forwards',
            animationDelay: '1s',
            flexWrap: 'wrap'
          }}>
            <a href="/about" className="cta-button primary" style={{
              display: 'inline-block',
              padding: '15px 40px',
              border: '1px solid var(--primary-white)',
              color: 'var(--primary-white)',
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              DISCOVER REDUX
            </a>
            <a href="/exhibitions" className="cta-button" style={{
              display: 'inline-block',
              padding: '15px 40px',
              border: '1px solid var(--primary-white)',
              color: 'var(--primary-white)',
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              VIEW EXHIBITIONS
            </a>
          </div>
        </div>

        {/* 라디얼 그라디언트 오버레이 - HTML 버전과 동일 */}
        <div style={{
          content: '',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 30%)',
          zIndex: 1,
          opacity: videoClosed ? 1 : 0,
          transform: 'rotate(-15deg)',
          transition: 'opacity 1.5s ease 0.3s'
        }}></div>
      </section>

      {/* CSS for animations and hover effects */}
      <style jsx>{`
        @keyframes fadeInSequential {
          0% {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes revealText {
          to {
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(30px);
          }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        .video-close-btn:hover,
        .video-play-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--primary-white);
          transition: left 0.3s ease;
          z-index: -1;
        }

        .cta-button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 20px rgba(183,175,163,0.3) !important;
          background: linear-gradient(135deg, var(--accent-mocha), var(--accent-warm)) !important;
          color: var(--primary-white) !important;
          border-color: transparent !important;
        }

        .cta-button:hover::before {
          left: 0;
        }

        .typewriter-text {
          overflow: hidden !important;
          white-space: nowrap !important;
          animation: typewriter 2s steps(20) 1s forwards !important;
          width: 0 !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .video-close-btn,
          .video-play-btn {
            width: 50px !important;
            height: 50px !important;
            top: 20px !important;
            right: 20px !important;
          }
          
          .video-close-btn span {
            font-size: 30px !important;
          }
          
          .video-play-btn svg {
            width: 20px !important;
            height: 20px !important;
          }

          .hero-cta {
            flex-direction: column;
            gap: 20px;
            margin-top: 40px;
          }

          .cta-button {
            min-height: 44px !important;
            min-width: 44px !important;
            padding: 16px 20px !important;
            margin: 8px 4px !important;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: clamp(36px, 15vw, 60px);
          }
          
          .hero-subtitle {
            font-size: 12px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </>
  );
}