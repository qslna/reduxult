'use client';

import { useEffect } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

// HTML redux6 about.html과 완전 동일한 About 페이지 구현
export default function AboutPage() {
  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 초기화
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile && typeof window !== 'undefined') {
      // GSAP 애니메이션 실행
      const timer = setTimeout(() => {
        if (window.gsap) {
          // Grid items animation
          window.gsap.utils.toArray('.grid-item').forEach((item: any, index: number) => {
            window.gsap.from(item, {
              y: 100,
              opacity: 0,
              duration: 1,
              delay: index * 0.1,
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'bottom 20%'
              }
            });
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Value items reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.value-item').forEach(item => {
      observer.observe(item);
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
    };
  }, []);

  return (
    <>
      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section 
        className="hero-section"
        style={{
          marginTop: '80px',
          padding: '120px 40px',
          background: '#f5f5f5',
          textAlign: 'center'
        }}
      >
        <h1 
          className="hero-title"
          style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            marginBottom: '20px',
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'fadeInUp 1s ease forwards',
            color: '#000'
          }}
        >
          WHO REDUX?
        </h1>
        <p 
          className="hero-subtitle"
          style={{
            fontSize: '18px',
            color: '#999',
            letterSpacing: '2px',
            opacity: 0,
            animation: 'fadeInUp 1s ease forwards',
            animationDelay: '0.2s'
          }}
        >
          Fashion Designer Collective
        </p>
      </section>

      {/* About Intro - HTML 버전과 완전 동일한 한국어 텍스트 */}
      <section 
        className="about-intro"
        style={{
          padding: '120px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <h2 
          style={{
            fontSize: '36px',
            fontWeight: 300,
            letterSpacing: '3px',
            marginBottom: '40px',
            color: '#000'
          }}
        >
          우리는 REDUX입니다
        </h2>
        <p 
          style={{
            fontSize: '18px',
            lineHeight: 2,
            color: '#333',
            marginBottom: '20px'
          }}
        >
          REDUX는 6인의 패션 디자이너가 모여 만든 크리에이티브 콜렉티브입니다.
          우리는 패션을 넘어 다양한 예술적 매체를 통해 새로운 경험을 창조합니다.
        </p>
        <p 
          style={{
            fontSize: '18px',
            lineHeight: 2,
            color: '#333',
            marginBottom: '20px'
          }}
        >
          패션 필름, 설치 미술, 비주얼 아트, 공간 디자인 등 다양한 형태로
          관객들에게 '기억에 남을 순간'을 선사하고자 합니다.
        </p>
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
        <a 
          href="/about/fashion-film" 
          className="grid-item"
          style={{
            gridColumn: 'span 7',
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'visible',
            background: '#f5f5f5',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            perspective: '1000px'
          }}
        >
          <div 
            className="grid-stack"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(0px) rotate(-1deg)',
                zIndex: 3
              }}
            >
              <OptimizedImage 
                src="/images/designers/choieunsol/cinemode/IMG_8617.jpeg" 
                alt="Fashion Film - Choi Eunsol" 
                fill={true}
                priority={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-12px) rotate(2deg)',
                zIndex: 2,
                opacity: 0.85
              }}
            >
              <OptimizedImage 
                src="/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg" 
                alt="Fashion Film - Hwang Jinsu" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-24px) rotate(-0.5deg)',
                zIndex: 1,
                opacity: 0.7
              }}
            >
              <OptimizedImage 
                src="/images/designers/kimbomin/cinemode/NOR_7419-11.jpg" 
                alt="Fashion Film - Kim Bomin" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
          </div>
          <div 
            className="grid-item-overlay"
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: 0,
              right: 0,
              padding: '25px 30px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              color: '#fff',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 10,
              borderRadius: '0 0 12px 12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '1.5px',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Fashion Film
            </h3>
            <p 
              style={{
                fontSize: '13px',
                opacity: 0.9,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              패션필름을 통한 스토리텔링
            </p>
          </div>
        </a>

        {/* Memory */}
        <a 
          href="/about/memory" 
          className="grid-item"
          style={{
            gridColumn: 'span 5',
            gridRow: 'span 3',
            position: 'relative',
            overflow: 'visible',
            background: '#f5f5f5',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            perspective: '1000px'
          }}
        >
          <div 
            className="grid-stack"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(0px) rotate(-1deg)',
                zIndex: 3
              }}
            >
              <OptimizedImage 
                src="/images/about-memory.jpg" 
                alt="Memory" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-12px) rotate(2deg)',
                zIndex: 2,
                opacity: 0.85
              }}
            >
              <OptimizedImage 
                src="/images/about-memory.jpg" 
                alt="Memory" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-24px) rotate(-0.5deg)',
                zIndex: 1,
                opacity: 0.7
              }}
            >
              <OptimizedImage 
                src="/images/about-memory.jpg" 
                alt="Memory" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
          </div>
          <div 
            className="grid-item-overlay"
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: 0,
              right: 0,
              padding: '25px 30px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              color: '#fff',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 10,
              borderRadius: '0 0 12px 12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '1.5px',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Memory
            </h3>
            <p 
              style={{
                fontSize: '13px',
                opacity: 0.9,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              기억에 남을 순간
            </p>
          </div>
        </a>

        {/* Visual Art */}
        <a 
          href="/about/visual-art" 
          className="grid-item"
          style={{
            gridColumn: 'span 4',
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'visible',
            background: '#f5f5f5',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            perspective: '1000px'
          }}
        >
          <div 
            className="grid-stack"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(0px) rotate(-1deg)',
                zIndex: 3
              }}
            >
              <OptimizedImage 
                src="/images/visual-art/METAMORPHOSIS.jpg" 
                alt="Visual Art" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-12px) rotate(2deg)',
                zIndex: 2,
                opacity: 0.85
              }}
            >
              <OptimizedImage 
                src="/images/visual-art/SHADOW PLAY.jpg" 
                alt="Visual Art" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-24px) rotate(-0.5deg)',
                zIndex: 1,
                opacity: 0.7
              }}
            >
              <OptimizedImage 
                src="/images/visual-art/DIGITAL DREAMS.jpg" 
                alt="Visual Art" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
          </div>
          <div 
            className="grid-item-overlay"
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: 0,
              right: 0,
              padding: '25px 30px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              color: '#fff',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 10,
              borderRadius: '0 0 12px 12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '1.5px',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Visual Art
            </h3>
            <p 
              style={{
                fontSize: '13px',
                opacity: 0.9,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              시각적 경험의 확장
            </p>
          </div>
        </a>

        {/* Process (Installation) */}
        <a 
          href="/about/installation" 
          className="grid-item"
          style={{
            gridColumn: 'span 4',
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'visible',
            background: '#f5f5f5',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            perspective: '1000px'
          }}
        >
          <div 
            className="grid-stack"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(0px) rotate(-1deg)',
                zIndex: 3
              }}
            >
              <OptimizedImage 
                src="/images/process/창작자.png" 
                alt="Process" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-12px) rotate(2deg)',
                zIndex: 2,
                opacity: 0.85
              }}
            >
              <OptimizedImage 
                src="/images/process/큐레이터.png" 
                alt="Process" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-24px) rotate(-0.5deg)',
                zIndex: 1,
                opacity: 0.7
              }}
            >
              <OptimizedImage 
                src="/images/process/진행자.png" 
                alt="Process" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
          </div>
          <div 
            className="grid-item-overlay"
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: 0,
              right: 0,
              padding: '25px 30px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              color: '#fff',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 10,
              borderRadius: '0 0 12px 12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '1.5px',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Process
            </h3>
            <p 
              style={{
                fontSize: '13px',
                opacity: 0.9,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              전시를 만드는 6가지 역할
            </p>
          </div>
        </a>

        {/* Collective */}
        <a 
          href="/about/collective" 
          className="grid-item"
          style={{
            gridColumn: 'span 4',
            gridRow: 'span 2',
            position: 'relative',
            overflow: 'visible',
            background: '#f5f5f5',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            perspective: '1000px'
          }}
        >
          <div 
            className="grid-stack"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(0px) rotate(-1deg)',
                zIndex: 3
              }}
            >
              <OptimizedImage 
                src="/images/about-collective.jpg" 
                alt="Collective" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-12px) rotate(2deg)',
                zIndex: 2,
                opacity: 0.85
              }}
            >
              <OptimizedImage 
                src="/images/about-collective.jpg" 
                alt="Collective" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
            <div 
              className="stack-layer"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px solid #fff',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
                transform: 'translateZ(-24px) rotate(-0.5deg)',
                zIndex: 1,
                opacity: 0.7
              }}
            >
              <OptimizedImage 
                src="/images/about-collective.jpg" 
                alt="Collective" 
                fill={true}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(50%) brightness(0.9)',
                  transition: 'all 0.8s ease'
                }}
              />
            </div>
          </div>
          <div 
            className="grid-item-overlay"
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: 0,
              right: 0,
              padding: '25px 30px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              color: '#fff',
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 10,
              borderRadius: '0 0 12px 12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 
              style={{
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '1.5px',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Collective
            </h3>
            <p 
              style={{
                fontSize: '13px',
                opacity: 0.9,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              6인의 디자이너 크루
            </p>
          </div>
        </a>
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
            OUR PHILOSOPHY
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
            우리는 <span style={{ color: '#999', fontStyle: 'italic' }}>경계를 넘어</span> 새로운 가능성을 탐구합니다.
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
            각자의 개성이 하나로 모여 <span style={{ color: '#999', fontStyle: 'italic' }}>더 큰 시너지</span>를 만들어냅니다.
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
            순간을 넘어 <span style={{ color: '#999', fontStyle: 'italic' }}>영원히 기억될</span> 경험을 디자인합니다.
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
          OUR VALUES
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
        
        /* Grid hover effects - HTML 버전과 완전 동일 */
        .grid-item:hover .grid-stack {
          transform: rotateY(12deg) rotateX(3deg);
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
          filter: grayscale(0%) brightness(1);
          transform: scale(1.05);
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
            grid-template-columns: repeat(6, 1fr) !important;
            grid-auto-rows: 180px !important;
          }
          
          .grid-item {
            grid-column: span 3 !important;
            grid-row: span 2 !important;
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
          
          .about-intro h2 {
            font-size: 28px !important;
            margin-bottom: 30px !important;
          }
          
          .about-intro p {
            font-size: 16px !important;
            line-height: 1.8 !important;
          }
          
          .asymmetric-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 250px !important;
            padding: 0 20px !important;
            gap: 10px !important;
            margin-bottom: 80px !important;
          }
          
          .grid-item {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          
          .grid-stack {
            border-radius: 8px !important;
            overflow: hidden !important;
          }
          
          .stack-layer {
            border-radius: 8px !important;
            position: relative !important;
            transform: none !important;
            opacity: 1 !important;
            border: 1px solid #fff !important;
          }
          
          .stack-layer:nth-child(2),
          .stack-layer:nth-child(3) {
            display: none !important;
          }
          
          .grid-item-overlay {
            padding: 20px !important;
            bottom: 0 !important;
            background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)) !important;
            border-radius: 0 !important;
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

// GSAP 타입 확장
declare global {
  interface Window {
    gsap: any;
  }
}