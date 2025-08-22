'use client';

import HeroSection from '../components/home/HeroSection';
import ShowcaseSection from '../components/home/ShowcaseSection';

// 최적화된 메인 페이지 - HydrationSafe 제거
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

