'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';

export default function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProjects = selectedCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === selectedCategory);

  const categories = Object.values(CATEGORIES);

  return (
    <section className="section-padding">
      <div className="container">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full transition-all',
              selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-4 py-2 rounded-full transition-all',
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              )}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-zinc-900 mb-6">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-sm rounded-full">
                    {CATEGORIES[project.category as keyof typeof CATEGORIES].title}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                {project.title}
              </h2>
              <p className="text-gray-500 mb-3">{project.titleKo}</p>
              <p className="text-gray-400 line-clamp-2">
                {project.description}
              </p>
            </Link>
          ))}
        </div>

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