'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

// 디자이너 데이터 - designers.html과 일관된 구조
const designersData = {
  'lee-taehyeon': {
    id: 'lee-taehyeon',
    number: '01',
    name: '이태현',
    englishName: 'LEE TAEHYEON',
    role: 'Creative Director',
    description: '패션을 통해 이야기를 만들어가는 크리에이티브 디렉터입니다.',
    bio: 'REDUX의 창립자이자 크리에이티브 디렉터로, 실험적인 패션과 예술의 경계를 탐구합니다. 미니멀리즘과 구조적 실루엣을 바탕으로 독창적인 작품 세계를 구축해나갑니다.',
    profileImage: '/images/designers/leetaehyeon/profile.jpg',
    instagram: '@tododope',
    portfolioImages: [
      '/images/designers/leetaehyeon/work1.jpg',
      '/images/designers/leetaehyeon/work2.jpg',
      '/images/designers/leetaehyeon/work3.jpg',
      '/images/designers/leetaehyeon/work4.jpg',
      '/images/designers/leetaehyeon/work5.jpg',
      '/images/designers/leetaehyeon/work6.jpg'
    ]
  },
  'choi-eunsol': {
    id: 'choi-eunsol',
    number: '02',
    name: '최은솔',
    englishName: 'CHOI EUNSOL',
    role: 'Fashion Designer',
    description: '지속가능한 패션을 추구하는 디자이너입니다.',
    bio: '전통과 현대를 융합한 독특한 미학을 추구하는 패션 디자이너입니다. 지속가능한 패션에 대한 깊은 관심을 바탕으로 환경을 생각하는 창작 활동을 이어가고 있습니다.',
    profileImage: '/images/designers/choieunsol/profile.jpg',
    instagram: '@choieunsol.of',
    portfolioImages: [
      '/images/designers/choieunsol/work1.jpg',
      '/images/designers/choieunsol/work2.jpg',
      '/images/designers/choieunsol/work3.jpg',
      '/images/designers/choieunsol/work4.jpg',
      '/images/designers/choieunsol/work5.jpg',
      '/images/designers/choieunsol/work6.jpg'
    ]
  },
  'hwang-jinsu': {
    id: 'hwang-jinsu',
    number: '03',
    name: '황진수',
    englishName: 'HWANG JINSU',
    role: 'Visual Director',
    description: '시각적 언어로 패션의 새로운 가능성을 탐구합니다.',
    bio: 'REDUX의 비주얼 디렉터로서 실험적인 패션과 예술의 경계를 탐구합니다. 독창적인 시각적 언어를 통해 패션의 새로운 가능성을 제시하며, 혁신적인 크리에이티브 작업을 선도합니다.',
    profileImage: '/images/designers/hwangjinsu/profile.jpg',
    instagram: '@j_j_j_j_j_h',
    portfolioImages: [
      '/images/designers/hwangjinsu/work1.jpg',
      '/images/designers/hwangjinsu/work2.jpg',
      '/images/designers/hwangjinsu/work3.jpg',
      '/images/designers/hwangjinsu/work4.jpg',
      '/images/designers/hwangjinsu/work5.jpg',
      '/images/designers/hwangjinsu/work6.jpg'
    ]
  },
  'kim-bomin': {
    id: 'kim-bomin',
    number: '04',
    name: '김보민',
    englishName: 'KIM BOMIN',
    role: 'Film Director',
    description: '패션 필름을 통해 움직이는 이야기를 전달합니다.',
    bio: '색채와 텍스처를 통해 감정을 표현하는 크리에이티브 디자이너입니다. 패션 필름이라는 매체를 통해 의상의 움직임과 감정을 영상 언어로 번역하여 관객에게 전달합니다.',
    profileImage: '/images/designers/kimbomin/profile.jpg',
    instagram: '@minectivbe',
    portfolioImages: [
      '/images/designers/kimbomin/work1.jpg',
      '/images/designers/kimbomin/work2.jpg',
      '/images/designers/kimbomin/work3.jpg',
      '/images/designers/kimbomin/work4.jpg',
      '/images/designers/kimbomin/work5.jpg',
      '/images/designers/kimbomin/work6.jpg'
    ]
  },
  'kim-gyeongsu': {
    id: 'kim-gyeongsu',
    number: '05',
    name: '김경수',
    englishName: 'KIM GYEONGSU',
    role: 'Brand Manager',
    description: '브랜드의 아이덴티티를 구축하고 전략을 수립합니다.',
    bio: '기능성과 예술성을 결합한 혁신적인 패션을 선보이는 디자이너입니다. 브랜드 매니저로서 REDUX의 아이덴티티를 구축하고 체계적인 브랜드 전략을 수립하는 역할을 담당합니다.',
    profileImage: '/images/designers/kimgyeongsu/profile.jpg',
    instagram: '@gang._.soo__',
    portfolioImages: [
      '/images/designers/kimgyeongsu/work1.jpg',
      '/images/designers/kimgyeongsu/work2.jpg',
      '/images/designers/kimgyeongsu/work3.jpg',
      '/images/designers/kimgyeongsu/work4.jpg',
      '/images/designers/kimgyeongsu/work5.jpg',
      '/images/designers/kimgyeongsu/work6.jpg'
    ]
  },
  'park-parang': {
    id: 'park-parang',
    number: '06',
    name: '박파랑',
    englishName: 'PARK PARANG',
    role: 'Digital Designer',
    description: '디지털 매체를 통해 패션의 경계를 확장합니다.',
    bio: '시각 예술과 패션의 경계를 넘나드는 멀티미디어 아티스트입니다. 디지털 매체를 통해 패션의 경계를 확장하고, 온라인 공간에서의 새로운 패션 경험을 디자인합니다.',
    profileImage: '/images/designers/parkparang/profile.jpg',
    instagram: '@rannx8m',
    portfolioImages: [
      '/images/designers/parkparang/work1.jpg',
      '/images/designers/parkparang/work2.jpg',
      '/images/designers/parkparang/work3.jpg',
      '/images/designers/parkparang/work4.jpg',
      '/images/designers/parkparang/work5.jpg',
      '/images/designers/parkparang/work6.jpg'
    ]
  }
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(designersData).map((id) => ({
    id,
  }));
}

export default function DesignerPage({ params }: Props) {
  const router = useRouter();
  const [designerId, setDesignerId] = useState<string>('');
  const [designer, setDesigner] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setDesignerId(id);
      
      const designerData = designersData[id as keyof typeof designersData];
      if (!designerData) {
        notFound();
      }
      setDesigner(designerData);
    };
    
    getParams();
  }, [params]);

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

    // 키보드 네비게이션
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // 내비게이션 함수들
  const goBack = () => {
    router.push('/designers');
  };

  const goHome = () => {
    router.push('/');
  };

  // 라이트박스 함수들
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

  if (!designer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation - designers.html과 일관된 다크 테마 */}
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
              {designer.englishName}
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

      {/* Hero Section */}
      <section className="hero-section h-screen relative overflow-hidden bg-black">
        <div className="hero-background absolute inset-0">
          <img 
            src={designer.profileImage}
            alt={designer.name}
            className="w-full h-full object-cover [filter:grayscale(100%)_brightness(0.3)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>
        
        <div className="hero-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[1] max-w-4xl mx-auto px-10">
          <div className="designer-number font-['Playfair_Display'] text-[200px] font-thin text-white/10 leading-[1] mb-[-50px] max-[768px]:text-[120px] max-[768px]:mb-[-30px]">
            {designer.number}
          </div>
          <h1 
            className="hero-title font-['Playfair_Display'] font-thin uppercase text-white opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.3em] mb-5"
            style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}
          >
            {designer.name}
          </h1>
          <p className="hero-subtitle font-['Inter'] text-xl tracking-[3px] text-[--accent-mocha] opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.3s] mb-3">
            {designer.englishName}
          </p>
          <p className="hero-role font-['Inter'] text-base font-medium text-white/90 opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.5s] mb-5">
            {designer.role}
          </p>
          <p className="hero-description font-['Inter'] text-sm leading-[1.6] text-white/70 opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.7s] max-w-2xl mx-auto">
            {designer.description}
          </p>
          {designer.instagram && (
            <p className="hero-instagram font-['Inter'] text-xs tracking-[0.1em] text-[--accent-mocha] opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.9s] mt-8">
              <a 
                href={`https://instagram.com/${designer.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                {designer.instagram}
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Bio Section */}
      <section className="bio-section py-[120px] px-10 bg-black max-[768px]:py-20 max-[768px]:px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-4xl font-light tracking-[3px] text-white mb-10 max-[768px]:text-3xl">
            About {designer.englishName}
          </h2>
          <p className="font-['Inter'] text-lg leading-[2] text-white/80 max-w-3xl mx-auto">
            {designer.bio}
          </p>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="portfolio-section py-[120px] px-10 bg-black max-[768px]:py-20 max-[768px]:px-5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-4xl font-light tracking-[3px] text-white mb-20 text-center max-[768px]:text-3xl max-[768px]:mb-10">
            Portfolio
          </h2>
          
          <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designer.portfolioImages.map((image: string, index: number) => (
              <div 
                key={index}
                className="portfolio-item relative overflow-hidden cursor-pointer transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:scale-[1.02] hover:z-10 hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] bg-gray-800 overflow-hidden">
                  <img 
                    src={image}
                    alt={`${designer.name} Portfolio ${index + 1}`}
                    className="w-full h-full object-cover [filter:grayscale(70%)_brightness(0.8)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] hover:[filter:grayscale(0%)_brightness(1)_contrast(1.1)] hover:transform hover:scale-110"
                  />
                </div>
                
                <div className="portfolio-overlay absolute top-0 left-0 w-full h-full bg-[linear-gradient(180deg,transparent_0%,transparent_40%,rgba(0,0,0,0.7)_80%,rgba(0,0,0,0.9)_100%)] opacity-0 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)] flex items-end p-5 hover:opacity-100">
                  <p className="font-['Inter'] text-xs font-light tracking-[0.1em] text-white uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                    Work {String(index + 1).padStart(2, '0')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-[120px] px-10 bg-black border-t border-white/10 max-[768px]:py-20 max-[768px]:px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl font-light tracking-[3px] text-white mb-8 max-[768px]:text-2xl">
            Work with {designer.name}
          </h2>
          <p className="font-['Inter'] text-base text-white/70 mb-12 max-w-2xl mx-auto">
            창의적인 프로젝트나 협업 기회가 있으시다면 언제든 연락해 주세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all duration-300 uppercase tracking-wider"
            >
              Contact
            </a>
            
            {designer.instagram && (
              <a
                href={`https://instagram.com/${designer.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
              >
                Follow Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Professional Lightbox */}
      {isLightboxOpen && (
        <div 
          className="lightbox fixed top-0 left-0 w-full h-full bg-black/95 backdrop-blur-[20px] z-[10000] flex items-center justify-center opacity-100 transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.8,0.25,1)]"
          onClick={handleLightboxClick}
        >
          <div className="lightbox-content max-w-[90vw] max-h-[90vh] relative">
            <button 
              className="lightbox-close absolute -top-[50px] right-0 bg-transparent border-none text-white text-[30px] cursor-pointer transition-all duration-300 ease-in-out w-10 h-10 flex items-center justify-center hover:text-[--accent-mocha] hover:transform hover:scale-120"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            <button 
              className="lightbox-nav lightbox-prev absolute top-1/2 left-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[--accent-mocha]/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            
            <img 
              className="lightbox-image max-w-full max-h-[90vh] object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              src={designer.portfolioImages[currentImageIndex]}
              alt={`${designer.name} Portfolio ${currentImageIndex + 1}`}
            />
            
            <button 
              className="lightbox-nav lightbox-next absolute top-1/2 right-[-80px] transform -translate-y-1/2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-full w-[60px] h-[60px] flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[--accent-mocha]/30 hover:transform hover:-translate-y-1/2 hover:scale-110 max-[1024px]:hidden"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes heroFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* CSS 변수 정의 */
        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --accent-deep: #9A9086;
          --accent-neutral: #F8F6F4;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
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