'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { designers } from '../../../data/designers';
import { Designer } from '../../../types';
import OptimizedImage from '../../../components/ui/OptimizedImage';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';
import { useSimpleCMS, useGalleryCMS } from '../../../hooks/useSimpleCMS';
import GalleryCMS from '../../../components/cms/GalleryCMS';
import DirectCMS from '../../../components/cms/DirectCMS';
import { getSlotById } from '../../../lib/cms-config';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function DesignerPage({ params }: Props) {
  const router = useRouter();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  
  // CMS 인증
  const { isAuthenticated } = useSimpleAuth();
  
  // CMS 슬롯들
  const profileCMS = useSimpleCMS(`designer-${designer?.id || 'default'}-profile`, designer?.profileImage);
  
  // 포트폴리오 갤러리 CMS - cms-config.ts에서 정의된 이미지들 사용
  const portfolioSlot = getSlotById(`designer-${designer?.id || 'default'}-portfolio`);
  const portfolioCMS = useGalleryCMS(
    `designer-${designer?.id || 'default'}-portfolio`, 
    portfolioSlot?.currentFiles || designer?.portfolioImages
  );

  // 클라이언트 마운트 처리
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    try {
      const designerSlug = resolvedParams.slug;
      // Try to find designer by various id formats
      let designerData = designers.find(d => d.id === designerSlug);
      
      // If not found, try with different slug formats
      if (!designerData) {
        designerData = designers.find(d => 
          d.id === designerSlug.replace('-', '') || 
          d.id === designerSlug.replace(/-/g, '') ||
          d.id.replace('-', '') === designerSlug ||
          d.name.toLowerCase().replace(/\s+/g, '-') === designerSlug ||
          d.name.toLowerCase().replace(/\s+/g, '') === designerSlug
        );
      }
      
      if (!designerData) {
        notFound();
        return;
      }
      
      setDesigner(designerData);
      setIsLoading(false);
    } catch (error) {
      notFound();
    }
  }, [resolvedParams]);

  const goBack = () => router.push('/designers');
  const goHome = () => router.push('/');

  const openLightbox = (index: number) => {
    if (!isClient) return;
    
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    if (isClient) {
      document.body.style.overflow = '';
    }
  };

  const nextImage = () => {
    if (designer) {
      const images = portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages;
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (designer) {
      const images = portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages;
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  // 키보드 이벤트 처리 - 클라이언트에서만
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClient, isLightboxOpen]);

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // 블랙스크린 방지 - 로딩 중이거나 디자이너 정보가 없으면 기본 화면
  if (!isClient || isLoading || !designer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-thin tracking-[0.2em] text-white mb-4">REDUX</h1>
          <p className="text-gray-400">{isLoading ? 'Loading...' : 'Designer not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 z-[1000] transition-all duration-[400ms] border-b border-white/10">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-10">
            <button 
              className="text-xl cursor-pointer transition-all duration-[400ms] text-white hover:transform hover:-translate-x-[5px] hover:text-amber-300 bg-transparent border-none outline-none focus:outline-none active:outline-none z-10 relative"
              onClick={goBack}
              type="button"
            >
              ←
            </button>
            <span className="text-lg font-light tracking-[0.2em] text-amber-300 uppercase max-[768px]:hidden z-10 relative">
              {designer.name}
            </span>
          </div>
          <button 
            className="font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em] cursor-pointer transition-all duration-[400ms] text-white hover:opacity-70 hover:transform hover:scale-[1.02] bg-transparent border-none outline-none focus:outline-none active:outline-none z-10 relative"
            onClick={goHome}
            type="button"
          >
            REDUX
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-[120px]">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {/* Background texture */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'
            }}
          />
          
          {/* Avant-garde decorative elements */}
          <div 
            className="absolute top-[20%] right-[15%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ transform: 'rotate(-15deg)' }}
          />
          <div 
            className="absolute bottom-[30%] left-[10%] w-[60px] h-[60px] border border-white/20"
            style={{ transform: 'rotate(25deg)', borderRadius: '30%' }}
          />
          
          {/* 추가 아방가르드 스크래치 라인들 */}
          <div 
            className="absolute top-[35%] left-[25%] w-[100px] h-[0.4px] bg-gradient-to-r from-white/8 via-white/18 to-transparent"
            style={{ transform: 'rotate(-62deg) skewX(-18deg)' }}
          />
          <div 
            className="absolute top-[70%] right-[30%] w-[80px] h-[0.3px] bg-gradient-to-l from-transparent via-white/14 to-white/6"
            style={{ transform: 'rotate(35deg) skewY(12deg)' }}
          />
          <div 
            className="absolute bottom-[50%] right-[12%] w-[45px] h-[0.2px] bg-white/10"
            style={{ transform: 'rotate(-105deg) skewX(25deg)' }}
          />
          <div 
            className="absolute top-[85%] left-[40%] w-[90px] h-[0.3px] bg-gradient-to-r from-white/5 via-transparent to-white/15"
            style={{ transform: 'rotate(22deg) skewY(-20deg)' }}
          />
          <div 
            className="absolute top-[15%] left-[55%] w-[30px] h-[0.15px] bg-white/8"
            style={{ transform: 'rotate(-78deg)' }}
          />
          
          <div className="relative z-10 h-full flex items-center px-10">
            <div className="max-w-[1600px] mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Designer Info */}
                <div className="designer-info">
                  <div className="mb-8">
                    <h1 
                      className="font-['Playfair_Display'] font-bold text-white mb-4 tracking-[-0.02em] leading-[0.9] w-full max-w-full"
                      style={{ 
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        textShadow: '0 0 30px rgba(255,255,255,0.1)'
                      }}
                    >
                      {designer.name}
                    </h1>
                    <div className="mb-4">
                      <p className="text-white text-xl font-medium tracking-[0.2em] uppercase mb-2 w-full max-w-full">
                        {designer.mainRole}
                      </p>
                      <p className="text-amber-300 text-base tracking-[0.1em] uppercase w-full max-w-full">
                        {designer.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="mb-8">
                    <p className="text-white/80 text-lg leading-relaxed max-w-full lg:max-w-[500px] w-full">
                      {designer.bio}
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4 w-full max-w-full">
                    {designer.instagramHandle && (
                      <div className="w-full max-w-full break-words">
                        <span className="text-amber-300 text-sm tracking-[0.1em] uppercase mr-4 w-full max-w-full">
                          Instagram:
                        </span>
                        <a 
                          href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-amber-300 transition-colors duration-300 w-full max-w-full break-words"
                        >
                          {designer.instagramHandle}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Profile Image */}
                <div className="relative">
                  <div 
                    className="relative w-full max-w-[400px] mx-auto"
                  >
                    <OptimizedImage 
                      src={profileCMS.currentUrl || designer.profileImage}
                      alt={`${designer.name} Profile`}
                      width={400}
                      height={500}
                      priority={true}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                      style={{
                        filter: 'contrast(1.1) brightness(0.9)',
                        maxHeight: '500px',
                        minHeight: '300px'
                      }}
                    />
                    
                    {/* 프로필 이미지 CMS */}
                    {isAuthenticated && (
                      <div className="absolute top-2 left-2 z-20">
                        <DirectCMS
                          slotId={`designer-${designer.id}-profile`}
                          currentUrl={profileCMS.currentUrl}
                          type="image"
                          onUpload={profileCMS.handleUpload}
                          onDelete={profileCMS.handleDelete}
                          isAdminMode={true}
                          placeholder="프로필"
                        />
                      </div>
                    )}
                    
                    {/* Decorative elements */}
                    <div 
                      className="absolute -top-2 -right-2 w-8 h-8 border-2 border-amber-300 opacity-60"
                      style={{ transform: 'rotate(45deg)' }}
                    />
                    <div 
                      className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-300 opacity-40"
                      style={{ transform: 'rotate(15deg)', borderRadius: '30%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20 px-10">
          <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-['Playfair_Display'] text-4xl font-light text-white mb-4 tracking-[0.05em]">
                Portfolio
              </h2>
              <div className="w-20 h-[1px] bg-amber-300 mx-auto"></div>
            </div>
            
            {/* Portfolio Grid */}
            <div className="relative">
              {/* CMS 오버레이 - 포트폴리오 갤러리 */}
              {isAuthenticated && (
                <div className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] bg-black/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium text-sm">포트폴리오 갤러리 관리</h3>
                  </div>
                  <div className="overflow-y-auto max-h-[50vh]">
                    <GalleryCMS
                      slotId={`designer-${designer.id}-portfolio`}
                      currentImages={portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages}
                      onUpload={(url: string) => {
                        try {
                          console.log('Gallery upload attempt:', url);
                          if (url && url.trim() !== '') {
                            portfolioCMS.handleUpload(url.trim());
                            console.log('Gallery upload successful:', url);
                          } else {
                            console.error('Invalid URL provided:', url);
                          }
                        } catch (error) {
                          console.error('Gallery upload failed:', error);
                        }
                      }}
                      onDelete={(index: number) => {
                        try {
                          console.log('Gallery delete attempt:', index);
                          portfolioCMS.handleDelete(index);
                          console.log('Gallery delete successful:', index);
                        } catch (error) {
                          console.error('Gallery delete failed:', error);
                        }
                      }}
                      onReorder={portfolioCMS.reorderImages}
                      isAdminMode={true}
                      maxImages={50}
                    />
                  </div>
                </div>
              )}

              {/* Masonry Grid */}
              <div className="[columns:4] [column-gap:20px] max-[1400px]:[columns:3] max-[1024px]:[columns:2] max-[768px]:[columns:1]">
                {/* CMS 관리 이미지 우선, 없으면 기본 이미지 사용 */}
                {(portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages).map((image: string, index: number) => (
                  <div 
                    key={index}
                    className="[break-inside:avoid] mb-5 relative overflow-hidden cursor-pointer opacity-0 transition-all duration-[600ms] hover:transform hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    style={{ 
                      animation: `revealItem 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={() => openLightbox(index)}
                  >
                    <OptimizedImage 
                      src={image}
                      alt={`${designer.name} Portfolio ${index + 1}`}
                      width={400}
                      height={600}
                      priority={index < 8}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-auto block transition-all duration-[600ms] [filter:grayscale(20%)_contrast(1.1)_brightness(0.9)] hover:[filter:grayscale(0%)_contrast(1.2)_brightness(1)]"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-[400ms] flex items-end p-5 hover:opacity-100">
                      <p className="text-xs font-light tracking-[0.1em] text-white uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
                        {String(index + 1).padStart(2, '0')} / {String((portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages).length).padStart(2, '0')}
                      </p>
                    </div>
                    
                    {/* 개별 이미지 CMS */}
                    {isAuthenticated && (
                      <div 
                        className="absolute top-2 left-2 z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <DirectCMS
                          slotId={`designer-${designer.id}-portfolio-${index}`}
                          currentUrl={image}
                          type="image"
                          onUpload={(url) => {
                            const currentImages = portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages;
                            const newImages = [...currentImages];
                            if (index < newImages.length) {
                              // 기존 이미지 교체
                              newImages[index] = url;
                            } else {
                              // 새 이미지 추가
                              newImages.push(url);
                            }
                            portfolioCMS.updateGallery(newImages);
                          }}
                          onDelete={() => {
                            const currentImages = portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages;
                            const newImages = currentImages.filter((_, i) => i !== index);
                            portfolioCMS.updateGallery(newImages);
                          }}
                          isAdminMode={true}
                          placeholder={`포트폴리오 ${index + 1}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* 새 이미지 추가 슬롯 */}
                {isAuthenticated && (
                  <div 
                    className="[break-inside:avoid] mb-5 relative overflow-hidden bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-amber-300 transition-all duration-300 min-h-[200px] flex items-center justify-center"
                    style={{ 
                      animation: `revealItem 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`,
                      animationDelay: `${(portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages).length * 100}ms`
                    }}
                  >
                    <DirectCMS
                      slotId={`designer-${designer.id}-portfolio-new`}
                      type="image"
                      onUpload={(url) => {
                        const currentImages = portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages;
                        const newImages = [...currentImages, url];
                        portfolioCMS.updateGallery(newImages);
                      }}
                      isAdminMode={true}
                      placeholder="새 이미지 추가"
                      className="w-full h-full flex items-center justify-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-[20px] z-[10000] flex items-center justify-center opacity-100 transition-opacity duration-[400ms]"
          onClick={handleLightboxClick}
        >
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <button 
              className="absolute -top-[50px] right-0 bg-transparent border-none text-white text-[30px] cursor-pointer transition-all duration-300 ease-in-out w-10 h-10 flex items-center justify-center hover:text-amber-300 hover:transform hover:scale-120"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            <button 
              className="absolute top-1/2 left-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-amber-300/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            
            <OptimizedImage 
              src={(portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages)[currentImageIndex]}
              alt={`${designer.name} Portfolio ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              priority={true}
              sizes="90vw"
              className="max-w-full max-h-[90vh] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
            
            <button 
              className="absolute top-1/2 right-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-amber-300/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
            
            {/* Image info */}
            <div className="absolute bottom-[-50px] left-0 text-white">
              <p className="text-sm tracking-[0.1em]">
                {String(currentImageIndex + 1).padStart(2, '0')} / {String((portfolioCMS.currentImages.length > 0 ? portfolioCMS.currentImages : designer.portfolioImages).length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes revealItem {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        /* 완전한 모바일 최적화 - 깨짐 방지 */
        @media (max-width: 1024px) {
          /* Navigation 모바일 최적화 */
          nav {
            padding: 15px 20px !important;
          }
          
          .hero-section {
            height: 60vh !important;
            min-height: 500px !important;
            padding: 0 20px !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          
          .hero-section .grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .profile-image-container {
            order: -1 !important;
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
          }
          
          .profile-image {
            max-width: 300px !important;
            width: 100% !important;
            height: auto !important;
          }
          
          /* Portfolio section 모바일 최적화 */
          .portfolio-section {
            padding: 60px 20px !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          
          /* Masonry grid 모바일 최적화 */
          .portfolio-grid {
            columns: 2 !important;
            column-gap: 10px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .portfolio-item {
            margin-bottom: 10px !important;
            break-inside: avoid !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* CMS 오버레이 모바일 대응 */
          .hero-section .absolute.top-20.right-4,
          .portfolio-section .fixed.top-20.right-4 {
            top: 80px !important;
            right: 10px !important;
            width: calc(100vw - 20px) !important;
            max-width: 320px !important;
            font-size: 0.8rem !important;
          }
        }
        
        @media (max-width: 768px) {
          /* 모든 컨테이너 너비 제한 */
          * {
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }
          
          html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            max-width: 100vw !important;
          }
          
          nav {
            padding: 15px 20px !important;
            width: 100vw !important;
            max-width: 100vw !important;
          }
          
          .page-title {
            display: none !important;
          }
          
          .hero-section {
            height: auto !important;
            min-height: 100vh !important;
            width: 100vw !important;
            max-width: 100vw !important;
            padding: 120px 15px 60px !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
          }
          
          /* Bio 섹션 특별 처리 */
          .designer-info .mb-8 {
            margin-bottom: 2rem !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          .hero-section .max-w-\\[1600px\\] {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .hero-section .grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 2rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .designer-info {
            text-align: center !important;
            margin-bottom: 2rem !important;
            width: 100% !important;
            max-width: 100% !important;
            order: 1 !important;
            padding: 0 15px !important;
            box-sizing: border-box !important;
          }
          
          .designer-info p,
          .designer-info .text-white\/80,
          .designer-info .leading-relaxed,
          .designer-info .text-lg {
            max-width: 100% !important;
            width: 100% !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            text-overflow: unset !important;
            font-size: 15px !important;
            line-height: 1.7 !important;
            margin-bottom: 1.5rem !important;
            padding: 0 10px !important;
            text-align: left !important;
            display: block !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          
          /* 모든 디자이너 역할 텍스트 */
          .designer-info .uppercase,
          .designer-info .tracking-\\[0\\.2em\\],
          .designer-info .tracking-\\[0\\.1em\\] {
            max-width: 100% !important;
            width: 100% !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            text-overflow: unset !important;
            overflow: visible !important;
            height: auto !important;
            box-sizing: border-box !important;
            padding: 0 10px !important;
          }
          
          .designer-name,
          .hero-section h1 {
            font-size: clamp(2rem, 8vw, 3rem) !important;
            text-align: center !important;
            width: 100% !important;
            margin-bottom: 1rem !important;
            line-height: 1.1 !important;
          }
          
          .profile-image,
          .hero-section .relative:has(OptimizedImage) {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            order: 0 !important;
            padding: 0 20px !important;
          }
          
          .profile-image img,
          .hero-section .relative:has(OptimizedImage) img {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            max-height: 400px !important;
            min-height: 250px !important;
          }
          
          .portfolio-section {
            padding: 60px 15px !important;
            width: 100vw !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          
          .portfolio-section .max-w-\\[1600px\\] {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .portfolio-grid,
          .\\[columns\\:4\\] {
            columns: 1 !important;
            column-gap: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          
          .portfolio-item,
          .\\[break-inside\\:avoid\\] {
            margin-bottom: 15px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* CMS 모바일 최적화 */
          .fixed.top-20.right-4 {
            position: fixed !important;
            top: 80px !important;
            right: 10px !important;
            left: 10px !important;
            width: auto !important;
            max-width: none !important;
            z-index: 60 !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: 100px 12px 25px !important;
            min-height: 90vh !important;
          }
          
          .hero-section h1,
          .designer-name {
            font-size: clamp(1.8rem, 10vw, 2.5rem) !important;
            margin-bottom: 0.8rem !important;
          }
          
          .profile-image,
          .hero-section .relative:has(OptimizedImage) {
            max-width: 240px !important;
          }
          
          .portfolio-section {
            padding: 50px 12px !important;
          }
          
          .portfolio-grid,
          .\\[columns\\:4\\] {
            columns: 1 !important;
            column-gap: 0 !important;
          }
          
          .portfolio-item,
          .\\[break-inside\\:avoid\\] {
            margin-bottom: 10px !important;
          }
          
          /* 매우 작은 화면에서 CMS 오버레이 조정 */
          .fixed.top-20.right-4 {
            top: 70px !important;
            right: 5px !important;
            left: 5px !important;
            font-size: 0.75rem !important;
          }
        }
        
        @media (max-width: 375px) {
          .hero-section {
            padding: 100px 12px 25px !important;
          }
          
          .designer-name {
            font-size: clamp(1.6rem, 12vw, 2.2rem) !important;
          }
          
          .profile-image {
            max-width: 220px !important;
          }
        }
        
        /* Motion reduction */
        @media (prefers-reduced-motion: reduce) {
          .portfolio-item,
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}