'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import DirectCMS from '@/components/cms/DirectCMS';

// 최적화된 ShowcaseSection - 로딩 문제 해결
export default function ShowcaseSection() {
  const [isClient, setIsClient] = useState(false);
  
  // CMS 인증
  const { isAuthenticated } = useSimpleAuth();
  
  // SimpleCMS 슬롯 - 디자이너 프로필 이미지들
  const kimBominCMS = useSimpleCMS('main-designer-profile-kimbomin', '/images/profile/Kim Bomin.webp');
  const parkParangCMS = useSimpleCMS('main-designer-profile-parkparang', '/images/profile/Park Parang.jpg');
  const leeTaehyeonCMS = useSimpleCMS('main-designer-profile-leetaehyeon', '/images/profile/Lee Taehyeon.jpg');
  const choiEunsolCMS = useSimpleCMS('main-designer-profile-choieunsol', '/images/profile/Choi Eunsol.jpeg');
  const kimGyeongsuCMS = useSimpleCMS('main-designer-profile-kimgyeongsu', '/images/profile/Kim Gyeongsu.webp');
  
  // SimpleCMS 슬롯 - 전시 프리뷰 이미지들
  const cinemodeCMS = useSimpleCMS('main-exhibition-cinemode', '/images/exhibitions/cinemode/1.jpg');
  const theroomCMS = useSimpleCMS('main-exhibition-theroom', '/images/exhibitions/theroom/1.jpg');
  
  // 디자이너 데이터
  const designers = [
    { 
      id: 'kimbomin', 
      name: 'KIM BOMIN', 
      cms: kimBominCMS, 
      link: '/designers/kimbomin',
      role: 'Fashion Designer'
    },
    { 
      id: 'parkparang', 
      name: 'PARK PARANG', 
      cms: parkParangCMS, 
      link: '/designers/parkparang',
      role: 'Fashion Designer'
    },
    { 
      id: 'leetaehyeon', 
      name: 'LEE TAEHYEON', 
      cms: leeTaehyeonCMS, 
      link: '/designers/leetaehyeon',
      role: 'Creative Director'
    },
    { 
      id: 'choieunsol', 
      name: 'CHOI EUNSOL', 
      cms: choiEunsolCMS, 
      link: '/designers/choieunsol',
      role: 'Fashion Designer'
    },
    { 
      id: 'kimgyeongsu', 
      name: 'KIM GYEONGSU', 
      cms: kimGyeongsuCMS, 
      link: '/designers/kimgyeongsu',
      role: 'Fashion Designer'
    }
  ];

  // 전시 데이터
  const exhibitions = [
    {
      id: 'cinemode',
      name: 'CINE MODE',
      description: 'Fashion Film Exhibition',
      cms: cinemodeCMS,
      link: '/exhibitions#cine-mode'
    },
    {
      id: 'theroom',
      name: 'THE ROOM OF [ ]',
      description: 'Multi-media Exhibition',
      cms: theroomCMS,
      link: '/exhibitions#the-room'
    }
  ];

  // 클라이언트 마운트 처리
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드 렌더링 중에는 기본 콘텐츠 반환
  if (!isClient) {
    return (
      <section className="showcase-section py-20 px-10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="showcase-grid grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
            {/* Loading skeleton */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-800 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="showcase-section py-20 px-10 bg-black min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 md:mb-6 tracking-[0.1em]"
          >
            DISCOVER
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4">
            5명의 디자이너와 그들의 창작 세계, 그리고 함께 만들어가는 전시의 공간을 탐험해보세요.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="showcase-grid grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
          {/* Designers */}
          {designers.map((designer, index) => (
            <Link 
              key={designer.id}
              href={designer.link} 
              className="showcase-item group relative overflow-hidden bg-gray-900 aspect-square transition-all duration-500 hover:scale-105 hover:z-10"
              style={{
                animation: `fadeInUp 0.8s ease forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0
              }}
            >
              <OptimizedImage
                src={designer.cms.currentUrl || `/images/profile/${designer.name.replace(' ', ' ')}.${designer.id === 'kimbomin' || designer.id === 'kimgyeongsu' ? 'webp' : designer.id === 'choieunsol' ? 'jpeg' : 'jpg'}`}
                alt={designer.name}
                fill={true}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-medium text-sm tracking-[0.1em] mb-1">
                    {designer.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {designer.role}
                  </p>
                </div>
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
                    slotId={`main-designer-profile-${designer.id}`}
                    currentUrl={designer.cms.currentUrl}
                    type="image"
                    onUpload={designer.cms.handleUpload}
                    onDelete={designer.cms.handleDelete}
                    isAdminMode={true}
                    placeholder={designer.name}
                  />
                </div>
              )}
            </Link>
          ))}

          {/* Exhibitions */}
          {exhibitions.map((exhibition, index) => (
            <Link 
              key={exhibition.id}
              href={exhibition.link} 
              className="showcase-item group relative overflow-hidden bg-gray-900 aspect-square transition-all duration-500 hover:scale-105 hover:z-10"
              style={{
                animation: `fadeInUp 0.8s ease forwards`,
                animationDelay: `${(designers.length + index) * 100}ms`,
                opacity: 0
              }}
            >
              <OptimizedImage
                src={exhibition.cms.currentUrl || `/images/exhibitions/${exhibition.id}/1.jpg`}
                alt={exhibition.name}
                fill={true}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-['Playfair_Display'] font-medium text-sm tracking-[0.1em] mb-1 text-amber-300">
                    {exhibition.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {exhibition.description}
                  </p>
                </div>
                
                {/* Exhibition indicator */}
                <div className="absolute top-4 left-4">
                  <span className="text-xs bg-amber-300 text-black px-2 py-1 rounded uppercase tracking-wider font-medium">
                    Exhibition
                  </span>
                </div>
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
                    slotId={`main-exhibition-${exhibition.id}`}
                    currentUrl={exhibition.cms.currentUrl}
                    type="image"
                    onUpload={exhibition.cms.handleUpload}
                    onDelete={exhibition.cms.handleDelete}
                    isAdminMode={true}
                    placeholder={exhibition.name}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link 
            href="/about"
            className="inline-block px-8 py-4 border border-white/30 text-white uppercase tracking-[0.2em] text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
          >
            Explore More
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .showcase-item {
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .showcase-item:hover {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        }
        
        /* Enhanced Mobile Responsive adjustments */
        @media (max-width: 768px) {
          .showcase-section {
            padding: 50px 20px !important;
            min-height: auto !important;
          }
          
          .showcase-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          
          .showcase-item {
            aspect-ratio: 1 !important;
            border-radius: 8px !important;
          }
          
          .showcase-item h3 {
            font-size: 0.75rem !important;
          }
          
          .showcase-item p {
            font-size: 0.65rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .showcase-section {
            padding: 40px 15px !important;
          }
          
          .showcase-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }
          
          .showcase-item h3 {
            font-size: 0.7rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          .showcase-item p {
            font-size: 0.6rem !important;
          }
        }
        
        @media (max-width: 375px) {
          .showcase-section {
            padding: 30px 12px !important;
          }
          
          .showcase-grid {
            gap: 0.5rem !important;
          }
          
          .showcase-item h3 {
            font-size: 0.65rem !important;
          }
          
          .showcase-item p {
            font-size: 0.55rem !important;
          }
        }
        
        /* Performance optimizations */
        .showcase-item img {
          will-change: transform;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .showcase-item {
            animation: none !important;
            opacity: 1 !important;
          }
          
          .showcase-item img,
          .showcase-item {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}