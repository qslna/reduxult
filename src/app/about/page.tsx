'use client';

import { useEffect } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import CategoryPreview from '@/components/about/CategoryPreview';
import { aboutGalleries } from '@/data/aboutGallery';
import { useTextContent } from '@/hooks/usePageContent';

// HTML redux6 about.html과 완전 동일한 About 페이지 구현
export default function AboutPage() {
  // Dynamic content loading
  const { text: heroTitle } = useTextContent('about', 'about-title', 'WHO REDUX?');
  const { text: heroSubtitle } = useTextContent('about', 'about-subtitle', 'Fashion Designer Collective');
  const { text: introTitle } = useTextContent('about', 'intro-title', '우리는\nREDUX\n입니다');
  const { text: introDescription1 } = useTextContent('about', 'intro-description-1', 'REDUX는 6인의 패션 디자이너가 모여 만든 크리에이티브 콜렉티브입니다. 우리는 패션을 넘어 다양한 예술적 매체를 통해 새로운 경험을 창조합니다.');
  const { text: introDescription2 } = useTextContent('about', 'intro-description-2', '패션 필름, 설치 미술, 비주얼 아트, 공간 디자인 등 다양한 형태로 관객들에게 \'기억에 남을 순간\'을 선사하고자 합니다.');
  const { text: philosophyTitle } = useTextContent('about', 'philosophy-title', 'OUR PHILOSOPHY');
  const { text: philosophyText1 } = useTextContent('about', 'philosophy-text-1', '우리는 경계를 넘어 새로운 가능성을 탐구합니다.');
  const { text: philosophyText2 } = useTextContent('about', 'philosophy-text-2', '각자의 개성이 하나로 모여 더 큰 시너지를 만들어냅니다.');
  const { text: philosophyText3 } = useTextContent('about', 'philosophy-text-3', '순간을 넘어 영원히 기억될 경험을 디자인합니다.');
  const { text: valuesTitle } = useTextContent('about', 'values-title', 'OUR VALUES');
  useEffect(() => {
    // CSS-based animations without GSAP dependency
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('grid-revealed');
          }, index * 100);
        }
      });
    }, observerOptions);
    
    // Observe grid items for animations
    document.querySelectorAll('.grid-item').forEach(item => {
      observer.observe(item);
    });
    
    // Value items reveal animation
    const valueObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.value-item').forEach(item => {
      valueObserver.observe(item);
    });
    
    // Touch feedback for mobile
    if ('ontouchstart' in window) {
      document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('touchstart', function(this: Element) {
          this.classList.add('touch-active');
        });
        
        item.addEventListener('touchend', function(this: Element) {
          setTimeout(() => {
            this.classList.remove('touch-active');
          }, 300);
        });
      });
    }
    
    return () => {
      observer.disconnect();
      valueObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Hero Section - 비대칭 왜곡 디자이너 스타일 */}
      <section 
        className="hero-section"
        style={{
          marginTop: '80px',
          padding: '120px 40px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 배경 노이즈 텍스처 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.03"/%3E%3C/svg%3E")',
            zIndex: 1
          }}
        />
        
        {/* 비대칭 기하학적 요소들 */}
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '150px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #333, transparent)',
            transform: 'rotate(-15deg)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '100px',
            height: '100px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'rotate(45deg)',
            zIndex: 2
          }}
        />
        
        <h1 
          className="hero-title glitch-text"
          style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: '20px',
            opacity: 0,
            transform: 'translateY(30px) skew(-2deg)',
            animation: 'fadeInUp 1s ease forwards, glitchText 3s ease-in-out infinite',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.1)',
            fontFamily: "'Inter', 'Helvetica', sans-serif",
            position: 'relative',
            zIndex: 3
          }}
        >
{heroTitle}
        </h1>
        <p 
          className="hero-subtitle"
          style={{
            fontSize: '18px',
            color: '#999',
            letterSpacing: '4px',
            opacity: 0,
            animation: 'fadeInUp 1s ease forwards',
            animationDelay: '0.2s',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 3,
            transform: 'translateX(10px)'
          }}
        >
{heroSubtitle}
        </p>
      </section>

      {/* About Intro - 비대칭 레이아웃과 타이포그래피 강화 */}
      <section 
        className="about-intro"
        style={{
          padding: '120px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'left',
          position: 'relative'
        }}
      >
        {/* 비대칭 배경 요소 */}
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            right: '0',
            width: '200px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #ddd, transparent)',
            transform: 'rotate(-5deg)'
          }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <h2 
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '40px',
                color: '#000',
                transform: 'rotate(-1deg)',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 0.9
              }}
            >
{introTitle.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line === 'REDUX' ? (
                    <span style={{ color: '#666', fontWeight: 300, fontSize: '0.7em', letterSpacing: '0.1em' }}>
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                  {index < introTitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
          
          <div style={{ transform: 'translateY(20px)' }}>
            <p 
              style={{
                fontSize: '18px',
                lineHeight: 1.8,
                color: '#333',
                marginBottom: '30px',
                fontWeight: 300,
                borderLeft: '2px solid #000',
                paddingLeft: '25px'
              }}
            >
{introDescription1}
            </p>
            <p 
              style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#666',
                marginBottom: '20px',
                fontStyle: 'italic',
                transform: 'translateX(20px)'
              }}
            >
{introDescription2}
            </p>
          </div>
        </div>
      </section>

      {/* Asymmetric Grid - HTML 버전과 완전 동일한 3D 스택 효과 */}
      <div 
        className="asymmetric-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: '200px',
          gap: '20px',
          padding: '0 40px',
          maxWidth: '1600px',
          margin: '0 auto 120px'
        }}
      >
        
        {/* Fashion Film */}
        <CategoryPreview 
          category={aboutGalleries.find(g => g.id === 'fashion-film')!}
          gridStyle={{
            gridColumn: 'span 7',
            gridRow: 'span 2'
          }}
          className="grid-item"
        />

        {/* Memory */}
        <CategoryPreview 
          category={aboutGalleries.find(g => g.id === 'memory')!}
          gridStyle={{
            gridColumn: 'span 5',
            gridRow: 'span 3'
          }}
          className="grid-item"
        />

        {/* Visual Art */}
        <CategoryPreview 
          category={aboutGalleries.find(g => g.id === 'visual-art')!}
          gridStyle={{
            gridColumn: 'span 4',
            gridRow: 'span 2'
          }}
          className="grid-item"
        />

        {/* Installation */}
        <CategoryPreview 
          category={aboutGalleries.find(g => g.id === 'installation')!}
          gridStyle={{
            gridColumn: 'span 4',
            gridRow: 'span 2'
          }}
          className="grid-item"
        />

        {/* Collective */}
        <CategoryPreview 
          category={aboutGalleries.find(g => g.id === 'collective')!}
          gridStyle={{
            gridColumn: 'span 4',
            gridRow: 'span 2'
          }}
          className="grid-item"
        />
      </div>

      {/* Philosophy Section - HTML 버전과 완전 동일한 다크 섹션 */}
      <section 
        className="philosophy-section"
        style={{
          padding: '120px 40px',
          background: '#000',
          color: '#fff'
        }}
      >
        <div 
          className="philosophy-container"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <h2 
            className="philosophy-title"
            style={{
              fontSize: '48px',
              fontWeight: 300,
              letterSpacing: '4px',
              marginBottom: '60px'
            }}
          >
{philosophyTitle}
          </h2>
          <p 
            className="philosophy-text"
            style={{
              fontSize: '24px',
              fontWeight: 300,
              lineHeight: 2,
              marginBottom: '40px'
            }}
          >
{philosophyText1.split('경계를 넘어').map((part: string, index: number) => (
              <span key={index}>
                {part}
                {index === 0 && <span style={{ color: '#999', fontStyle: 'italic' }}>경계를 넘어</span>}
              </span>
            ))}
          </p>
          <p 
            className="philosophy-text"
            style={{
              fontSize: '24px',
              fontWeight: 300,
              lineHeight: 2,
              marginBottom: '40px'
            }}
          >
{philosophyText2.split('더 큰 시너지').map((part: string, index: number) => (
              <span key={index}>
                {part}
                {index === 0 && <span style={{ color: '#999', fontStyle: 'italic' }}>더 큰 시너지</span>}
              </span>
            ))}
          </p>
          <p 
            className="philosophy-text"
            style={{
              fontSize: '24px',
              fontWeight: 300,
              lineHeight: 2,
              marginBottom: '40px'
            }}
          >
{philosophyText3.split('영원히 기억될').map((part: string, index: number) => (
              <span key={index}>
                {part}
                {index === 0 && <span style={{ color: '#999', fontStyle: 'italic' }}>영원히 기억될</span>}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Values Section - HTML 버전과 완전 동일한 3개 가치 */}
      <section 
        className="values-section"
        style={{
          padding: '120px 40px',
          background: '#fff'
        }}
      >
        <h2 
          className="values-title"
          style={{
            fontSize: '48px',
            fontWeight: 300,
            letterSpacing: '4px',
            textAlign: 'center',
            marginBottom: '80px'
          }}
        >
{valuesTitle}
        </h2>
        <div 
          className="values-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '60px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <div 
            className="value-item"
            style={{
              textAlign: 'center',
              opacity: 0,
              transform: 'translateY(30px)'
            }}
          >
            <div 
              className="value-icon"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#000',
                opacity: 0.2
              }}
            >
              ◈
            </div>
            <h3 
              className="value-name"
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '2px',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}
            >
              Collective
            </h3>
            <p 
              className="value-description"
              style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: '#333'
              }}
            >
              개인의 창의성이 모여 더 큰 시너지를 만듭니다.
              서로 다른 관점과 재능이 하나의 비전을 향해 나아갑니다.
            </p>
          </div>
          <div 
            className="value-item"
            style={{
              textAlign: 'center',
              opacity: 0,
              transform: 'translateY(30px)'
            }}
          >
            <div 
              className="value-icon"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#000',
                opacity: 0.2
              }}
            >
              ◐
            </div>
            <h3 
              className="value-name"
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '2px',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}
            >
              Memory
            </h3>
            <p 
              className="value-description"
              style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: '#333'
              }}
            >
              순간을 넘어 기억에 남는 경험을 창조합니다.
              우리의 작품이 관객의 마음속에 오래도록 머물기를 바랍니다.
            </p>
          </div>
          <div 
            className="value-item"
            style={{
              textAlign: 'center',
              opacity: 0,
              transform: 'translateY(30px)'
            }}
          >
            <div 
              className="value-icon"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#000',
                opacity: 0.2
              }}
            >
              ∞
            </div>
            <h3 
              className="value-name"
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '2px',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}
            >
              Evolution
            </h3>
            <p 
              className="value-description"
              style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: '#333'
              }}
            >
              끊임없이 변화하고 진화합니다.
              새로운 도전과 실험을 통해 창의적 한계를 넓혀갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* CSS for HTML 버전과 동일한 호버 효과 */}
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 글리치 애니메이션 */
        @keyframes glitchText {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255,255,255,0.1);
            transform: translateY(0) skew(-2deg);
          }
          20% {
            text-shadow: 2px 0 0 rgba(255, 0, 0, 0.1), -2px 0 0 rgba(0, 255, 255, 0.1);
            transform: translateY(-1px) skew(-2deg);
          }
          40% {
            text-shadow: -1px 0 0 rgba(255, 0, 0, 0.1), 1px 0 0 rgba(0, 255, 255, 0.1);
            transform: translateY(1px) skew(-2deg);
          }
          60% {
            text-shadow: 0 0 20px rgba(255,255,255,0.1);
            transform: translateY(0) skew(-2deg);
          }
        }
        
        /* Grid animations */
        .grid-item {
          opacity: 0;
          transform: translateY(100px);
          transition: all 0.8s ease;
        }
        
        .grid-item.grid-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Grid hover effects - 디자이너 스타일 강화 */
        .grid-item:hover .grid-stack {
          transform: rotateY(12deg) rotateX(3deg) scale(1.02);
        }
        
        .grid-item:hover .stack-layer:nth-child(1) {
          transform: translateZ(25px) translateX(-20px) rotate(-5deg);
        }
        
        .grid-item:hover .stack-layer:nth-child(2) {
          transform: translateZ(12px) translateX(0px) rotate(3deg);
          opacity: 1;
        }
        
        .grid-item:hover .stack-layer:nth-child(3) {
          transform: translateZ(0px) translateX(20px) rotate(2deg);
          opacity: 1;
        }
        
        .grid-item:hover .stack-layer img {
          filter: grayscale(0%) brightness(1.1) contrast(1.2) saturate(1.1);
          transform: scale(1.05);
        }
        
        /* 비대칭 글리치 효과 */
        .grid-item:nth-child(odd):hover .stack-layer:nth-child(1) {
          filter: hue-rotate(5deg);
        }
        
        .grid-item:nth-child(even):hover .stack-layer:nth-child(1) {
          filter: hue-rotate(-5deg);
        }
        
        .grid-item:hover .grid-item-overlay {
          bottom: 0;
        }
        
        /* Touch feedback for mobile */
        @media (hover: none) {
          .grid-item:active .grid-stack {
            transform: rotateY(8deg) rotateX(2deg);
          }
          
          .grid-item:active .grid-item-overlay {
            bottom: 0;
          }
          
          .grid-item:active .stack-layer:nth-child(1) {
            transform: translateZ(15px) translateX(-12px) rotate(-3deg);
          }
          
          .grid-item:active .stack-layer:nth-child(2) {
            transform: translateZ(8px) translateX(0px) rotate(2deg);
            opacity: 1;
          }
          
          .grid-item:active .stack-layer:nth-child(3) {
            transform: translateZ(0px) translateX(12px) rotate(1deg);
            opacity: 1;
          }
          
          .grid-item:active .stack-layer img {
            filter: grayscale(0%) brightness(1);
          }
        }
        
        /* Mobile grid simplification */
        @media (max-width: 1024px) {
          .asymmetric-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            grid-auto-rows: 200px !important;
            gap: 15px !important;
            margin-bottom: 100px !important;
          }
          
          .grid-item {
            grid-column: span 2 !important;
            grid-row: span 2 !important;
          }
          
          /* Fashion Film takes more space on tablet */
          .grid-item:nth-child(1) {
            grid-column: span 4 !important;
            grid-row: span 2 !important;
          }
          
          /* Memory takes full width on tablet */
          .grid-item:nth-child(2) {
            grid-column: span 4 !important;
            grid-row: span 3 !important;
          }
          
          .values-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .philosophy-text {
            font-size: 20px !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            margin-top: 60px !important;
            padding: 80px 20px !important;
          }
          
          .hero-title {
            font-size: clamp(36px, 10vw, 56px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .hero-subtitle {
            font-size: 16px !important;
          }
          
          .about-intro {
            padding: 60px 20px !important;
          }
          
          .about-intro > div {
            display: block !important;
            gap: 40px !important;
          }
          
          .about-intro h2 {
            font-size: 28px !important;
            margin-bottom: 30px !important;
          }
          
          .about-intro p {
            font-size: 16px !important;
            line-height: 1.8 !important;
            transform: none !important;
            padding-left: 15px !important;
          }
          
          .asymmetric-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 280px !important;
            padding: 0 20px !important;
            gap: 20px !important;
            margin-bottom: 80px !important;
          }
          
          .grid-item {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            min-height: 280px !important;
          }
          
          /* Maintain some visual hierarchy on mobile */
          .grid-item:nth-child(1),
          .grid-item:nth-child(2) {
            grid-row: span 1 !important;
            min-height: 320px !important;
          }
          
          .grid-stack {
            border-radius: 12px !important;
            overflow: hidden !important;
          }
          
          .stack-layer {
            border-radius: 12px !important;
            position: absolute !important;
            transform: translateZ(0) !important;
            opacity: 1 !important;
            border: 2px solid #fff !important;
          }
          
          /* Keep first two layers visible on mobile for depth */
          .stack-layer:nth-child(2) {
            display: block !important;
            transform: translateZ(-8px) rotate(1deg) !important;
            opacity: 0.7 !important;
            z-index: 2 !important;
          }
          
          .stack-layer:nth-child(3) {
            display: none !important;
          }
          
          .grid-item-overlay {
            padding: 20px !important;
            bottom: 0 !important;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6)) !important;
            border-radius: 0 0 12px 12px !important;
          }
          
          .grid-item-overlay h3 {
            font-size: 18px !important;
          }
          
          .grid-item-overlay p {
            font-size: 14px !important;
          }
          
          .philosophy-section {
            padding: 60px 20px !important;
          }
          
          .philosophy-title {
            font-size: 32px !important;
            margin-bottom: 40px !important;
          }
          
          .philosophy-text {
            font-size: 18px !important;
            line-height: 1.8 !important;
            margin-bottom: 30px !important;
          }
          
          .values-section {
            padding: 60px 20px !important;
          }
          
          .values-title {
            font-size: 32px !important;
            margin-bottom: 50px !important;
          }
          
          .value-item {
            margin-bottom: 20px !important;
          }
          
          .value-icon {
            width: 60px !important;
            height: 60px !important;
            font-size: 36px !important;
            margin-bottom: 20px !important;
          }
          
          .value-name {
            font-size: 18px !important;
            margin-bottom: 15px !important;
          }
          
          .value-description {
            font-size: 14px !important;
            line-height: 1.6 !important;
            padding: 0 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px !important;
          }
          
          .hero-subtitle {
            font-size: 14px !important;
            letter-spacing: 1px !important;
          }
          
          .about-intro h2 {
            font-size: 24px !important;
          }
          
          .philosophy-title {
            font-size: 28px !important;
          }
          
          .philosophy-text {
            font-size: 16px !important;
          }
          
          .values-title {
            font-size: 28px !important;
          }
        }
        
        .value-item.revealed {
          animation: fadeInUp 0.8s ease forwards;
        }
      `}</style>
    </>
  );
}