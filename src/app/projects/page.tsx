import { Metadata } from 'next';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects | REDUX',
  description: '패션과 예술의 경계를 넘나드는 REDUX의 프로젝트들',
};

export default function ProjectsPage() {
  return (
    <>
      <section className="relative h-[40vh] flex items-center justify-center bg-zinc-900">
        <div className="container text-center">
          <h1 className="heading-1 mb-4">Projects</h1>
          <p className="body-large text-gray-400">
            패션과 예술의 경계를 넘나드는 창의적인 프로젝트들
          </p>
        </div>
      </section>
      <ProjectsGrid />
    </>
  );
}