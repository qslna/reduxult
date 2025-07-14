import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

export const metadata: Metadata = {
  title: 'Contact | REDUX',
  description: 'REDUX에 문의하기',
};

export default function ContactPage() {
  return (
    <>
      <section className="relative h-[40vh] flex items-center justify-center bg-zinc-900">
        <div className="container text-center">
          <h1 className="heading-1 mb-4">Contact Us</h1>
          <p className="body-large text-gray-400">
            REDUX와 함께하고 싶으신가요?
          </p>
        </div>
      </section>
      
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}