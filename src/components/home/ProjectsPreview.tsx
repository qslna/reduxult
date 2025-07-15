'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PROJECTS } from '@/utils/constants';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';

export default function ProjectsPreview() {
  const [projects, setProjects] = useState(PROJECTS);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);

  const handleImageUpdate = (projectId: string, imageIndex: number, newImageUrl: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const newImages = [...project.images];
        newImages[imageIndex] = newImageUrl;
        return { ...project, images: newImages };
      }
      return project;
    }));
  };

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
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group block hover-float"
              >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-black mb-6 hover-glow">
                <EditableImage
                  src={project.images[0] || '/images/designer-placeholder.jpg'}
                  alt={project.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onUpdate={(newSrc) => handleImageUpdate(project.id, 0, newSrc)}
                  category={`projects/${project.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-700 pointer-events-none" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-sm rounded-full border border-white/20 group-hover:border-white/40 transition-colors">
                    {project.category}
                  </span>
                </div>
                
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ArrowRight size={24} className="text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-gray-300 transition-colors underline-effect">
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
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-all duration-300 hover-lift hover:shadow-2xl group"
            >
              <span>View All Projects</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}