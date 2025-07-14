import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DesignerDetail from '@/components/designers/DesignerDetail';
import { DESIGNERS } from '@/utils/constants';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return DESIGNERS.map((designer) => ({
    id: designer.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const designer = DESIGNERS.find((d) => d.id === resolvedParams.id);

  if (!designer) {
    return {
      title: 'Designer Not Found',
    };
  }

  return {
    title: `${designer.name} | REDUX`,
    description: designer.bio,
  };
}

export default async function DesignerPage({ params }: Props) {
  const resolvedParams = await params;
  const designer = DESIGNERS.find((d) => d.id === resolvedParams.id);

  if (!designer) {
    notFound();
  }

  return <DesignerDetail designer={designer} />;
}