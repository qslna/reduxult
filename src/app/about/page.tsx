import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About | REDUX',
  description: 'REDUX의 철학과 비전을 소개합니다.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutContent />
    </>
  );
}