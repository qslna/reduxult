import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import AboutList from '@/components/about/AboutList';

export const metadata: Metadata = {
  title: 'About',
  description: 'REDUX의 다양한 창작 분야와 철학을 소개합니다',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AboutList />
      </main>
      <Footer />
    </>
  );
}