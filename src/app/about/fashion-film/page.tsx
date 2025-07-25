'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// HTML redux6 about-fashion-film.html과 완전 동일한 Fashion Film 페이지 구현
export default function FashionFilmPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState('');

  useEffect(() => {
    // HTML 버전과 동일한 스크롤 네비게이션 효과
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

    window.addEventListener('scroll', handleScroll);

    // HTML 버전과 동일한 필름 아이템 reveal 애니메이션
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.film-item').forEach(item => {
      observer.observe(item);
    });

    // ESC 키로 모달 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFilm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, []);

  // HTML 버전과 동일한 내비게이션 함수들
  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  const openFilm = (designer: string) => {
    setCurrentFilm(designer);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFilm = () => {
    setIsModalOpen(false);
    setCurrentFilm('');
    document.body.style.overflow = 'auto';
  };

  // 필름 데이터 - 실제 이미지와 구글 드라이브 비디오 링크 포함
  const films = [
    { 
      designer: 'KIM BOMIN', 
      title: 'CHASING VOWS', 
      id: 'kimbomin',
      thumbnail: '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg',
      videoUrl: 'https://drive.google.com/file/d/1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X/preview'
    },
    { 
      designer: 'PARK PARANG', 
      title: 'THE TIME BETWEEN', 
      id: 'parkparang',
      thumbnail: '/images/profile/Park Parang.jpg',
      videoUrl: 'https://drive.google.com/file/d/15d901XRElkF5p7xiJYelIyblYFb-PtsD/preview'
    },
    { 
      designer: 'LEE TAEHYEON', 
      title: 'POLYHEDRON', 
      id: 'leetaehyeon',
      thumbnail: '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg',
      videoUrl: 'https://drive.google.com/file/d/1fG2fchKvEG7i7Lo79K7250mgiVTse6ks/preview'
    },
    { 
      designer: 'CHOI EUNSOL', 
      title: 'SOUL SUCKER', 
      id: 'choieunsol',
      thumbnail: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
      videoUrl: 'https://drive.google.com/file/d/1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3/preview'
    },
    { 
      designer: 'HWANG JINSU', 
      title: 'WHO AM I ?!', 
      id: 'hwangjinsu',
      thumbnail: '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg',
      videoUrl: 'https://drive.google.com/file/d/1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d/preview'
    },
    { 
      designer: 'KIM GYEONGSU', 
      title: 'TO BE REVEALED', 
      id: 'kimgyeongsu',
      thumbnail: '/images/designers/kimgyeongsu/Showcase/IMG_2544.jpg',
      videoUrl: 'https://drive.google.com/file/d/1Hl594dd_MY714hZwmklTAPTc-pofe9bY/preview'
    }
  ];

  return (
    <>
      {/* Navigation - HTML 버전과 동일한 다크 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-white/10 scrolled:py-[15px] scrolled:px-10 scrolled:bg-black/98"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button text-xl cursor-pointer transition-all duration-300 ease-in-out text-white hover:transform hover:-translate-x-[5px]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title text-lg font-medium tracking-[2px] text-white max-[768px]:hidden">
              FASHION FILM
            </span>
          </div>
          <div 
            className="logo text-2xl font-bold tracking-[2px] cursor-pointer transition-opacity duration-300 ease-in-out text-white hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Hero Section - 디자이너 스타일 강화 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-black overflow-hidden pt-[100px]">
        {/* 배경 노이즈 텍스처 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E")',
            zIndex: 1
          }}
        />
        
        {/* 비대칭 기하학적 요소들 */}
        <div 
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '200px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'rotate(-25deg)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '15%',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            transform: 'rotate(15deg)',
            zIndex: 2
          }}
        />
        
        <div className="hero-content text-center relative z-10">
          <h1 
            className="hero-title font-bold uppercase text-white text-center opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.2em] glitch-text"
            style={{ 
              fontSize: 'clamp(60px, 10vw, 160px)',
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              textShadow: '0 0 30px rgba(255,255,255,0.1)'
            }}
          >
            Fashion Film
          </h1>
          <div 
            className="hero-separator"
            style={{
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #fff, transparent)',
              margin: '30px auto',
              opacity: 0,
              animation: 'fadeInUp 1s ease forwards',
              animationDelay: '0.5s'
            }}
          />
          <p 
            className="hero-subtitle text-sm tracking-[4px] text-white opacity-0 uppercase"
            style={{
              animation: 'fadeInUp 1s ease forwards',
              animationDelay: '0.7s',
              fontWeight: 300,
              letterSpacing: '0.3em'
            }}
          >
            CINE MODE Exhibition Films
          </p>
        </div>
      </section>

      {/* Film Grid Section - HTML 버전과 완전 동일 */}
      <section className="film-grid-section py-[120px] px-10 bg-black">
        <div className="section-intro max-w-[800px] mx-auto mb-[120px] text-center">
          <h2 className="text-4xl font-light tracking-[3px] text-white mb-[30px]">
            CINE MODE
          </h2>
          <p className="text-base leading-[2] text-[--gray-medium]">
            REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
            영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
          </p>
        </div>
        
        <div className="film-grid grid grid-cols-3 gap-[60px] max-w-[1400px] mx-auto max-[1024px]:grid-cols-2 max-[1024px]:gap-10 max-[768px]:grid-cols-1 max-[768px]:gap-[60px]">
          {films.map((film, index) => (
            <div 
              key={film.id}
              className="film-item group relative cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards]"
              onClick={() => openFilm(film.id)}
              style={{
                filter: 'contrast(0.9) brightness(0.95)',
                transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
            >
              <div className="film-thumbnail relative pb-[133.33%] overflow-hidden rounded-lg border border-white/10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-black/20 before:z-[1] before:transition-opacity before:duration-500 before:ease-in-out group-hover:before:opacity-30">
                <img 
                  src={film.thumbnail}
                  alt={`${film.designer} - ${film.title}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    filter: 'grayscale(20%) contrast(1.1) brightness(0.9)',
                    transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                />
                <div className="play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-[10px] border-2 border-white/30 rounded-full flex items-center justify-center z-[2] transition-all duration-500 ease-out group-hover:scale-125 group-hover:bg-white/20 group-hover:border-white/50">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-white ml-1 transition-all duration-300"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                
                {/* 글리치 효과 */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
                  style={{
                    background: 'linear-gradient(45deg, transparent 48%, rgba(255,0,0,0.03) 49%, rgba(255,0,0,0.03) 51%, transparent 52%, transparent 58%, rgba(0,255,255,0.03) 59%, rgba(0,255,255,0.03) 61%, transparent 62%)',
                    animation: 'glitchSlide 2s ease-in-out infinite'
                  }}
                />
              </div>
              <div className="film-info py-[30px]">
                <h3 className="film-designer text-xl font-light tracking-[2px] text-white mb-[10px]">
                  {film.designer}
                </h3>
                <p className="film-title text-sm tracking-[1px] text-[--gray-medium] uppercase">
                  {film.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Film Modal - HTML 버전과 완전 동일 */}
      <div 
        className={`film-modal fixed top-0 left-0 w-full h-screen bg-black/95 flex items-center justify-center z-[2000] transition-all duration-500 ease-in-out ${
          isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="modal-close absolute top-10 right-10 w-[60px] h-[60px] bg-white/10 border border-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20 hover:transform hover:scale-110 max-[768px]:top-5 max-[768px]:right-5 max-[768px]:w-[50px] max-[768px]:h-[50px]"
          onClick={closeFilm}
        >
          <span className="text-[30px] text-white font-light">×</span>
        </div>
        <div className="modal-content w-[90%] max-w-[1200px] h-[80vh] relative">
          {currentFilm && (
            <iframe
              src={films.find(f => f.id === currentFilm)?.videoUrl || ''}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            />
          )}
          {!currentFilm && (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white text-2xl rounded-lg border border-white/10">
              <div className="text-center">
                <div className="mb-4 text-6xl opacity-20">▶</div>
                <p className="text-lg opacity-60">Loading Video...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes heroFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes revealItem {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glitchSlide {
          0%, 100% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-2px);
          }
          20% {
            transform: translateX(2px);
          }
          30% {
            transform: translateX(-1px);
          }
          40%, 60% {
            transform: translateX(0);
          }
          70% {
            transform: translateX(1px);
          }
          80% {
            transform: translateX(-1px);
          }
          90% {
            transform: translateX(1px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 글리치 텍스트 효과 */
        .glitch-text:hover {
          animation: glitchText 0.5s ease-in-out;
        }
        
        @keyframes glitchText {
          0%, 100% {
            text-shadow: 0 0 30px rgba(255,255,255,0.1);
          }
          25% {
            text-shadow: 2px 0 0 rgba(255, 0, 0, 0.1), -2px 0 0 rgba(0, 255, 255, 0.1);
          }
          50% {
            text-shadow: -1px 0 0 rgba(255, 0, 0, 0.1), 1px 0 0 rgba(0, 255, 255, 0.1);
          }
          75% {
            text-shadow: 1px 0 0 rgba(255, 0, 0, 0.1), -1px 0 0 rgba(0, 255, 255, 0.1);
          }
        }
        
        .film-item.revealed {
          animation: revealItem 0.8s ease forwards;
        }
        
        /* Enhanced film item hover effects */
        .film-item:hover {
          filter: contrast(1.1) brightness(1.05) !important;
          transform: translateY(-8px) !important;
        }
        
        .film-item:hover img {
          filter: grayscale(0%) contrast(1.2) brightness(1) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(40px, 8vw, 80px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .film-grid-section {
            padding: 80px 20px;
          }
          
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .modal-content {
            w-95% !important;
            h-70vh !important;
          }
          
          .film-item:hover {
            transform: translateY(-4px) !important;
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