import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { baseMetadata, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

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

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        
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
        <main className="pt-16 sm:pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <AdminButton />
        
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