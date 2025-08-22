'use client';

import { useEffect, useState } from 'react';
import { useCMSSlot } from '../../../hooks/useCMSSlot';
import { useSimpleAuth } from '../../../hooks/useSimpleAuth';
import MediaSlot from '../../../components/cms/MediaSlot';
import OptimizedImage from '../../../components/ui/OptimizedImage';

// 최적화된 Fashion Film 페이지
export default function FashionFilmPage() {
  return <FashionFilmContent />;
}

function FashionFilmContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState('');
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // CMS integration
  const { isAuthenticated } = useSimpleAuth();
  
  // 기본 영화 데이터 - 검은 화면 방지를 위해 항상 렌더링 가능
  const baseFilmData = [
    {
      id: 'kimbomin',
      name: 'Kim Bomin',
      title: 'CHASING VOWS',
      description: '설레임과 이별의 감정을 담은 서사',
      defaultThumbnail: '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg',
      defaultVideo: '1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X'
    },
    {
      id: 'parkparang',
      name: 'Park Parang',
      title: 'THE TIME BETWEEN',
      description: '시간의 틈 사이에서 발견하는 아름다움',
      defaultThumbnail: '/images/profile/Park Parang.jpg',
      defaultVideo: '15d901XRElkF5p7xiJYelIyblYFb-PtsD'
    },
    {
      id: 'leetaehyeon',
      name: 'Lee Taehyeon',
      title: 'POLYHEDRON',
      description: '다면체로 표현하는 인간의 복잡성',
      defaultThumbnail: '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg',
      defaultVideo: '1fG2fchKvEG7i7Lo79K7250mgiVTse6ks'
    },
    {
      id: 'choieunsol',
      name: 'Choi Eunsol',
      title: 'SOUL SUCKER',
      description: '영혼을 빨아드리는 유혹의 힘',
      defaultThumbnail: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
      defaultVideo: '1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3'
    },
    {
      id: 'kimgyeongsu',
      name: 'Kim Gyeongsu',
      title: 'TO BE REVEALED',
      description: '드러날 진실에 대한 고민',
      defaultThumbnail: '/images/designers/kimgyeongsu/Showcase/IMG_2544.jpg',
      defaultVideo: '1Hl594dd_MY714hZwmklTAPTc-pofe9bY'
    }
  ];

  // CMS 슬롯들 - 클라이언트에서만 초기화
  const kimbomin_thumb = useCMSSlot('about-fashionfilm-kimbomin-thumbnail');
  const parkparang_thumb = useCMSSlot('about-fashionfilm-parkparang-thumbnail');
  const leetaehyeon_thumb = useCMSSlot('about-fashionfilm-leetaehyeon-thumbnail');
  const choieunsol_thumb = useCMSSlot('about-fashionfilm-choieunsol-thumbnail');
  const kimgyeongsu_thumb = useCMSSlot('about-fashionfilm-kimgyeongsu-thumbnail');

  useEffect(() => {
    if (!isClient) return;

    // 스크롤 네비게이션 효과
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    // 키보드 모달 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const filmItems = document.querySelectorAll('.film-item');
    filmItems.forEach(item => observer.observe(item));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [isClient, isModalOpen]);


  const formatGoogleDriveUrl = (cmsUrl: string | undefined, defaultId: string) => {
    const fileId = cmsUrl || defaultId;
    return `https://drive.google.com/file/d/${fileId}/preview?usp=sharing&controls=1&modestbranding=1&rel=0&showinfo=0`;
  };

  const openFilm = (filmId: string) => {
    if (!isClient) return;
    
    const film = baseFilmData.find(f => f.id === filmId);
    if (!film) return;
    
    setCurrentFilm(film.defaultVideo);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isClient) {
      document.body.style.overflow = '';
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 블랙스크린 방지 - SSR에서도 콘텐츠 렌더링

  return (
    <>


      {/* Hero Section */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-black overflow-hidden pt-[80px]">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'
          }}
        />
        
        {/* Avant-garde decorative scratch lines */}
        <div 
          className="absolute top-[15%] right-[10%] w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ transform: 'rotate(-25deg)' }}
        />
        <div 
          className="absolute bottom-[25%] left-[8%] w-[80px] h-[80px] border border-white/20"
          style={{ transform: 'rotate(15deg)', borderRadius: '30%' }}
        />
        
        {/* 추가 아방가르드 선 요소들 */}
        <div 
          className="absolute top-[35%] left-[15%] w-[120px] h-[0.4px] bg-gradient-to-r from-white/10 via-white/20 to-transparent"
          style={{ transform: 'rotate(-75deg) skewX(-20deg)' }}
        />
        <div 
          className="absolute top-[60%] right-[25%] w-[90px] h-[0.3px] bg-gradient-to-l from-transparent via-white/15 to-white/8"
          style={{ transform: 'rotate(42deg) skewY(15deg)' }}
        />
        <div 
          className="absolute bottom-[45%] left-[35%] w-[60px] h-[0.2px] bg-white/12"
          style={{ transform: 'rotate(-135deg) skewX(30deg)' }}
        />
        <div 
          className="absolute top-[80%] right-[15%] w-[110px] h-[0.3px] bg-gradient-to-r from-white/6 via-transparent to-white/18"
          style={{ transform: 'rotate(28deg) skewY(-25deg)' }}
        />
        <div 
          className="absolute top-[20%] left-[50%] w-[40px] h-[0.15px] bg-white/8"
          style={{ transform: 'rotate(-88deg)' }}
        />
        
        <div className="hero-content text-center z-10">
          <h1 
            className="hero-title font-['Playfair_Display'] font-thin uppercase text-white tracking-[0.2em] leading-[0.8]"
            style={{ fontSize: 'clamp(60px, 10vw, 160px)' }}
          >
            FASHION<br />FILM
          </h1>
          <p className="hero-subtitle text-base tracking-[3px] text-amber-300 mt-8 opacity-80">
            Moving Images, Moving Stories
          </p>
        </div>
      </section>

      {/* Films Grid Section */}
      <section className="films-section py-[120px] px-10 bg-black">
        <div className="section-intro max-w-[800px] mx-auto mb-[120px] text-center">
          <h2 className="text-4xl font-['Playfair_Display'] font-light tracking-[3px] text-white mb-[30px]">
            5인 5색의 시각적 서사
          </h2>
          <p className="text-base leading-[2] text-white/70">
            REDUX의 5명 디자이너가 각자의 시선으로 풀어낸 패션 필름 컬렉션입니다.<br />
            의상을 넘어선 이야기, 움직임을 통해 전달되는 감정을 경험해보세요.
          </p>
        </div>
        
        <div className="films-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
          {baseFilmData.map((film, index) => {
            // CMS 슬롯에서 이미지 가져오기 (안전하게)
            let thumbnailUrl = film.defaultThumbnail;
            let cmsSlot = null;
            
            if (isClient && isAuthenticated) {
              switch(film.id) {
                case 'kimbomin':
                  cmsSlot = kimbomin_thumb;
                  break;
                case 'parkparang':
                  cmsSlot = parkparang_thumb;
                  break;
                case 'leetaehyeon':
                  cmsSlot = leetaehyeon_thumb;
                  break;
                case 'choieunsol':
                  cmsSlot = choieunsol_thumb;
                  break;
                case 'kimgyeongsu':
                  cmsSlot = kimgyeongsu_thumb;
                  break;
              }
              if (cmsSlot?.currentFiles?.[0]) {
                thumbnailUrl = cmsSlot.currentFiles[0];
              }
            }
            
            return (
              <div 
                key={film.id}
                className="film-item relative overflow-hidden cursor-pointer group opacity-0 transform translate-y-[50px] hover:scale-[1.02] transition-all duration-500 ease-out"
                style={{ 
                  aspectRatio: '16/10',
                  animation: `revealItem 0.8s ease forwards`,
                  animationDelay: `${index * 200}ms`
                }}
                onClick={() => openFilm(film.id)}
              >
                <OptimizedImage 
                  src={thumbnailUrl}
                  alt={`${film.name} - ${film.title}`}
                  fill={true}
                  priority={index < 3}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-all duration-[800ms] group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-['Playfair_Display'] font-medium tracking-[2px] mb-2 text-amber-300">
                      {film.title}
                    </h3>
                    <p className="text-sm tracking-[1px] mb-1 uppercase">
                      {film.name}
                    </p>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {film.description}
                    </p>
                  </div>
                  
                  {/* Play icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* CMS overlay for admin - 안전한 렌더링 */}
                {isAuthenticated && isClient && cmsSlot?.slot && (
                  <div 
                    className="absolute top-2 right-2 z-20 w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MediaSlot
                      slot={cmsSlot.slot}
                      currentFiles={cmsSlot.currentFiles}
                      onFilesUpdate={cmsSlot.updateFiles}
                      isAdminMode={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Video Modal - 현재 보는 위치 기준으로 수정 */}
      {isModalOpen && (
        <div 
          className="modal-overlay fixed inset-0 bg-black/95 z-[10000] cursor-pointer"
          onClick={handleModalClick}
          style={{
            backdropFilter: 'blur(20px)',
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
          <div 
            className="modal-content relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-[50px] right-0 text-white text-3xl hover:text-amber-300 transition-colors duration-300 w-10 h-10 flex items-center justify-center"
              onClick={closeModal}
            >
              ×
            </button>
            
            <div className="relative w-[80vw] h-[45vw] max-w-[1200px] max-h-[675px] bg-black rounded-lg overflow-hidden">
              {currentFilm && (
                <iframe
                  src={formatGoogleDriveUrl(currentFilm, currentFilm)}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Fashion Film"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        .scrolled {
          background: rgba(0, 0, 0, 0.98) !important;
          padding-top: 15px !important;
          padding-bottom: 15px !important;
        }
        
        @keyframes revealItem {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .film-item.revealed {
          animation: revealItem 0.8s ease forwards;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .films-section {
            padding: 80px 20px;
          }
          
          .films-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .hero-title {
            font-size: clamp(40px, 12vw, 80px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .films-section {
            padding: 60px 15px;
          }
          
          .modal-content .relative {
            width: 95vw !important;
            height: 53vw !important;
          }
        }
      `}</style>
    </>
  );
}