import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'REDUX와 함께하세요',
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}