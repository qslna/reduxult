'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { designers } from '@/data/designers';
import { Designer } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import SimpleCMS from '@/components/cms/SimpleCMS';

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
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  
  // CMS 인증
  const { isAuthenticated } = useSimpleAuth();
  
  // CMS 슬롯들
  const profileCMS = useSimpleCMS(`designer-${designer?.id || 'default'}-profile`, designer?.profileImage);
  const portfolioCMS = useSimpleCMS(`designer-${designer?.id || 'default'}-portfolio`);

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
      const designerData = designers.find(d => d.id === designerSlug);
      
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
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (designer) {
      setCurrentImageIndex(prev => (prev + 1) % designer.portfolioImages.length);
    }
  };

  const prevImage = () => {
    if (designer) {
      setCurrentImageIndex(prev => (prev - 1 + designer.portfolioImages.length) % designer.portfolioImages.length);
    }
  };

  useEffect(() => {
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
  }, [isLightboxOpen]);

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Inter'] text-sm tracking-wider text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!designer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[20px] z-[1000] transition-all duration-[400ms] border-b border-white/10">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-10">
            <span 
              className="text-xl cursor-pointer transition-all duration-[400ms] text-white hover:transform hover:-translate-x-[5px] hover:text-amber-300"
              onClick={goBack}
            >
              ←
            </span>
            <span className="text-lg font-light tracking-[0.2em] text-amber-300 uppercase max-[768px]:hidden">
              {designer.name}
            </span>
          </div>
          <div 
            className="font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em] cursor-pointer transition-all duration-[400ms] text-white hover:opacity-70 hover:transform hover:scale-[1.02]"
            onClick={goHome}
          >
            REDUX
          </div>
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
          
          {/* Decorative elements */}
          <div 
            className="absolute top-[20%] right-[15%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ transform: 'rotate(-15deg)' }}
          />
          <div 
            className="absolute bottom-[30%] left-[10%] w-[60px] h-[60px] border border-white/20"
            style={{ transform: 'rotate(25deg)', borderRadius: '30%' }}
          />
          
          <div className="relative z-10 h-full flex items-center px-10">
            <div className="max-w-[1600px] mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Designer Info */}
                <div className="designer-info">
                  <div className="mb-8">
                    <h1 
                      className="font-['Playfair_Display'] font-bold text-white mb-4 tracking-[-0.02em] leading-[0.9]"
                      style={{ 
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        textShadow: '0 0 30px rgba(255,255,255,0.1)'
                      }}
                    >
                      {designer.name}
                    </h1>
                    <div className="mb-4">
                      <p className="text-white text-xl font-medium tracking-[0.2em] uppercase mb-2">
                        {designer.mainRole}
                      </p>
                      <p className="text-amber-300 text-base tracking-[0.1em] uppercase">
                        {designer.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="mb-8">
                    <p className="text-white/80 text-lg leading-relaxed max-w-[500px]">
                      {designer.bio}
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    {designer.instagramHandle && (
                      <div>
                        <span className="text-amber-300 text-sm tracking-[0.1em] uppercase mr-4">
                          Instagram:
                        </span>
                        <a 
                          href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-amber-300 transition-colors duration-300"
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
                    style={{ aspectRatio: '3/4' }}
                  >
                    <OptimizedImage 
                      src={profileCMS.currentUrl || designer.profileImage}
                      alt={`${designer.name} Profile`}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                      style={{
                        filter: 'contrast(1.1) brightness(0.9)',
                        clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'
                      }}
                    />
                    
                    
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
              {/* CMS 오버레이 - 포트폴리오 */}
              {isAuthenticated && (
                <div className="absolute -top-16 right-0 z-20">
                  <div className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                    <div className="text-sm font-medium text-white mb-3">포트폴리오 관리</div>
                    <SimpleCMS
                      slotId={`designer-${designer.id}-portfolio`}
                      currentUrl={portfolioCMS.currentUrl}
                      type="image"
                      onUpload={portfolioCMS.handleUpload}
                      onDelete={portfolioCMS.handleDelete}
                      isAdminMode={true}
                      className="w-16 h-16"
                      placeholder="포트폴리오"
                    />
                  </div>
                </div>
              )}

              {/* Masonry Grid */}
              <div className="[columns:4] [column-gap:20px] max-[1400px]:[columns:3] max-[1024px]:[columns:2] max-[768px]:[columns:1]">
                {designer.portfolioImages.map((image: string, index: number) => (
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
                        {String(index + 1).padStart(2, '0')} / {String(designer.portfolioImages.length).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                ))}
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
              src={designer.portfolioImages[currentImageIndex]}
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
                {String(currentImageIndex + 1).padStart(2, '0')} / {String(designer.portfolioImages.length).padStart(2, '0')}
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
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .hero-section {
            height: 60vh;
            min-height: 400px;
          }
          
          .hero-section .grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .profile-image-container {
            order: -1;
          }
          
          .profile-image {
            max-width: 300px;
          }
        }
        
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .hero-section {
            height: 50vh;
            min-height: 350px;
            padding: 0 20px;
          }
          
          .portfolio-section {
            padding: 60px 20px;
          }
          
          .portfolio-grid {
            column-gap: 10px;
          }
          
          .portfolio-item {
            margin-bottom: 10px;
          }
          
          .designer-name {
            font-size: clamp(2rem, 8vw, 3rem) !important;
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