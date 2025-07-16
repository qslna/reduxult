'use client';

import Link from 'next/link';
import { ArrowRight, Layers, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';
import useContentStore from '@/store/useContentStore';

export default function ProjectsPreview() {
  const { projects, updateProjectImage } = useContentStore();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);

  return (
    <section className="section-padding bg-gradient-to-b from-zinc-900 to-black">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-gray-400" />
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Featured Works</span>
            <Layers className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Recent Projects</h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            패션과 예술의 경계를 넘나드는 창의적인 프로젝트들
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group block"
              >
                {/* Project Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-black mb-6">
                  <EditableImage
                    src={project.images[0] || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
                    alt={project.title}
                    className="transition-all duration-700 group-hover:scale-105 w-full h-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onUpdate={(newSrc) => updateProjectImage(project.id, 'gallery', newSrc, 0)}
                    category={`projects/${project.id}`}
                    priority={index === 0}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-sm rounded-full border border-white/20 group-hover:border-white/40 transition-all">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Project Number */}
                  <div className="absolute top-4 right-4 text-7xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300 mb-2">프로젝트 둘러보기</p>
                        <div className="flex items-center text-white font-medium">
                          <span>View Project</span>
                          <ArrowRight size={20} className="ml-2" />
                        </div>
                      </div>
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-lg">{project.titleKo}</p>
                  </div>
                  
                  <p className="text-gray-500 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 pt-2">
                    {project.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{project.date}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-white transition-colors">
                      <span>자세히 보기</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Projects Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-8 bg-gradient-to-r from-zinc-900 to-black rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">더 많은 프로젝트를 만나보세요</h4>
              <p className="text-gray-400">총 {projects.length}개의 창의적인 작품들이 준비되어 있습니다</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all duration-300 group"
            >
              <span className="text-lg">View All Projects</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}