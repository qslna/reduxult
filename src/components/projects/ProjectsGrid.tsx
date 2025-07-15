'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROJECTS, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';

export default function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [projects, setProjects] = useState(PROJECTS);
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

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

  const categories = Object.values(CATEGORIES);

  return (
    <section className="section-padding">
      <div className="container">
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-4 mb-12 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-6 py-2 rounded-full transition-all duration-300 font-medium tracking-wide',
              selectedCategory === 'all'
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white backdrop-blur-sm'
            )}
          >
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-6 py-2 rounded-full transition-all duration-300 font-medium tracking-wide',
                selectedCategory === category.id
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white backdrop-blur-sm'
              )}
            >
              {category.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
          {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900 mb-6">
                    <EditableImage
                      src={project.images[0] || '/images/designer-placeholder.jpg'}
                      alt={project.title}
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onUpdate={(newSrc) => handleImageUpdate(project.id, 0, newSrc)}
                      category={`projects/${project.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Animated overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                    
                    {/* Category Badge */}
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="absolute top-4 left-4"
                    >
                      <span className="px-4 py-2 bg-black/80 backdrop-blur-md text-sm rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                        {CATEGORIES[project.category as keyof typeof CATEGORIES].title}
                      </span>
                    </motion.div>
                    
                    {/* Date overlay */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-xs rounded-full border border-white/20">
                        {new Date(project.date).getFullYear()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <h2 className="text-2xl font-bold mb-2 tracking-wide group-hover:text-white transition-all duration-300 group-hover:tracking-wider">
                      {project.title}
                    </h2>
                    <p className="text-gray-400 mb-3 text-sm uppercase tracking-widest">{project.titleKo}</p>
                    <p className="text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                      {project.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 flex items-center text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="mr-2">View Project</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">
              선택한 카테고리의 프로젝트가 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}