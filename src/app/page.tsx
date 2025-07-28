'use client';

import HeroSection from '@/components/home/HeroSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';

// 로딩 화면 없이 직접 메인 콘텐츠로 이동
export default function HomePage() {
  return (
    <>
      {/* Hero Section with Video */}
      <HeroSection />
      
      {/* Showcase Grid Section */}
      <ShowcaseSection />
    </>
  );
}

