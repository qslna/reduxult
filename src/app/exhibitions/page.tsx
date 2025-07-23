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
    
    // HTML 버전과 동일한 전시 아이템 애니메이션
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.exhibition-item').forEach(item => {
      observer.observe(item);
    });

    // 부드러운 앵커 링크 스크롤
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href') || '');
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

  // 전시 데이터 - HTML 버전과 완전 동일
  const exhibitions = [
    {
      id: 'cine-mode',
      number: '01',
      date: '2025.03.03 - 2025.03.08',
      title: 'CINE MODE',
      description: `REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
        영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
        6인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 
        시각적 서사를 경험할 수 있습니다.`,
      details: [
        'Location: Seoul, South Korea',
        'Type: Fashion Film Exhibition',
        'Participants: 6 Designers',
        'Curator: REDUX Collective'
      ],
      image: '/images/exhibition-cinemode.jpg',
      ctaText: 'View Exhibition',
      ctaLink: '/about/fashion-film'
    },
    {
      id: 'the-room',
      number: '02',
      date: '2025.12 - 2026.01 (Upcoming)',
      title: 'THE ROOM OF [ ]',
      description: `패션 필름, 텍스타일 아트, 인터랙션 디자인, 공간 인스톨레이션 등 
        다양한 매체를 통해 각 디자이너의 서로 다른 컨셉으로 전시를 풀어냅니다.
        빈 공간 [ ] 안에 각자의 이야기를 채워나가는 실험적인 전시입니다.`,
      details: [
        'Location: To be announced',
        'Type: Multimedia Installation',
        'Duration: 1 Month',
        'Special: Interactive Experience'
      ],
      image: '/images/exhibition-theroom.jpg',
      ctaText: 'Coming Soon',
      ctaLink: '#',
      isComingSoon: true
    }
  ];

  const handleExhibitionClick = (exhibition: typeof exhibitions[0]) => {
    if (exhibition.isComingSoon) {
      alert('Coming Soon');
      return;
    }
    router.push(exhibition.ctaLink);
  };

  return (
    <>
      {/* Navigation - HTML 버전과 완전 동일한 화이트 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-white/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-black/10 scrolled:py-[15px] scrolled:shadow-[0_2px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div 
            className="logo font-bold text-2xl tracking-[2px] text-black transition-all duration-300 ease-in-out cursor-pointer hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Exhibition Hero - HTML 버전과 완전 동일 */}
      <section className="exhibition-hero mt-[80px] py-[100px] px-10 bg-[--gray-light] text-center relative overflow-hidden">
        <div className="exhibition-hero-content relative z-[1]">
          <h1 
            className="exhibition-hero-title font-light text-black mb-5 opacity-0 transform translate-y-[30px] animate-[fadeInUp_1s_ease_forwards] tracking-[0.2em]"
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
        <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-[1px] bg-[--gray-light] transform -translate-x-1/2"></div>
        
        {exhibitions.map((exhibition, index) => (
          <div 
            key={exhibition.id}
            id={exhibition.id}
            className="exhibition-item relative mb-0"
          >        
            <div className={`exhibition-content grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center ${
              index % 2 === 1 ? '[direction:rtl]' : ''
            }`}>
              <div className={`exhibition-visual relative h-screen overflow-hidden bg-[--gray-dark] ${
                index % 2 === 1 ? '[direction:ltr]' : ''
              }`}>
                <img 
                  src={exhibition.image}
                  alt={exhibition.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out hover:transform hover:scale-105"
                />
              </div>
              <div className={`exhibition-info flex flex-col justify-center py-20 px-20 bg-white relative ${
                index % 2 === 1 ? '[direction:ltr] bg-[--gray-light]' : ''
              } max-[1024px]:px-[60px] max-[768px]:px-5 max-[768px]:py-10`}>
                <span className="exhibition-number absolute -top-[60px] right-0 text-[200px] font-thin text-black/5 z-0 max-[768px]:text-[100px] max-[768px]:-top-[30px]">
                  {exhibition.number}
                </span>
                <p className="exhibition-date text-sm tracking-[2px] text-[--gray-medium] mb-5 uppercase">
                  {exhibition.date}
                </p>
                <h2 
                  className="exhibition-title font-light text-black mb-[30px] leading-[1.2] tracking-[3px]"
                  style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
                >
                  {exhibition.title}
                </h2>
                <p className="exhibition-description text-base leading-[1.8] text-[--gray-dark] mb-10 max-w-[500px]">
                  {exhibition.description}
                </p>
                <ul className="exhibition-details list-none mb-[60px]">
                  {exhibition.details.map((detail, detailIndex) => (
                    <li 
                      key={detailIndex}
                      className="text-sm text-[--gray-dark] mb-[15px] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[--gray-medium]"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
                <button 
                  className="exhibition-cta inline-block py-[15px] px-10 border-2 border-black text-black text-sm tracking-[2px] uppercase transition-all duration-300 ease-in-out relative overflow-hidden hover:text-white before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-black before:transition-[left] before:duration-300 before:ease-in-out before:z-[-1] hover:before:left-0"
                  onClick={() => handleExhibitionClick(exhibition)}
                >
                  {exhibition.ctaText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Coming Soon Section - HTML 버전과 완전 동일 */}
      <section className="coming-soon py-[120px] px-10 text-center bg-black text-white relative overflow-hidden">
        <div className="coming-soon-content relative z-[1] max-w-[800px] mx-auto">
          <h2 className="coming-soon-title text-5xl font-light tracking-[4px] mb-[30px] max-[768px]:text-3xl">
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
        :root {
          --primary-black: #000;
          --primary-white: #fff;
          --gray-light: #f5f5f5;
          --gray-medium: #999;
          --gray-dark: #333;
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
        
        /* Scrolled navigation state */
        .scrolled {
          padding: 15px 40px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .exhibition-content {
            grid-template-columns: 1fr;
          }
          
          .exhibition-visual {
            height: 60vh;
          }
          
          .exhibition-info {
            padding: 60px;
          }
          
          .exhibition-item:nth-child(even) .exhibition-content {
            direction: ltr;
          }
        }
        
        @media (max-width: 768px) {
          .exhibition-hero {
            padding: 80px 20px;
          }
          
          .timeline-line {
            display: none;
          }
          
          .exhibition-visual {
            height: 50vh;
          }
          
          .exhibition-info {
            padding: 40px 20px;
          }
          
          .exhibition-title {
            font-size: clamp(28px, 5vw, 40px);
          }
          
          .exhibition-number {
            font-size: 100px;
            top: -30px;
          }
          
          .coming-soon {
            padding: 80px 20px;
          }
          
          .coming-soon::before {
            font-size: 80px;
          }
        }
      `}</style>
    </>
  );
}