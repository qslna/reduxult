import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { baseMetadata, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo';
import { DEFAULT_SEO, seoPerformanceOptimization } from '@/lib/seo-optimization';
import { initializePerformanceOptimization } from '@/lib/performance';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'dark',
};

import { Navigation } from '@/components/layout/ModernNavigation';
import { Footer } from '@/components/layout/ModernFooter';
import AdminButton from '@/components/admin/AdminButton';
import PageTransition from '@/components/ui/PageTransition';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationStructuredData = generateOrganizationStructuredData();
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* 파비콘 및 앱 아이콘 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
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
        <Navigation />
        <main>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <AdminButton />
        
        {/* 성능 최적화 초기화 */}
        <Script
          id="performance-optimization"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 성능 최적화 초기화
              (function() {
                const initPerf = ${initializePerformanceOptimization.toString()};
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initPerf);
                } else {
                  initPerf();
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
                console.log('Analytics initialized');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}