import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import DesignersPreview from '@/components/home/DesignersPreview';
import ProjectsPreview from '@/components/home/ProjectsPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <DesignersPreview />
      <ProjectsPreview />
    </>
  );
}