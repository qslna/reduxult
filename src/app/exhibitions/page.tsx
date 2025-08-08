'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import DirectCMS from '@/components/cms/DirectCMS';

// Simplified Exhibitions Page
export default function ExhibitionsPage() {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentAlt, setCurrentAlt] = useState('');
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  
  // CMS slots for exhibition galleries
  const cinemode1CMS = useSimpleCMS('exhibition-cinemode-1', '/images/exhibitions/cinemode/1.jpg');
  const cinemode2CMS = useSimpleCMS('exhibition-cinemode-2', '/images/exhibitions/cinemode/2.jpg');
  const cinemode3CMS = useSimpleCMS('exhibition-cinemode-3', '/images/exhibitions/cinemode/3.jpg');
  const cinemode4CMS = useSimpleCMS('exhibition-cinemode-4', '/images/exhibitions/cinemode/4.jpg');
  
  const theroom1CMS = useSimpleCMS('exhibition-theroom-1', '/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png');
  const theroom2CMS = useSimpleCMS('exhibition-theroom-2', '/images/exhibitions/theroom/qslna_minimalist_concrete_courtyard_high-key_daylight_overcas_85d5cd51-4cd3-40e8-9111-12e1bf3c2bdd_0.png');
  const theroom3CMS = useSimpleCMS('exhibition-theroom-3', '/images/exhibitions/theroom/qslna_split-frame_triptych_left_strip--front_close-crop_of_ma_25f1d65c-d800-4e74-9a72-5919d703eeb2_1.png');
  

  const openLightbox = (imageSrc: string, imageAlt: string) => {
    setCurrentImage(imageSrc);
    setCurrentAlt(imageAlt);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Navigation with better UX */}
      <nav className="fixed top-0 left-0 w-full py-4 px-6 bg-black/95 backdrop-blur-md z-[1000] border-b border-white/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left navigation */}
          <div className="flex items-center space-x-6">
            {/* Back button with better UX */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-white hover:text-amber-300 transition-all duration-300 cursor-pointer group"
              aria-label="홈으로 가기"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Breadcrumb navigation */}
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push('/')}
                className="text-white/70 hover:text-white transition-colors tracking-wider uppercase font-medium"
              >
                Home
              </button>
              <span className="text-white/30">/</span>
              <span className="text-amber-300 tracking-wider uppercase">Exhibitions</span>
            </div>
            
            {/* Quick navigation links */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <button
                onClick={() => router.push('/about')}
                className="text-white/70 hover:text-amber-300 transition-colors text-sm tracking-wider uppercase"
              >
                About
              </button>
              <button
                onClick={() => router.push('/designers')}
                className="text-white/70 hover:text-amber-300 transition-colors text-sm tracking-wider uppercase"
              >
                Designers
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="text-white/70 hover:text-amber-300 transition-colors text-sm tracking-wider uppercase"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Right - Logo */}
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-white hover:text-amber-300 transition-all duration-300 font-['Playfair_Display'] tracking-wider hover:scale-105"
          >
            REDUX
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-white hover:text-amber-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Exhibitions</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/about')}
              className="text-white/70 hover:text-amber-300 transition-colors text-xs uppercase"
            >
              About
            </button>
            <button
              onClick={() => router.push('/designers')}
              className="text-white/70 hover:text-amber-300 transition-colors text-xs uppercase"
            >
              Designers
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-[120px]">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <h1 
              className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.9]"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                textShadow: '0 0 30px rgba(255,255,255,0.1)'
              }}
            >
              EXHIBITIONS
            </h1>
            <p className="text-white/80 text-xl tracking-[0.2em] uppercase">
              Redefining Fashion Through Space
            </p>
          </div>
        </section>

        {/* CINE MODE Section */}
        <section id="cine-mode" className="py-20 px-10">
          <div className="max-w-[1600px] mx-auto">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              {/* Text Content */}
              <div>
                <h2 
                  className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.9]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
                >
                  CINE<br />MODE
                </h2>
                <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                  <p>
                    REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
                  </p>
                  <p>
                    5인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 시각적 서사를 경험할 수 있습니다.
                  </p>
                </div>
                <button 
                  className="mt-8 px-8 py-4 border border-amber-300 text-amber-300 bg-transparent hover:bg-amber-300 hover:text-black transition-all duration-300 tracking-[0.1em] uppercase"
                  onClick={() => alert('Exhibition Details Coming Soon')}
                >
                  Explore Exhibition
                </button>
              </div>
              
              {/* Featured Image */}
              <div className="relative">
                <OptimizedImage 
                  src={cinemode1CMS.currentUrl || "/images/exhibitions/cinemode/1.jpg"}
                  alt="CINE MODE Exhibition"
                  width={600}
                  height={400}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto object-cover cursor-pointer transition-all duration-[600ms] hover:scale-[1.02]"
                  onClick={() => openLightbox(cinemode1CMS.currentUrl || '/images/exhibitions/cinemode/1.jpg', 'CINE MODE Exhibition')}
                />
                
                {/* CMS 오버레이 */}
                {isAuthenticated && (
                  <div 
                    className="absolute top-4 right-4 z-20 w-12 h-12"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DirectCMS
                      slotId="exhibition-cinemode-1"
                      currentUrl={cinemode1CMS.currentUrl}
                      type="image"
                      onUpload={cinemode1CMS.handleUpload}
                      onDelete={cinemode1CMS.handleDelete}
                      isAdminMode={true}
                      placeholder="Cinemode 1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: 1, cms: cinemode1CMS },
                { num: 2, cms: cinemode2CMS },
                { num: 3, cms: cinemode3CMS },
                { num: 4, cms: cinemode4CMS }
              ].map(({ num, cms }) => (
                <div key={num} className="relative aspect-square overflow-hidden">
                  <OptimizedImage 
                    src={cms.currentUrl || `/images/exhibitions/cinemode/${num}.jpg`}
                    alt={`CINE MODE Gallery ${num}`}
                    fill={true}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover cursor-pointer transition-all duration-[600ms] hover:scale-[1.1]"
                    onClick={() => openLightbox(cms.currentUrl || `/images/exhibitions/cinemode/${num}.jpg`, `CINE MODE Gallery ${num}`)}
                  />
                  
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
                        slotId={`exhibition-cinemode-${num}`}
                        currentUrl={cms.currentUrl}
                        type="image"
                        onUpload={cms.handleUpload}
                        onDelete={cms.handleDelete}
                        isAdminMode={true}
                        placeholder={`Cinemode ${num}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE ROOM OF [ ] Section */}
        <section id="the-room" className="py-20 px-10 bg-gray-900/30">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              {/* Featured Image */}
              <div className="relative order-2 lg:order-1">
                <OptimizedImage 
                  src={theroom1CMS.currentUrl || "/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png"}
                  alt="THE ROOM OF [ ] Exhibition"
                  width={600}
                  height={400}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto object-cover cursor-pointer transition-all duration-[600ms] hover:scale-[1.02]"
                  onClick={() => openLightbox(theroom1CMS.currentUrl || '/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png', 'THE ROOM OF [ ] Exhibition')}
                />
                
                {/* CMS 오버레이 */}
                {isAuthenticated && (
                  <div 
                    className="absolute top-4 right-4 z-20 w-12 h-12"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DirectCMS
                      slotId="exhibition-theroom-1"
                      currentUrl={theroom1CMS.currentUrl}
                      type="image"
                      onUpload={theroom1CMS.handleUpload}
                      onDelete={theroom1CMS.handleDelete}
                      isAdminMode={true}
                      placeholder="The Room 1"
                    />
                  </div>
                )}
              </div>
              
              {/* Text Content */}
              <div className="order-1 lg:order-2">
                <h2 
                  className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.9]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
                >
                  THE ROOM<br />OF <span className="text-amber-300">[ ]</span>
                </h2>
                <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                  <p>
                    패션 필름, 텍스타일 아트, 인터랙션 디자인, 공간 인스톨레이션 등 다양한 매체를 통해 각 디자이너의 서로 다른 컨셉으로 전시를 풀어냅니다.
                  </p>
                  <p>
                    빈 공간 [ ] 안에 각자의 이야기를 채워나가는 실험적인 전시입니다.
                  </p>
                </div>
                <button 
                  className="mt-8 px-8 py-4 border border-gray-500 text-gray-400 bg-transparent cursor-not-allowed tracking-[0.1em] uppercase"
                  disabled
                >
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { num: 1, cms: theroom1CMS },
                { num: 2, cms: theroom2CMS },
                { num: 3, cms: theroom3CMS }
              ].map(({ num, cms }) => (
                <div key={num} className="relative aspect-square overflow-hidden">
                  <OptimizedImage 
                    src={cms.currentUrl || (num === 1 ? '/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png' : num === 2 ? '/images/exhibitions/theroom/qslna_minimalist_concrete_courtyard_high-key_daylight_overcas_85d5cd51-4cd3-40e8-9111-12e1bf3c2bdd_0.png' : '/images/exhibitions/theroom/qslna_split-frame_triptych_left_strip--front_close-crop_of_ma_25f1d65c-d800-4e74-9a72-5919d703eeb2_1.png')}
                    alt={`THE ROOM Gallery ${num}`}
                    fill={true}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover cursor-pointer transition-all duration-[600ms] hover:scale-[1.1]"
                    onClick={() => openLightbox(cms.currentUrl || (num === 1 ? '/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png' : num === 2 ? '/images/exhibitions/theroom/qslna_minimalist_concrete_courtyard_high-key_daylight_overcas_85d5cd51-4cd3-40e8-9111-12e1bf3c2bdd_0.png' : '/images/exhibitions/theroom/qslna_split-frame_triptych_left_strip--front_close-crop_of_ma_25f1d65c-d800-4e74-9a72-5919d703eeb2_1.png'), `THE ROOM Gallery ${num}`)}
                  />
                  
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
                        slotId={`exhibition-theroom-${num}`}
                        currentUrl={cms.currentUrl}
                        type="image"
                        onUpload={cms.handleUpload}
                        onDelete={cms.handleDelete}
                        isAdminMode={true}
                        placeholder={`The Room ${num}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Exhibitions Section */}
        <section className="py-20 px-10">
          <div className="max-w-[1600px] mx-auto text-center">
            <h2 
              className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              FUTURE<br />EXHIBITIONS
            </h2>
            <div className="max-w-[600px] mx-auto space-y-6 text-white/80 text-lg leading-relaxed mb-8">
              <p>
                REDUX는 계속해서 새로운 형태의 전시를 준비하고 있습니다.
              </p>
              <p>
                패션과 예술의 경계를 넘나들며, 관객과 함께 만들어가는 특별한 경험을 선사하겠습니다.
              </p>
            </div>
            <button 
              className="px-8 py-4 border border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 tracking-[0.1em] uppercase"
              onClick={() => alert('Stay tuned for updates!')}
            >
              Stay Updated
            </button>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
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
            
            <OptimizedImage 
              src={currentImage}
              alt={currentAlt}
              width={1200}
              height={800}
              priority={true}
              sizes="90vw"
              className="max-w-full max-h-[90vh] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        /* Enhanced Mobile Responsive adjustments */
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px !important;
          }
          
          .page-title {
            display: none !important;
          }
          
          section {
            padding: 50px 20px !important;
          }
          
          .grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          h1 {
            font-size: clamp(2.5rem, 8vw, 4rem) !important;
            text-align: center !important;
          }
          
          h2 {
            font-size: clamp(2rem, 6vw, 3rem) !important;
            text-align: center !important;
            margin-bottom: 1.5rem !important;
          }
          
          p {
            font-size: 0.9rem !important;
            line-height: 1.6 !important;
            text-align: center !important;
          }
          
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          .hero-section {
            height: 60vh !important;
            min-height: 400px !important;
          }
        }
        
        @media (max-width: 480px) {
          section {
            padding: 40px 15px !important;
          }
          
          h1 {
            font-size: clamp(2rem, 10vw, 3rem) !important;
          }
          
          h2 {
            font-size: clamp(1.5rem, 8vw, 2.5rem) !important;
          }
          
          p {
            font-size: 0.85rem !important;
            padding: 0 10px !important;
          }
          
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
          
          .hero-section {
            height: 50vh !important;
            min-height: 350px !important;
          }
          
          button {
            padding: 12px 24px !important;
            font-size: 0.8rem !important;
            margin: 0 auto !important;
            display: block !important;
          }
        }
        
        @media (max-width: 375px) {
          section {
            padding: 30px 12px !important;
          }
          
          h1 {
            font-size: clamp(1.8rem, 12vw, 2.5rem) !important;
          }
          
          h2 {
            font-size: clamp(1.3rem, 10vw, 2rem) !important;
          }
          
          p {
            font-size: 0.8rem !important;
            padding: 0 5px !important;
          }
          
          .hero-section {
            height: 45vh !important;
            min-height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}