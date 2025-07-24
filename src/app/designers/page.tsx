'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { designers } from '@/data/designers';

// HTML redux6 designers.html과 완전 동일한 Designers 페이지 구현
export default function DesignersPage() {
  const router = useRouter();

  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 초기화
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile && typeof window !== 'undefined') {
      // GSAP 애니메이션 실행
      const timer = setTimeout(() => {
        if (window.gsap) {
          // Designer cards animation
          window.gsap.utils.toArray('.designer-card').forEach((card: any, index: number) => {
            window.gsap.from(card, {
              opacity: 0,
              y: 100,
              duration: 1,
              delay: index * 0.1,
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%'
              }
            });
          });
          
          // Parallax effect on designer numbers
          window.gsap.utils.toArray('.designer-number').forEach((number: any) => {
            window.gsap.to(number, {
              y: -50,
              scrollTrigger: {
                trigger: number,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            });
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Touch feedback for mobile
    if ('ontouchstart' in window) {
      document.querySelectorAll('.designer-card').forEach(card => {
        card.addEventListener('touchstart', function(this: Element) {
          this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function(this: Element) {
          setTimeout(() => {
            this.classList.remove('touch-active');
          }, 300);
        });
      });
    }
  }, []);

  // 6인의 디자이너 데이터를 실제 데이터에서 가져와서 display용으로 변환
  const designerDisplayData = designers.map((designer, index) => ({
    id: designer.id,
    number: String(designer.order).padStart(2, '0'),
    name: designer.name.toUpperCase(),
    role: designer.role,
    brand: designer.filmTitle || 'REDUX COLLECTIVE',
    profileImage: designer.profileImage,
    hasImage: designer.profileImage !== '',
    hasVideo: !!designer.videoUrl
  }));

  const handleDesignerClick = (designerId: string) => {
    router.push(`/designers/${designerId}`);
  };

  return (
    <>
      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section 
        className="hero-section"
        style={{
          marginTop: '80px',
          height: '50vh',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="hero-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            opacity: 0.5
          }}
        ></div>
        <div 
          className="hero-content"
          style={{
            textAlign: 'center',
            zIndex: 1,
            color: '#fff'
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
              animation: 'fadeInUp 1s ease forwards'
            }}
          >
            SIX DESIGNERS
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
            One Collective Vision
          </p>
        </div>
      </section>

      {/* Designer Grid - HTML 버전과 완전 동일 */}
      <section 
        className="designers-container"
        style={{
          padding: '120px 40px',
          maxWidth: '1600px',
          margin: '0 auto'
        }}
      >
        <div 
          className="designers-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            position: 'relative'
          }}
        >
          {designerDisplayData.map((designer, index) => (
            <div 
              key={designer.id}
              className="designer-card"
              onClick={() => handleDesignerClick(designer.id)}
              style={{
                position: 'relative',
                height: '65vh',
                minHeight: '450px',
                maxHeight: '600px',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRight: (index + 1) % 3 !== 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.6s ease'
              }}
            >
              <div 
                className="designer-image"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: designer.hasImage ? `url('${designer.profileImage}')` : 'none',
                  background: !designer.hasImage ? 'linear-gradient(135deg, #2a2a2a, #4a4a4a)' : undefined,
                  filter: 'grayscale(100%) contrast(1.2)',
                  transition: 'all 0.8s ease',
                  opacity: 0.7,
                  display: !designer.hasImage ? 'flex' : 'block',
                  alignItems: !designer.hasImage ? 'center' : 'normal',
                  justifyContent: !designer.hasImage ? 'center' : 'normal',
                  color: !designer.hasImage ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  fontSize: !designer.hasImage ? '48px' : '0',
                  fontWeight: !designer.hasImage ? 100 : 'normal'
                }}
              >
                {!designer.hasImage && '📷'}
              </div>
              
              <span 
                className="designer-number"
                style={{
                  fontSize: '120px',
                  fontWeight: 100,
                  color: 'rgba(255, 255, 255, 0.1)',
                  position: 'absolute',
                  top: '40px',
                  right: '40px',
                  transition: 'all 0.6s ease'
                }}
              >
                {designer.number}
              </span>
              
              {/* Film indicator for designers with videos */}
              {designer.hasVideo && (
                <div 
                  className="film-indicator"
                  style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#fff',
                    transition: 'all 0.6s ease'
                  }}
                >
                  ▶
                </div>
              )}
              
              <div 
                className="designer-content"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '60px 40px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                  transform: 'translateY(60%)',
                  transition: 'transform 0.6s ease'
                }}
              >
                <h3 
                  className="designer-name"
                  style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    letterSpacing: '3px',
                    color: '#fff',
                    marginBottom: '10px'
                  }}
                >
                  {designer.name}
                </h3>
                <p 
                  className="designer-role"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '2px',
                    color: '#999',
                    textTransform: 'uppercase',
                    marginBottom: '20px'
                  }}
                >
                  {designer.role}
                </p>
                <p 
                  className="designer-brand"
                  style={{
                    fontSize: '16px',
                    color: '#fff',
                    marginBottom: '30px',
                    opacity: 0.8
                  }}
                >
                  {designer.brand}
                </p>
                <span 
                  className="designer-link"
                  style={{
                    display: 'inline-block',
                    padding: '12px 30px',
                    border: '1px solid #fff',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    opacity: 0
                  }}
                >
                  View Profile
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Designer card hover effects - HTML 버전과 완전 동일 */
        .designer-card:hover {
          z-index: 10;
        }
        
        .designer-card:hover .designer-image {
          filter: grayscale(0%) contrast(1) !important;
          opacity: 1 !important;
          transform: scale(1.05) !important;
        }
        
        .designer-card:hover .designer-number {
          color: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.2) !important;
        }
        
        .designer-card:hover .designer-content {
          transform: translateY(0) !important;
        }
        
        .designer-card:hover .designer-link {
          opacity: 1 !important;
        }
        
        .designer-card:hover .film-indicator {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }
        
        .designer-link:hover {
          background: #fff !important;
          color: #000 !important;
        }
        
        /* Touch feedback for mobile */
        @media (hover: none) {
          .designer-card:active .designer-image {
            filter: grayscale(0%) contrast(1) !important;
            opacity: 1 !important;
            transform: scale(1.05) !important;
          }
          
          .designer-card:active .designer-content {
            transform: translateY(0) !important;
          }
          
          .designer-card:active .designer-link {
            opacity: 1 !important;
          }
          
          .designer-content {
            transform: translateY(30%) !important;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .designers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .designer-card {
            height: 55vh !important;
            min-height: 400px !important;
            max-height: 500px !important;
            border-right: none !important;
          }
          
          .designer-card:nth-child(2n) {
            border-right: none !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            margin-top: 60px !important;
            height: 40vh !important;
            min-height: 300px !important;
          }
          
          .hero-title {
            font-size: clamp(36px, 10vw, 56px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .hero-subtitle {
            font-size: 16px !important;
          }
          
          .designers-container {
            padding: 60px 20px 40px !important;
          }
          
          .designers-grid {
            grid-template-columns: 1fr !important;
            gap: 2px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            padding: 2px !important;
          }
          
          .designer-card {
            height: 60vh !important;
            min-height: 350px !important;
            max-height: 450px !important;
            border-right: none !important;
            border-bottom: none !important;
            background: #000 !important;
          }
          
          .designer-number {
            font-size: 80px !important;
            top: 20px !important;
            right: 20px !important;
          }
          
          .designer-name {
            font-size: 24px !important;
          }
          
          .designer-role {
            font-size: 12px !important;
          }
          
          .designer-brand {
            font-size: 14px !important;
          }
          
          .designer-content {
            padding: 40px 20px !important;
            transform: translateY(0) !important;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent) !important;
          }
          
          .designer-link {
            opacity: 1 !important;
            padding: 10px 25px !important;
            font-size: 11px !important;
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
          
          .designer-card {
            height: 50vh !important;
            min-height: 300px !important;
            max-height: 400px !important;
          }
          
          .designer-number {
            font-size: 60px !important;
          }
          
          .designer-name {
            font-size: 20px !important;
          }
          
          .designer-role {
            font-size: 11px !important;
          }
          
          .designer-brand {
            font-size: 13px !important;
            margin-bottom: 20px !important;
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