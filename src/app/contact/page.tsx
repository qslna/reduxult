'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initGSAPAnimations, animations, isMobile } from '@/lib/gsap';

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
  const [submitStatus, setSubmitStatus] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

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
    const mobileDevice = isMobile();
    
    if (mobileDevice) {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          setTimeout(() => {
            window.scrollTo(0, (input as HTMLElement).offsetTop - 100);
          }, 300);
        });
      });
    }

    // HTML 버전과 동일한 GSAP 애니메이션
    initGSAPAnimations(() => {
      animations.contactInfoAnimation('.contact-info-group', '.contact-info-section');
      animations.contactFormAnimation('.contact-form-section');
    });
    
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

  // 폼 데이터 처리 및 실시간 검증
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 상태가 있다면 사용자가 입력을 시작할 때 클리어
    if (submitStatus.show && submitStatus.type === 'error') {
      setSubmitStatus({ show: false, type: 'success', message: '' });
    }
  };

  // 폼 검증 함수
  const validateForm = () => {
    const { name, email, subject, message } = formData;
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return 'All fields are required.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    
    if (message.trim().length < 10) {
      return 'Message should be at least 10 characters long.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 클라이언트 사이드 검증
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({
        show: true,
        type: 'error',
        message: validationError
      });
      
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, show: false }));
      }, 5000);
      
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ show: false, type: 'success', message: '' });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          show: true,
          type: 'success',
          message: data.message || 'Thank you! Your message has been sent successfully.'
        });
        
        // 폼 초기화
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({
          show: true,
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        show: true,
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
      
      // 메시지를 5초 후 숨기기
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  return (
    <>

      {/* Contact Hero - 비대칭 아방가르드 디자인 */}
      <section className="contact-hero relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* 비대칭 배경 요소들 */}
        <div className="absolute inset-0">
          <div className="absolute top-[12%] left-[8%] w-[250px] h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent transform rotate-[35deg] animate-[slideInLeft_2s_ease_forwards]"></div>
          <div className="absolute bottom-[25%] right-[10%] w-[180px] h-[180px] border border-white/5 rounded-full animate-[float_10s_infinite_ease-in-out]"></div>
          <div className="absolute top-[45%] right-[15%] w-[2px] h-[120px] bg-gradient-to-b from-white/20 to-transparent animate-[dropIn_2s_ease_forwards] [animation-delay:0.8s]"></div>
          <div className="absolute bottom-[15%] left-[12%] w-[80px] h-[80px] border border-white/8 transform rotate-45 animate-[rotateIn_3s_ease_forwards]"></div>
          
          {/* 노이즈 패턴 */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)'
          }}></div>
        </div>
        
        <div className="contact-hero-content relative z-10 text-center px-10 max-w-6xl mx-auto">
          {/* 비대칭 데코레이티브 라인 */}
          <div className="absolute -top-[80px] left-1/2 transform -translate-x-1/2 w-[1px] h-[60px] bg-gradient-to-b from-transparent to-white/30 animate-[dropIn_1.5s_ease_forwards] max-[768px]:hidden"></div>
          
          {/* 메인 타이틀 */}
          <h1 className="contact-hero-title font-['Playfair_Display'] font-bold text-white mb-8 leading-[0.85] opacity-0 animate-[glitchIn_2.5s_ease_forwards]" 
              style={{ 
                fontSize: 'clamp(50px, 12vw, 140px)', 
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(255,255,255,0.1), 4px 4px 0px rgba(255,255,255,0.03)'
              }}>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.3s]" style={{'--i': 1} as React.CSSProperties}>C</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.4s]" style={{'--i': 2} as React.CSSProperties}>O</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.5s]" style={{'--i': 3} as React.CSSProperties}>N</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.6s]" style={{'--i': 4} as React.CSSProperties}>N</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.7s]" style={{'--i': 5} as React.CSSProperties}>E</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.8s]" style={{'--i': 6} as React.CSSProperties}>C</span>
            <span className="inline-block animate-[letterSlide_0.8s_ease_forwards] [animation-delay:0.9s]" style={{'--i': 7} as React.CSSProperties}>T</span>
          </h1>
          
          {/* 비대칭 서브타이틀 */}
          <div className="relative mb-12">
            <div className="absolute -left-[200px] top-1/2 transform -translate-y-1/2 w-[120px] h-[1px] bg-gradient-to-r from-transparent to-white/30 opacity-0 animate-[slideInLeft_1s_ease_forwards] [animation-delay:1.8s] max-[768px]:hidden"></div>
            <p className="contact-hero-subtitle font-['Inter'] text-white/80 tracking-[0.4em] uppercase opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:1.5s]" 
               style={{
                 fontSize: 'clamp(14px, 2vw, 18px)',
                 fontWeight: 300
               }}>
              Let's Create Something Extraordinary
            </p>
            <div className="absolute -right-[200px] top-1/2 transform -translate-y-1/2 w-[120px] h-[1px] bg-gradient-to-l from-transparent to-white/30 opacity-0 animate-[slideInRight_1s_ease_forwards] [animation-delay:1.8s] max-[768px]:hidden"></div>
          </div>
          
          {/* 인터랙티브 CTA */}
          <div className="opacity-0 animate-[bounceIn_1s_ease_forwards] [animation-delay:2s]">
            <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4 transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] hover:border-white/30">
              <div className="w-[8px] h-[8px] bg-white/60 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-['Inter'] text-sm tracking-[2px] uppercase font-light">
                Ready to Connect
              </span>
              <svg className="w-4 h-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          
          {/* 비대칭 네비게이션 하인트 */}
          <div className="absolute -bottom-[60px] left-1/2 transform -translate-x-1/2 opacity-0 animate-[bounceIn_1s_ease_forwards] [animation-delay:2.5s] max-[768px]:hidden">
            <div className="w-[1px] h-[40px] bg-gradient-to-b from-white/40 to-transparent mx-auto mb-3"></div>
            <div className="text-white/50 text-xs tracking-[2px] uppercase font-light">Scroll Down</div>
          </div>
        </div>
      </section>

      {/* Contact Main - 비대칭 레이아웃 재설계 */}
      <section className="contact-main relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* 배경 데코레이션 */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] right-[10%] w-[150px] h-[1px] bg-gradient-to-r from-transparent to-white/10 transform -rotate-12"></div>
          <div className="absolute bottom-[30%] left-[5%] w-[100px] h-[100px] border border-white/5 transform rotate-45"></div>
        </div>
        
        <div className="contact-container max-w-7xl mx-auto px-10 relative z-10">
          {/* 비대칭 그리드 레이아웃 */}
          <div className="grid grid-cols-12 gap-8 items-start max-[1024px]:grid-cols-1 max-[1024px]:gap-16">
            
            {/* Contact Info Section - 좌측 4열 */}
            <div className="contact-info-section col-span-4 max-[1024px]:col-span-1">
              {/* 섹션 헤더 */}
              <div className="relative mb-16">
                <div className="absolute -left-4 top-0 w-[2px] h-[80px] bg-gradient-to-b from-white/30 to-transparent"></div>
                <h2 className="contact-info-title font-['Playfair_Display'] font-bold text-white mb-4 leading-[0.9]" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
                  Let's<br />
                  <span className="text-white/70 font-light">Connect</span>
                </h2>
                <p className="font-['Inter'] text-white/60 text-sm leading-[1.6]">
                  우리와 함께 만들어갈<br />
                  새로운 프로젝트를 이야기해보세요
                </p>
              </div>
              
              {/* 연락처 정보 카드들 */}
              <div className="space-y-8">
                {/* 이메일 */}
                <div className="contact-info-card group relative bg-white/[0.02] border border-white/10 rounded-lg p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/20">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26c.3.16.67.16.97 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs tracking-[2px] uppercase text-white/50 mb-2 font-medium">Email</p>
                      <a 
                        href="mailto:reduxsix@gmail.com"
                        className="text-white font-['Inter'] font-medium transition-colors duration-300 hover:text-white/80 text-sm"
                      >
                        reduxsix@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* 전화번호 */}
                <div className="contact-info-card group relative bg-white/[0.02] border border-white/10 rounded-lg p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/20">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs tracking-[2px] uppercase text-white/50 mb-2 font-medium">Phone</p>
                      <a 
                        href="tel:+821076211928"
                        className="text-white font-['Inter'] font-medium transition-colors duration-300 hover:text-white/80 text-sm"
                      >
                        +82 10-7621-1928
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* 위치 */}
                <div className="contact-info-card group relative bg-white/[0.02] border border-white/10 rounded-lg p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/20">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs tracking-[2px] uppercase text-white/50 mb-2 font-medium">Location</p>
                      <p className="text-white font-['Inter'] font-medium text-sm">
                        Seoul, South Korea
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 운영시간 */}
                <div className="contact-info-card group relative bg-white/[0.02] border border-white/10 rounded-lg p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/20">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs tracking-[2px] uppercase text-white/50 mb-2 font-medium">Business Hours</p>
                      <p className="text-white font-['Inter'] font-medium text-sm leading-[1.6]">
                        Monday - Friday<br />
                        10:00 AM - 7:00 PM KST
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 소셜 링크 */}
              <div className="social-links mt-16">
                <p className="text-xs tracking-[2px] uppercase text-white/50 mb-6 font-medium">
                  Follow Our Journey
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com/redux.official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:border-white/40"
                  >
                    <svg className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:border-white/40"
                  >
                    <svg className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:border-white/40"
                  >
                    <svg className="w-5 h-5 text-white/80 transition-colors duration-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 7h-7v-2c0-2.761-2.238-5-5-5s-5 2.239-5 5v2H0v15h22V7zM7 5c0-1.654 1.346-3 3-3s3 1.346 3 3v2H7V5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          
            {/* Contact Form Section - 오른쪽 8열 */}
            <div className="contact-form-section col-span-8 max-[1024px]:col-span-1">
              <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-12 overflow-hidden max-[1024px]:p-8 max-[768px]:p-6">
                {/* 배경 데코레이션 */}
                <div className="absolute inset-0">
                  <div className="absolute top-8 right-8 w-[100px] h-[1px] bg-gradient-to-r from-white/10 to-transparent transform rotate-12"></div>
                  <div className="absolute bottom-12 left-8 w-[60px] h-[60px] border border-white/5 rounded-full"></div>
                </div>
                
                <form className="contact-form relative z-10" onSubmit={handleSubmit}>
                  {/* 폼 헤더 */}
                  <div className="form-header mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-[40px] h-[1px] bg-gradient-to-r from-white/40 to-transparent"></div>
                      <div className="text-white/60 font-['JetBrains_Mono'] text-xs tracking-[2px] uppercase">Send Message</div>
                    </div>
                    <h3 className="form-title font-['Playfair_Display'] font-bold text-white mb-4 leading-[0.9]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
                      Start a<br />
                      <span className="text-white/70 font-light">Conversation</span>
                    </h3>
                    <p className="font-['Inter'] text-white/60 text-sm leading-[1.6]">
                      당신의 아이디어를 들려주세요. 함께 만들어갈 이야기가 기다리고 있습니다.
                    </p>
                  </div>
                  
                  {/* 폼 필드들 - 더 현대적인 디자인 */}
                  <div className="form-fields space-y-8">
                    {/* Name Field */}
                    <div className="form-group relative">
                      <div className="relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/10 transition-all duration-300 hover:border-white/20 focus-within:border-white/40 focus-within:bg-white/[0.05]">
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full py-4 px-4 bg-transparent text-white font-['Inter'] text-sm transition-all duration-300 focus:outline-none appearance-none peer"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="name"
                          className="absolute left-4 top-4 text-sm text-white/50 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white/80 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/80"
                        >
                          Full Name
                        </label>
                        {/* Focus line */}
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 peer-focus:w-full"></div>
                      </div>
                    </div>
                    
                    {/* Email Field */}
                    <div className="form-group relative">
                      <div className="relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/10 transition-all duration-300 hover:border-white/20 focus-within:border-white/40 focus-within:bg-white/[0.05]">
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full py-4 px-4 bg-transparent text-white font-['Inter'] text-sm transition-all duration-300 focus:outline-none appearance-none peer"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="email"
                          className="absolute left-4 top-4 text-sm text-white/50 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white/80 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/80"
                        >
                          Email Address
                        </label>
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 peer-focus:w-full"></div>
                      </div>
                    </div>
                    
                    {/* Subject Field */}
                    <div className="form-group relative">
                      <div className="relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/10 transition-all duration-300 hover:border-white/20 focus-within:border-white/40 focus-within:bg-white/[0.05]">
                        <input 
                          type="text" 
                          id="subject" 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full py-4 px-4 bg-transparent text-white font-['Inter'] text-sm transition-all duration-300 focus:outline-none appearance-none peer"
                          placeholder=" "
                        />
                        <label 
                          htmlFor="subject"
                          className="absolute left-4 top-4 text-sm text-white/50 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white/80 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/80"
                        >
                          Project Subject
                        </label>
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 peer-focus:w-full"></div>
                      </div>
                    </div>
                    
                    {/* Message Field */}
                    <div className="form-group relative">
                      <div className="relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/10 transition-all duration-300 hover:border-white/20 focus-within:border-white/40 focus-within:bg-white/[0.05]">
                        <textarea 
                          id="message" 
                          name="message" 
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="w-full py-4 px-4 bg-transparent text-white font-['Inter'] text-sm transition-all duration-300 focus:outline-none appearance-none resize-none peer"
                          placeholder=" "
                        ></textarea>
                        <label 
                          htmlFor="message"
                          className="absolute left-4 top-4 text-sm text-white/50 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-white/80 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/80"
                        >
                          Tell us about your project
                        </label>
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-white/60 to-white/40 transition-all duration-300 peer-focus:w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button - Enhanced */}
                  <div className="form-submit mt-12">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-btn group relative w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 text-white py-6 px-8 rounded-lg font-['Inter'] text-sm tracking-[1px] uppercase font-medium transition-all duration-500 hover:from-white/20 hover:to-white/10 hover:border-white/40 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {/* 배경 애니메이션 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                  
                  {/* Status Message - Enhanced */}
                  <div className={`form-message mt-6 transition-all duration-500 ${
                    submitStatus.show ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                  }`}>
                    <div className={`p-4 rounded-lg border text-center ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        {submitStatus.type === 'success' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        )}
                        <p className="font-['Inter'] text-sm font-medium">
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Enhanced with Professional Design */}
      <section className="map-section h-[500px] bg-[--gray-dark] relative overflow-hidden max-[768px]:h-[300px]">
        <div className="map-container w-full h-full relative bg-[linear-gradient(135deg,#1a1a1a_0%,#2a2a2a_100%)]">
          {/* Map Grid Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Location Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="location-pin relative animate-pulse">
              {/* Pin Icon */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              {/* Pin Shadow */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
              {/* Ripple Effect */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          
          {/* Location Info */}
          <div className="absolute bottom-8 left-8 max-[768px]:bottom-4 max-[768px]:left-4">
            <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-w-xs">
              <h3 className="text-white font-medium text-lg mb-2">REDUX Studio</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Seoul, South Korea<br />
                Creative Fashion Collective
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-white/20 text-xs font-mono tracking-wider">
            37.5665° N, 126.9780° E
          </div>
          
          {/* Click to View Message */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <p className="text-white/80 text-sm font-light tracking-wider">
                Seoul, South Korea
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10 max-[768px]:py-10 max-[768px]:px-5">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* Contact Page Animations */}
      <style jsx>{`
        /* Hero Animations */
        @keyframes glitchIn {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9);
            filter: blur(10px);
          }
          50% { 
            opacity: 0.8; 
            transform: translateY(-10px) scale(1.05);
            filter: blur(2px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes letterSlide {
          0% { 
            opacity: 0; 
            transform: translateX(-30px) rotate(-5deg);
          }
          50% { 
            opacity: 0.7; 
            transform: translateX(5px) rotate(2deg);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) rotate(0deg);
          }
        }
        
        @keyframes slideInLeft {
          0% { 
            opacity: 0; 
            transform: translateX(-100px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          0% { 
            opacity: 0; 
            transform: translateX(100px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        @keyframes dropIn {
          0% { 
            opacity: 0; 
            transform: translateY(-50px) scale(0.5);
          }
          60% { 
            opacity: 0.8; 
            transform: translateY(10px) scale(1.1);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes rotateIn {
          0% { 
            opacity: 0; 
            transform: rotate(-180deg) scale(0);
          }
          100% { 
            opacity: 1; 
            transform: rotate(0deg) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.8);
          }
          50% { 
            opacity: 0.8; 
            transform: translateY(-10px) scale(1.05);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          33% { 
            transform: translateY(-10px) rotate(1deg);
          }
          66% { 
            transform: translateY(5px) rotate(-1deg);
          }
        }
        
        /* Contact Form Animations */
        .contact-info-card {
          animation: fadeInLeft 0.8s ease forwards;
        }
        
        .contact-info-card:nth-child(1) { animation-delay: 0.2s; }
        .contact-info-card:nth-child(2) { animation-delay: 0.4s; }
        .contact-info-card:nth-child(3) { animation-delay: 0.6s; }
        .contact-info-card:nth-child(4) { animation-delay: 0.8s; }
        
        @keyframes fadeInLeft {
          0% { 
            opacity: 0; 
            transform: translateX(-30px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        .form-group {
          animation: fadeInRight 0.8s ease forwards;
          opacity: 0;
        }
        
        .form-group:nth-child(1) { animation-delay: 0.3s; }
        .form-group:nth-child(2) { animation-delay: 0.5s; }
        .form-group:nth-child(3) { animation-delay: 0.7s; }
        .form-group:nth-child(4) { animation-delay: 0.9s; }
        
        @keyframes fadeInRight {
          0% { 
            opacity: 0; 
            transform: translateX(30px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        .submit-btn {
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: 1.2s;
          opacity: 0;
        }
        
        /* Map Animation */
        .location-pin {
          animation: pinDrop 1s ease-out forwards;
        }
        
        @keyframes pinDrop {
          0% { 
            opacity: 0; 
            transform: translateY(-100px) scale(0.5);
          }
          60% { 
            opacity: 1; 
            transform: translateY(10px) scale(1.2);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        /* Responsive Animations */
        @media (max-width: 768px) {
          .contact-hero-title {
            font-size: clamp(36px, 12vw, 64px) !important;
          }
          
          .contact-hero-subtitle {
            font-size: 14px !important;
            letter-spacing: 0.2em !important;
          }
          
          .contact-info-section {
            margin-bottom: 2rem;
          }
          
          .form-fields {
            gap: 1.5rem !important;
          }
          
          .form-group input,
          .form-group textarea {
            padding: 1rem !important;
          }
          
          .submit-btn {
            padding: 1.25rem 2rem !important;
          }
        }
        
        /* Enhanced hover effects */
        .contact-info-card:hover {
          animation: cardLift 0.3s ease forwards;
        }
        
        @keyframes cardLift {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-5px) scale(1.02); }
        }
        
        /* Focus states for accessibility */
        .form-group input:focus,
        .form-group textarea:focus {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }
        
        /* Loading animation enhancement */
        .submit-btn:disabled {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
}

