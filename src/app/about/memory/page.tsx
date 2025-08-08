'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGalleryCMS } from '@/hooks/useSimpleCMS';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import DirectCMS from '@/components/cms/DirectCMS';
import OptimizedImage from '@/components/ui/OptimizedImage';
// import SubPageNavigation from '@/components/layout/SubPageNavigation'; // 제거됨 - layout.tsx에서 Navigation 렌더링

// HTML redux6 about-memory.html과 완전 동일한 Memory 페이지 구현
export default function MemoryPage() {
  const router = useRouter();
  // Client-side only state
  const [isClient, setIsClient] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageError, setLightboxImageError] = useState(false);
  const [lightboxImageLoading, setLightboxImageLoading] = useState(true);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  const memoryCMS = useGalleryCMS('about-memory-gallery', [
    '/images/about/memory/IMG_3452.JPG',
    '/images/about/memory/IMG_3454.JPG',
    '/images/about/memory/IMG_3455.JPG',
    '/images/about/memory/IMG_3481.JPG',
    '/images/about/memory/IMG_3491.JPG',
    '/images/about/memory/IMG_3492.JPG',
    '/images/about/memory/IMG_3493.JPG',
    '/images/about/memory/IMG_4339.JPG',
    '/images/about/memory/IMG_4345.JPG',
    '/images/about/memory/IMG_4348.JPG',
    '/images/about/memory/IMG_4367.JPG',
    '/images/about/memory/IMG_5380.JPG',
    '/images/about/memory/IMG_5381.JPG',
    '/images/about/memory/IMG_5382.JPG',
    '/images/about/memory/IMG_5383.JPG',
    '/images/about/memory/0C22A68E-AADF-4A8D-B5E7-44DDBA2EE64F.jpeg',
    '/images/about/memory/83C1CE7D-97A9-400F-9403-60E89979528A.jpg',
    '/images/about/memory/IMG_1728.jpeg',
    '/images/about/memory/IMG_7103.jpeg',
    '/images/about/memory/IMG_7146.jpeg',
    '/images/about/memory/IMG_7272.jpeg',
    '/images/about/memory/KakaoTalk_20250626_002430368.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_01.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_02.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_03.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_04.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_05.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_06.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_07.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_08.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_09.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_10.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_11.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_12.jpg',
    '/images/about/memory/KakaoTalk_20250626_002430368_13.jpg',
    '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-00 001.jpeg',
    '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 002.jpeg',
    '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 003.jpeg',
    '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 004.jpeg',
    '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 005.jpeg'
  ]);
  const galleryImages = memoryCMS.currentImages;

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Gallery images are now managed by CMS - fallback to empty array if not loaded
  // CMS will populate galleryImages from the 'about-memory-gallery' slot

  // 키보드 네비게이션 - 클라이언트에서만
  useEffect(() => {
    if (!isClient) return;

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
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClient, isLightboxOpen]);

  // 이미지 프리로딩
  useEffect(() => {
    if (!isClient || !galleryImages.length) return;

    const preloadImages = () => {
      galleryImages.slice(0, 6).forEach(src => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    };

    const timeoutId = setTimeout(preloadImages, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient, galleryImages]);


  // 라이트박스 함수들 - 클라이언트 체크 포함
  const openLightbox = (index: number) => {
    if (!isClient || !galleryImages || galleryImages.length === 0) return;
    
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    setLightboxImageError(false);
    setLightboxImageLoading(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    if (isClient) {
      document.body.style.overflow = '';
    }
  };

  const nextImage = () => {
    if (!isClient || !galleryImages || galleryImages.length === 0) return;
    
    setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
    setLightboxImageError(false);
    setLightboxImageLoading(true);
  };

  const prevImage = () => {
    if (!isClient || !galleryImages || galleryImages.length === 0) return;
    
    setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    setLightboxImageError(false);
    setLightboxImageLoading(true);
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // 서버 사이드 렌더링 중에는 null 반환 - 로딩 화면 없이
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Navigation - About 서브페이지용 통일된 네비게이션 - 제거됨: layout.tsx에서 렌더링됨 */}
      {/* <SubPageNavigation pageTitle="Memory" /> */}

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
              
              {/* CMS 버튼 for admin */}
              {isAuthenticated && (
                <div 
                  className="absolute top-2 right-2 z-20"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DirectCMS
                    slotId={`memory-gallery-${index}`}
                    currentUrl={image}
                    type="image"
                    onUpload={(url) => {
                      const newImages = [...galleryImages];
                      newImages[index] = url;
                      memoryCMS.updateGallery(newImages);
                    }}
                    onDelete={() => {
                      const newImages = galleryImages.filter((_, i) => i !== index);
                      memoryCMS.updateGallery(newImages);
                    }}
                    isAdminMode={true}
                    placeholder={`메모리 ${index + 1}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 새 이미지 추가 슬롯 */}
        {isAuthenticated && (
          <div className="max-w-[1800px] mx-auto mt-10 px-5">
            <div 
              className="[break-inside:avoid] mb-[2px] relative overflow-hidden bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-amber-300 transition-all duration-300 min-h-[200px] flex items-center justify-center"
              style={{ 
                animation: `fadeInSequential 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                animationDelay: `${galleryImages.length * 50}ms`
              }}
            >
              <DirectCMS
                slotId={`memory-gallery-new`}
                type="image"
                onUpload={(url) => {
                  const newImages = [...galleryImages, url];
                  memoryCMS.updateGallery(newImages);
                }}
                isAdminMode={true}
                placeholder="새 메모리 추가"
                className="w-full h-full flex items-center justify-center"
              />
            </div>
          </div>
        )}
      </div>

      {/* Professional Lightbox - 현재 보는 위치 기준으로 수정 */}
      {isLightboxOpen && (
        <div 
          className="lightbox fixed inset-0 bg-black/95 backdrop-blur-[20px] z-[10000] opacity-100 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)]"
          onClick={handleLightboxClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
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
            
            <div className="relative">
              {lightboxImageError ? (
                <div className="flex items-center justify-center text-white min-h-[50vh]">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50">📷</div>
                    <p className="text-lg mb-2">Failed to load image</p>
                    <p className="text-sm opacity-70 mb-4">Image may not exist or is not accessible</p>
                    <button 
                      onClick={() => {
                        setLightboxImageError(false);
                        setLightboxImageLoading(true);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors border border-white/20"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {lightboxImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white min-h-[50vh]">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mb-4 mx-auto"></div>
                        <p className="text-sm opacity-70">Loading image...</p>
                      </div>
                    </div>
                  )}
                  <OptimizedImage 
                    src={galleryImages[currentImageIndex] || ''}
                    alt={`Memory ${currentImageIndex + 1}`}
                    width={1200}
                    height={800}
                    priority={true}
                    sizes="90vw"
                    className="lightbox-image max-w-full max-h-[90vh] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                    onLoad={() => setLightboxImageLoading(false)}
                    onError={() => {
                      setLightboxImageLoading(false);
                      setLightboxImageError(true);
                    }}
                  />
                </>
              )}
            </div>
            
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
        
        /* Enhanced Mobile Responsive adjustments */
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px !important;
          }
          
          .page-title {
            display: none !important;
          }
          
          .gallery-container {
            padding: 100px 15px 40px !important;
          }
          
          .gallery-header {
            margin-bottom: 30px !important;
            text-align: center !important;
          }
          
          .gallery-header h1 {
            font-size: 2.5rem !important;
            margin-bottom: 1rem !important;
          }
          
          .gallery-header p {
            font-size: 0.9rem !important;
            padding: 0 20px !important;
          }
          
          .gallery-grid {
            columns: 2 !important;
            column-gap: 1px !important;
          }
          
          .gallery-item {
            margin-bottom: 1px !important;
          }
        }
        
        @media (max-width: 480px) {
          .gallery-container {
            padding: 90px 10px 30px !important;
          }
          
          .gallery-header h1 {
            font-size: 2rem !important;
          }
          
          .gallery-header p {
            font-size: 0.85rem !important;
            padding: 0 10px !important;
          }
          
          .gallery-grid {
            columns: 1 !important;
            column-gap: 0 !important;
          }
          
          .gallery-item {
            margin-bottom: 0.5px !important;
          }
        }
        
        @media (max-width: 375px) {
          .gallery-container {
            padding: 80px 8px 25px !important;
          }
          
          .gallery-header h1 {
            font-size: 1.8rem !important;
          }
          
          .gallery-header p {
            font-size: 0.8rem !important;
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

// Framer Motion 애니메이션으로 마이그레이션 완료