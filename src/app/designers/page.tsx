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
      id: 'kimbomin',
      number: '01',
      name: 'KIM BOMIN',
      role: 'Creative Director',
      brand: 'CHASING VOWS',
      profileImage: '/images/designers/kimbomin/cinemode/김보민 사진.jpg',
      hasImage: true
    },
    {
      id: 'parkparang',
      number: '02',
      name: 'PARK PARANG',
      role: 'Visual Artist',
      brand: 'THE TIME BETWEEN',
      profileImage: '',
      hasImage: false
    },
    {
      id: 'leetaehyeon',
      number: '03',
      name: 'LEE TAEHYEON',
      role: 'Fashion Designer',
      brand: 'POLYHEDRON',
      profileImage: '/images/designers/leetaehyeon/leetaehyeon-Profile.jpg',
      hasImage: true
    },
    {
      id: 'choieunsol',
      number: '04',
      name: 'CHOI EUNSOL',
      role: 'Art Director',
      brand: 'SOUL SUCKER',
      profileImage: '/images/designers/choieunsol/choieunsol-Profile.jpeg',
      hasImage: true
    },
    {
      id: 'hwangjinsu',
      number: '05',
      name: 'HWANG JINSU',
      role: 'Film Director',
      brand: 'WHO AM I ?!',
      profileImage: '',
      hasImage: false
    },
    {
      id: 'kimgyeongsu',
      number: '06',
      name: 'KIM GYEONGSU',
      role: 'Installation Artist',
      brand: 'SPATIAL NARRATIVES',
      profileImage: '',
      hasImage: false
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
      <section className="hero-section mt-20 h-[50vh] min-h-[400px] flex items-center justify-center relative overflow-hidden">
        <div className="hero-bg absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,#1a1a1a_0%,#2a2a2a_100%)] opacity-50"></div>
        <div className="hero-content text-center z-[1] text-white">
          <h1 
            className="hero-title font-light tracking-[0.2em] mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            SIX DESIGNERS
          </h1>
          <p className="hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s]">
            One Collective Vision
          </p>
        </div>
      </section>

      {/* Designer Grid - HTML 버전과 완전 동일 */}
      <section className="designers-container py-[120px] px-10 max-w-[1600px] mx-auto">
        <div className="designers-grid grid grid-cols-3 gap-0 relative max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:gap-[2px] max-[768px]:bg-white/5 max-[768px]:p-[2px]">
          {designers.map((designer, index) => (
            <div 
              key={designer.id}
              className={`designer-card relative h-[65vh] min-h-[450px] max-h-[600px] overflow-hidden cursor-pointer transition-all duration-[600ms] ease-in-out hover:z-10 border-r border-b border-white/5 last:border-r-0 max-[1024px]:h-[55vh] max-[1024px]:min-h-[400px] max-[1024px]:max-h-[500px] max-[768px]:h-[60vh] max-[768px]:min-h-[350px] max-[768px]:max-h-[450px] max-[768px]:border-r-0 max-[768px]:border-b-0 max-[768px]:bg-black ${
                index % 3 === 2 ? 'border-r-0' : ''
              } ${
                index % 2 === 1 ? 'max-[1024px]:border-r-0' : ''
              }`}
              onClick={() => handleDesignerClick(designer.id)}
            >
              <div 
                className={`designer-image absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-[800ms] ease-in-out opacity-70 hover:opacity-100 hover:scale-105 ${
                  designer.hasImage 
                    ? '[filter:grayscale(100%)_contrast(1.2)] hover:[filter:grayscale(0%)_contrast(1)]'
                    : 'no-image bg-[linear-gradient(135deg,#2a2a2a,#4a4a4a)] flex items-center justify-center text-white/30 text-5xl font-thin before:content-["📷"]'
                }`}
                style={designer.hasImage ? { backgroundImage: `url('${designer.profileImage}')` } : {}}
              >
              </div>
              
              <span className="designer-number absolute top-10 right-10 text-[120px] font-thin text-white/10 transition-all duration-[600ms] ease-in-out hover:text-white/20 hover:scale-120 max-[768px]:text-[80px] max-[768px]:top-5 max-[768px]:right-5 max-[480px]:text-[60px]">
                {designer.number}
              </span>
              
              <div className="designer-content absolute bottom-0 left-0 w-full py-[60px] px-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),transparent)] transform translate-y-[60%] transition-transform duration-[600ms] ease-in-out hover:transform hover:translate-y-0 max-[768px]:py-10 max-[768px]:px-5 max-[768px]:transform max-[768px]:translate-y-0 max-[768px]:bg-[linear-gradient(to_top,rgba(0,0,0,0.95),rgba(0,0,0,0.7),transparent)]">
                <h3 className="designer-name text-[32px] font-light tracking-[3px] text-white mb-[10px] max-[768px]:text-2xl max-[480px]:text-xl">
                  {designer.name}
                </h3>
                <p className="designer-role text-sm tracking-[2px] text-[--gray-medium] uppercase mb-5 max-[768px]:text-xs">
                  {designer.role}
                </p>
                <p className="designer-brand text-base text-white mb-[30px] opacity-80 max-[768px]:text-sm max-[480px]:mb-5">
                  {designer.brand}
                </p>
                <span className="designer-link inline-block py-3 px-[30px] border border-white text-white text-xs tracking-[2px] uppercase transition-all duration-300 ease-in-out opacity-0 hover:bg-white hover:text-black hover:opacity-100 max-[768px]:opacity-100 max-[768px]:py-[10px] max-[768px]:px-[25px] max-[768px]:text-[11px]">
                  View Profile
                </span>
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
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Touch feedback for mobile */
        @media (hover: none) {
          .designer-card:active .designer-image {
            filter: grayscale(0%) contrast(1);
            opacity: 1;
            transform: scale(1.05);
          }
          
          .designer-card:active .designer-content {
            transform: translateY(0);
          }
          
          .designer-card:active .designer-link {
            opacity: 1;
          }
          
          .designer-content {
            transform: translateY(30%);
          }
        }
        
        /* CSS 변수 정의 - HTML 버전과 완전 동일 */
        :root {
          --primary-black: #000;
          --primary-white: #fff;
          --gray-light: #f5f5f5;
          --gray-medium: #999;
          --gray-dark: #333;
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
            font-size: clamp(36px, 10vw, 56px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .designers-container {
            padding: 60px 20px 40px;
          }
        }
        
        /* Better mobile responsive behavior */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px !important;
          }
          
          .hero-subtitle {
            font-size: 14px;
            letter-spacing: 1px;
          }
          
          .designer-card {
            height: 50vh;
            min-height: 300px;
            max-height: 400px;
          }
          
          .designer-number {
            font-size: 60px;
          }
          
          .designer-name {
            font-size: 20px;
          }
          
          .designer-role {
            font-size: 11px;
          }
          
          .designer-brand {
            font-size: 13px;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
}