'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aboutGalleries } from '@/data/aboutGallery';
import OptimizedImage from '@/components/ui/OptimizedImage';
import HydrationSafe, { useIsClient } from '@/components/ui/HydrationSafe';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import DirectCMS from '@/components/cms/DirectCMS';

// 최적화된 About 페이지 - 로딩 문제 해결
export default function AboutPage() {
  return (
    <HydrationSafe fallback={<div className="min-h-screen bg-black"></div>}>
      <AboutContent />
    </HydrationSafe>
  );
}

function AboutContent() {
  const router = useRouter();
  const isClient = useIsClient();
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  
  // CMS 슬롯들 - 각 카테고리별 프리뷰 이미지
  const fashionFilmCMS = useSimpleCMS('about-preview-fashion-film', '/images/designers/choieunsol/cinemode/IMG_8617.jpeg');
  const visualArtCMS = useSimpleCMS('about-preview-visual-art', '/images/about/visual-art/Metamorphosis.png');
  const memoryCMS = useSimpleCMS('about-preview-memory', '/images/about/memory/IMG_3452.JPG');
  const installationCMS = useSimpleCMS('about-preview-installation', '/images/about/process/공간  연출.png');
  const collectiveCMS = useSimpleCMS('about-preview-collective', '/images/profile/Kim Bomin.webp');
  
  // CMS 매핑
  const categoryCMSMap: { [key: string]: any } = {
    'fashion-film': fashionFilmCMS,
    'visual-art': visualArtCMS,
    'memory': memoryCMS,
    'installation': installationCMS,
    'collective': collectiveCMS
  };

  // useIsClient 훅으로 클라이언트 상태 관리

  useEffect(() => {
    if (!isClient) return;

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('grid-revealed');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const gridItems = document.querySelectorAll('.about-grid-item');
    gridItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [isClient]);

  const goHome = () => {
    router.push('/');
  };

  // 카테고리 그리드 설정
  const categoryConfigs: Record<string, { gridColumn: string; gridRow: string }> = {
    'fashion-film': { gridColumn: 'span 7', gridRow: 'span 2' },
    'memory': { gridColumn: 'span 5', gridRow: 'span 3' },
    'visual-art': { gridColumn: 'span 4', gridRow: 'span 2' },
    'installation': { gridColumn: 'span 4', gridRow: 'span 2' },
    'collective': { gridColumn: 'span 8', gridRow: 'span 2' }
  };

  // HydrationSafe 컴포넌트가 클라이언트 렌더링을 보장

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[20px] z-[1000] transition-all duration-[400ms] border-b border-white/10">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-10">
            <span 
              className="text-xl cursor-pointer transition-all duration-[400ms] text-white hover:transform hover:-translate-x-[5px] hover:text-amber-300"
              onClick={goHome}
            >
              ←
            </span>
            <span className="text-lg font-light tracking-[0.2em] text-amber-300 uppercase max-[768px]:hidden">
              ABOUT
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

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-[100px]">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'
          }}
        />
        
        {/* Decorative elements */}
        <div 
          className="absolute top-[15%] right-[10%] w-[120px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ transform: 'rotate(-20deg)' }}
        />
        <div 
          className="absolute bottom-[20%] left-[8%] w-[50px] h-[50px] border border-white/20"
          style={{ transform: 'rotate(30deg)', borderRadius: '25%' }}
        />
        
        <div className="text-center z-10 px-6">
          <h1 
            className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.85]"
            style={{ 
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              textShadow: '0 0 30px rgba(255,255,255,0.1)'
            }}
          >
            WHO REDUX?
          </h1>
          <p className="text-white/80 text-xl tracking-[0.3em] uppercase">
            Fashion Designer Collective
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                className="font-['Playfair_Display'] font-bold text-white mb-8 tracking-[-0.02em] leading-[0.9]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
              >
                우리는<br />REDUX<br />입니다
              </h2>
              <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                <p>
                  REDUX는 6인의 패션 디자이너가 모여 만든 크리에이티브 콜렉티브입니다. 
                  우리는 패션을 넘어 다양한 예술적 매체를 통해 새로운 경험을 창조합니다.
                </p>
                <p>
                  패션 필름, 설치 미술, 비주얼 아트, 공간 디자인 등 다양한 형태로 
                  관객들에게 '기억에 남을 순간'을 선사하고자 합니다.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-['Playfair_Display'] font-light text-amber-300 mb-4 tracking-[0.1em]">
                  OUR PHILOSOPHY
                </h3>
                <div className="space-y-4 text-white/70">
                  <p>우리는 경계를 넘어 새로운 가능성을 탐구합니다.</p>
                  <p>각자의 개성이 하나로 모여 더 큰 시너지를 만들어냅니다.</p>
                  <p>순간을 넘어 영원히 기억될 경험을 디자인합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 px-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl font-light text-white mb-4 tracking-[0.05em]">
              EXPLORE OUR WORLD
            </h2>
            <div className="w-20 h-[1px] bg-amber-300 mx-auto"></div>
          </div>
          
          {/* Responsive Grid */}
          <div className="about-categories-grid">
            {aboutGalleries.length > 0 ? (
              aboutGalleries.map((category, index) => {
                const config = categoryConfigs[category.id] || { gridColumn: 'span 6', gridRow: 'span 2' };
                const cms = categoryCMSMap[category.id];
                const imageUrl = cms?.currentUrl || category.previewImages[0]?.src || '/images/default-preview.jpg';
                
                return (
                  <div
                    key={category.id}
                    className="about-grid-item relative overflow-hidden cursor-pointer group opacity-0 transform translate-y-[30px]"
                    style={{
                      gridColumn: config.gridColumn,
                      gridRow: config.gridRow,
                      animation: `revealItem 0.8s ease forwards`,
                      animationDelay: `${index * 200}ms`
                    }}
                    onClick={() => router.push(`/about/${category.id}`)}
                  >
                    <OptimizedImage
                      src={imageUrl}
                      alt={category.name}
                      fill={true}
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-[800ms] group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl font-['Playfair_Display'] font-medium tracking-[0.1em] mb-2 text-amber-300">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center">
                        <span className="text-sm">→</span>
                      </div>
                    </div>
                    
                    {/* CMS 버튼 for admin */}
                    {isAuthenticated && cms && (
                      <div 
                        className="absolute top-2 right-2 z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <DirectCMS
                          slotId={`about-preview-${category.id}`}
                          currentUrl={cms.currentUrl}
                          type="image"
                          onUpload={cms.handleUpload}
                          onDelete={cms.handleDelete}
                          isAdminMode={true}
                          placeholder={category.name}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-white/50">
                <p>카테고리를 불러오는 중...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-categories-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 200px;
          gap: 1rem;
          min-height: 600px;
        }
        
        @keyframes revealItem {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .about-grid-item.grid-revealed {
          animation: revealItem 0.8s ease forwards;
        }
        
        /* Responsive grid adjustments */
        @media (max-width: 1024px) {
          .about-categories-grid {
            grid-template-columns: repeat(8, 1fr);
            grid-auto-rows: 180px;
          }
          
          .about-grid-item[style*="span 7"] {
            grid-column: span 8 !important;
          }
          
          .about-grid-item[style*="span 5"] {
            grid-column: span 8 !important;
          }
          
          .about-grid-item[style*="span 4"] {
            grid-column: span 4 !important;
          }
          
          .about-grid-item[style*="span 8"] {
            grid-column: span 8 !important;
          }
        }
        
        @media (max-width: 768px) {
          .about-categories-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 250px;
            gap: 1rem;
          }
          
          .about-grid-item {
            grid-column: 1 !important;
            grid-row: span 1 !important;
          }
        }
        
        /* Performance optimizations */
        .about-grid-item img {
          will-change: transform;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .about-grid-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          
          .about-grid-item img {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}