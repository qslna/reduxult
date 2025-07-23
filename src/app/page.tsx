'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import DesignersPreview from '@/components/home/DesignersPreview';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import ReduxLoadingScreen from '@/components/ui/ReduxLoadingScreen';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('redux_visited');
    if (hasVisited) {
      setIsLoading(false);
      setShowContent(true);
    } else {
      sessionStorage.setItem('redux_visited', 'true');
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  return (
    <>
      {isLoading && (
        <ReduxLoadingScreen 
          onComplete={handleLoadingComplete}
          duration={3500}
          showProgress={true}
        />
      )}
      
      {showContent && (
        <>
          <HeroSection />
          <AboutPreview />
          <DesignersPreview />
          <ProjectsPreview />
        </>
      )}
    </>
  );
}