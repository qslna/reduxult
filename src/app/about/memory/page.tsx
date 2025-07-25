'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useCMSSlot } from '@/hooks/useCMSSlot';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import MediaSlot from '@/components/cms/MediaSlot';

// HTML redux6 about-memory.html과 완전 동일한 Memory 페이지 구현
export default function MemoryPage() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const { slot: memorySlot, currentFiles: galleryImages, updateFiles: updateGalleryImages } = useCMSSlot('about-memory-gallery');

  // Gallery images are now managed by CMS - fallback to empty array if not loaded
  // CMS will populate galleryImages from the 'about-memory-gallery' slot

  useEffect(() => {
    // HTML 버전과 동일한 키보드 네비게이션
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) {
        switch(event.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // HTML 버전과 동일한 성능 최적화
    const preloadImages = () => {
      galleryImages.slice(0, 6).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    preloadImages();
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // HTML 버전과 동일한 내비게이션 함수들
  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  // HTML 버전과 동일한 라이트박스 함수들
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <>
      {/* Navigation - HTML 버전과 완전 동일한 다크 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[20px] z-[1000] transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] border-b border-[--accent-mocha]/10"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button font-['Inter'] text-xl cursor-pointer transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] text-white no-underline hover:transform hover:-translate-x-[5px] hover:text-[--accent-mocha]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title font-['Inter'] text-lg font-light tracking-[0.2em] text-[--accent-mocha] uppercase max-[768px]:hidden">
              Memory
            </span>
          </div>
          <div 
            className="logo font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em] cursor-pointer transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] text-white no-underline hover:opacity-70 hover:transform hover:scale-[1.02]"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Professional Gallery - HTML 버전과 완전 동일 */}
      <div className="gallery-container min-h-screen pt-[120px] pr-5 pb-[60px] pl-5 relative">
        <div className="gallery-header text-center mb-20 opacity-0 transform translate-y-10 animate-[fadeInUp_1.2s_cubic-bezier(0.25,0.8,0.25,1)_forwards]">
          <h1 className="gallery-title font-['Playfair_Display'] font-bold text-white mb-5 [text-shadow:0_0_20px_rgba(255,255,255,0.1)]"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.02em', lineHeight: 0.9 }}>
            Memory
          </h1>
          <p className="gallery-subtitle font-['Inter'] font-extralight text-[--accent-mocha] uppercase"
             style={{ fontSize: 'clamp(0.875rem, 2vw, 1.25rem)', letterSpacing: '0.3em' }}>
            Collective Moments
          </p>
        </div>
        
        <div className="gallery-grid [columns:4] [column-gap:2px] max-w-[1800px] mx-auto max-[1400px]:[columns:3] max-[1024px]:[columns:2] max-[1024px]:[column-gap:1px] max-[768px]:[columns:1]">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="gallery-item [break-inside:avoid] mb-[2px] relative overflow-hidden opacity-0 cursor-pointer transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:scale-[1.02] hover:z-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-[1024px]:mb-[1px]"
              style={{ 
                '--index': index,
                animation: `fadeInSequential 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                animationDelay: `${index * 50}ms`
              } as React.CSSProperties}
              onClick={() => openLightbox(index)}
            >
              <OptimizedImage 
                src={image}
                alt={`Memory ${index + 1}`}
                width={400}
                height={600}
                priority={index < 6}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="w-full h-auto block transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] [filter:brightness(0.9)_contrast(1.1)] hover:[filter:brightness(1)_contrast(1.2)_saturate(1.1)] hover:transform hover:scale-105"
              />
              <div className="gallery-overlay absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.7)_0%,transparent_30%,transparent_70%,rgba(183,175,163,0.3)_100%)] opacity-0 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] flex items-end p-5 hover:opacity-100">
                <p className="gallery-caption font-['Inter'] text-xs font-light tracking-[0.1em] text-white uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                  Moment {String(index + 1).padStart(2, '0')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CMS Admin Interface - Only visible to authenticated users */}
        {isAuthenticated && memorySlot && (
          <div 
            className="cms-admin-section"
            style={{
              maxWidth: '1800px',
              margin: '60px auto 0',
              padding: '0 20px'
            }}
          >
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '24px'
            }}>
              <div style={{
                color: 'var(--primary-white)',
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                📸 Memory Gallery Management
              </div>
              
              <MediaSlot
                slot={memorySlot}
                isAdminMode={true}
                onFileUpdate={(slotId, files) => {
                  updateGalleryImages(files);
                }}
                className="memory-cms-slot"
              />
            </div>
          </div>
        )}
      </div>

      {/* Professional Lightbox - HTML 버전과 완전 동일 */}
      {isLightboxOpen && (
        <div 
          className="lightbox fixed top-0 left-0 w-full h-full bg-black/95 backdrop-blur-[20px] z-[10000] flex items-center justify-center opacity-100 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)]"
          onClick={handleLightboxClick}
        >
          <div className="lightbox-content max-w-[90vw] max-h-[90vh] relative">
            <button 
              className="lightbox-close absolute -top-[50px] right-0 bg-transparent border-none text-white text-[30px] cursor-pointer transition-all duration-300 ease-in-out w-10 h-10 flex items-center justify-center hover:text-[--accent-mocha] hover:transform hover:scale-120"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            <button 
              className="lightbox-nav lightbox-prev absolute top-1/2 left-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[--accent-mocha]/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            
            <OptimizedImage 
              src={galleryImages[currentImageIndex]}
              alt={`Memory ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              priority={true}
              sizes="90vw"
              className="lightbox-image max-w-full max-h-[90vh] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
            
            <button 
              className="lightbox-nav lightbox-next absolute top-1/2 right-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[--accent-mocha]/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInSequential {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        /* CSS 변수 정의 - HTML 버전과 완전 동일 */
        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --accent-deep: #9A9086;
          --accent-neutral: #F8F6F4;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .gallery-container {
            padding: 100px 10px 40px;
          }
          
          .gallery-header {
            margin-bottom: 40px;
          }
        }
        
        /* CMS Admin Section Styles */
        .cms-admin-section {
          animation: slideUpFade 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .memory-cms-slot :global(.media-slot-admin) {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .memory-cms-slot :global(.media-slot-admin h4) {
          color: var(--accent-mocha) !important;
        }

        .memory-cms-slot :global(.media-slot-admin p) {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Motion Reduction */
        @media (prefers-reduced-motion: reduce) {
          .gallery-item,
          .gallery-header,
          .cms-admin-section {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
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