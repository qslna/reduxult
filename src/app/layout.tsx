import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono, Orbitron, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastProvider } from '@/components/ToastProvider';
import UniversalNavigation from '@/components/layout/UniversalNavigation';
import Footer from '@/components/layout/Footer';
import CursorFollower from '@/components/ui/CursorFollower';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'REDUX - Korean Fashion Designer Collective',
    template: '%s | REDUX'
  },
  description: '한국 패션 디자이너 6인 컬렉티브. 실험적이고 혁신적인 패션과 비주얼 아트의 만남.',
  keywords: ['fashion', 'design', 'collective', 'redux', 'korean fashion', 'visual art', 'designer', '패션', '디자인', '컬렉티브'],
  authors: [{ name: 'Redux Collective' }],
  creator: 'Redux Collective',
  publisher: 'Redux Collective',
  category: 'fashion',
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://redux-collective.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'REDUX - Korean Fashion Designer Collective',
    description: '한국 패션 디자이너 6인 컬렉티브. 실험적이고 혁신적인 패션과 비주얼 아트의 만남.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'REDUX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'REDUX - Korean Fashion Designer Collective',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REDUX - Korean Fashion Designer Collective',
    description: '한국 패션 디자이너 6인 컬렉티브. 실험적이고 혁신적인 패션과 비주얼 아트의 만남.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden selection:bg-white/20">
        {/* Noise overlay */}
        <div className="noise-overlay" />
        
        <ToastProvider>
          <CursorFollower />
          <UniversalNavigation />
          <main className="relative min-h-screen">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ToastProvider>
      </body>
    </html>
  );
}