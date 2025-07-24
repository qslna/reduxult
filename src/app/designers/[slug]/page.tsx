'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { designers } from '@/data/designers';
import { Designer } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}


export default function DesignerPage({ params }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        const designerSlug = resolvedParams.slug;
        setSlug(designerSlug);
        
        const designerData = designers.find(d => d.id === designerSlug);
        if (!designerData) {
          notFound();
        }
        setDesigner(designerData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error resolving params:', error);
        notFound();
      }
    };
    
    getParams();
  }, [params]);

  useEffect(() => {
    if (!designer || isLoading) return;

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-content', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo('.hero-image', 
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );

      // Portfolio grid animations
      gsap.fromTo('.portfolio-item', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 80%',
            end: 'bottom 20%',
          }
        }
      );

      // Bio section animation
      gsap.fromTo('.bio-content', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.bio-section',
            start: 'top 80%',
          }
        }
      );

      // Navbar scroll effect
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '.navbar' }
      });
    });

    return () => ctx.revert();
  }, [designer, isLoading]);

  useEffect(() => {
    // Keyboard navigation for lightbox
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
  }, [isLightboxOpen, designer]);

  // Navigation functions
  const goBack = () => router.push('/designers');
  const goHome = () => router.push('/');

  // Lightbox functions
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
    <>
      {/* Navigation */}
      <nav className="navbar fixed top-0 left-0 w-full py-6 px-8 bg-black/90 backdrop-blur-xl z-[1000] transition-all duration-500 ease-out border-b border-white/5">
        <div className="nav-container flex justify-between items-center max-w-7xl mx-auto">
          <div className="nav-left flex items-center gap-8">
            <button 
              className="back-button font-['Inter'] text-lg cursor-pointer transition-all duration-300 text-white/80 hover:text-white hover:-translate-x-1 flex items-center gap-2"
              onClick={goBack}
            >
              <span className="text-xl">←</span>
              <span className="hidden sm:block text-sm tracking-wider">Back</span>
            </button>
            <span className="page-title font-['Inter'] text-sm font-medium tracking-[0.3em] text-[#B7AFA3] uppercase hidden md:block">
              {designer.name}
            </span>
          </div>
          <button 
            className="logo font-['Playfair_Display'] text-2xl font-bold tracking-wider cursor-pointer transition-all duration-300 text-white hover:opacity-80 hover:scale-105"
            onClick={goHome}
          >
            REDUX
          </button>
        </div>
      </nav>

      {/* Hero Section - Full Screen with Profile */}
      <section className="hero-section h-screen relative overflow-hidden bg-black flex items-center justify-center">
        <div className="hero-background absolute inset-0 z-0">
          <OptimizedImage 
            src={designer.coverImage}
            alt={`${designer.name} Cover`}
            fill={true}
            priority={true}
            sizes="100vw"
            className="hero-image object-cover brightness-[0.4] contrast-110 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60"></div>
        </div>
        
        <div className="hero-content relative z-10 text-center max-w-4xl mx-auto px-8">
          <div className="designer-number font-['Playfair_Display'] text-[160px] md:text-[220px] font-thin text-white/10 leading-none mb-[-60px] md:mb-[-80px]">
            {String(designer.order).padStart(2, '0')}
          </div>
          
          <h1 className="hero-title font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl font-light uppercase text-white mb-4 tracking-wider">
            {designer.nameKo}
          </h1>
          
          <p className="hero-subtitle font-['Inter'] text-lg md:text-xl tracking-[0.3em] text-[#B7AFA3] mb-3 uppercase">
            {designer.name}
          </p>
          
          <p className="hero-role font-['Inter'] text-sm md:text-base font-medium text-white/90 mb-8 tracking-wider">
            {designer.role}
          </p>
          
          {designer.instagramHandle && (
            <a 
              href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-instagram inline-flex items-center gap-2 font-['Inter'] text-xs tracking-[0.2em] text-[#B7AFA3] hover:text-white transition-colors duration-300 border border-white/20 px-4 py-2 rounded-full hover:border-white/40"
            >
              <span>Instagram</span>
              <span className="text-[10px]">↗</span>
            </a>
          )}
        </div>
      </section>

      {/* Bio Section */}
      <section className="bio-section py-24 md:py-32 px-8 bg-black">
        <div className="bio-content max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-light tracking-wider text-white mb-12">
            Biography
          </h2>
          <p className="font-['Inter'] text-base md:text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">
            {designer.bio}
          </p>
        </div>
      </section>

      {/* Film Section - CINE MODE */}
      {designer.videoUrl && (
        <section className="film-section py-24 md:py-32 px-8 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-light tracking-wider text-white mb-4">
                Fashion Film
              </h2>
              <p className="font-['Inter'] text-lg text-[#B7AFA3] tracking-[0.2em] uppercase">
                CINE MODE - {designer.filmTitle}
              </p>
            </div>
            
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={designer.videoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  border: 'none',
                  borderRadius: '8px'
                }}
                title={`${designer.name} - ${designer.filmTitle}`}
              />
            </div>
            
            <div className="text-center mt-8">
              <p className="font-['Inter'] text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
                {designer.nameKo} 디자이너의 창작 세계를 영상으로 만나보세요. 
                패션과 예술이 만나는 순간을 담은 특별한 시네마틱 경험입니다.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Gallery - Instagram Style */}
      <section className="portfolio-section py-24 md:py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-light tracking-wider text-white mb-16 text-center">
            Portfolio
          </h2>
          
          {/* Instagram-style grid */}
          <div className="portfolio-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {designer.portfolioImages.map((image: string, index: number) => (
              <div 
                key={index}
                className="portfolio-item group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out hover:scale-[1.02] hover:z-10"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square bg-gray-900 overflow-hidden rounded-lg">
                  <OptimizedImage 
                    src={image}
                    alt={`${designer.name} Portfolio ${index + 1}`}
                    fill={true}
                    priority={index < 6}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-110 brightness-90 group-hover:brightness-100 contrast-110 group-hover:contrast-100"
                  />
                </div>
                
                {/* Instagram-style overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-xs">+</span>
                    </div>
                    <p className="font-['Inter'] text-xs font-medium tracking-wider uppercase">
                      View
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-section py-24 md:py-32 px-8 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-light tracking-wider text-white mb-8">
            Collaborate with {designer.nameKo}
          </h2>
          <p className="font-['Inter'] text-base text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            창의적인 프로젝트나 협업 기회가 있으시다면 언제든 연락해 주세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              Contact Us
            </a>
            
            {designer.instagramHandle && (
              <a
                href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider text-sm"
              >
                <span>Follow</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Professional Lightbox */}
      {isLightboxOpen && (
        <div 
          className="lightbox fixed inset-0 bg-black/95 backdrop-blur-xl z-[10000] flex items-center justify-center transition-opacity duration-400"
          onClick={handleLightboxClick}
        >
          <div className="lightbox-content max-w-[90vw] max-h-[90vh] relative">
            {/* Close button */}
            <button 
              className="absolute -top-16 right-0 text-white text-2xl w-12 h-12 flex items-center justify-center transition-all duration-300 hover:text-[#B7AFA3] hover:scale-110 z-50"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            {/* Navigation buttons */}
            <button 
              className="absolute top-1/2 -left-20 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-14 h-14 flex items-center justify-center text-white text-xl transition-all duration-300 hover:bg-[#B7AFA3]/30 hover:scale-110 hidden lg:flex"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            
            <div className="relative">
              <OptimizedImage 
                src={designer.portfolioImages[currentImageIndex]}
                alt={`${designer.name} Portfolio ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                priority={true}
                sizes="90vw"
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-['Inter'] tracking-wider">
                {currentImageIndex + 1} / {designer.portfolioImages.length}
              </div>
            </div>
            
            <button 
              className="absolute top-1/2 -right-20 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-14 h-14 flex items-center justify-center text-white text-xl transition-all duration-300 hover:bg-[#B7AFA3]/30 hover:scale-110 hidden lg:flex"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          </div>

          {/* Mobile navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 lg:hidden">
            <button 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-12 h-12 flex items-center justify-center text-white text-lg"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            <button 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-12 h-12 flex items-center justify-center text-white text-lg"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .navbar.scrolled {
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .portfolio-item {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: calc(var(--index, 0) * 0.1s);
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2.5rem, 8vw, 4rem);
          }
          
          .designer-number {
            font-size: clamp(6rem, 20vw, 10rem);
            margin-bottom: -2rem;
          }
        }
      `}</style>
    </>
  );
}