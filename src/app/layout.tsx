import type { Metadata, Viewport } from 'next';
// import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import '../styles/mobile-optimization.css';
import { baseMetadata, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo';
import { DEFAULT_SEO, seoPerformanceOptimization } from '@/lib/seo-optimization';

// const inter = Inter({ 
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
//   preload: true,
// });

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#000000',
  colorScheme: 'dark',
};

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
// import PageTransition from '@/components/ui/PageTransition';
// import InitialLoadingScreen from '@/components/ui/InitialLoadingScreen';
// import GlobalErrorBoundary from '@/components/ui/GlobalErrorBoundary';
import MobileAdminPanel from '@/components/admin/MobileAdminPanel';
import SkipToContent from '@/components/ui/SkipToContent';
import ClientMobileOptimizer from '@/components/ui/ClientMobileOptimizer';
import AISearch from '@/components/ui/AISearch';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationStructuredData = generateOrganizationStructuredData();
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <html lang="ko" className="font-sans">
      <head>
        {/* 파비콘 및 앱 아이콘 */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/images/hero-background/background.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Critical CSS - Prevents FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical styles to prevent FOUC */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              background: #000000; 
              color: #ffffff; 
              font-family: system-ui, -apple-system, sans-serif;
              overflow-x: hidden;
              -webkit-font-smoothing: antialiased;
            }
            /* Prevent FOUC with smoother transition */
            body:not(.fonts-loaded) {
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            body.fonts-loaded {
              opacity: 1;
            }
            /* Ensure loading screen is always visible */
            .initial-loading-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100vh;
              background: #000000;
              z-index: 10001;
            }
          `
        }} />
        
        {/* PWA 및 모바일 최적화 */}
        <meta name="application-name" content={DEFAULT_SEO.siteName} />
        <meta name="apple-mobile-web-app-title" content={DEFAULT_SEO.siteName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content={DEFAULT_SEO.themeColor} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* SEO 최적화 메타 태그 */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="Korean" />
        <meta name="geo.region" content="KR" />
        <meta name="geo.country" content="Korea" />
        <meta name="geo.placename" content="Seoul" />
        
        {/* 성능 최적화 리소스 힌트는 개별적으로 추가됨 */}
        
        {/* 추가 외부 도메인 프리커넥트 */}
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        
        {/* 패션 업계 표준 폰트 - 성능 최적화 */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap" 
          rel="stylesheet"
        />
        <noscript>
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap" 
            rel="stylesheet" 
          />
        </noscript>
        
        
        {/* Structured Data */}
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        <SkipToContent />
        {/* <InitialLoadingScreen /> */}
        <ClientMobileOptimizer />
        {/* <GlobalErrorBoundary> */}
          <Navigation />
          <main id="main-content" tabIndex={-1}>
            {/* <PageTransition> */}
              {children}
            {/* </PageTransition> */}
          </main>
          <Footer />
          <MobileAdminPanel />
          {/* AI 검색 기능만 유지 */}
          <AISearch />
        {/* </GlobalErrorBoundary> */}
        
        {/* 전역 에러 처리 시스템 */}
        <Script
          id="global-error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 전역 에러 처리 시스템
              (function() {
                let errorCount = 0;
                const MAX_ERRORS = 5;
                const RELOAD_DELAY = 1000;
                
                // JavaScript 에러 처리
                window.onerror = function(message, source, lineno, colno, error) {
                  console.warn('Global error caught:', { message, source, lineno, colno, error });
                  errorCount++;
                  
                  // 너무 많은 에러가 발생하면 사용자에게 알리고 홈으로 이동
                  if (errorCount >= MAX_ERRORS) {
                    console.error('Too many errors detected, redirecting to home...');
                    setTimeout(() => {
                      window.location.href = '/';
                    }, RELOAD_DELAY);
                  }
                  
                  return true; // 에러를 처리했음을 알림
                };
                
                // Promise rejection 처리
                window.addEventListener('unhandledrejection', function(event) {
                  console.warn('Unhandled promise rejection:', event.reason);
                  event.preventDefault(); // 기본 에러 처리 방지
                });
                
                // React 하이드레이션 에러 처리
                window.addEventListener('error', function(event) {
                  if (event.error && event.error.message) {
                    const message = event.error.message.toLowerCase();
                    if (message.includes('hydration') || 
                        message.includes('server-rendered') || 
                        message.includes('client-rendered')) {
                      console.warn('Hydration error detected, attempting recovery...');
                      event.preventDefault();
                      
                      // 하이드레이션 에러의 경우 잠시 후 새로고침
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                  }
                });
                
                // Emergency fallback to show content if InitialLoadingScreen fails
                setTimeout(function() {
                  if (!document.body.classList.contains('fonts-loaded')) {
                    document.body.classList.add('fonts-loaded');
                  }
                }, 3000); // 3초 후 강제로 콘텐츠 표시
              })();
            `,
          }}
        />

        {/* 성능 및 호환성 최적화 초기화 */}
        <Script
          id="performance-optimization"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 기본 성능 최적화 및 호환성 테스트
              (function() {
                if (typeof window !== 'undefined') {
                  // 폰트 로딩 최적화
                  document.fonts.ready.then(() => {
                    document.body.classList.add('fonts-loaded');
                  });
                  
                  // 브라우저 호환성 체크
                  const checkCompatibility = () => {
                    const warnings = [];
                    
                    // 필수 기능 지원 확인
                    if (!window.IntersectionObserver) {
                      warnings.push('IntersectionObserver not supported - image lazy loading may be limited');
                    }
                    if (!window.fetch) {
                      warnings.push('Fetch API not supported - network requests may be limited');
                    }
                    if (!CSS.supports || !CSS.supports('display', 'grid')) {
                      warnings.push('CSS Grid not supported - layout may be affected');
                    }
                    
                    // 오래된 브라우저 감지
                    const ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
                      warnings.push('Internet Explorer is not supported - please upgrade to a modern browser');
                    }
                    
                    if (warnings.length > 0) {
                      console.group('⚠️ Browser Compatibility Warnings');
                      warnings.forEach(warning => console.warn(warning));
                      console.groupEnd();
                    }
                  };
                  
                  // 모바일 최적화
                  const optimizeForMobile = () => {
                    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
                    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(navigator.userAgent);
                    
                    if (isMobile || isTablet) {
                      // 뷰포트 높이 수정 (iOS Safari)
                      const setViewportHeight = () => {
                        const vh = window.innerHeight * 0.01;
                        document.documentElement.style.setProperty('--vh', vh + 'px');
                      };
                      
                      setViewportHeight();
                      window.addEventListener('resize', setViewportHeight);
                      window.addEventListener('orientationchange', () => {
                        setTimeout(setViewportHeight, 100);
                      });
                      
                      // 터치 스크롤 최적화
                      document.body.style.webkitOverflowScrolling = 'touch';
                      
                      // 300ms 클릭 지연 제거
                      document.addEventListener('touchstart', () => {}, { passive: true });
                      
                      console.log('📱 Mobile optimizations applied');
                    }
                  };
                  
                  // 이미지 지연 로딩
                  if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries) => {
                      entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          const img = entry.target;
                          const dataSrc = img.getAttribute('data-src');
                          if (dataSrc) {
                            img.src = dataSrc;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                          }
                        }
                      });
                    }, { rootMargin: '50px' });
                    
                    // 기존 이미지와 새로 추가되는 이미지 모두 관찰
                    const observeImages = () => {
                      document.querySelectorAll('img[data-src]:not(.observed)').forEach(img => {
                        img.classList.add('observed');
                        imageObserver.observe(img);
                      });
                    };
                    
                    observeImages();
                    
                    // DOM 변경 감지하여 새 이미지 관찰
                    if ('MutationObserver' in window) {
                      const mutationObserver = new MutationObserver(() => {
                        observeImages();
                      });
                      
                      mutationObserver.observe(document.body, {
                        childList: true,
                        subtree: true
                      });
                    }
                  }
                  
                  // 초기화 실행
                  checkCompatibility();
                  optimizeForMobile();
                  
                  console.log('🚀 Performance and compatibility optimizations loaded');
                }
              })();
            `,
          }}
        />

        {/* Analytics placeholder - replace with actual analytics */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Add your analytics code here
                // Analytics initialized
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}