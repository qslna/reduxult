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
              
              <div className={`form-message mt-5 text-center transition-all duration-300 ease-in-out ${
                submitStatus.show ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
              }`}>
                <p className={`text-sm font-medium tracking-wider ${
                  submitStatus.type === 'success' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {submitStatus.message}
                </p>
              </div>
            </form>
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

    </>
  );
}

