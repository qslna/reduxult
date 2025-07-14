import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './error-overlay-fix.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'REDUX - Fashion & Art Collective',
  description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
  keywords: 'REDUX, fashion, art, collective, designer, seoul',
  authors: [{ name: 'REDUX' }],
  openGraph: {
    title: 'REDUX - Fashion & Art Collective',
    description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
    url: 'https://redux.kr',
    siteName: 'REDUX',
    locale: 'ko_KR',
    type: 'website',
  },
};

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ErrorOverlayRemover from '@/components/ErrorOverlayRemover';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased bg-black text-white">
        <ErrorOverlayRemover />
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}