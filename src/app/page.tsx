'use client';

import HeroSection from '@/components/home/HeroSection';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import HydrationSafe from '@/components/ui/HydrationSafe';

// 하이드레이션 안전한 메인 페이지
export default function HomePage() {
  return (
    <HydrationSafe fallback={<div className="min-h-screen bg-black"></div>}>
      {/* Hero Section with Video */}
      <HeroSection />
      
      {/* Showcase Grid Section */}
      <ShowcaseSection />
    </HydrationSafe>
  );
}

