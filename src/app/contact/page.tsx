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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // HTML 버전과 동일한 내비게이션 함수들
  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
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
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-white/10 scrolled:py-[15px] scrolled:bg-black/98"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div 
            className="logo font-bold text-2xl tracking-[2px] text-white transition-all duration-300 ease-in-out cursor-pointer hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Contact Hero - HTML 버전과 완전 동일 */}
      <section className="contact-hero mt-[80px] h-[60vh] min-h-[400px] flex items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_100%)]">
        <div className="contact-hero-content text-center z-[1]">
          <h1 
            className="contact-hero-title font-light text-white mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards] tracking-[0.2em]"
            style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
          >
            GET IN TOUCH
          </h1>
          <p className="contact-hero-subtitle text-lg text-[--gray-medium] tracking-[2px] opacity-0 animate-[fadeInUp_1s_ease_forwards] [animation-delay:0.2s]">
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
        
        /* Scrolled navigation state */
        .scrolled {
          padding: 15px 40px;
          background: rgba(0, 0, 0, 0.98);
        }
      `}</style>
    </>
  );
}