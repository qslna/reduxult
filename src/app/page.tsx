'use client';

import { useState, useEffect } from 'react';
import VideoHeroSection from '@/components/layout/VideoHeroSection';
import AboutShowcase from '@/components/layout/AboutShowcase';
import DesignersPreview from '@/components/layout/DesignersPreview';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Video */}
      <VideoHeroSection />

      {/* About Section */}
      <AboutShowcase />

      {/* Designers Section */}
      <DesignersPreview />

      {/* Featured Works Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              FEATURED WORKS
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              세계 최고 수준의 디자인 작품들을 만나보세요. 
              각 디자이너의 독창적인 비전과 혁신적인 접근법이 담긴 프로젝트들입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            함께 만들어가는 디자인의 미래
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            REDUX66에서 창의적 파트너십을 시작하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              프로젝트 문의하기
            </a>
            
            <a
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              더 알아보기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}