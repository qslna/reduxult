'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import DirectCMS from '@/components/cms/DirectCMS';

/**
 * 최적화된 Hero Section - 로딩 문제 해결
 */
function HeroSection() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const { currentUrl: heroVideoUrl, handleUpload: cmsUpload, handleDelete: cmsDelete } = useSimpleCMS('main-hero-video', '/VIDEO/main.mp4');
  

  // 클라이언트 마운트 처리
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 비디오 로드 처리
  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleLoadedData = () => {
      setVideoError(false);
      // 자동 재생 시도
      video.play().catch(() => {
        // 자동 재생 실패시 무시 (사용자가 수동으로 재생 가능)
      });
    };

    const handleError = () => {
      setVideoError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isClient, heroVideoUrl]);

  const navigateToAbout = () => {
    router.push('/about');
  };

  const navigateToExhibitions = () => {
    router.push('/exhibitions');
  };

  // 비디오 컨트롤 함수들 - 간소화
  const hideVideo = () => {
    setIsVideoVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const showVideo = () => {
    setIsVideoVisible(true);
  };

  // 비디오가 다시 보이게 될 때 자동 재생
  useEffect(() => {
    if (isVideoVisible && videoRef.current && isClient) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0; // 처음부터 재생
          videoRef.current.play().catch((error) => {
            console.warn('Video play failed:', error);
          });
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isVideoVisible, isClient]);

  // 서버 사이드 렌더링 중에는 기본 콘텐츠 반환
  if (!isClient) {
    return (
      <section className="hero-section relative h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="hero-content text-center z-10 px-6">
          <h1 
            className="hero-title font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.85]"
            style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
          >
            REDUX
          </h1>
          <p className="hero-subtitle text-white/80 text-xl tracking-[0.3em] uppercase mb-12">
            THE ROOM OF [ ]
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section relative h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Video */}
      {!videoError && isVideoVisible && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={heroVideoUrl || '/VIDEO/main.mp4'} type="video/mp4" />
        </video>
      )}

      {/* Background Image (when video is hidden or error) */}
      {(videoError || !isVideoVisible) && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: 'url(/images/hero-background/background.png)'
          }}
        />
      )}

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'
        }}
      />

      {/* Decorative elements */}
      <div 
        className="absolute top-[20%] right-[15%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ transform: 'rotate(-15deg)' }}
      />
      <div 
        className="absolute bottom-[30%] left-[10%] w-[60px] h-[60px] border border-white/20"
        style={{ transform: 'rotate(25deg)', borderRadius: '30%' }}
      />

      {/* Main content */}
      <div className="hero-content text-center z-10 px-6 max-w-4xl mx-auto">
        <h1 
          className="hero-title font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.85]"
          style={{ 
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            textShadow: '0 0 30px rgba(255,255,255,0.1)'
          }}
        >
          REDUX
        </h1>
        
        <p className="hero-subtitle text-white/80 text-xl tracking-[0.3em] uppercase mb-12">
          THE ROOM OF [ ]
        </p>

        <div className="hero-description max-w-2xl mx-auto mb-12">
          <p className="text-white/70 text-lg leading-relaxed">
            5명의 패션 디자이너가 만들어가는 창작의 공간.<br />
            패션을 넘어 예술로, 개인을 넘어 집단으로.
          </p>
        </div>

        {/* Action buttons */}
        <div className="hero-actions flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={navigateToAbout}
            className="group relative px-8 py-4 bg-transparent border-2 border-white text-white uppercase tracking-[0.2em] text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
          >
            <span className="relative z-10">Discover Redux</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          
          <button
            onClick={navigateToExhibitions}
            className="group relative px-8 py-4 bg-amber-300 text-black uppercase tracking-[0.2em] text-sm font-medium transition-all duration-300 hover:bg-amber-400 hover:scale-105"
          >
            View Exhibitions
          </button>
        </div>
      </div>

      {/* 비디오 컨트롤 - 간소화된 버전 */}
      {!videoError && (
        <div className="absolute bottom-20 right-8 z-30">
          {isVideoVisible ? (
            // X 버튼 - 비디오 끄기 (미니멀 디자인)
            <button
              onClick={hideVideo}
              className="w-12 h-12 bg-black/70 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
              title="비디오 끄기"
              aria-label="비디오 끄기"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          ) : (
            // 재생 버튼 - 비디오 켜기 (미니멀 디자인)
            <button
              onClick={showVideo}
              className="w-12 h-12 bg-black/70 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
              title="비디오 재생"
              aria-label="비디오 재생"
            >
              <span className="text-lg font-bold ml-0.5">▶</span>
            </button>
          )}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* CMS 버튼 for admin - video management */}
      {isAuthenticated && (
        <div className="absolute top-20 right-8 z-30">
          <DirectCMS
            slotId="main-hero-video"
            currentUrl={heroVideoUrl}
            type="video"
            onUpload={cmsUpload}
            onDelete={cmsDelete}
            isAdminMode={true}
            placeholder="Hero Video"
          />
        </div>
      )}
    </section>
  );
}

const HeroSectionWithStyles = () => (
  <>
    <HeroSection />
    <style jsx global>{`
        /* Enhanced Mobile Responsive adjustments */
        @media (max-width: 768px) {
          .hero-content {
            padding: 0 20px !important;
            max-width: 100% !important;
          }
          
          .hero-title {
            font-size: clamp(2rem, 10vw, 4rem) !important;
            margin-bottom: 1rem !important;
            line-height: 1.1 !important;
            text-align: center !important;
          }
          
          .hero-subtitle {
            font-size: 0.9rem !important;
            margin-bottom: 1.5rem !important;
            letter-spacing: 0.2em !important;
            text-align: center !important;
          }
          
          .hero-description {
            margin-bottom: 2rem !important;
            text-align: center !important;
          }
          
          .hero-description p {
            font-size: 0.9rem !important;
            line-height: 1.6 !important;
            max-width: 300px !important;
            margin: 0 auto !important;
          }
          
          .hero-actions {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: center !important;
          }
          
          .hero-actions button {
            width: 100% !important;
            max-width: 260px !important;
            padding: 14px 24px !important;
            font-size: 0.85rem !important;
            white-space: nowrap !important;
          }
          
          /* 모바일에서 비디오 컨트롤 위치 조정 - 간소화된 버전 */
          .hero-section .absolute.bottom-20.right-8 {
            bottom: 120px;
            right: 16px;
          }
          
          .hero-section .absolute.bottom-20.right-8 button {
            width: 44px;
            height: 44px;
            font-size: 14px;
            min-height: 44px; /* 터치 접근성 보장 */
            min-width: 44px;
          }
          
          /* 매우 작은 화면에서 더 작게 조정 */
          @media (max-width: 320px) {
            .hero-section .absolute.bottom-20.right-8 {
              bottom: 100px;
              right: 12px;
            }
            
            .hero-section .absolute.bottom-20.right-8 button {
              width: 40px;
              height: 40px;
              min-height: 40px;
              min-width: 40px;
              font-size: 12px;
            }
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: clamp(1.8rem, 12vw, 3.5rem) !important;
          }
          
          .hero-subtitle {
            font-size: 0.8rem !important;
            letter-spacing: 0.15em !important;
          }
          
          .hero-description p {
            font-size: 0.85rem !important;
            max-width: 280px !important;
          }
          
          .hero-actions button {
            padding: 12px 20px !important;
            font-size: 0.75rem !important;
            max-width: 240px !important;
          }
          
          .hero-content {
            padding: 0 15px !important;
          }
        }
        
        @media (max-width: 375px) {
          .hero-title {
            font-size: clamp(1.6rem, 12vw, 3rem) !important;
          }
          
          .hero-subtitle {
            font-size: 0.75rem !important;
          }
          
          .hero-description p {
            font-size: 0.8rem !important;
            max-width: 260px !important;
          }
          
          .hero-actions button {
            padding: 10px 18px !important;
            font-size: 0.7rem !important;
            max-width: 220px !important;
          }
        }
        
        /* Prevent flash of unstyled content */
        .hero-section {
          min-height: 100vh;
          min-height: 100dvh;
        }
        
        /* Video optimization */
        video {
          will-change: transform;
        }
        
        /* Performance optimizations */
        .hero-content * {
          will-change: auto;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
  </>
);

export default HeroSectionWithStyles;