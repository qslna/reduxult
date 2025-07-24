'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';

// HTML redux6 about-collective.html과 완전 동일한 Collective 페이지 구현
export default function CollectivePage() {
  const router = useRouter();

  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 초기화
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
    
    document.querySelectorAll('.member-card').forEach(card => {
      observer.observe(card);
    });
    
    // GSAP 애니메이션
    if (typeof window !== 'undefined' && window.gsap) {
      // Values animation
      window.gsap.utils.toArray('.value-item').forEach((item: any, i: number) => {
        window.gsap.from(item, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%'
          }
        });
      });
      
      // Philosophy text animation
      window.gsap.utils.toArray('.philosophy-text').forEach((text: any, i: number) => {
        window.gsap.from(text, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: text,
            start: 'top 80%'
          }
        });
      });
    }
    
    return () => {
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

  const openDesignerPage = (designer: string) => {
    router.push(`/designers/${designer}`);
  };

  return (
    <>
      {/* Navigation - HTML 버전과 동일 */}
      <nav className="fixed top-0 left-0 w-full py-5 px-10 bg-white/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-black/10 scrolled:py-[15px] scrolled:px-10 scrolled:shadow-[0_2px_20px_rgba(0,0,0,0.1)]">
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button text-xl cursor-pointer transition-all duration-300 ease-in-out text-black hover:transform hover:-translate-x-[5px]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title text-lg font-medium tracking-[2px] text-black max-[768px]:hidden">
              COLLECTIVE
            </span>
          </div>
          <div 
            className="logo text-2xl font-bold tracking-[2px] cursor-pointer transition-opacity duration-300 ease-in-out text-black hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-black overflow-hidden">
        <video 
          className="hero-video absolute top-0 left-0 w-full h-full object-cover opacity-30"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/VIDEO/main.mp4.mp4" type="video/mp4" />
        </video>
        <div className="hero-content text-center z-[1] text-white">
          <h1 
            className="hero-title font-thin uppercase mb-5 opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.4em]"
            style={{ fontSize: 'clamp(80px, 12vw, 200px)' }}
          >
            REDUX
          </h1>
          <p className="hero-subtitle text-lg tracking-[4px] opacity-0 animate-[heroFade_1.5s_ease_forwards] [animation-delay:0.3s]">
            SIX MINDS, ONE VISION
          </p>
        </div>
      </section>

      {/* Philosophy Section - HTML 버전과 완전 동일 */}
      <section className="philosophy-section py-40 px-10 bg-white">
        <div className="philosophy-container max-w-[1000px] mx-auto text-center">
          <h2 className="philosophy-title text-5xl font-light tracking-[4px] mb-[60px] text-black">
            WHO WE ARE
          </h2>
          <p className="philosophy-text text-2xl font-light leading-[2] text-[--gray-dark] mb-10">
            REDUX는 <span className="text-black font-normal">6인의 패션 디자이너</span>가 모여서 만든 예술 크루입니다.
          </p>
          <p className="philosophy-text text-2xl font-light leading-[2] text-[--gray-dark] mb-10">
            우리는 패션필름, 설치, 비주얼 작업 등 다양한 방식으로<br />
            관객들에게 <span className="text-black font-normal">'기억에 남을 순간'</span>을 디자인합니다.
          </p>
          <p className="philosophy-text text-2xl font-light leading-[2] text-[--gray-dark] mb-10">
            각자 다른 색을 가진 멤버가 모여서 하나의 흐름을 만들고,<br />
            그 잔상이 오래도록 머물길 바라는 마음으로 활동하고 있습니다.
          </p>
          <p className="philosophy-quote text-lg italic text-[--gray-medium] mt-[60px]">
            "Fashion is not just what we wear, it's how we remember."
          </p>
        </div>
      </section>

      {/* Members Section - HTML 버전과 완전 동일 */}
      <section className="members-section py-[120px] px-10 bg-[--gray-light]">
        <h2 className="members-title text-5xl font-light tracking-[4px] text-center mb-20 text-black">
          THE COLLECTIVE
        </h2>
        <div className="members-grid grid grid-cols-3 gap-[60px] max-w-[1400px] mx-auto max-[1024px]:grid-cols-2 max-[1024px]:gap-10 max-[768px]:grid-cols-1 max-[768px]:gap-[60px]">
          
          {/* Member 1: Kim Bomin */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('kimbomin')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                01
              </div>
              <OptimizedImage 
                src="/images/designer-placeholder.jpg" 
                alt="Kim Bomin" 
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              KIM BOMIN
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Creative Director
            </p>
          </div>

          {/* Member 2: Park Parang */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('parkparang')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                02
              </div>
              <OptimizedImage 
                src="/images/designer-placeholder.jpg" 
                alt="Park Parang" 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              PARK PARANG
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Visual Artist
            </p>
          </div>

          {/* Member 3: Lee Taehyeon */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('leetaehyeon')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                03
              </div>
              <OptimizedImage 
                src="/images/designers/leetaehyeon/leetaehyeon-Profile.jpg" 
                alt="Lee Taehyeon" 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              LEE TAEHYEON
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Fashion Designer
            </p>
          </div>

          {/* Member 4: Choi Eunsol */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('choieunsol')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                04
              </div>
              <OptimizedImage 
                src="/images/designers/choieunsol/choieunsol-Profile.jpeg" 
                alt="Choi Eunsol" 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              CHOI EUNSOL
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Art Director
            </p>
          </div>

          {/* Member 5: Hwang Jinsu */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('hwangjinsu')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                05
              </div>
              <OptimizedImage 
                src="/images/designer-placeholder.jpg" 
                alt="Hwang Jinsu" 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              HWANG JINSU
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Film Director
            </p>
          </div>

          {/* Member 6: Kim Gyeongsu */}
          <div 
            className="member-card text-center cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealMember_0.8s_ease_forwards]"
            onClick={() => openDesignerPage('kimgyeongsu')}
          >
            <div className="member-portrait relative [aspect-ratio:3/4] bg-[--gray-dark] overflow-hidden mb-[30px]">
              <div className="member-number absolute top-5 left-5 text-5xl font-thin text-white opacity-50">
                06
              </div>
              <OptimizedImage 
                src="/images/designer-placeholder.jpg" 
                alt="Kim Gyeongsu" 
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover [filter:grayscale(100%)] transition-all duration-[800ms] ease-in-out hover:[filter:grayscale(0%)] hover:transform hover:scale-105"
              />
            </div>
            <h3 className="member-name text-xl font-normal tracking-[2px] mb-[10px] text-black">
              KIM GYEONGSU
            </h3>
            <p className="member-role text-sm tracking-[1px] text-[--gray-medium] uppercase">
              Installation Artist
            </p>
          </div>
        </div>
      </section>

      {/* Values Section - HTML 버전과 완전 동일 */}
      <section className="values-section py-[120px] px-10 bg-black text-white">
        <div className="values-container max-w-[1400px] mx-auto">
          <h2 className="values-title text-5xl font-light tracking-[4px] text-center mb-20">
            OUR VALUES
          </h2>
          <div className="values-grid grid grid-cols-4 gap-10 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:gap-[30px]">
            
            <div className="value-item text-center py-10 px-5 border border-white/10 transition-all duration-500 ease-in-out hover:bg-white/5 hover:transform hover:-translate-y-[10px]">
              <div className="value-icon w-[60px] h-[60px] mx-auto mb-[30px] border-2 border-white rounded-full flex items-center justify-center text-2xl">
                ∞
              </div>
              <h3 className="value-name text-lg font-light tracking-[2px] mb-5 uppercase">
                Collective
              </h3>
              <p className="value-description text-sm leading-[1.8] text-[--gray-medium]">
                개인의 창의성이 모여
                더 큰 시너지를 만듭니다
              </p>
            </div>
            
            <div className="value-item text-center py-10 px-5 border border-white/10 transition-all duration-500 ease-in-out hover:bg-white/5 hover:transform hover:-translate-y-[10px]">
              <div className="value-icon w-[60px] h-[60px] mx-auto mb-[30px] border-2 border-white rounded-full flex items-center justify-center text-2xl">
                ◐
              </div>
              <h3 className="value-name text-lg font-light tracking-[2px] mb-5 uppercase">
                Memory
              </h3>
              <p className="value-description text-sm leading-[1.8] text-[--gray-medium]">
                순간을 넘어 기억에
                남는 경험을 디자인합니다
              </p>
            </div>
            
            <div className="value-item text-center py-10 px-5 border border-white/10 transition-all duration-500 ease-in-out hover:bg-white/5 hover:transform hover:-translate-y-[10px]">
              <div className="value-icon w-[60px] h-[60px] mx-auto mb-[30px] border-2 border-white rounded-full flex items-center justify-center text-2xl">
                ◈
              </div>
              <h3 className="value-name text-lg font-light tracking-[2px] mb-5 uppercase">
                Boundary
              </h3>
              <p className="value-description text-sm leading-[1.8] text-[--gray-medium]">
                패션과 예술의 경계를
                허물고 새로운 영역을 탐구합니다
              </p>
            </div>
            
            <div className="value-item text-center py-10 px-5 border border-white/10 transition-all duration-500 ease-in-out hover:bg-white/5 hover:transform hover:-translate-y-[10px]">
              <div className="value-icon w-[60px] h-[60px] mx-auto mb-[30px] border-2 border-white rounded-full flex items-center justify-center text-2xl">
                ※
              </div>
              <h3 className="value-name text-lg font-light tracking-[2px] mb-5 uppercase">
                Evolution
              </h3>
              <p className="value-description text-sm leading-[1.8] text-[--gray-medium]">
                끊임없이 변화하고
                진화하는 창작을 추구합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section - HTML 버전과 완전 동일 */}
      <section className="cta-section py-40 px-10 bg-white text-center">
        <h2 
          className="cta-title font-light tracking-[3px] mb-10 text-black"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          Let's Create Something Memorable Together
        </h2>
        <a 
          href="/contact" 
          className="cta-button inline-block py-5 px-[60px] border-2 border-black text-black no-underline text-base tracking-[2px] uppercase relative overflow-hidden transition-all duration-300 ease-in-out hover:text-white before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-black before:transition-[left_0.3s_ease] before:-z-[1] hover:before:left-0"
        >
          Get in Touch
        </a>
      </section>

    </>
  );
}

// GSAP 타입 확장
declare global {
  interface Window {
    gsap: any;
  }
}