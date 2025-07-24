'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// HTML redux6 exhibitions.html과 완전 동일한 Exhibitions 페이지 구현
export default function ExhibitionsPage() {
  const router = useRouter();

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

    // HTML 버전과 동일한 GSAP 애니메이션 (만약 GSAP이 로드되었다면)
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
      // Timeline animation
      window.gsap.to('.timeline-line', {
        height: '100%',
        scrollTrigger: {
          trigger: '.exhibition-timeline',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
      
      // Exhibition items animation
      window.gsap.utils.toArray('.exhibition-item').forEach((item: any, index: number) => {
        const visual = item.querySelector('.exhibition-visual');
        const info = item.querySelector('.exhibition-info');
        
        window.gsap.from(visual, {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%'
          }
        });
        
        window.gsap.from(info, {
          x: index % 2 === 0 ? 100 : -100,
          opacity: 0,
          duration: 1.5,
          delay: 0.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%'
          }
        });
      });
    }

    // Smooth scroll for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // HTML 버전과 동일한 내비게이션 함수들
  const toggleMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuToggle?.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
  };

  const toggleSubmenu = (menu: string) => {
    const submenu = document.getElementById(menu + 'Submenu');
    submenu?.classList.toggle('active');
  };

  const comingSoonAlert = () => {
    alert('Coming Soon');
    return false;
  };

  return (
    <>
      {/* Navigation - HTML 버전과 완전 동일 */}
      <nav id="navbar" className="fixed top-0 left-0 w-full py-5 px-10 bg-white/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-black/10">
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <a href="/" className="logo text-2xl font-bold tracking-[2px] text-black transition-opacity duration-300 ease-in-out hover:opacity-70 no-underline">
            REDUX
          </a>
          <ul className="nav-menu flex gap-10 list-none max-[768px]:hidden">
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-black before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/about" className="text-black no-underline block py-[5px]">
                About
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-white/98 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-white/98">
                <a href="/about/fashion-film" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Fashion Film
                </a>
                <a href="/about/memory" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Memory
                </a>
                <a href="/about/visual-art" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Visual Art
                </a>
                <a href="/about/installation" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Process
                </a>
                <a href="/about/collective" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Collective
                </a>
              </div>
            </li>
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-black before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/designers" className="text-black no-underline block py-[5px]">
                Designers
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-white/98 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-white/98">
                <a href="/designers/kimbomin" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Kim Bomin
                </a>
                <a href="/designers/parkparang" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Park Parang
                </a>
                <a href="/designers/leetaehyeon" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Lee Taehyeon
                </a>
                <a href="/designers/choieunsol" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Choi Eunsol
                </a>
                <a href="/designers/hwangjinsu" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Hwang Jinsu
                </a>
                <a href="/designers/kimgyeongsu" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  Kim Gyeongsu
                </a>
              </div>
            </li>
            <li className="nav-item active relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-full before:h-[1px] before:bg-black before:transition-[width_0.3s_ease]">
              <a href="/exhibitions" className="text-black no-underline block py-[5px]">
                Exhibitions
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-white/98 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-white/98">
                <a href="#cine-mode" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  CINE MODE
                </a>
                <a href="#the-room" className="dropdown-item block py-[10px] px-[25px] text-black text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-[--gray-light] hover:pl-[30px]">
                  THE ROOM OF [ ]
                </a>
              </div>
            </li>
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-black before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/contact" className="text-black no-underline block py-[5px]">
                Contact
              </a>
            </li>
          </ul>
          <div 
            className="menu-toggle hidden flex-col gap-[5px] z-[1001] relative w-[30px] h-[20px] cursor-pointer max-[768px]:flex"
            id="menuToggle"
            onClick={toggleMobileMenu}
          >
            <span className="w-full h-[2px] bg-black transition-all duration-300 ease-in-out absolute top-0"></span>
            <span className="w-full h-[2px] bg-black transition-all duration-300 ease-in-out absolute top-1/2 transform -translate-y-1/2"></span>
            <span className="w-full h-[2px] bg-black transition-all duration-300 ease-in-out absolute bottom-0"></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - HTML 버전과 완전 동일 */}
      <div className="mobile-menu hidden fixed top-0 left-0 w-full h-screen bg-white z-[999] transform translate-x-full transition-transform duration-500 ease-in-out overflow-y-auto max-[768px]:block" id="mobileMenu">
        <div className="mobile-menu-content flex flex-col justify-center items-center min-h-screen gap-10 p-5">
          <div className="mobile-menu-item opacity-0 transform translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center" style={{ animationDelay: '0.1s' }}>
            <span onClick={() => toggleSubmenu('about')} className="text-black text-xl tracking-[2px]">
              About
            </span>
            <div className="mobile-submenu hidden flex-col gap-5 mt-5 pl-5" id="aboutSubmenu">
              <a href="/about" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                About REDUX
              </a>
              <a href="/about/fashion-film" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Fashion Film
              </a>
              <a href="/about/memory" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Memory
              </a>
              <a href="/about/visual-art" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Visual Art
              </a>
              <a href="/about/installation" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Process
              </a>
              <a href="/about/collective" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Collective
              </a>
            </div>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center" style={{ animationDelay: '0.2s' }}>
            <span onClick={() => toggleSubmenu('designers')} className="text-black text-xl tracking-[2px]">
              Designers
            </span>
            <div className="mobile-submenu hidden flex-col gap-5 mt-5 pl-5" id="designersSubmenu">
              <a href="/designers" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                All Designers
              </a>
              <a href="/designers/kimbomin" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Kim Bomin
              </a>
              <a href="/designers/parkparang" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Park Parang
              </a>
              <a href="/designers/leetaehyeon" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Lee Taehyeon
              </a>
              <a href="/designers/choieunsol" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Choi Eunsol
              </a>
              <a href="/designers/hwangjinsu" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Hwang Jinsu
              </a>
              <a href="/designers/kimgyeongsu" className="mobile-submenu-item text-base text-black opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100">
                Kim Gyeongsu
              </a>
            </div>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 text-center" style={{ animationDelay: '0.3s' }}>
            <a href="/exhibitions" className="text-black text-xl tracking-[2px] no-underline">
              Exhibitions
            </a>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 text-center" style={{ animationDelay: '0.4s' }}>
            <a href="/contact" className="text-black text-xl tracking-[2px] no-underline">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Exhibition Hero - HTML 버전과 완전 동일 */}
      <section className="exhibition-hero mt-20 py-[100px] px-10 bg-[--gray-light] text-center relative overflow-hidden">
        <div className="exhibition-hero-content relative z-[1]">
          <h1 
            className="exhibition-hero-title font-light tracking-[0.2em] mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            EXHIBITIONS
          </h1>
          <p className="exhibition-hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s]">
            Moments We Create
          </p>
        </div>
      </section>

      {/* Exhibition Timeline - HTML 버전과 완전 동일 */}
      <section className="exhibition-timeline py-[120px] relative">
        <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-[1px] bg-[--gray-light] transform -translate-x-1/2 max-[768px]:hidden"></div>
        
        {/* Exhibition 1: CINE MODE */}
        <div className="exhibition-item relative mb-0" id="cine-mode">
          <div className="exhibition-content grid grid-cols-2 min-h-screen items-center max-[1024px]:grid-cols-1">
            <div className="exhibition-visual relative h-screen overflow-hidden bg-[--gray-dark] max-[1024px]:h-[60vh] max-[768px]:h-[50vh]">
              <img 
                src="/images/exhibition-cinemode.jpg" 
                alt="CINE MODE Exhibition" 
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-in-out hover:scale-105"
              />
            </div>
            <div className="exhibition-info py-20 px-20 bg-white relative max-[1024px]:py-[60px] max-[768px]:py-10 max-[768px]:px-5">
              <span className="exhibition-number absolute -top-[60px] right-0 text-[200px] font-thin text-black/5 z-0 max-[768px]:text-[100px] max-[768px]:-top-[30px]">
                01
              </span>
              <p className="exhibition-date text-sm tracking-[2px] text-[--gray-medium] mb-5 uppercase">
                2025.03.03 - 2025.03.08
              </p>
              <h2 
                className="exhibition-title font-light tracking-[3px] mb-[30px] leading-[1.2]"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
              >
                CINE MODE
              </h2>
              <p className="exhibition-description text-base leading-[1.8] text-[--gray-dark] mb-10 max-w-[500px]">
                REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
                영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
                6인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 
                시각적 서사를 경험할 수 있습니다.
              </p>
              <ul className="exhibition-details list-none mb-[60px]">
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Location: Seoul, South Korea
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Type: Fashion Film Exhibition
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Participants: 6 Designers
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Curator: REDUX Collective
                </li>
              </ul>
              <a 
                href="/about/fashion-film" 
                className="exhibition-cta inline-block py-[15px] px-10 border-2 border-black text-black no-underline text-sm tracking-[2px] uppercase relative overflow-hidden transition-all duration-300 ease-in-out hover:text-white before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-black before:transition-[left_0.3s_ease] before:-z-[1] hover:before:left-0"
              >
                View Exhibition
              </a>
            </div>
          </div>
        </div>
        
        {/* Exhibition 2: THE ROOM OF [ ] */}
        <div className="exhibition-item relative mb-0" id="the-room">
          <div className="exhibition-content grid grid-cols-2 min-h-screen items-center [direction:rtl] max-[1024px]:grid-cols-1 max-[1024px]:[direction:ltr]">
            <div className="exhibition-visual relative h-screen overflow-hidden bg-[--gray-dark] [direction:ltr] max-[1024px]:h-[60vh] max-[768px]:h-[50vh]">
              <img 
                src="/images/exhibition-theroom.jpg" 
                alt="THE ROOM OF [ ] Exhibition" 
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-in-out hover:scale-105"
              />
            </div>
            <div className="exhibition-info py-20 px-20 bg-[--gray-light] relative [direction:ltr] max-[1024px]:py-[60px] max-[768px]:py-10 max-[768px]:px-5">
              <span className="exhibition-number absolute -top-[60px] right-0 text-[200px] font-thin text-black/5 z-0 max-[768px]:text-[100px] max-[768px]:-top-[30px]">
                02
              </span>
              <p className="exhibition-date text-sm tracking-[2px] text-[--gray-medium] mb-5 uppercase">
                2025.12 - 2026.01 (Upcoming)
              </p>
              <h2 
                className="exhibition-title font-light tracking-[3px] mb-[30px] leading-[1.2]"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
              >
                THE ROOM OF [&nbsp;&nbsp;]
              </h2>
              <p className="exhibition-description text-base leading-[1.8] text-[--gray-dark] mb-10 max-w-[500px]">
                패션 필름, 텍스타일 아트, 인터랙션 디자인, 공간 인스톨레이션 등 
                다양한 매체를 통해 각 디자이너의 서로 다른 컨셉으로 전시를 풀어냅니다.
                빈 공간 [ ] 안에 각자의 이야기를 채워나가는 실험적인 전시입니다.
              </p>
              <ul className="exhibition-details list-none mb-[60px]">
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Location: To be announced
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Type: Multimedia Installation
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Duration: 1 Month
                </li>
                <li className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]">
                  Special: Interactive Experience
                </li>
              </ul>
              <a 
                href="#" 
                className="exhibition-cta inline-block py-[15px] px-10 border-2 border-black text-black no-underline text-sm tracking-[2px] uppercase relative overflow-hidden transition-all duration-300 ease-in-out hover:text-white before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-black before:transition-[left_0.3s_ease] before:-z-[1] hover:before:left-0"
                onClick={comingSoonAlert}
              >
                Coming Soon
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section - HTML 버전과 완전 동일 */}
      <section className="coming-soon py-[120px] px-10 text-center bg-black text-white relative overflow-hidden">
        <div className="coming-soon-content relative z-[1] max-w-[800px] mx-auto">
          <h2 className="coming-soon-title text-5xl font-light tracking-[4px] mb-[30px]">
            FUTURE EXHIBITIONS
          </h2>
          <p className="coming-soon-text text-lg leading-[1.8] opacity-80">
            REDUX는 계속해서 새로운 형태의 전시를 준비하고 있습니다.<br />
            패션과 예술의 경계를 넘나들며, 관객과 함께 만들어가는<br />
            특별한 경험을 선사하겠습니다.
          </p>
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-white text-black text-center border-t border-black/10">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        /* CSS 변수 정의 - HTML 버전과 완전 동일 */
        :root {
          --primary-black: #000;
          --primary-white: #fff;
          --gray-light: #f5f5f5;
          --gray-medium: #999;
          --gray-dark: #333;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .exhibition-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }
        
        .coming-soon::before {
          content: 'COMING SOON';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 200px;
          font-weight: 100;
          opacity: 0.05;
          white-space: nowrap;
        }
        
        @keyframes mobileMenuFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-menu.active {
          transform: translateX(0);
        }
        
        .mobile-menu.active .mobile-menu-item {
          animation: mobileMenuFade 0.5s ease forwards;
        }
        
        .mobile-submenu.active {
          display: flex;
        }
        
        .menu-toggle.active span:nth-child(1) {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        
        .menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
          bottom: 50%;
          transform: translateY(50%) rotate(-45deg);
        }
        
        .nav-item:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          margin-top: 10px;
        }
        
        .nav-item.active::before {
          width: 100%;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .coming-soon::before {
            font-size: 80px;
          }
          
          .exhibition-hero {
            padding: 80px 20px;
          }
          
          .exhibition-hero-title {
            font-size: clamp(36px, 7vw, 48px) !important;
          }
          
          .exhibition-title {
            font-size: clamp(28px, 5vw, 40px) !important;
          }
          
          .coming-soon {
            padding: 80px 20px;
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
    ScrollTrigger: any;
  }
}