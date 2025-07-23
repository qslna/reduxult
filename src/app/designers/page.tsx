'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// HTML redux6 designers.html과 완전 동일한 Designers 페이지 구현
export default function DesignersPage() {
  const router = useRouter();

  useEffect(() => {
    // HTML 버전과 동일한 스크롤 네비게이션 효과
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
          navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // HTML 버전과 동일한 디자이너 카드 reveal 애니메이션
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.designer-card').forEach(card => {
      observer.observe(card);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  // 6인의 디자이너 데이터 - HTML 버전과 완전 동일
  const designers = [
    {
      id: 'leetaehyeon',
      number: '01',
      name: '이태현',
      englishName: 'LEE TAEHYEON',
      role: 'Creative Director',
      description: '패션을 통해 이야기를 만들어가는 크리에이티브 디렉터입니다.',
      profileImage: '/images/designers/leetaehyeon/profile.jpg',
      instagram: '@leetaehyeon_designer'
    },
    {
      id: 'choieunsol',
      number: '02',
      name: '최은솔',
      englishName: 'CHOI EUNSOL',
      role: 'Fashion Designer',
      description: '지속가능한 패션을 추구하는 디자이너입니다.',
      profileImage: '/images/designers/choieunsol/profile.jpg',
      instagram: '@choieunsol_fashion'
    },
    {
      id: 'hwangjinsu',
      number: '03',
      name: '황진수',
      englishName: 'HWANG JINSU',
      role: 'Visual Director',
      description: '시각적 언어로 패션의 새로운 가능성을 탐구합니다.',
      profileImage: '/images/designers/hwangjinsu/profile.jpg',
      instagram: '@hwangjinsu_visual'
    },
    {
      id: 'kimbomin',
      number: '04',
      name: '김보민',
      englishName: 'KIM BOMIN',
      role: 'Film Director',
      description: '패션 필름을 통해 움직이는 이야기를 전달합니다.',
      profileImage: '/images/designers/kimbomin/profile.jpg',
      instagram: '@kimbomin_film'
    },
    {
      id: 'kimgyeongsu',
      number: '05',
      name: '김경수',
      englishName: 'KIM GYEONGSU',
      role: 'Brand Manager',
      description: '브랜드의 아이덴티티를 구축하고 전략을 수립합니다.',
      profileImage: '/images/designers/kimgyeongsu/profile.jpg',
      instagram: '@kimgyeongsu_brand'
    },
    {
      id: 'parkparang',
      number: '06',
      name: '박파랑',
      englishName: 'PARK PARANG',
      role: 'Digital Designer',
      description: '디지털 매체를 통해 패션의 경계를 확장합니다.',
      profileImage: '/images/designers/parkparang/profile.jpg',
      instagram: '@parkparang_digital'
    }
  ];

  const handleDesignerClick = (designerId: string) => {
    router.push(`/designers/${designerId}`);
  };

  return (
    <>
      {/* Navigation - HTML 버전과 완전 동일한 다크 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[20px] z-[1000] transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] border-b border-white/10"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button font-['Inter'] text-xl cursor-pointer transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] text-white no-underline hover:transform hover:-translate-x-[5px] hover:text-[--accent-mocha]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title font-['Inter'] text-lg font-light tracking-[0.2em] text-[--accent-mocha] uppercase max-[768px]:hidden">
              Designers
            </span>
          </div>
          <div 
            className="logo font-['Playfair_Display'] text-2xl font-extrabold tracking-[0.05em] cursor-pointer transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] text-white no-underline hover:opacity-70 hover:transform hover:scale-[1.02]"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section h-screen relative overflow-hidden bg-black">
        <div className="hero-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[1]">
          <h1 
            className="hero-title font-['Playfair_Display'] font-thin uppercase text-white opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.3em]"
            style={{ fontSize: 'clamp(60px, 10vw, 180px)' }}
          >
            Designers
          </h1>
          <p className="hero-subtitle font-['Inter'] text-base tracking-[3px] text-[--gray-medium] mt-5 opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.3s]">
            Six Creative Minds
          </p>
        </div>
      </section>

      {/* Designers Grid - HTML 버전과 완전 동일 */}
      <section className="designers-section py-[120px] bg-black">
        <div className="designers-intro max-w-[800px] mx-auto mb-[120px] text-center px-10">
          <h2 className="font-['Playfair_Display'] text-4xl font-light tracking-[3px] text-white mb-[30px]">
            Meet Our Team
          </h2>
          <p className="font-['Inter'] text-base leading-[2] text-[--gray-medium]">
            REDUX를 이끄는 6인의 크리에이티브 디렉터들을 소개합니다.
            각자의 전문 분야에서 독창적인 시각을 제시하며, 함께 새로운 패션 경험을 만들어갑니다.
          </p>
        </div>
        
        <div className="designers-grid grid grid-cols-3 gap-0 max-w-[1800px] mx-auto max-[1400px]:grid-cols-2 max-[768px]:grid-cols-1">
          {designers.map((designer, index) => (
            <div 
              key={designer.id}
              className="designer-card relative h-[600px] overflow-hidden cursor-pointer opacity-0 transform translate-y-[100px] revealed:animate-[revealDesigner_1.2s_ease_forwards] border border-white/5 transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:z-10 hover:transform hover:scale-[1.02] hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)] max-[768px]:h-[500px]"
              style={{ 
                '--index': index,
                animationDelay: `${index * 0.15}s`
              }}
              onClick={() => handleDesignerClick(designer.id)}
            >
              <div className="designer-image absolute top-0 left-0 w-full h-full">
                <img 
                  src={designer.profileImage}
                  alt={designer.name}
                  className="w-full h-full object-cover [filter:grayscale(100%)_brightness(0.7)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:[filter:grayscale(0%)_brightness(1)_contrast(1.1)] hover:transform hover:scale-110"
                />
              </div>
              
              <div className="designer-overlay absolute top-0 left-0 w-full h-full bg-[linear-gradient(180deg,transparent_0%,transparent_40%,rgba(0,0,0,0.7)_80%,rgba(0,0,0,0.9)_100%)] opacity-100 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)]">
              </div>
              
              <div className="designer-number absolute top-8 left-8 font-['Playfair_Display'] text-[120px] font-thin text-white/10 leading-[1] [text-shadow:0_0_20px_rgba(255,255,255,0.1)] max-[768px]:text-[80px] max-[768px]:top-5 max-[768px]:left-5">
                {designer.number}
              </div>
              
              <div className="designer-info absolute bottom-8 left-8 right-8 text-white max-[768px]:bottom-5 max-[768px]:left-5 max-[768px]:right-5">
                <h3 className="designer-name font-['Playfair_Display'] text-3xl font-medium tracking-[2px] mb-2 max-[768px]:text-2xl">
                  {designer.name}
                </h3>
                <p className="designer-english font-['Inter'] text-sm font-light tracking-[0.2em] text-[--accent-mocha] uppercase mb-3">
                  {designer.englishName}
                </p>
                <p className="designer-role font-['Inter'] text-base font-medium text-white/90 mb-3">
                  {designer.role}
                </p>
                <p className="designer-description font-['Inter'] text-sm leading-[1.6] text-white/70 mb-4">
                  {designer.description}
                </p>
                <p className="designer-instagram font-['Inter'] text-xs tracking-[0.1em] text-[--accent-mocha]">
                  {designer.instagram}
                </p>
              </div>
              
              <div className="designer-hover-effect absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-100">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-[80px] h-[80px] bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 ease-in-out hover:bg-[--accent-mocha]/30 hover:transform hover:scale-110">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10">
        <p className="font-['Inter'] text-sm">&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes heroFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes revealDesigner {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        .designer-card.revealed {
          animation: revealDesigner 1.2s ease forwards;
        }
        
        /* CSS 변수 정의 - HTML 버전과 완전 동일 */
        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --accent-deep: #9A9086;
          --accent-neutral: #F8F6F4;
          --gray-medium: #A0A0A0;
          --gray-dark: #303030;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .designers-section {
            padding: 80px 0;
          }
          
          .designers-intro {
            margin-bottom: 80px;
            padding: 0 20px;
          }
          
          .designers-intro h2 {
            font-size: 28px;
          }
          
          .hero-title {
            font-size: clamp(40px, 8vw, 100px) !important;
            letter-spacing: 0.1em !important;
          }
        }
        
        /* Motion Reduction */
        @media (prefers-reduced-motion: reduce) {
          .designer-card,
          .hero-title,
          .hero-subtitle {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}