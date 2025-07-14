import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import AboutDetail from '@/components/about/AboutDetail';
import { ABOUT_SECTIONS } from '@/utils/constants';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return ABOUT_SECTIONS.map((section) => ({
    id: section.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const section = ABOUT_SECTIONS.find((s) => s.id === resolvedParams.id);

  if (!section) {
    return {
      title: 'Section Not Found',
    };
  }

  return {
    title: `${section.title} | About`,
    description: section.description,
  };
}

export default async function AboutSectionPage({ params }: Props) {
  const resolvedParams = await params;
  const section = ABOUT_SECTIONS.find((s) => s.id === resolvedParams.id);

  if (!section) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AboutDetail section={section} />
      </main>
      <Footer />
    </>
  );
}