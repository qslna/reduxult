'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useSimpleCMS } from '@/hooks/useSimpleCMS';
import SimpleCMS from '@/components/cms/SimpleCMS';

// HTML redux6 index.html의 showcase-preview 섹션과 완전 동일한 구현 + SimpleCMS 통합
export default function ShowcaseSection() {
  // CMS 인증
  const { isAuthenticated } = useSimpleAuth();
  
  // SimpleCMS 슬롯 - 디자이너 프로필 이미지들 (실제 파일 경로로 수정)
  const kimBominCMS = useSimpleCMS('main-designer-kimbomin', '/images/profile/Kim Bomin.webp');
  const parkParangCMS = useSimpleCMS('main-designer-parkparang', '/images/profile/Park Parang.jpg');
  const leeTaehyeonCMS = useSimpleCMS('main-designer-leetaehyeon', '/images/profile/Lee Taehyeon.jpg');
  const choiEunsolCMS = useSimpleCMS('main-designer-choieunsol', '/images/profile/Choi Eunsol.jpeg');
  const hwangJinsuCMS = useSimpleCMS('main-designer-hwangjinsu', '/images/profile/Hwang Jinsu.jpg');
  const kimGyeongsuCMS = useSimpleCMS('main-designer-kimgyeongsu', '/images/profile/Kim Gyeongsu.webp');
  
  // SimpleCMS 슬롯 - 전시 프리뷰 이미지들
  const cinemodeCMS = useSimpleCMS('main-exhibition-cinemode', '/images/exhibitions/cinemode/1.jpg');
  const theroomCMS = useSimpleCMS('main-exhibition-theroom', '/images/exhibitions/theroom/1.jpg');
  
  useEffect(() => {
    // HTML 버전과 동일한 GSAP 애니메이션 (모바일이 아닌 경우에만)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile && typeof window !== 'undefined') {
      // GSAP이 로드되면 애니메이션 실행
      const timer = setTimeout(() => {
        if (window.gsap) {
          window.gsap.utils.toArray('.showcase-item').forEach((item: any, index: number) => {
            window.gsap.from(item, {
              scale: 0.8,
              opacity: 0,
              duration: 0.6,
              delay: index * 0.05,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 15%'
              }
            });
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="showcase-preview py-[120px] px-10 bg-white">
      <div className="showcase-container max-w-[1600px] mx-auto">
        {/* 헤더 - HTML 버전과 동일 */}
        <div className="showcase-header text-center mb-20">
          <h2 className="showcase-title font-['Playfair_Display'] font-semibold mb-5 leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)' }}>
            SIX DESIGNERS, ONE VISION
          </h2>
          <p className="showcase-subtitle text-base text-[--gray-medium] tracking-[2px]">
            Fashion Designer Collective
          </p>
        </div>

        {/* 쇼케이스 그리드 - HTML 버전과 완전 동일한 구조 */}
        <div 
          className="showcase-grid grid grid-cols-4 gap-[2px] bg-[--gray-light] p-[2px] max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-8 max-[480px]:p-4"
          data-redux-gallery="main-showcase"
          data-manageable="true"
          data-fixed-slots="8"
        >
          {/* 디자이너 1: Kim Bomin */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 0 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/kim-bomin"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={kimBominCMS.currentUrl || "/images/profile/Kim Bomin.webp"} 
                alt="Kim Bomin" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">KIM BOMIN</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-kimbomin"
                      currentUrl={kimBominCMS.currentUrl}
                      type="image"
                      onUpload={kimBominCMS.handleUpload}
                      onDelete={kimBominCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Kim Bomin 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  KIM BOMIN
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Creative Director
                </div>
              </div>
            )}
          </div>

          {/* 디자이너 2: Park Parang */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 1 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/park-parang"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={parkParangCMS.currentUrl || "/images/profile/Park Parang.jpg"} 
                alt="Park Parang" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">PARK PARANG</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-parkparang"
                      currentUrl={parkParangCMS.currentUrl}
                      type="image"
                      onUpload={parkParangCMS.handleUpload}
                      onDelete={parkParangCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Park Parang 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  PARK PARANG
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Art Director
                </div>
              </div>
            )}
          </div>

          {/* 디자이너 3: Lee Taehyeon */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 2 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/lee-taehyeon"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={leeTaehyeonCMS.currentUrl || "/images/profile/Lee Taehyeon.jpg"} 
                alt="Lee Taehyeon" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">LEE TAEHYEON</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-leetaehyeon"
                      currentUrl={leeTaehyeonCMS.currentUrl}
                      type="image"
                      onUpload={leeTaehyeonCMS.handleUpload}
                      onDelete={leeTaehyeonCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Lee Taehyeon 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  LEE TAEHYEON
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Visual Director
                </div>
              </div>
            )}
          </div>

          {/* 디자이너 4: Choi Eunsol */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 3 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/choi-eunsol"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={choiEunsolCMS.currentUrl || "/images/profile/Choi Eunsol.jpeg"} 
                alt="Choi Eunsol" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">CHOI EUNSOL</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-choieunsol"
                      currentUrl={choiEunsolCMS.currentUrl}
                      type="image"
                      onUpload={choiEunsolCMS.handleUpload}
                      onDelete={choiEunsolCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Choi Eunsol 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  CHOI EUNSOL
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Fashion Director
                </div>
              </div>
            )}
          </div>

          {/* 디자이너 5: Hwang Jinsu */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 4 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/hwang-jinsu"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={hwangJinsuCMS.currentUrl || "/images/profile/Hwang Jinsu.jpg"} 
                alt="Hwang Jinsu" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">HWANG JINSU</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-hwangjinsu"
                      currentUrl={hwangJinsuCMS.currentUrl}
                      type="image"
                      onUpload={hwangJinsuCMS.handleUpload}
                      onDelete={hwangJinsuCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Hwang Jinsu 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  HWANG JINSU
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Production Director
                </div>
              </div>
            )}
          </div>

          {/* 디자이너 6: Kim Gyeongsu */}
          <div 
            className="showcase-item relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 5 } as React.CSSProperties}
            data-manageable="showcase"
          >
            <Link 
              href="/designers/kim-gyeongsu"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={kimGyeongsuCMS.currentUrl || "/images/profile/Kim Gyeongsu.webp"} 
                alt="Kim Gyeongsu" 
                fill={true}
                priority={true}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">KIM GYEONGSU</h3>
                    <p className="text-white/70 text-sm">프로필 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-designer-kimgyeongsu"
                      currentUrl={kimGyeongsuCMS.currentUrl}
                      type="image"
                      onUpload={kimGyeongsuCMS.handleUpload}
                      onDelete={kimGyeongsuCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Kim Gyeongsu 프로필 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  KIM GYEONGSU
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Brand Director
                </div>
              </div>
            )}
          </div>

          {/* 전시 1: Cinemode */}
          <div 
            className="showcase-item showcase-exhibition relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 6 } as React.CSSProperties}
            data-manageable="exhibition"
          >
            <Link 
              href="/exhibitions"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={cinemodeCMS.currentUrl || "/images/exhibitions/cinemode/1.jpg"} 
                alt="Cinemode Exhibition" 
                fill={true}
                priority={false}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">CINEMODE</h3>
                    <p className="text-white/70 text-sm">전시 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-exhibition-cinemode"
                      currentUrl={cinemodeCMS.currentUrl}
                      type="image"
                      onUpload={cinemodeCMS.handleUpload}
                      onDelete={cinemodeCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="Cinemode 전시 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  CINEMODE
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Exhibition
                </div>
              </div>
            )}
          </div>

          {/* 전시 2: The Room */}
          <div 
            className="showcase-item showcase-exhibition relative aspect-square overflow-hidden bg-black cursor-pointer opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:transform hover:translate-y-[-3px] hover:scale-[1.005] hover:brightness-[1.02] hover:saturate-[1.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
            style={{ '--index': 7 } as React.CSSProperties}
            data-manageable="exhibition"
          >
            <Link 
              href="/exhibitions"
              className="absolute inset-0 z-10"
              style={{ pointerEvents: isAuthenticated ? 'none' : 'auto' }}
            >
              <OptimizedImage 
                src={theroomCMS.currentUrl || "/images/exhibitions/theroom/1.jpg"} 
                alt="The Room Exhibition" 
                fill={true}
                priority={false}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-all duration-[600ms] ease-in-out opacity-90 hover:scale-[1.02] hover:contrast-[1.05] hover:brightness-[1.02]"
              />
            </Link>
            
            {/* 관리자 모드: 전체 이미지 CMS 오버레이 */}
            {isAuthenticated && (
              <div 
                className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                onClick={(e) => {
                  // CMS 버튼 클릭은 허용, 기타 클릭은 차단
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('input[type="file"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <h3 className="text-white font-medium mb-2">THE ROOM</h3>
                    <p className="text-white/70 text-sm">전시 이미지 관리</p>
                  </div>
                  <div className="w-64">
                    <SimpleCMS
                      slotId="main-exhibition-theroom"
                      currentUrl={theroomCMS.currentUrl}
                      type="image"
                      onUpload={theroomCMS.handleUpload}
                      onDelete={theroomCMS.handleDelete}
                      isAdminMode={true}
                      className="w-full"
                      placeholder="The Room 전시 이미지"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 일반 사용자: 호버 오버레이 */}
            {!isAuthenticated && (
              <div className="showcase-overlay absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center text-white opacity-0 transition-opacity duration-[400ms] ease-in-out p-5 text-center hover:opacity-100">
                <div className="showcase-name font-['Inter'] font-medium mb-[5px] tracking-[0.02em]" 
                     style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}>
                  THE ROOM
                </div>
                <div className="showcase-role text-xs text-white/70 tracking-[1px] uppercase">
                  Exhibition
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}