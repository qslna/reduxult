import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import DesignersPreview from '@/components/home/DesignersPreview';
import FeaturedWorks from '@/components/home/FeaturedWorks';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutPreview />
        <DesignersPreview />
        <FeaturedWorks />
      </main>
      <Footer />
    </>
  );
}