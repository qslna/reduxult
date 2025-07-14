import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import DesignersList from '@/components/designers/DesignersList';

export const metadata: Metadata = {
  title: 'Designers',
  description: 'REDUX를 이끄는 6인의 창의적인 디자이너들',
};

export default function DesignersPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <DesignersList />
      </main>
      <Footer />
    </>
  );
}