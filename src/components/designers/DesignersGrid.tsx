'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DESIGNERS } from '@/utils/constants';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DesignersGrid() {
  return (
    <section className="section-padding">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {DESIGNERS.map((designer, index) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link
                href={`/designers/${designer.id}`}
                className="block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-6">
                  <Image
                    src={designer.profileImage}
                    alt={designer.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Glitch effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-red-500 mix-blend-multiply animate-glitch" />
                    <div className="absolute inset-0 bg-blue-500 mix-blend-multiply animate-glitch" style={{ animationDelay: '0.1s' }} />
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              
                <div className="px-2">
                  <h2 className="text-2xl font-bold mb-2 tracking-wide group-hover:text-white transition-all duration-300 group-hover:tracking-wider">
                    {designer.name}
                  </h2>
                  <p className="text-gray-400 mb-1 text-sm uppercase tracking-widest">{designer.nameKo}</p>
                  <p className="text-gray-500 mb-3 text-sm font-light italic">{designer.role}</p>
                  <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                    {designer.bio}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-600 group-hover:text-white transition-all duration-300">
                    <Instagram size={16} className="mr-2 group-hover:animate-pulse" />
                    <span className="group-hover:underline underline-offset-4">
                      {designer.instagramHandle}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}