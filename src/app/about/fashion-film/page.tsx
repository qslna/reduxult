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

  // 필름 데이터 - HTML 버전과 완전 동일
  const films = [
    { designer: 'KIM BOMIN', title: 'CHASING VOWS', id: 'kimbomin' },
    { designer: 'PARK PARANG', title: 'THE TIME BETWEEN', id: 'parkparang' },
    { designer: 'LEE TAEHYEON', title: 'POLYHEDRON', id: 'leetaehyeon' },
    { designer: 'CHOI EUNSOL', title: 'SOUL SUCKER', id: 'choieunsol' },
    { designer: 'HWANG JINSU', title: 'WHO AM I ?!', id: 'hwangjinsu' },
    { designer: 'KIM GYEONGSU', title: 'TO BE REVEALED', id: 'kimgyeongsu' }
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

      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-black overflow-hidden">
        <h1 
          className="hero-title font-thin uppercase text-white text-center opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.3em]"
          style={{ fontSize: 'clamp(60px, 10vw, 160px)' }}
        >
          Fashion Film
        </h1>
        <p className="hero-subtitle absolute bottom-[60px] left-1/2 transform -translate-x-1/2 text-sm tracking-[3px] text-white opacity-60 uppercase">
          CINE MODE Exhibition Films
        </p>
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
              className="film-item relative cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards]"
              onClick={() => openFilm(film.id)}
            >
              <div className="film-thumbnail relative pb-[133.33%] bg-[--gray-dark] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/40 before:z-[1] before:transition-opacity before:duration-500 before:ease-in-out hover:before:opacity-0">
                <div className="play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-[10px] border-2 border-white rounded-full flex items-center justify-center z-[2] transition-all duration-300 ease-in-out hover:transform hover:-translate-x-1/2 hover:-translate-y-1/2 hover:scale-110 hover:bg-white/20">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-white ml-1"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
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
          <div className="modal-video w-full h-full bg-[--gray-dark] flex items-center justify-center text-white text-2xl">
            Video Player Placeholder
          </div>
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
        
        .film-item.revealed {
          animation: revealItem 0.8s ease forwards;
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