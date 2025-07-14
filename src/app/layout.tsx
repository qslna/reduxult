import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'REDUX - Korean Fashion Designer Collective',
    template: '%s | REDUX',
  },
  description: '실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너',
  keywords: ['fashion', 'design', 'korean fashion', 'designer collective', 'visual art'],
  authors: [{ name: 'REDUX Collective' }],
  openGraph: {
    title: 'REDUX - Korean Fashion Designer Collective',
    description: '실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너',
    url: 'https://reduxult.vercel.app',
    siteName: 'REDUX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'REDUX Collective',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REDUX - Korean Fashion Designer Collective',
    description: '실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너',
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}