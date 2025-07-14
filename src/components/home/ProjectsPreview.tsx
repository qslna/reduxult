import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS } from '@/utils/constants';
import { ArrowRight } from 'lucide-react';

export default function ProjectsPreview() {
  const featuredProjects = PROJECTS.filter(p => p.featured).slice(0, 2);

  return (
    <section className="section-padding bg-zinc-900">
      <div className="container">
        <div className="mb-12">
          <h2 className="heading-2 mb-4">Featured Projects</h2>
          <p className="body-large text-gray-400">
            패션과 예술의 경계를 넘나드는 창의적인 프로젝트들
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-black mb-6">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-sm rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-500 mb-3">{project.titleKo}</p>
              <p className="text-gray-400 line-clamp-2 mb-4">
                {project.description}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                <span>자세히 보기</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}