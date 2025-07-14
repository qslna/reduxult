import { Metadata } from 'next';
import ExhibitionsTimeline from '@/components/exhibitions/ExhibitionsTimeline';

export const metadata: Metadata = {
  title: 'Exhibitions | REDUX',
  description: 'REDUX의 전시 및 공연 기록',
};

export default function ExhibitionsPage() {
  return (
    <>
      <section className="relative h-[40vh] flex items-center justify-center bg-zinc-900">
        <div className="container text-center">
          <h1 className="heading-1 mb-4">Exhibitions</h1>
          <p className="body-large text-gray-400">
            REDUX의 전시 및 공연 기록
          </p>
        </div>
      </section>
      <ExhibitionsTimeline />
    </>
  );
}