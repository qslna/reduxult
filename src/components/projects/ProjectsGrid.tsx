'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Calendar, ArrowRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditableImage from '@/components/admin/EditableImage';
import useContentStore from '@/store/useContentStore';

export default function ProjectsGrid() {
  const { projects, categories, updateProjectImage } = useContentStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="min-h-screen py-20 bg-black">
      <div className="container">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-gray-400" />
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">Projects</h1>
            <Layers className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            패션과 예술의 경계를 넘나드는 창의적인 작품들
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400 uppercase tracking-wider">Filter by Category</span>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-6 py-3 rounded-full transition-all duration-300 font-medium',
                selectedCategory === 'all'
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
              )}
            >
              All Projects
              <span className="ml-2 text-sm opacity-60">({projects.length})</span>
            </motion.button>
            
            {categories.map((category) => {
              const count = projects.filter(p => p.category === category.id).length;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-6 py-3 rounded-full transition-all duration-300 font-medium',
                    selectedCategory === category.id
                      ? 'bg-white text-black shadow-lg shadow-white/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                  )}
                >
                  {category.title}
                  <span className="ml-2 text-sm opacity-60">({count})</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {filteredProjects.map((project, index) => {
              const category = categories.find(c => c.id === project.category);
              
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/projects/${project.id}`} className="block">
                    {/* Project Image */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800 to-black mb-6">
                      <EditableImage
                        src={project.images[0] || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
                        alt={project.title}
                        className="transition-all duration-700 group-hover:scale-105 w-full h-full object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        onUpdate={(newSrc) => updateProjectImage(project.id, 'gallery', newSrc, 0)}
                        category={`projects/${project.id}`}
                        priority={index < 2}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.span 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="inline-block px-4 py-2 bg-black/50 backdrop-blur-md text-sm rounded-full border border-white/20 group-hover:border-white/40 transition-all"
                        >
                          {category?.title || 'Uncategorized'}
                        </motion.span>
                      </div>
                      
                      {/* Hover Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-300 mb-2">프로젝트 자세히 보기</p>
                            <div className="flex items-center text-white font-medium">
                              <span>Explore Project</span>
                              <ArrowRight size={20} className="ml-2" />
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <ArrowRight size={24} className="text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Number */}
                      <div className="absolute top-4 right-4 text-7xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    
                    {/* Project Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                          {project.title}
                        </h2>
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
                            <span>{new Date(project.date).getFullYear()}</span>
                          </div>
                        )}
                        {project.designers && project.designers.length > 0 && (
                          <div className="text-sm text-gray-500">
                            <span>{project.designers.length} Designer{project.designers.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-white transition-colors ml-auto">
                          <span>View Details</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-12 bg-zinc-900 rounded-2xl">
              <Layers size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">
                선택한 카테고리의 프로젝트가 없습니다.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-6 px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                모든 프로젝트 보기
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}