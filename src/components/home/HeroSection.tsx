'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { DESIGNER_VIDEOS, getGoogleDriveEmbedUrl, getGoogleDriveThumbnailUrl } from '@/utils/drive-utils';
import { useTextContent } from '@/hooks/usePageContent';
import { useCMSSlot } from '@/hooks/useCMSSlot';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import MediaSlot from '@/components/cms/MediaSlot';

/**
 * Phase 2.2: Revolutionary Hero Section
 * - Advanced loading animations with Redux logo
 * - Google Drive video integration
 * - Video-to-image background transitions
 * - Modern video controls with 2025 fashion styling
 */
export default function HeroSection() {
  // Dynamic content loading
  const { text: heroTitle } = useTextContent('home', 'hero-title', 'REDUX');
  const { text: heroSubtitle } = useTextContent('home', 'hero-subtitle', 'THE ROOM OF [ ]');
  const { text: primaryCTAText } = useTextContent('home', 'hero-cta-primary', 'DISCOVER REDUX');
  const { text: secondaryCTAText } = useTextContent('home', 'hero-cta-secondary', 'VIEW EXHIBITIONS');
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const { slot: videoSlot, currentFiles: videoFiles, updateFiles: updateVideoFiles } = useCMSSlot('main-hero-video');

  // Video states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoClosed, setVideoClosed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get designer videos array
  const designerVideos = Object.values(DESIGNER_VIDEOS);
  const currentVideo = designerVideos[currentVideoIndex];

  // Simplified loading animation
  useEffect(() => {
    // Reduced loading time and simplified progress
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
        setLoadingProgress(100);
      }, 200);
    }, 1500); // Reduced from complex multi-step to simple 1.5s

    // Simple progress animation
    const progressTimer = setTimeout(() => {
      setLoadingProgress(100);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(progressTimer);
    };
  }, []);

  // Device detection and video initialization
  useEffect(() => {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const tabletCheck = /iPad|Android(?=.*\bMobile\b)/i.test(navigator.userAgent) || 
                        (window.innerWidth >= 768 && window.innerWidth <= 1024);
    
    setIsMobile(mobileCheck);
    setIsTablet(tabletCheck);
    
    // Initialize video after content is shown
    if (showContent) {
      initializeVideo();
    }
  }, [showContent]);

  // Simplified and more stable video initialization
  const initializeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add error handling with try-catch
    try {
      video.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
        console.log('Video loaded successfully');
      });

      video.addEventListener('canplay', () => {
        if (!isMobile) {
          // More defensive auto-play
          setTimeout(() => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsVideoPlaying(true);
                setVideoClosed(false);
              }).catch((error) => {
                console.warn('Video autoplay failed:', error);
                handleVideoError();
              });
            }
          }, 500); // Small delay to ensure everything is ready
        }
      });

      video.addEventListener('error', handleVideoError);
      video.addEventListener('ended', () => {
        // Auto-switch to next designer video when current ends
        try {
          switchToNextVideo();
        } catch (error) {
          console.warn('Video switching failed:', error);
        }
      });

      // Simplified hover controls
      if (!isMobile) {
        const heroElement = heroRef.current;
        if (heroElement) {
          const handleMouseEnter = () => setShowVideoControls(true);
          const handleMouseLeave = () => setShowVideoControls(false);
          
          heroElement.addEventListener('mouseenter', handleMouseEnter);
          heroElement.addEventListener('mouseleave', handleMouseLeave);
          
          // Cleanup function
          return () => {
            heroElement.removeEventListener('mouseenter', handleMouseEnter);
            heroElement.removeEventListener('mouseleave', handleMouseLeave);
          };
        }
      } else {
        setShowVideoControls(true); // Always show on mobile
      }
    } catch (error) {
      console.error('Video initialization failed:', error);
      handleVideoError();
    }
  }, [isMobile]);

  // Enhanced video error handling
  const handleVideoError = useCallback(() => {
    console.warn('Video playback failed, switching to background image');
    setIsVideoPlaying(false);
    setVideoClosed(true);
    if (heroRef.current) {
      heroRef.current.classList.add('video-closed');
    }
  }, []);

  // Enhanced video control functions
  const closeVideo = useCallback(() => {
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
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsVideoPlaying(true);
          setVideoClosed(false);
          
          if (heroRef.current) {
            heroRef.current.classList.remove('video-closed');
          }
        }).catch(handleVideoError);
      }
    }
  }, [handleVideoError]);

  // Switch to next designer video
  const switchToNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % designerVideos.length;
    setCurrentVideoIndex(nextIndex);
    
    // Reload video with new source
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load(); // Reload with new source
    }
  }, [currentVideoIndex, designerVideos.length]);

  // Switch to previous designer video
  const switchToPrevVideo = useCallback(() => {
    const prevIndex = currentVideoIndex === 0 ? designerVideos.length - 1 : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load();
    }
  }, [currentVideoIndex, designerVideos.length]);

  return (
    <>
      {/* Advanced Loading Screen with Redux Logo Animation */}
      {isLoading && (
        <div 
          ref={loadingRef}
          className="redux-loading-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            transition: 'opacity 0.8s ease-out',
            overflow: 'hidden'
          }}
        >
          {/* Animated Redux Logo */}
          <div className="redux-logo-container" style={{
            position: 'relative',
            marginBottom: '60px'
          }}>
            <h1 className="redux-logo-text" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(4rem, 8vw, 8rem)',
              fontWeight: 800,
              color: 'var(--primary-white)',
              letterSpacing: '0.05em',
              textAlign: 'center',
              margin: 0,
              position: 'relative',
              overflow: 'hidden',
              opacity: 0,
              animation: 'fadeInUp 1.2s ease-out forwards',
              animationDelay: '0.3s'
            }}>
              {heroTitle}
            </h1>
            
            {/* Loading Progress Bar */}
            <div className="loading-progress-container" style={{
              width: '300px',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
              margin: '40px auto 20px'
            }}>
              <div 
                className="loading-progress-bar"
                style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-mocha), var(--accent-warm))',
                  transition: 'width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  borderRadius: '1px'
                }}
              />
            </div>
            
            {/* Loading Text */}
            <p className="loading-text" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: 0
            }}>
              Loading Experience... {loadingProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Main Hero Section */}
      <section 
        ref={heroRef}
        className={`redux-hero ${videoClosed ? 'video-closed' : ''} ${showContent ? 'content-visible' : ''}`}
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: `
            linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
            url('/images/hero-background/background.png') center/cover no-repeat,
            linear-gradient(135deg, #000000, #1a1a1a)
          `,
          opacity: showContent ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        {/* Enhanced Video Container with Google Drive Integration */}
        <div 
          className={`redux-video-container ${videoClosed ? 'hidden' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
            zIndex: 2,
            opacity: videoClosed ? 0 : 1,
            transform: videoClosed ? 'scale(1.1)' : 'scale(1)',
            pointerEvents: videoClosed ? 'none' : 'auto'
          }}
        >
          {/* Background Video - CMS Enabled */}
          <video
            ref={videoRef}
            className="redux-hero-video"
            autoPlay={!isMobile}
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85) contrast(1.1)',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              transition: 'filter 0.3s ease'
            }}
          >
            <source src={videoFiles[0] || '/VIDEO/main.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay for Better Text Readability */}
          <div 
            className="video-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
          
          {/* Modern Video Controls */}
          <div 
            className={`redux-video-controls ${showVideoControls || isMobile ? 'visible' : ''}`}
            style={{
              position: 'absolute',
              top: isMobile ? '20px' : '40px',
              right: isMobile ? '20px' : '40px',
              display: 'flex',
              gap: '15px',
              zIndex: 5,
              opacity: showVideoControls || isMobile ? 1 : 0,
              transform: showVideoControls || isMobile ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            {/* Desktop Controls */}
            {!isMobile && (
              <>
                {/* Previous Video Button */}
                <button 
                  onClick={switchToPrevVideo}
                  className="video-control-btn"
                  title="Previous Designer"
                  style={controlButtonStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 19 2 12 11 5 11 19"></polygon>
                    <polygon points="22 19 13 12 22 5 22 19"></polygon>
                  </svg>
                </button>
                
                {/* Video Info */}
                <div 
                  className="video-info"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    color: 'var(--primary-white)',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}>
                    {currentVideo?.name || 'REDUX'}
                  </span>
                </div>
                
                {/* Next Video Button */}
                <button 
                  onClick={switchToNextVideo}
                  className="video-control-btn"
                  title="Next Designer"
                  style={controlButtonStyle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 19 22 12 13 5 13 19"></polygon>
                    <polygon points="2 19 11 12 2 5 2 19"></polygon>
                  </svg>
                </button>
              </>
            )}
            
            {/* Close Video Button - Always visible */}
            <button 
              onClick={closeVideo}
              className="video-control-btn close-btn"
              title="Close Video"
              style={{
                ...controlButtonStyle,
                background: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'rgba(255, 0, 0, 0.3)',
                width: isMobile ? '50px' : '40px',
                height: isMobile ? '50px' : '40px',
                fontSize: isMobile ? '20px' : '16px'
              }}
            >
              <svg width={isMobile ? "20" : "16"} height={isMobile ? "20" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Video Play Button */}
        <button 
          className="redux-video-play-btn"
          onClick={playVideo}
          title="Play Video Experience"
          style={{ 
            display: videoClosed ? 'flex' : 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            zIndex: 4,
            color: 'var(--primary-white)',
            outline: 'none',
            animation: 'pulsePlay 2s ease-in-out infinite'
          }}
        >
          <svg 
            width={isMobile ? "32" : "48"} 
            height={isMobile ? "32" : "48"} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            style={{
              marginLeft: '4px',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
            }}
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>

        {/* Revolutionary Hero Content */}
        <div 
          ref={contentRef}
          className="redux-hero-content" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 3,
            mixBlendMode: videoClosed ? 'normal' : 'difference',
            width: '90%',
            maxWidth: '1200px',
            isolation: 'isolate',
            padding: '0 20px',
            opacity: showContent ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1) 0.5s'
          }}
        >
          {/* Simplified Main Title */}
          <h1 className="redux-hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 'clamp(3.5rem, 10vw, 12rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.85,
            color: 'var(--primary-white)',
            marginBottom: '30px',
            textShadow: `
              0 0 30px rgba(255,255,255,0.15),
              0 0 60px rgba(183,175,163,0.1),
              0 4px 20px rgba(0,0,0,0.3)
            `,
            position: 'relative',
            opacity: 0,
            animation: 'fadeInUp 1.5s ease-out forwards',
            animationDelay: '0.5s'
          }}>
            {heroTitle}
            
            {/* Title decoration */}
            <div 
              className="title-decoration"
              style={{
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--accent-mocha), transparent)',
                opacity: 0,
                animation: 'fadeInScale 1s ease-out forwards',
                animationDelay: '1.2s'
              }}
            />
          </h1>

          {/* Simplified Subtitle */}
          <div className="redux-subtitle-container" style={{
            position: 'relative',
            margin: '40px 0 50px'
          }}>
            <p className="redux-hero-subtitle" style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--primary-white)',
              textShadow: `
                0 0 20px rgba(255,255,255,0.3),
                0 2px 10px rgba(0,0,0,0.5)
              `,
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '12px 24px',
              borderRadius: '6px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              margin: 0,
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeInUp 1.2s ease-out forwards',
              animationDelay: '0.8s'
            }}>
              {heroSubtitle}
            </p>
          </div>

          {/* Simplified CTA Buttons */}
          <div className="redux-hero-cta" style={{
            marginTop: '70px',
            display: 'flex',
            gap: '25px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            animation: 'fadeInUp 1.2s ease-out forwards',
            animationDelay: '1.2s',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/about" 
              className="redux-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 36px',
                border: '2px solid transparent',
                background: 'linear-gradient(135deg, rgba(183,175,163,0.15), rgba(212,204,197,0.1))',
                color: 'var(--primary-white)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                borderRadius: '50px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                minHeight: '56px'
              }}
            >
              <span>{primaryCTAText}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
            
            <a 
              href="/exhibitions" 
              className="redux-cta-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 36px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--primary-white)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                borderRadius: '50px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '56px'
              }}
            >
              <span>{secondaryCTAText}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
              </svg>
            </a>
          </div>
        </div>

        {/* Enhanced Background Overlays */}
        <div className="redux-background-overlays">
          {/* Main gradient overlay */}
          <div 
            className="primary-gradient-overlay" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(183,175,163,0.08) 0%, transparent 40%),
                radial-gradient(ellipse at 70% 80%, rgba(212,204,197,0.05) 0%, transparent 35%),
                linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)
              `,
              zIndex: 1,
              opacity: videoClosed ? 1 : 0.6,
              transition: 'opacity 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
              pointerEvents: 'none'
            }}
          />
          
          {/* Animated pattern overlay */}
          <div 
            className="pattern-overlay"
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-20%',
              width: '140%',
              height: '140%',
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.01) 2px,
                  rgba(255,255,255,0.01) 4px
                )
              `,
              zIndex: 1,
              opacity: 0.3,
              animation: 'patternMove 20s linear infinite',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* CMS Admin Interface - Only visible to authenticated users */}
        {isAuthenticated && videoSlot && (
          <div 
            className="cms-admin-overlay"
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px',
              maxWidth: '300px'
            }}
          >
            <div style={{
              color: 'var(--primary-white)',
              fontSize: '12px',
              fontWeight: 500,
              marginBottom: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              🎬 Hero Video Management
            </div>
            
            <MediaSlot
              slot={videoSlot}
              currentFiles={videoFiles}
              onFilesUpdate={(files) => {
                updateVideoFiles(files);
                // Reload video when files change
                const video = videoRef.current;
                if (video && files.length > 0) {
                  video.src = files[0];
                  video.load();
                }
              }}
              isAdminMode={true}
              className="mini-cms-slot"
            />
          </div>
        )}
      </section>

      {/* Simplified CSS Animations and Styles */}
      <style jsx>{`
        /* Basic Animations */
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

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translateX(-50%) scaleX(0);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes pulsePlay {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }

        @keyframes patternMove {
          0% {
            transform: translateX(-50px) translateY(-50px);
          }
          100% {
            transform: translateX(0px) translateY(0px);
          }
        }

        /* Video Control Hover Effects */
        .video-control-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
        }

        .video-control-btn.close-btn:hover {
          background: rgba(255, 0, 0, 0.2) !important;
          border-color: rgba(255, 0, 0, 0.5) !important;
        }

        .redux-video-play-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translate(-50%, -50%) scale(1.1) !important;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6) !important;
        }

        /* Enhanced CTA Button Effects */
        .redux-cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent-mocha), var(--accent-warm));
          transition: left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: -1;
          border-radius: inherit;
        }

        .redux-cta-primary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 40px rgba(183,175,163,0.4) !important;
          border-color: var(--accent-mocha) !important;
        }

        .redux-cta-primary:hover::before {
          left: 0;
        }

        .redux-cta-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transition: left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: -1;
          border-radius: inherit;
        }

        .redux-cta-secondary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 40px rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.6) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .redux-cta-secondary:hover::before {
          left: 0;
        }

        /* Video State Management */
        .redux-hero.video-closed {
          background-attachment: fixed;
        }

        .redux-hero.video-closed::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6));
          z-index: 1;
        }

        .redux-video-container.hidden {
          opacity: 0 !important;
          pointer-events: none !important;
          transform: scale(1.1) !important;
        }

        .redux-hero.content-visible {
          animation: heroReveal 1.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        @keyframes heroReveal {
          0% {
            opacity: 0;
            transform: scale(1.05);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .redux-video-controls {
            top: 15px !important;
            right: 15px !important;
            gap: 10px !important;
          }
          
          .video-control-btn {
            width: 42px !important;
            height: 42px !important;
          }
          
          .video-control-btn svg {
            width: 14px !important;
            height: 14px !important;
          }

          .video-info {
            padding: 6px 12px !important;
          }

          .video-info span {
            font-size: 10px !important;
          }

          .redux-video-play-btn {
            width: 70px !important;
            height: 70px !important;
          }

          .redux-video-play-btn svg {
            width: 28px !important;
            height: 28px !important;
          }

          .redux-hero-cta {
            flex-direction: column !important;
            gap: 15px !important;
            margin-top: 50px !important;
          }

          .redux-cta-primary,
          .redux-cta-secondary {
            min-height: 50px !important;
            padding: 16px 28px !important;
            font-size: 11px !important;
            letter-spacing: 2px !important;
          }

          .redux-hero-title {
            font-size: clamp(2.8rem, 15vw, 6rem) !important;
            margin-bottom: 25px !important;
          }

          .redux-hero-subtitle {
            font-size: clamp(0.9rem, 4vw, 1.2rem) !important;
            letter-spacing: 0.2em !important;
            padding: 10px 18px !important;
          }

          .redux-subtitle-container {
            margin: 30px 0 40px !important;
          }
        }

        /* Extra Small Mobile Devices */
        @media (max-width: 480px) {
          .redux-loading-screen .redux-logo-text {
            font-size: clamp(2.5rem, 12vw, 4rem) !important;
          }

          .loading-progress-container {
            width: 250px !important;
          }

          .redux-hero-title {
            font-size: clamp(2.2rem, 18vw, 4.5rem) !important;
            margin-bottom: 20px !important;
          }
          
          .redux-hero-subtitle {
            font-size: clamp(0.7rem, 5vw, 1rem) !important;
            letter-spacing: 0.15em !important;
            padding: 8px 15px !important;
          }

          .redux-cta-primary,
          .redux-cta-secondary {
            padding: 14px 24px !important;
            font-size: 10px !important;
            min-height: 46px !important;
          }

          .redux-video-controls {
            gap: 8px !important;
          }

          .video-control-btn {
            width: 38px !important;
            height: 38px !important;
          }

          .redux-video-play-btn {
            width: 65px !important;
            height: 65px !important;
          }
        }

        /* CMS Admin Overlay Styles */
        .cms-admin-overlay {
          animation: slideInFromLeft 0.5s ease-out;
        }

        .mini-cms-slot :global(.media-slot-admin) {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          padding: 12px !important;
        }

        .mini-cms-slot :global(.media-slot-admin h4) {
          color: var(--primary-white) !important;
          font-size: 11px !important;
        }

        .mini-cms-slot :global(.media-slot-admin p) {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 10px !important;
        }

        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .redux-hero-title {
            text-shadow: none !important;
          }
          
          .redux-hero-subtitle {
            background: rgba(0, 0, 0, 0.8) !important;
            border: 2px solid white !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .redux-hero-title .redux-title-letter {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          
          .redux-hero-subtitle {
            animation: none !important;
            opacity: 1 !important;
            width: auto !important;
          }
          
          .redux-hero-cta {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  );
}

// Control button style constant (moved outside component for better performance)
const controlButtonStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  color: 'var(--primary-white)',
  outline: 'none'
};