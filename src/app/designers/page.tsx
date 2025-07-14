import { Metadata } from 'next';
import DesignersGrid from '@/components/designers/DesignersGrid';

export const metadata: Metadata = {
  title: 'Designers | REDUX',
  description: 'REDUX를 이끄는 6인의 창의적인 디자이너들을 만나보세요.',
};

export default function DesignersPage() {
  return (
    <>
      <section className="relative h-[40vh] flex items-center justify-center bg-zinc-900">
        <div className="container text-center">
          <h1 className="heading-1 mb-4">Designers</h1>
          <p className="body-large text-gray-400">
            창의성과 열정으로 가득한 6인의 디자이너
          </p>
        </div>
      </section>
      <DesignersGrid />
    </>
  );
}