'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Grid, List } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DESIGNERS } from '@/utils/constants';

export default function DesignersList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            DESIGNERS
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-400 max-w-3xl">
              REDUX를 이끄는 6인의 창의적인 디자이너들
            </p>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                )}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                )}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DESIGNERS.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/designers/${designer.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-900">
                    <Image
                      src={designer.profileImage}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-gray-300 transition-colors">
                    {designer.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{designer.nameKo}</p>
                  <p className="text-sm text-gray-400 mb-3">{designer.role}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {designer.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                    <Instagram size={16} className="mr-2" />
                    @{designer.instagramHandle}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-8">
            {DESIGNERS.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/designers/${designer.id}`}
                  className="group flex flex-col md:flex-row gap-8 p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-lg bg-gray-900 flex-shrink-0">
                    <Image
                      src={designer.profileImage}
                      alt={designer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                      {designer.name}
                    </h3>
                    <p className="text-gray-500 mb-1">{designer.nameKo}</p>
                    <p className="text-gray-400 mb-4">{designer.role}</p>
                    <p className="text-gray-500 mb-4">
                      {designer.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                      <Instagram size={16} className="mr-2" />
                      @{designer.instagramHandle}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}