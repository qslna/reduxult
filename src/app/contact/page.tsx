'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// HTML redux6 contact.html과 완전 동일한 Contact 페이지 구현
export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

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

    // 모바일 감지 및 iOS 폼 입력 줄 수정
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          setTimeout(() => {
            window.scrollTo(0, (input as HTMLElement).offsetTop - 100);
          }, 300);
        });
      });
    }

    // HTML 버전과 동일한 GSAP 애니메이션 (만약 GSAP이 로드되었다면)
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger && !isMobile) {
      window.gsap.from('.contact-info-group', {
        x: -50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact-info-section',
          start: 'top 80%'
        }
      });
      
      window.gsap.from('.contact-form-section', {
        x: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.contact-form-section',
          start: 'top 80%'
        }
      });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // HTML 버전과 동일한 내비게이션 함수들
  const toggleMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    menuToggle?.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    
    if (mobileMenu?.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      document.querySelectorAll('.mobile-submenu').forEach(submenu => {
        submenu.classList.remove('active');
      });
    }
  };

  const toggleSubmenu = (menu: string) => {
    const submenu = document.getElementById(menu + 'Submenu');
    const allSubmenus = document.querySelectorAll('.mobile-submenu');
    
    allSubmenus.forEach(s => {
      if (s !== submenu) {
        s.classList.remove('active');
      }
    });
    
    submenu?.classList.toggle('active');
  };

  // 폼 데이터 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 시뮤레이션: 실제 서버로 전송
    setTimeout(() => {
      setIsSubmitting(false);
      setShowMessage(true);
      
      // 폼 초기화
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // 메시지 숨기기
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }, 1000);
  };

  return (
    <>
      {/* Navigation - HTML 버전과 완전 동일한 다크 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-white/10"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <a href="/" className="logo text-2xl font-bold tracking-[2px] text-white transition-opacity duration-300 ease-in-out hover:opacity-70 no-underline">
            REDUX
          </a>
          <ul className="nav-menu flex gap-10 list-none max-[768px]:hidden">
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/about" className="text-white no-underline block py-[5px]">
                About
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10 hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-black/95">
                <a href="/about/fashion-film" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Fashion Film
                </a>
                <a href="/about/memory" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Memory
                </a>
                <a href="/about/visual-art" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Visual Art
                </a>
                <a href="/about/installation" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Process
                </a>
                <a href="/about/collective" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Collective
                </a>
              </div>
            </li>
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/designers" className="text-white no-underline block py-[5px]">
                Designers
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10 hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-black/95">
                <a href="/designers/kimbomin" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Kim Bomin
                </a>
                <a href="/designers/parkparang" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Park Parang
                </a>
                <a href="/designers/leetaehyeon" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Lee Taehyeon
                </a>
                <a href="/designers/choieunsol" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Choi Eunsol
                </a>
                <a href="/designers/hwangjinsu" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Hwang Jinsu
                </a>
                <a href="/designers/kimgyeongsu" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  Kim Gyeongsu
                </a>
              </div>
            </li>
            <li className="nav-item relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width_0.3s_ease] hover:before:w-full">
              <a href="/exhibitions" className="text-white no-underline block py-[5px]">
                Exhibitions
              </a>
              <div className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-[10px] min-w-[180px] py-[15px] mt-5 opacity-0 invisible transition-all duration-300 ease-in-out border border-white/10 hover:opacity-100 hover:visible hover:mt-[10px] before:content-[''] before:absolute before:-top-[10px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-black/95">
                <a href="/exhibitions#cine-mode" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  CINE MODE
                </a>
                <a href="/exhibitions#the-room" className="dropdown-item block py-[10px] px-[25px] text-white text-xs tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer no-underline whitespace-nowrap hover:bg-white/10 hover:pl-[30px]">
                  THE ROOM OF [ ]
                </a>
              </div>
            </li>
            <li className="nav-item active relative text-[13px] tracking-[1px] uppercase transition-all duration-300 ease-in-out cursor-pointer before:content-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-full before:h-[1px] before:bg-white before:transition-[width_0.3s_ease]">
              <a href="/contact" className="text-white no-underline block py-[5px]">
                Contact
              </a>
            </li>
          </ul>
          <div 
            className="menu-toggle hidden flex-col gap-[5px] z-[1001] relative w-[30px] h-[20px] cursor-pointer p-[10px] -m-[10px] max-[768px]:flex"
            id="menuToggle"
            onClick={toggleMobileMenu}
          >
            <span className="w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute top-0"></span>
            <span className="w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute top-1/2 transform -translate-y-1/2"></span>
            <span className="w-full h-[2px] bg-white transition-all duration-300 ease-in-out absolute bottom-0"></span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - HTML 버전과 완전 동일 */}
      <div className="mobile-menu hidden fixed top-0 left-0 w-full h-screen h-[100dvh] bg-black z-[999] transform translate-x-full transition-transform duration-500 ease-in-out overflow-y-auto [-webkit-overflow-scrolling:touch] max-[768px]:block" id="mobileMenu">
        <div className="mobile-menu-content flex flex-col justify-center items-center min-h-screen min-h-[100dvh] gap-[30px] py-20 px-5">
          <div className="mobile-menu-item opacity-0 transform translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center p-[10px] w-full max-w-[300px]" style={{ animationDelay: '0.1s' }}>
            <span onClick={() => toggleSubmenu('about')} className="text-white text-xl tracking-[2px]">
              About
            </span>
            <div className="mobile-submenu hidden flex-col gap-[15px] mt-5 pl-5 w-full" id="aboutSubmenu">
              <a href="/about" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                About REDUX
              </a>
              <a href="/about/fashion-film" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Fashion Film
              </a>
              <a href="/about/memory" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Memory
              </a>
              <a href="/about/visual-art" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Visual Art
              </a>
              <a href="/about/installation" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Process
              </a>
              <a href="/about/collective" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Collective
              </a>
            </div>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 cursor-pointer transition-opacity duration-300 ease-in-out text-center p-[10px] w-full max-w-[300px]" style={{ animationDelay: '0.2s' }}>
            <span onClick={() => toggleSubmenu('designers')} className="text-white text-xl tracking-[2px]">
              Designers
            </span>
            <div className="mobile-submenu hidden flex-col gap-[15px] mt-5 pl-5 w-full" id="designersSubmenu">
              <a href="/designers" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                All Designers
              </a>
              <a href="/designers/kimbomin" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Kim Bomin
              </a>
              <a href="/designers/parkparang" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Park Parang
              </a>
              <a href="/designers/leetaehyeon" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Lee Taehyeon
              </a>
              <a href="/designers/choieunsol" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Choi Eunsol
              </a>
              <a href="/designers/hwangjinsu" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Hwang Jinsu
              </a>
              <a href="/designers/kimgyeongsu" className="mobile-submenu-item text-base text-white opacity-70 no-underline transition-opacity duration-300 ease-in-out hover:opacity-100 py-2 px-4 text-left">
                Kim Gyeongsu
              </a>
            </div>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 text-center p-[10px] w-full max-w-[300px]" style={{ animationDelay: '0.3s' }}>
            <a href="/exhibitions" className="text-white text-xl tracking-[2px] no-underline">
              Exhibitions
            </a>
          </div>
          <div className="mobile-menu-item opacity-0 transform translate-y-5 text-center p-[10px] w-full max-w-[300px]" style={{ animationDelay: '0.4s' }}>
            <a href="/contact" className="text-white text-xl tracking-[2px] no-underline">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Contact Hero - HTML 버전과 완전 동일 */}
      <section className="contact-hero mt-[80px] h-[60vh] min-h-[400px] flex items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_100%)] max-[768px]:mt-[60px] max-[768px]:h-[50vh] max-[768px]:min-h-[350px]">
        <div className="contact-hero-content text-center z-[1]">
          <h1 
            className="contact-hero-title font-light text-white mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards] tracking-[0.2em] max-[768px]:mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            GET IN TOUCH
          </h1>
          <p className="contact-hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s] max-[768px]:text-base">
            Let's Create Something Together
          </p>
        </div>
      </section>

      {/* Contact Main - HTML 버전과 완전 동일 */}
      <section className="contact-main py-[120px] px-10 max-w-[1400px] mx-auto max-[768px]:py-[60px] max-[768px]:px-5">
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-2 gap-20 items-start max-[1024px]:gap-[60px] max-[768px]:gap-[60px]">
          {/* Contact Info Section - HTML 버전과 완전 동일 */}
          <div className="contact-info-section pr-10 max-[1024px]:pr-0">
            <h2 className="contact-info-title text-4xl font-light tracking-[3px] text-white mb-[60px] relative pb-5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[60px] after:h-[1px] after:bg-white max-[768px]:text-3xl max-[768px]:mb-10 max-[480px]:text-2xl">
              Contact Information
            </h2>
            
            <div className="contact-info-group mb-[50px] max-[768px]:mb-[35px]">
              <p className="contact-info-label text-xs tracking-[2px] uppercase text-[--gray-medium] mb-[15px] max-[480px]:text-[11px]">
                Email
              </p>
              <p className="contact-info-value text-lg font-light leading-[1.6] text-white transition-all duration-300 ease-in-out max-[768px]:text-base max-[480px]:text-[15px]">
                <a 
                  href="mailto:reduxsix@gmail.com"
                  className="text-white no-underline relative inline-block after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full"
                >
                  reduxsix@gmail.com
                </a>
              </p>
            </div>
            
            <div className="contact-info-group mb-[50px] max-[768px]:mb-[35px]">
              <p className="contact-info-label text-xs tracking-[2px] uppercase text-[--gray-medium] mb-[15px] max-[480px]:text-[11px]">
                Phone
              </p>
              <p className="contact-info-value text-lg font-light leading-[1.6] text-white transition-all duration-300 ease-in-out max-[768px]:text-base max-[480px]:text-[15px]">
                <a 
                  href="tel:+821076211928"
                  className="text-white no-underline relative inline-block after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full"
                >
                  +82 10-7621-1928
                </a>
              </p>
            </div>
            
            <div className="contact-info-group mb-[50px] max-[768px]:mb-[35px]">
              <p className="contact-info-label text-xs tracking-[2px] uppercase text-[--gray-medium] mb-[15px] max-[480px]:text-[11px]">
                Location
              </p>
              <p className="contact-info-value text-lg font-light leading-[1.6] text-white transition-all duration-300 ease-in-out max-[768px]:text-base max-[480px]:text-[15px]">
                Seoul, South Korea
              </p>
            </div>
            
            <div className="contact-info-group mb-[50px] max-[768px]:mb-[35px]">
              <p className="contact-info-label text-xs tracking-[2px] uppercase text-[--gray-medium] mb-[15px] max-[480px]:text-[11px]">
                Business Hours
              </p>
              <p className="contact-info-value text-lg font-light leading-[1.6] text-white transition-all duration-300 ease-in-out max-[768px]:text-base max-[480px]:text-[15px]">
                Monday - Friday<br />
                10:00 AM - 7:00 PM KST
              </p>
            </div>
            
            <div className="social-links mt-[60px] max-[768px]:mt-10">
              <p className="social-links-title text-xs tracking-[2px] uppercase text-[--gray-medium] mb-5">
                Follow Us
              </p>
              <div className="social-links-list flex gap-[30px] flex-wrap max-[768px]:gap-5">
                <a 
                  href="https://instagram.com/redux.official" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link text-sm text-white no-underline tracking-[1px] transition-all duration-300 ease-in-out relative py-[5px] px-0 before:content-[''] before:absolute before:bottom-[-5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width] before:duration-300 before:ease-in-out hover:before:w-full max-[480px]:text-[13px]"
                >
                  Instagram
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link text-sm text-white no-underline tracking-[1px] transition-all duration-300 ease-in-out relative py-[5px] px-0 before:content-[''] before:absolute before:bottom-[-5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width] before:duration-300 before:ease-in-out hover:before:w-full max-[480px]:text-[13px]"
                >
                  YouTube
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link text-sm text-white no-underline tracking-[1px] transition-all duration-300 ease-in-out relative py-[5px] px-0 before:content-[''] before:absolute before:bottom-[-5px] before:left-0 before:w-0 before:h-[1px] before:bg-white before:transition-[width] before:duration-300 before:ease-in-out hover:before:w-full max-[480px]:text-[13px]"
                >
                  Behance
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form Section - HTML 버전과 완전 동일 */}
          <div className="contact-form-section bg-white/[0.02] py-[60px] px-[60px] border border-white/10 relative overflow-hidden max-[1024px]:p-10 max-[768px]:py-[30px] max-[768px]:px-5 max-[768px]:mt-5">
            <form className="contact-form relative z-[1]" onSubmit={handleSubmit}>
              <h3 className="form-title text-2xl font-light tracking-[2px] text-white mb-10 max-[768px]:text-xl max-[768px]:mb-[30px] max-[480px]:text-lg">
                Send us a message
              </h3>
              
              <div className="form-group relative mb-10 max-[768px]:mb-[30px]">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full py-[15px] px-0 border-none border-b border-white/20 bg-transparent text-white font-inherit text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-b-white appearance-none max-[768px]:text-base max-[768px]:py-3"
                />
                <label 
                  htmlFor="name"
                  className={`absolute top-[15px] left-0 text-sm text-white/50 pointer-events-none transition-all duration-300 ease-in-out tracking-[1px] ${
                    formData.name ? 'top-[-10px] text-xs text-white tracking-[2px]' : ''
                  } max-[768px]:text-base max-[768px]:py-3`}
                >
                  Your Name
                </label>
              </div>
              
              <div className="form-group relative mb-10 max-[768px]:mb-[30px]">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full py-[15px] px-0 border-none border-b border-white/20 bg-transparent text-white font-inherit text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-b-white appearance-none max-[768px]:text-base max-[768px]:py-3"
                />
                <label 
                  htmlFor="email"
                  className={`absolute top-[15px] left-0 text-sm text-white/50 pointer-events-none transition-all duration-300 ease-in-out tracking-[1px] ${
                    formData.email ? 'top-[-10px] text-xs text-white tracking-[2px]' : ''
                  } max-[768px]:text-base max-[768px]:py-3`}
                >
                  Email Address
                </label>
              </div>
              
              <div className="form-group relative mb-10 max-[768px]:mb-[30px]">
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full py-[15px] px-0 border-none border-b border-white/20 bg-transparent text-white font-inherit text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-b-white appearance-none max-[768px]:text-base max-[768px]:py-3"
                />
                <label 
                  htmlFor="subject"
                  className={`absolute top-[15px] left-0 text-sm text-white/50 pointer-events-none transition-all duration-300 ease-in-out tracking-[1px] ${
                    formData.subject ? 'top-[-10px] text-xs text-white tracking-[2px]' : ''
                  } max-[768px]:text-base max-[768px]:py-3`}
                >
                  Subject
                </label>
              </div>
              
              <div className="form-group relative mb-10 max-[768px]:mb-[30px]">
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full py-[15px] px-0 border-none border-b border-white/20 bg-transparent text-white font-inherit text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-b-white appearance-none resize-y min-h-[120px] max-[768px]:text-base max-[768px]:py-3"
                ></textarea>
                <label 
                  htmlFor="message"
                  className={`absolute top-[15px] left-0 text-sm text-white/50 pointer-events-none transition-all duration-300 ease-in-out tracking-[1px] ${
                    formData.message ? 'top-[-10px] text-xs text-white tracking-[2px]' : ''
                  } max-[768px]:text-base max-[768px]:py-3`}
                >
                  Your Message
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="submit-btn bg-transparent text-white border-2 border-white py-[18px] px-[60px] text-sm tracking-[2px] uppercase mt-10 relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer w-full hover:text-black before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-white before:transition-[left] before:duration-300 before:ease-in-out before:z-[-1] hover:before:left-0 active:transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed max-[768px]:py-[15px] max-[768px]:px-10 max-[768px]:text-xs"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              <p className={`form-message mt-5 text-xs text-[--gray-medium] text-center transition-opacity duration-300 ease-in-out ${
                showMessage ? 'opacity-100' : 'opacity-0'
              }`}>
                Thank you! Your message has been sent.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section - HTML 버전과 완전 동일 */}
      <section className="map-section h-[500px] bg-[--gray-dark] relative overflow-hidden max-[768px]:h-[300px]">
        <div className="map-placeholder w-full h-full flex items-center justify-center bg-[linear-gradient(135deg,#1a1a1a_0%,#2a2a2a_100%)] text-[--gray-medium] text-lg tracking-[2px] max-[768px]:text-base">
          Seoul, South Korea
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10 max-[768px]:py-10 max-[768px]:px-5">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        :root {
          --primary-black: #000;
          --primary-white: #fff;
          --gray-light: #f5f5f5;
          --gray-medium: #999;
          --gray-dark: #333;
        }
        
        .contact-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%);
          animation: rotate 30s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes mobileMenuFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .contact-form-section::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .contact-form-section:hover::before {
          transform: translateX(100%);
        }
        
        /* Input focus styles */
        .form-group input:focus ~ label,
        .form-group input:valid ~ label,
        .form-group textarea:focus ~ label,
        .form-group textarea:valid ~ label {
          top: -10px;
          font-size: 12px;
          color: white;
          letter-spacing: 2px;
        }
        
        /* Mobile Menu Animations */
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
        
        /* Scrolled navigation state */
        .scrolled {
          padding: 15px 40px;
          background: rgba(0, 0, 0, 0.98);
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
          .contact-hero-title {
            font-size: 32px !important;
            letter-spacing: 0.1em !important;
          }
          
          .contact-hero-subtitle {
            font-size: 14px;
            letter-spacing: 1px;
          }
          
          .mobile-menu-content {
            gap: 20px;
          }
          
          .mobile-menu-item {
            font-size: 18px;
          }
          
          .mobile-submenu-item {
            font-size: 14px;
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