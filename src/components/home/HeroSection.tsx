'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { VideoCMSSlot } from '@/components/cms/SimpleCMSSlot';

/**
 * 최적화된 Hero Section - 로딩 문제 해결
 */
function HeroSection() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const { currentUrl: heroVideoUrl, handleUpload: cmsUpload, handleDelete: cmsDelete } = useSimpleCMS('main-hero-video', '/VIDEO/main.mp4');
  
  // 새로운 CMS 컴포넌트용 어댑터 함수들
  const handleUpload = async (file: File): Promise<void> => {
    // 파일을 업로드하고 URL을 받아서 기존 CMS에 저장
    // 실제 구현에서는 ImageKit이나 다른 업로드 서비스를 사용
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const { url } = await response.json();
        cmsUpload(url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };
  
  const handleDelete = async (): Promise<void> => {
    return Promise.resolve(cmsDelete());
  };

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

  // 비디오 컨트롤 함수들
  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;

    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // 재생 실패시 무시
      });
      setIsVideoPlaying(true);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isVideoMuted;
    setIsVideoMuted(!isVideoMuted);
  };

  const stopVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsVideoPlaying(false);
  };

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
    <VideoCMSSlot
      slotId="main-hero-video"
      currentUrl={heroVideoUrl}
      onUpload={handleUpload}
      onDelete={handleDelete}
      className="hero-section relative h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Background Video */}
      {!videoError && (
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

      {/* Fallback Background */}
      {videoError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"
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
            6명의 패션 디자이너가 만들어가는 창작의 공간.<br />
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

      {/* 비디오 컨트롤 - 메뉴바에 가려지지 않는 위치 */}
      {!videoError && (
        <div className="absolute bottom-20 right-8 z-30 flex flex-col gap-3">
          <button
            onClick={toggleVideoPlayback}
            className="w-12 h-12 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            title={isVideoPlaying ? '비디오 일시정지' : '비디오 재생'}
            aria-label={isVideoPlaying ? '비디오 일시정지' : '비디오 재생'}
          >
            {isVideoPlaying ? (
              <span className="text-sm" role="img" aria-label="일시정지">⏸️</span>
            ) : (
              <span className="text-sm" role="img" aria-label="재생">▶️</span>
            )}
          </button>
          
          <button
            onClick={toggleVideoMute}
            className="w-12 h-12 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            title={isVideoMuted ? '음소거 해제' : '음소거'}
            aria-label={isVideoMuted ? '음소거 해제' : '음소거'}
          >
            {isVideoMuted ? (
              <span className="text-sm" role="img" aria-label="음소거">🔇</span>
            ) : (
              <span className="text-sm" role="img" aria-label="음성">🔊</span>
            )}
          </button>
          
          <button
            onClick={stopVideo}
            className="w-12 h-12 bg-black/70 hover:bg-red-600/90 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400/50 shadow-lg"
            title="비디오 정지"
            aria-label="비디오 정지"
          >
            <span className="text-lg font-bold">×</span>
          </button>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </VideoCMSSlot>
  );
}

const HeroSectionWithStyles = () => (
  <>
    <HeroSection />
    <style jsx global>{`
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-content {
            padding: 0 20px;
          }
          
          .hero-title {
            font-size: clamp(2.5rem, 12vw, 5rem) !important;
            margin-bottom: 1.5rem !important;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
            margin-bottom: 2rem !important;
          }
          
          .hero-description {
            margin-bottom: 2rem !important;
          }
          
          .hero-description p {
            font-size: 1rem !important;
          }
          
          .hero-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .hero-actions button {
            width: 100%;
            max-width: 280px;
          }
          
          /* 모바일에서 비디오 컨트롤 위치 조정 */
          .hero-section .absolute.bottom-20.right-8 {
            bottom: 120px;
            right: 16px;
            gap: 12px;
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
              gap: 8px;
            }
            
            .hero-section .absolute.bottom-20.right-8 button {
              width: 36px;
              height: 36px;
              min-height: 36px;
              min-width: 36px;
              font-size: 12px;
            }
          }
        }
        
        @media (max-width: 480px) {
          .hero-actions button {
            padding: 12px 24px;
            font-size: 0.75rem;
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