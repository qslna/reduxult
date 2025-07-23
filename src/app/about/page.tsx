'use client';

import { useEffect } from 'react';
import { Metadata } from 'next';

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
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Hero Section - HTML 버전과 완전 동일 */}
      <section className="hero-section mt-[80px] py-[120px] px-10 bg-[--gray-light] text-center">
        <h1 className="hero-title font-light tracking-[0.2em] mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}>
          WHO REDUX?
        </h1>
        <p className="hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s]">
          Fashion Designer Collective
        </p>
      </section>

      {/* About Intro - HTML 버전과 완전 동일한 한국어 텍스트 */}
      <section className="about-intro py-[120px] px-10 max-w-[1200px] mx-auto text-center">
        <h2 className="text-4xl font-light tracking-[3px] mb-10">
          우리는 REDUX입니다
        </h2>
        <p className="text-lg leading-[2] text-[--gray-dark] mb-5">
          REDUX는 6인의 패션 디자이너가 모여 만든 크리에이티브 콜렉티브입니다.
          우리는 패션을 넘어 다양한 예술적 매체를 통해 새로운 경험을 창조합니다.
        </p>
        <p className="text-lg leading-[2] text-[--gray-dark] mb-5">
          패션 필름, 설치 미술, 비주얼 아트, 공간 디자인 등 다양한 형태로
          관객들에게 '기억에 남을 순간'을 선사하고자 합니다.
        </p>
      </section>

      {/* Asymmetric Grid - HTML 버전과 완전 동일한 3D 스택 효과 */}
      <div className="asymmetric-grid grid grid-cols-12 auto-rows-[200px] gap-5 px-10 max-w-[1600px] mx-auto mb-[120px] max-[1024px]:grid-cols-6 max-[1024px]:auto-rows-[180px] max-[768px]:grid-cols-1 max-[768px]:auto-rows-[250px] max-[768px]:gap-[10px] max-[768px]:px-5 max-[768px]:mb-20">
        
        {/* Fashion Film */}
        <a href="/about/fashion-film" 
           className="grid-item col-span-7 row-span-2 relative overflow-visible bg-[--gray-light] transition-all duration-500 ease-in-out cursor-pointer [perspective:1000px] max-[1024px]:col-span-3 max-[1024px]:row-span-2 max-[768px]:col-span-1 max-[768px]:row-span-1">
          <div className="grid-stack relative w-full h-full [transform-style:preserve-3d] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotateY(12deg)_rotateX(3deg)]">
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(0px)_rotate(-1deg)] z-[3]">
              <img src="/images/designers/choieunsol/cinemode/IMG_8617.jpeg" 
                   alt="Fashion Film - Choi Eunsol" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-12px)_rotate(2deg)] z-[2] opacity-85">
              <img src="/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg" 
                   alt="Fashion Film - Hwang Jinsu" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-24px)_rotate(-0.5deg)] z-[1] opacity-70">
              <img src="/images/designers/kimbomin/cinemode/NOR_7419-11.jpg" 
                   alt="Fashion Film - Kim Bomin" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
          </div>
          <div className="grid-item-overlay absolute -bottom-20 left-0 right-0 p-[25px_30px] bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.85))] text-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-10 rounded-[0_0_12px_12px] [backdrop-filter:blur(10px)]">
            <h3 className="text-xl font-normal tracking-[1.5px] mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Fashion Film
            </h3>
            <p className="text-[13px] opacity-90 tracking-[0.5px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              패션필름을 통한 스토리텔링
            </p>
          </div>
        </a>

        {/* Memory */}
        <a href="/about/memory" 
           className="grid-item col-span-5 row-span-3 relative overflow-visible bg-[--gray-light] transition-all duration-500 ease-in-out cursor-pointer [perspective:1000px] max-[1024px]:col-span-3 max-[1024px]:row-span-2 max-[768px]:col-span-1 max-[768px]:row-span-1">
          <div className="grid-stack relative w-full h-full [transform-style:preserve-3d] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotateY(12deg)_rotateX(3deg)]">
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(0px)_rotate(-1deg)] z-[3]">
              <img src="/images/about-memory.jpg" 
                   alt="Memory" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-12px)_rotate(2deg)] z-[2] opacity-85">
              <img src="/images/about-memory.jpg" 
                   alt="Memory" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-24px)_rotate(-0.5deg)] z-[1] opacity-70">
              <img src="/images/about-memory.jpg" 
                   alt="Memory" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
          </div>
          <div className="grid-item-overlay absolute -bottom-20 left-0 right-0 p-[25px_30px] bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.85))] text-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-10 rounded-[0_0_12px_12px] [backdrop-filter:blur(10px)]">
            <h3 className="text-xl font-normal tracking-[1.5px] mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Memory
            </h3>
            <p className="text-[13px] opacity-90 tracking-[0.5px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              기억에 남을 순간
            </p>
          </div>
        </a>

        {/* Visual Art */}
        <a href="/about/visual-art" 
           className="grid-item col-span-4 row-span-2 relative overflow-visible bg-[--gray-light] transition-all duration-500 ease-in-out cursor-pointer [perspective:1000px] max-[1024px]:col-span-3 max-[1024px]:row-span-2 max-[768px]:col-span-1 max-[768px]:row-span-1">
          <div className="grid-stack relative w-full h-full [transform-style:preserve-3d] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotateY(12deg)_rotateX(3deg)]">
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(0px)_rotate(-1deg)] z-[3]">
              <img src="/images/visual-art/METAMORPHOSIS.jpg" 
                   alt="Visual Art" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-12px)_rotate(2deg)] z-[2] opacity-85">
              <img src="/images/visual-art/SHADOW PLAY.jpg" 
                   alt="Visual Art" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-24px)_rotate(-0.5deg)] z-[1] opacity-70">
              <img src="/images/visual-art/DIGITAL DREAMS.jpg" 
                   alt="Visual Art" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
          </div>
          <div className="grid-item-overlay absolute -bottom-20 left-0 right-0 p-[25px_30px] bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.85))] text-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-10 rounded-[0_0_12px_12px] [backdrop-filter:blur(10px)]">
            <h3 className="text-xl font-normal tracking-[1.5px] mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Visual Art
            </h3>
            <p className="text-[13px] opacity-90 tracking-[0.5px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              시각적 경험의 확장
            </p>
          </div>
        </a>

        {/* Process (Installation) */}
        <a href="/about/installation" 
           className="grid-item col-span-4 row-span-2 relative overflow-visible bg-[--gray-light] transition-all duration-500 ease-in-out cursor-pointer [perspective:1000px] max-[1024px]:col-span-3 max-[1024px]:row-span-2 max-[768px]:col-span-1 max-[768px]:row-span-1">
          <div className="grid-stack relative w-full h-full [transform-style:preserve-3d] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotateY(12deg)_rotateX(3deg)]">
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(0px)_rotate(-1deg)] z-[3]">
              <img src="/images/process/창작자.png" 
                   alt="Process" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-12px)_rotate(2deg)] z-[2] opacity-85">
              <img src="/images/process/큐레이터.png" 
                   alt="Process" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-24px)_rotate(-0.5deg)] z-[1] opacity-70">
              <img src="/images/process/진행자.png" 
                   alt="Process" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
          </div>
          <div className="grid-item-overlay absolute -bottom-20 left-0 right-0 p-[25px_30px] bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.85))] text-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-10 rounded-[0_0_12px_12px] [backdrop-filter:blur(10px)]">
            <h3 className="text-xl font-normal tracking-[1.5px] mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Process
            </h3>
            <p className="text-[13px] opacity-90 tracking-[0.5px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              전시를 만드는 6가지 역할
            </p>
          </div>
        </a>

        {/* Collective */}
        <a href="/about/collective" 
           className="grid-item col-span-4 row-span-2 relative overflow-visible bg-[--gray-light] transition-all duration-500 ease-in-out cursor-pointer [perspective:1000px] max-[1024px]:col-span-3 max-[1024px]:row-span-2 max-[768px]:col-span-1 max-[768px]:row-span-1">
          <div className="grid-stack relative w-full h-full [transform-style:preserve-3d] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotateY(12deg)_rotateX(3deg)]">
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(0px)_rotate(-1deg)] z-[3]">
              <img src="/images/about-collective.jpg" 
                   alt="Collective" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-12px)_rotate(2deg)] z-[2] opacity-85">
              <img src="/images/about-collective.jpg" 
                   alt="Collective" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
            <div className="stack-layer absolute w-full h-full rounded-[12px] border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] overflow-hidden [transform:translateZ(-24px)_rotate(-0.5deg)] z-[1] opacity-70">
              <img src="/images/about-collective.jpg" 
                   alt="Collective" 
                   className="w-full h-full object-cover [filter:grayscale(50%)_brightness(0.9)] transition-all duration-[800ms] ease-in-out" />
            </div>
          </div>
          <div className="grid-item-overlay absolute -bottom-20 left-0 right-0 p-[25px_30px] bg-[linear-gradient(135deg,rgba(0,0,0,0.95),rgba(0,0,0,0.85))] text-white transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] z-10 rounded-[0_0_12px_12px] [backdrop-filter:blur(10px)]">
            <h3 className="text-xl font-normal tracking-[1.5px] mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Collective
            </h3>
            <p className="text-[13px] opacity-90 tracking-[0.5px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              6인의 디자이너 크루
            </p>
          </div>
        </a>
      </div>

      {/* Philosophy Section - HTML 버전과 완전 동일한 다크 섹션 */}
      <section className="philosophy-section py-[120px] px-10 bg-black text-white">
        <div className="philosophy-container max-w-[1000px] mx-auto text-center">
          <h2 className="philosophy-title text-5xl font-light tracking-[4px] mb-[60px] max-[768px]:text-[32px] max-[768px]:mb-10">
            OUR PHILOSOPHY
          </h2>
          <p className="philosophy-text text-2xl font-light leading-[2] mb-10 max-[768px]:text-lg max-[768px]:leading-[1.8] max-[768px]:mb-[30px]">
            우리는 <span className="text-[--gray-medium] italic">경계를 넘어</span> 새로운 가능성을 탐구합니다.
          </p>
          <p className="philosophy-text text-2xl font-light leading-[2] mb-10 max-[768px]:text-lg max-[768px]:leading-[1.8] max-[768px]:mb-[30px]">
            각자의 개성이 하나로 모여 <span className="text-[--gray-medium] italic">더 큰 시너지</span>를 만들어냅니다.
          </p>
          <p className="philosophy-text text-2xl font-light leading-[2] mb-10 max-[768px]:text-lg max-[768px]:leading-[1.8] max-[768px]:mb-[30px]">
            순간을 넘어 <span className="text-[--gray-medium] italic">영원히 기억될</span> 경험을 디자인합니다.
          </p>
        </div>
      </section>

      {/* Values Section - HTML 버전과 완전 동일한 3개 가치 */}
      <section className="values-section py-[120px] px-10 bg-white max-[768px]:py-[60px] max-[768px]:px-5">
        <h2 className="values-title text-5xl font-light tracking-[4px] text-center mb-20 max-[768px]:text-[32px] max-[768px]:mb-[50px]">
          OUR VALUES
        </h2>
        <div className="values-grid grid grid-cols-3 gap-[60px] max-w-[1200px] mx-auto max-[1024px]:grid-cols-1 max-[1024px]:gap-10">
          <div className="value-item text-center opacity-0 transform translate-y-[30px] revealed:animate-[fadeInUp_0.8s_ease_forwards]">
            <div className="value-icon w-20 h-20 mx-auto mb-[30px] flex items-center justify-center text-5xl text-black opacity-20 max-[768px]:w-[60px] max-[768px]:h-[60px] max-[768px]:text-4xl max-[768px]:mb-5">
              ◈
            </div>
            <h3 className="value-name text-xl font-normal tracking-[2px] mb-5 uppercase max-[768px]:text-lg max-[768px]:mb-[15px]">
              Collective
            </h3>
            <p className="value-description text-sm leading-[1.8] text-[--gray-dark] max-[768px]:text-sm max-[768px]:leading-[1.6] max-[768px]:px-5">
              개인의 창의성이 모여 더 큰 시너지를 만듭니다.
              서로 다른 관점과 재능이 하나의 비전을 향해 나아갑니다.
            </p>
          </div>
          <div className="value-item text-center opacity-0 transform translate-y-[30px] revealed:animate-[fadeInUp_0.8s_ease_forwards]">
            <div className="value-icon w-20 h-20 mx-auto mb-[30px] flex items-center justify-center text-5xl text-black opacity-20 max-[768px]:w-[60px] max-[768px]:h-[60px] max-[768px]:text-4xl max-[768px]:mb-5">
              ◐
            </div>
            <h3 className="value-name text-xl font-normal tracking-[2px] mb-5 uppercase max-[768px]:text-lg max-[768px]:mb-[15px]">
              Memory
            </h3>
            <p className="value-description text-sm leading-[1.8] text-[--gray-dark] max-[768px]:text-sm max-[768px]:leading-[1.6] max-[768px]:px-5">
              순간을 넘어 기억에 남는 경험을 창조합니다.
              우리의 작품이 관객의 마음속에 오래도록 머물기를 바랍니다.
            </p>
          </div>
          <div className="value-item text-center opacity-0 transform translate-y-[30px] revealed:animate-[fadeInUp_0.8s_ease_forwards]">
            <div className="value-icon w-20 h-20 mx-auto mb-[30px] flex items-center justify-center text-5xl text-black opacity-20 max-[768px]:w-[60px] max-[768px]:h-[60px] max-[768px]:text-4xl max-[768px]:mb-5">
              ∞
            </div>
            <h3 className="value-name text-xl font-normal tracking-[2px] mb-5 uppercase max-[768px]:text-lg max-[768px]:mb-[15px]">
              Evolution
            </h3>
            <p className="value-description text-sm leading-[1.8] text-[--gray-dark] max-[768px]:text-sm max-[768px]:leading-[1.6] max-[768px]:px-5">
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
        @media (max-width: 768px) {
          .grid-stack {
            border-radius: 8px;
            overflow: hidden;
          }
          
          .stack-layer {
            border-radius: 8px;
            position: relative;
            transform: none !important;
            opacity: 1 !important;
            border: 1px solid white;
          }
          
          .stack-layer:nth-child(2),
          .stack-layer:nth-child(3) {
            display: none;
          }
          
          .grid-item-overlay {
            padding: 20px;
            bottom: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4));
            border-radius: 0;
          }
          
          .grid-item-overlay h3 {
            font-size: 18px;
          }
          
          .grid-item-overlay p {
            font-size: 14px;
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

// 메타데이터
export const metadata = {
  title: 'About | REDUX',
  description: 'REDUX의 철학과 비전을 소개합니다.',
};