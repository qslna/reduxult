import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ExhibitionsList from '@/components/exhibitions/ExhibitionsList';

export const metadata: Metadata = {
  title: 'Exhibitions',
  description: 'REDUX의 전시 및 공연 기록',
};

export default function ExhibitionsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <ExhibitionsList />
      </main>
      <Footer />
    </>
  );
}