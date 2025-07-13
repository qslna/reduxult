import { DESIGNERS } from '@/utils/constants';
import DesignerDetailClient from './DesignerDetailClient';

// Static generation을 위한 params 생성
export async function generateStaticParams() {
  return Object.keys(DESIGNERS).map((designerId) => ({
    name: designerId,
  }));
}

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function DesignerDetailPage({ params }: PageProps) {
  const { name } = await params;
  return <DesignerDetailClient designerId={name} />;
}