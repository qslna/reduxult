'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { DESIGNER_VIDEOS, getGoogleDriveEmbedUrl, getGoogleDriveThumbnailUrl } from '@/utils/drive-utils';
import { useTextContent } from '@/hooks/usePageContent';

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

  // Advanced loading animation with progress
  useEffect(() => {
    const loadingSteps = [
      { step: 'Initializing REDUX System...', progress: 20, delay: 300 },
      { step: 'Loading Fashion Assets...', progress: 40, delay: 500 },
      { step: 'Connecting Designer Network...', progress: 60, delay: 400 },
      { step: 'Preparing Visual Experience...', progress: 80, delay: 600 },
      { step: 'Welcome to REDUX...', progress: 100, delay: 400 }
    ];

    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const { progress, delay } = loadingSteps[currentStep];
        setLoadingProgress(progress);
        currentStep++;
        
        if (currentStep === loadingSteps.length) {
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setShowContent(true), 500);
          }, delay);
        }
      } else {
        clearInterval(progressInterval);
      }
    }, 800);

    return () => clearInterval(progressInterval);
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

  // Video initialization function
  const initializeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadeddata', () => {
      setVideoLoaded(true);
      console.log('Video loaded successfully');
    });

    video.addEventListener('canplay', () => {
      if (!isMobile) {
        // Auto-play on desktop only
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsVideoPlaying(true);
            setVideoClosed(false);
          }).catch(handleVideoError);
        }
      }
    });

    video.addEventListener('error', handleVideoError);
    video.addEventListener('ended', () => {
      // Auto-switch to next designer video when current ends
      switchToNextVideo();
    });

    // Show controls on hover (desktop only)
    if (!isMobile) {
      const heroElement = heroRef.current;
      if (heroElement) {
        heroElement.addEventListener('mouseenter', () => setShowVideoControls(true));
        heroElement.addEventListener('mouseleave', () => setShowVideoControls(false));
      }
    } else {
      setShowVideoControls(true); // Always show on mobile
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
              overflow: 'hidden'
            }}>
              {heroTitle.split('').map((letter: string, index: number) => (
                <span
                  key={index}
                  className="redux-letter"
                  style={{
                    display: 'inline-block',
                    transform: 'translateY(100px)',
                    opacity: 0,
                    animation: `letterReveal 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                    animationDelay: `${index * 0.15}s`,
                    position: 'relative'
                  }}
                >
                  {letter}
                  <span 
                    className="letter-glow"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, var(--accent-mocha), var(--accent-warm))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      opacity: 0,
                      animation: `letterGlow 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.2 + 1}s`
                    }}
                  >
                    {letter}
                  </span>
                </span>
              ))}
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
          {/* Background Video */}
          <video
            ref={videoRef}
            className="redux-hero-video"
            autoPlay={!isMobile}
            muted
            loop
            playsInline
            preload="metadata"
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
            <source src="/VIDEO/main.mp4" type="video/mp4" />
            <source src="/VIDEO/main.webm" type="video/webm" />
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
            
            {/* Close Video Button */}
            <button 
              onClick={closeVideo}
              className="video-control-btn close-btn"
              title="Close Video"
              style={{
                ...controlButtonStyle,
                background: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'rgba(255, 0, 0, 0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          {/* Enhanced Main Title with Advanced Animations */}
          <h1 className="redux-hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 'clamp(3.5rem, 10vw, 12rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.85,
            color: 'var(--primary-white)',
            marginBottom: '30px',
            overflow: 'hidden',
            textShadow: `
              0 0 30px rgba(255,255,255,0.15),
              0 0 60px rgba(183,175,163,0.1),
              0 4px 20px rgba(0,0,0,0.3)
            `,
            position: 'relative'
          }}>
            {heroTitle.split('').map((letter: string, index: number) => (
              <span
                key={index}
                className="redux-title-letter"
                style={{
                  display: 'inline-block',
                  transform: 'translateY(120px) rotateX(90deg)',
                  opacity: 0,
                  animation: `letterRevealAdvanced 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                  animationDelay: `${index * 0.12 + 0.8}s`,
                  position: 'relative',
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                }}
              >
                {letter}
                {/* Letter glow effect */}
                <span 
                  className="letter-glow-effect"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, var(--accent-mocha), var(--accent-warm))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0,
                    animation: `letterGlowPulse 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.3 + 2}s`
                  }}
                >
                  {letter}
                </span>
              </span>
            ))}
            
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
                animationDelay: '2.5s'
              }}
            />
          </h1>

          {/* Enhanced Subtitle with Modern Typography */}
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
              opacity: 0,
              animation: 'typewriterReveal 2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
              animationDelay: '2s',
              textShadow: `
                0 0 20px rgba(255,255,255,0.3),
                0 2px 10px rgba(0,0,0,0.5)
              `,
              mixBlendMode: 'normal',
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '12px 24px',
              borderRadius: '6px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              margin: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: 0
            }}>
              {heroSubtitle}
            </p>
            
            {/* Typing cursor effect */}
            <span 
              className="typing-cursor"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2px',
                height: '60%',
                background: 'var(--accent-mocha)',
                opacity: 0,
                animation: 'typingCursor 0.8s ease-in-out infinite, fadeInCursor 0.3s ease-out forwards',
                animationDelay: '2s, 2s'
              }}
            />
          </div>

          {/* Modern CTA Buttons with Enhanced Styling */}
          <div className="redux-hero-cta" style={{
            marginTop: '70px',
            display: 'flex',
            gap: '25px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            animation: 'slideUpFade 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
            animationDelay: '3.5s',
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
      </section>

      {/* Advanced CSS Animations and Styles */}
      <style jsx>{`
        /* Loading Animations */
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

        @keyframes letterGlow {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Hero Content Animations */
        @keyframes letterRevealAdvanced {
          0% {
            opacity: 0;
            transform: translateY(120px) rotateX(90deg) scale(0.8);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(20px) rotateX(15deg) scale(0.95);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes letterGlowPulse {
          0%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }

        @keyframes typewriterReveal {
          0% {
            width: 0;
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes typingCursor {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @keyframes fadeInCursor {
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(60px);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
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