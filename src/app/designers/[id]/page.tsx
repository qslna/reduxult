import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import DesignerDetail from '@/components/designers/DesignerDetail';
import { DESIGNERS } from '@/utils/constants';

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return DESIGNERS.map((designer) => ({
    id: designer.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const designer = DESIGNERS.find((d) => d.id === params.id);

  if (!designer) {
    return {
      title: 'Designer Not Found',
    };
  }

  return {
    title: designer.name,
    description: designer.description,
  };
}

export default function DesignerPage({ params }: Props) {
  const designer = DESIGNERS.find((d) => d.id === params.id);

  if (!designer) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <DesignerDetail designer={designer} />
      </main>
      <Footer />
    </>
  );
}