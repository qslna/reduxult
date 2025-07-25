'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCMSSlot } from '@/hooks/useCMSSlot';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import MediaSlot from '@/components/cms/MediaSlot';

// HTML redux6 about-fashion-film.html과 완전 동일한 Fashion Film 페이지 구현
export default function FashionFilmPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState('');
  
  // CMS integration for fashion films
  const { isAuthenticated } = useSimpleAuth();
  
  // Individual CMS slots for each designer's fashion film content
  const { slot: kimBominSlot, currentFiles: kimBominFiles, updateFiles: updateKimBominFiles } = useCMSSlot('about-fashionfilm-kimbomin-thumbnail');
  const { slot: parkParangSlot, currentFiles: parkParangFiles, updateFiles: updateParkParangFiles } = useCMSSlot('about-fashionfilm-parkparang-thumbnail');
  const { slot: leeTaehyeonSlot, currentFiles: leeTaehyeonFiles, updateFiles: updateLeeTaehyeonFiles } = useCMSSlot('about-fashionfilm-leetaehyeon-thumbnail');
  const { slot: choiEunsolSlot, currentFiles: choiEunsolFiles, updateFiles: updateChoiEunsolFiles } = useCMSSlot('about-fashionfilm-choieunsol-thumbnail');
  const { slot: hwangJinsuSlot, currentFiles: hwangJinsuFiles, updateFiles: updateHwangJinsuFiles } = useCMSSlot('about-fashionfilm-hwangjinsu-thumbnail');
  const { slot: kimGyeongsuSlot, currentFiles: kimGyeongsuFiles, updateFiles: updateKimGyeongsuFiles } = useCMSSlot('about-fashionfilm-kimgyeongsu-thumbnail');
  
  // Video slots for Google Drive links
  const { slot: kimBominVideoSlot, currentFiles: kimBominVideoFiles, updateFiles: updateKimBominVideoFiles } = useCMSSlot('designer-kimbomin-film');
  const { slot: parkParangVideoSlot, currentFiles: parkParangVideoFiles, updateFiles: updateParkParangVideoFiles } = useCMSSlot('designer-parkparang-film');
  const { slot: leeTaehyeonVideoSlot, currentFiles: leeTaehyeonVideoFiles, updateFiles: updateLeeTaehyeonVideoFiles } = useCMSSlot('designer-leetaehyeon-film');
  const { slot: choiEunsolVideoSlot, currentFiles: choiEunsolVideoFiles, updateFiles: updateChoiEunsolVideoFiles } = useCMSSlot('designer-choieunsol-film');
  const { slot: hwangJinsuVideoSlot, currentFiles: hwangJinsuVideoFiles, updateFiles: updateHwangJinsuVideoFiles } = useCMSSlot('designer-hwangjinsu-film');
  const { slot: kimGyeongsuVideoSlot, currentFiles: kimGyeongsuVideoFiles, updateFiles: updateKimGyeongsuVideoFiles } = useCMSSlot('designer-kimgyeongsu-film');

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

    // HTML 버전과 동일한 필름 아이템 reveal 애니메이션
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
    
    document.querySelectorAll('.film-item').forEach(item => {
      observer.observe(item);
    });

    // ESC 키로 모달 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFilm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
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

  const openFilm = (designer: string) => {
    setCurrentFilm(designer);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFilm = () => {
    setIsModalOpen(false);
    setCurrentFilm('');
    document.body.style.overflow = 'auto';
  };

  // Dynamic films data from CMS - 각 디자이너별 개별 관리
  const films = [
    { 
      designer: 'KIM BOMIN', 
      title: 'CHASING VOWS', 
      id: 'kimbomin',
      thumbnail: kimBominFiles[0] || '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg',
      videoUrl: kimBominVideoFiles[0] ? `https://drive.google.com/file/d/${kimBominVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X/preview'
    },
    { 
      designer: 'PARK PARANG', 
      title: 'THE TIME BETWEEN', 
      id: 'parkparang',
      thumbnail: parkParangFiles[0] || '/images/profile/Park Parang.jpg',
      videoUrl: parkParangVideoFiles[0] ? `https://drive.google.com/file/d/${parkParangVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/15d901XRElkF5p7xiJYelIyblYFb-PtsD/preview'
    },
    { 
      designer: 'LEE TAEHYEON', 
      title: 'POLYHEDRON', 
      id: 'leetaehyeon',
      thumbnail: leeTaehyeonFiles[0] || '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg',
      videoUrl: leeTaehyeonVideoFiles[0] ? `https://drive.google.com/file/d/${leeTaehyeonVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/1fG2fchKvEG7i7Lo79K7250mgiVTse6ks/preview'
    },
    { 
      designer: 'CHOI EUNSOL', 
      title: 'SOUL SUCKER', 
      id: 'choieunsol',
      thumbnail: choiEunsolFiles[0] || '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
      videoUrl: choiEunsolVideoFiles[0] ? `https://drive.google.com/file/d/${choiEunsolVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3/preview'
    },
    { 
      designer: 'HWANG JINSU', 
      title: 'WHO AM I ?!', 
      id: 'hwangjinsu',
      thumbnail: hwangJinsuFiles[0] || '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg',
      videoUrl: hwangJinsuVideoFiles[0] ? `https://drive.google.com/file/d/${hwangJinsuVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d/preview'
    },
    { 
      designer: 'KIM GYEONGSU', 
      title: 'TO BE REVEALED', 
      id: 'kimgyeongsu',
      thumbnail: kimGyeongsuFiles[0] || '/images/designers/kimgyeongsu/Showcase/IMG_2544.jpg',
      videoUrl: kimGyeongsuVideoFiles[0] ? `https://drive.google.com/file/d/${kimGyeongsuVideoFiles[0]}/preview` : 'https://drive.google.com/file/d/1Hl594dd_MY714hZwmklTAPTc-pofe9bY/preview'
    }
  ];

  return (
    <>
      {/* Navigation - HTML 버전과 동일한 다크 테마 */}
      <nav 
        id="navbar"
        className="fixed top-0 left-0 w-full py-5 px-10 bg-black/95 backdrop-blur-[10px] z-[1000] transition-all duration-300 ease-in-out border-b border-white/10 scrolled:py-[15px] scrolled:px-10 scrolled:bg-black/98"
      >
        <div className="nav-container flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="nav-left flex items-center gap-10">
            <span 
              className="back-button text-xl cursor-pointer transition-all duration-300 ease-in-out text-white hover:transform hover:-translate-x-[5px]"
              onClick={goBack}
            >
              ←
            </span>
            <span className="page-title text-lg font-medium tracking-[2px] text-white max-[768px]:hidden">
              FASHION FILM
            </span>
          </div>
          <div 
            className="logo text-2xl font-bold tracking-[2px] cursor-pointer transition-opacity duration-300 ease-in-out text-white hover:opacity-70"
            onClick={goHome}
          >
            REDUX
          </div>
        </div>
      </nav>

      {/* Hero Section - 디자이너 스타일 강화 */}
      <section className="hero-section h-screen relative flex items-center justify-center bg-black overflow-hidden pt-[100px]">
        {/* 배경 노이즈 텍스처 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E")',
            zIndex: 1
          }}
        />
        
        {/* 비대칭 기하학적 요소들 */}
        <div 
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '200px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'rotate(-25deg)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '15%',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            transform: 'rotate(15deg)',
            zIndex: 2
          }}
        />
        
        <div className="hero-content text-center relative z-10">
          <h1 
            className="hero-title font-bold uppercase text-white text-center opacity-0 transform translate-y-[50px] animate-[heroFade_1.5s_ease_forwards] tracking-[0.2em] glitch-text"
            style={{ 
              fontSize: 'clamp(60px, 10vw, 160px)',
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              textShadow: '0 0 30px rgba(255,255,255,0.1)'
            }}
          >
            Fashion Film
          </h1>
          <div 
            className="hero-separator"
            style={{
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #fff, transparent)',
              margin: '30px auto',
              opacity: 0,
              animation: 'fadeInUp 1s ease forwards',
              animationDelay: '0.5s'
            }}
          />
          <p 
            className="hero-subtitle text-sm tracking-[4px] text-white opacity-0 uppercase"
            style={{
              animation: 'fadeInUp 1s ease forwards',
              animationDelay: '0.7s',
              fontWeight: 300,
              letterSpacing: '0.3em'
            }}
          >
            CINE MODE Exhibition Films
          </p>
        </div>
      </section>

      {/* Film Grid Section - HTML 버전과 완전 동일 */}
      <section className="film-grid-section py-[120px] px-10 bg-black">
        <div className="section-intro max-w-[800px] mx-auto mb-[120px] text-center">
          <h2 className="text-4xl font-light tracking-[3px] text-white mb-[30px]">
            CINE MODE
          </h2>
          <p className="text-base leading-[2] text-[--gray-medium]">
            REDUX의 'CINE MODE' 패션 필름 전시회는 단순한 스타일 전시를 넘어 
            영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.
          </p>
        </div>
        
        <div className="film-grid grid grid-cols-3 gap-[60px] max-w-[1400px] mx-auto max-[1024px]:grid-cols-2 max-[1024px]:gap-10 max-[768px]:grid-cols-1 max-[768px]:gap-[60px]">
          {films.map((film, index) => (
            <div 
              key={film.id}
              className="film-item group relative cursor-pointer opacity-0 transform translate-y-[50px] revealed:animate-[revealItem_0.8s_ease_forwards]"
              onClick={() => openFilm(film.id)}
              style={{
                filter: 'contrast(0.9) brightness(0.95)',
                transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
            >
              <div className="film-thumbnail relative pb-[133.33%] overflow-hidden rounded-lg border border-white/10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-black/20 before:z-[1] before:transition-opacity before:duration-500 before:ease-in-out group-hover:before:opacity-30">
                <img 
                  src={film.thumbnail}
                  alt={`${film.designer} - ${film.title}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    filter: 'grayscale(20%) contrast(1.1) brightness(0.9)',
                    transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                />
                <div className="play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-[10px] border-2 border-white/30 rounded-full flex items-center justify-center z-[2] transition-all duration-500 ease-out group-hover:scale-125 group-hover:bg-white/20 group-hover:border-white/50">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 fill-white ml-1 transition-all duration-300"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                
                {/* 글리치 효과 */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
                  style={{
                    background: 'linear-gradient(45deg, transparent 48%, rgba(255,0,0,0.03) 49%, rgba(255,0,0,0.03) 51%, transparent 52%, transparent 58%, rgba(0,255,255,0.03) 59%, rgba(0,255,255,0.03) 61%, transparent 62%)',
                    animation: 'glitchSlide 2s ease-in-out infinite'
                  }}
                />
              </div>
              <div className="film-info py-[30px]">
                <h3 className="film-designer text-xl font-light tracking-[2px] text-white mb-[10px]">
                  {film.designer}
                </h3>
                <p className="film-title text-sm tracking-[1px] text-[--gray-medium] uppercase">
                  {film.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Film Modal - HTML 버전과 완전 동일 */}
      <div 
        className={`film-modal fixed top-0 left-0 w-full h-screen bg-black/95 flex items-center justify-center z-[2000] transition-all duration-500 ease-in-out ${
          isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="modal-close absolute top-10 right-10 w-[60px] h-[60px] bg-white/10 border border-white/20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20 hover:transform hover:scale-110 max-[768px]:top-5 max-[768px]:right-5 max-[768px]:w-[50px] max-[768px]:h-[50px]"
          onClick={closeFilm}
        >
          <span className="text-[30px] text-white font-light">×</span>
        </div>
        <div className="modal-content w-[90%] max-w-[1200px] h-[80vh] relative">
          {currentFilm && (
            <iframe
              src={films.find(f => f.id === currentFilm)?.videoUrl || ''}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            />
          )}
          {!currentFilm && (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white text-2xl rounded-lg border border-white/10">
              <div className="text-center">
                <div className="mb-4 text-6xl opacity-20">▶</div>
                <p className="text-lg opacity-60">Loading Video...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CMS Admin Interface - 비대칭 왜곡 빈티지 트렌디 스타일 */}
      {isAuthenticated && (
        <section className="cms-admin-section py-[120px] px-10 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {/* 배경 장식 요소들 - 비대칭 */}
          <div 
            className="absolute top-[10%] left-[5%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
            style={{ transform: 'rotate(-15deg)' }}
          />
          <div 
            className="absolute bottom-[20%] right-[8%] w-[200px] h-[200px] border border-cyan-500/10 rounded-full"
            style={{ transform: 'rotate(25deg) scale(0.7)' }}
          />
          <div 
            className="absolute top-[60%] left-[15%] w-[100px] h-[100px] border-l border-t border-yellow-500/15"
            style={{ transform: 'rotate(-45deg)' }}
          />
          
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-[80px]">
              <h2 
                className="text-5xl font-light text-white mb-6 glitch-title"
                style={{ 
                  fontFamily: "'Inter', monospace",
                  letterSpacing: '0.3em',
                  textShadow: '2px 2px 0 rgba(255,0,0,0.1), -2px -2px 0 rgba(0,255,255,0.1)'
                }}
              >
                🎬 FILM MANAGEMENT
              </h2>
              <div 
                className="w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-4"
                style={{ transform: 'skew(-20deg)' }}
              />
              <p className="text-gray-400 text-sm tracking-[0.2em] uppercase">
                Instagram-Style CMS for Fashion Films
              </p>
            </div>

            {/* 각 디자이너별 CMS 슬롯들 - 비대칭 그리드 */}
            <div className="cms-grid space-y-12">
              {/* Kim Bomin */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-red-500/30 to-transparent"
                  style={{ transform: 'skew(5deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(0.5deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">KIM BOMIN</h3>
                    <p className="text-gray-400 text-sm mb-6">CHASING VOWS - 썸네일 관리</p>
                    {kimBominSlot && (
                      <MediaSlot
                        slot={kimBominSlot}
                        currentFiles={kimBominFiles}
                        onFilesUpdate={updateKimBominFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {kimBominVideoSlot && (
                      <MediaSlot
                        slot={kimBominVideoSlot}
                        currentFiles={kimBominVideoFiles}
                        onFilesUpdate={updateKimBominVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Park Parang */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -right-4 top-0 w-2 h-full bg-gradient-to-b from-blue-500/30 to-transparent"
                  style={{ transform: 'skew(-5deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(-0.3deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">PARK PARANG</h3>
                    <p className="text-gray-400 text-sm mb-6">THE TIME BETWEEN - 썸네일 관리</p>
                    {parkParangSlot && (
                      <MediaSlot
                        slot={parkParangSlot}
                        currentFiles={parkParangFiles}
                        onFilesUpdate={updateParkParangFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {parkParangVideoSlot && (
                      <MediaSlot
                        slot={parkParangVideoSlot}
                        currentFiles={parkParangVideoFiles}
                        onFilesUpdate={updateParkParangVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Lee Taehyeon */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-green-500/30 to-transparent"
                  style={{ transform: 'skew(3deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(0.2deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">LEE TAEHYEON</h3>
                    <p className="text-gray-400 text-sm mb-6">POLYHEDRON - 썸네일 관리</p>
                    {leeTaehyeonSlot && (
                      <MediaSlot
                        slot={leeTaehyeonSlot}
                        currentFiles={leeTaehyeonFiles}
                        onFilesUpdate={updateLeeTaehyeonFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {leeTaehyeonVideoSlot && (
                      <MediaSlot
                        slot={leeTaehyeonVideoSlot}
                        currentFiles={leeTaehyeonVideoFiles}
                        onFilesUpdate={updateLeeTaehyeonVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Choi Eunsol */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -right-4 top-0 w-2 h-full bg-gradient-to-b from-purple-500/30 to-transparent"
                  style={{ transform: 'skew(-3deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(-0.4deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">CHOI EUNSOL</h3>
                    <p className="text-gray-400 text-sm mb-6">SOUL SUCKER - 썸네일 관리</p>
                    {choiEunsolSlot && (
                      <MediaSlot
                        slot={choiEunsolSlot}
                        currentFiles={choiEunsolFiles}
                        onFilesUpdate={updateChoiEunsolFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {choiEunsolVideoSlot && (
                      <MediaSlot
                        slot={choiEunsolVideoSlot}
                        currentFiles={choiEunsolVideoFiles}
                        onFilesUpdate={updateChoiEunsolVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Hwang Jinsu */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-yellow-500/30 to-transparent"
                  style={{ transform: 'skew(4deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(0.3deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">HWANG JINSU</h3>
                    <p className="text-gray-400 text-sm mb-6">WHO AM I ?! - 썸네일 관리</p>
                    {hwangJinsuSlot && (
                      <MediaSlot
                        slot={hwangJinsuSlot}
                        currentFiles={hwangJinsuFiles}
                        onFilesUpdate={updateHwangJinsuFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {hwangJinsuVideoSlot && (
                      <MediaSlot
                        slot={hwangJinsuVideoSlot}
                        currentFiles={hwangJinsuVideoFiles}
                        onFilesUpdate={updateHwangJinsuVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Kim Gyeongsu */}
              <div className="designer-cms-block relative">
                <div 
                  className="absolute -right-4 top-0 w-2 h-full bg-gradient-to-b from-pink-500/30 to-transparent"
                  style={{ transform: 'skew(-4deg)' }}
                />
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5" 
                     style={{ transform: 'rotate(-0.2deg)' }}>
                  <div>
                    <h3 className="text-2xl text-white mb-4 font-light tracking-[0.15em]">KIM GYEONGSU</h3>
                    <p className="text-gray-400 text-sm mb-6">TO BE REVEALED - 썸네일 관리</p>
                    {kimGyeongsuSlot && (
                      <MediaSlot
                        slot={kimGyeongsuSlot}
                        currentFiles={kimGyeongsuFiles}
                        onFilesUpdate={updateKimGyeongsuFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg text-cyan-400 mb-4 font-light tracking-[0.1em]">Google Drive Video</h4>
                    <p className="text-gray-400 text-sm mb-6">비디오 파일 ID 관리</p>
                    {kimGyeongsuVideoSlot && (
                      <MediaSlot
                        slot={kimGyeongsuVideoSlot}
                        currentFiles={kimGyeongsuVideoFiles}
                        onFilesUpdate={updateKimGyeongsuVideoFiles}
                        isAdminMode={true}
                        className="vintage-cms-slot"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer - HTML 버전과 완전 동일 */}
      <footer className="py-[60px] px-10 bg-black text-white text-center border-t border-white/10">
        <p>&copy; 2025 REDUX. All rights reserved.</p>
      </footer>

      {/* CSS for animations matching HTML version */}
      <style jsx>{`
        @keyframes heroFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes revealItem {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glitchSlide {
          0%, 100% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-2px);
          }
          20% {
            transform: translateX(2px);
          }
          30% {
            transform: translateX(-1px);
          }
          40%, 60% {
            transform: translateX(0);
          }
          70% {
            transform: translateX(1px);
          }
          80% {
            transform: translateX(-1px);
          }
          90% {
            transform: translateX(1px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 글리치 텍스트 효과 */
        .glitch-text:hover {
          animation: glitchText 0.5s ease-in-out;
        }
        
        @keyframes glitchText {
          0%, 100% {
            text-shadow: 0 0 30px rgba(255,255,255,0.1);
          }
          25% {
            text-shadow: 2px 0 0 rgba(255, 0, 0, 0.1), -2px 0 0 rgba(0, 255, 255, 0.1);
          }
          50% {
            text-shadow: -1px 0 0 rgba(255, 0, 0, 0.1), 1px 0 0 rgba(0, 255, 255, 0.1);
          }
          75% {
            text-shadow: 1px 0 0 rgba(255, 0, 0, 0.1), -1px 0 0 rgba(0, 255, 255, 0.1);
          }
        }
        
        .film-item.revealed {
          animation: revealItem 0.8s ease forwards;
        }
        
        /* Enhanced film item hover effects */
        .film-item:hover {
          filter: contrast(1.1) brightness(1.05) !important;
          transform: translateY(-8px) !important;
        }
        
        .film-item:hover img {
          filter: grayscale(0%) contrast(1.2) brightness(1) !important;
        }
        
        /* CMS Admin Section - 비대칭 왜곡 빈티지 트렌디 스타일 */
        .cms-admin-section {
          animation: slideInFromBottom 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(60px) rotate(-0.5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        .glitch-title {
          animation: glitchPulse 3s ease-in-out infinite;
        }

        @keyframes glitchPulse {
          0%, 100% {
            text-shadow: 2px 2px 0 rgba(255,0,0,0.1), -2px -2px 0 rgba(0,255,255,0.1);
          }
          25% {
            text-shadow: -2px 2px 0 rgba(255,0,0,0.15), 2px -2px 0 rgba(0,255,255,0.15);
          }
          50% {
            text-shadow: 2px -2px 0 rgba(255,0,0,0.1), -2px 2px 0 rgba(0,255,255,0.1);
          }
          75% {
            text-shadow: -2px -2px 0 rgba(255,0,0,0.15), 2px 2px 0 rgba(0,255,255,0.15);
          }
        }

        .designer-cms-block {
          animation: blockReveal 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          opacity: 0;
          transform: translateY(30px) rotate(-1deg);
        }

        .designer-cms-block:nth-child(1) { animation-delay: 0.1s; }
        .designer-cms-block:nth-child(2) { animation-delay: 0.2s; }
        .designer-cms-block:nth-child(3) { animation-delay: 0.3s; }
        .designer-cms-block:nth-child(4) { animation-delay: 0.4s; }
        .designer-cms-block:nth-child(5) { animation-delay: 0.5s; }
        .designer-cms-block:nth-child(6) { animation-delay: 0.6s; }

        @keyframes blockReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) rotate(-1deg) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
            filter: blur(0);
          }
        }

        .designer-cms-block:hover {
          transform: translateY(-5px) rotate(0.2deg) !important;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .vintage-cms-slot :global(.media-slot-admin) {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 16px !important;
          backdrop-filter: blur(20px) !important;
          transform: skew(-0.5deg) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }

        .vintage-cms-slot :global(.media-slot-admin:hover) {
          transform: skew(0deg) scale(1.02) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }

        .vintage-cms-slot :global(.media-slot-admin h4) {
          color: var(--primary-white) !important;
          font-family: 'Inter', monospace !important;
          font-weight: 300 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
        }

        .vintage-cms-slot :global(.media-slot-admin p) {
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
        }

        /* Vintage button styles */
        .vintage-cms-slot :global(button) {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)) !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 12px !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          transform: skew(-1deg) !important;
        }

        .vintage-cms-slot :global(button:hover) {
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1)) !important;
          transform: skew(0deg) scale(1.05) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
        }

        /* 글리치 노이즈 효과 */
        .cms-admin-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255,0,0,0.01) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0,255,255,0.01) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,0,0.01) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
          animation: noiseFloat 10s ease-in-out infinite;
        }

        @keyframes noiseFloat {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.05) rotate(0.5deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(40px, 8vw, 80px) !important;
            letter-spacing: 0.1em !important;
          }
          
          .film-grid-section {
            padding: 80px 20px;
          }
          
          nav {
            padding: 15px 20px;
          }
          
          .page-title {
            display: none;
          }
          
          .modal-content {
            w-95% !important;
            h-70vh !important;
          }
          
          .film-item:hover {
            transform: translateY(-4px) !important;
          }

          .cms-admin-section {
            padding: 80px 15px !important;
          }

          .designer-cms-block .grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .glitch-title {
            font-size: clamp(32px, 8vw, 48px) !important;
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