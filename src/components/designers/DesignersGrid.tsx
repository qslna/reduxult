'use client';

import Link from 'next/link';
import { Instagram, ArrowUpRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';
import useContentStore from '@/store/useContentStore';

export default function DesignersGrid() {
  const { designers, updateDesignerImage } = useContentStore();

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
            <Users className="w-6 h-6 text-gray-400" />
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">Designers</h1>
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            6인의 크리에이티브 디렉터가 만들어가는 REDUX의 비전
          </p>
        </motion.div>

        {/* Designers Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {designers.map((designer, index) => (
            <motion.div
              key={designer.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/designers/${designer.id}`} className="block">
                {/* Profile Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-black mb-6">
                  <EditableImage
                    src={designer.profileImage}
                    alt={designer.name}
                    className="transition-all duration-700 group-hover:scale-110 w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onUpdate={(newSrc) => updateDesignerImage(designer.id, 'profile', newSrc)}
                    category={`designers/${designer.id}`}
                    priority={index < 3}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Number Badge */}
                  <div className="absolute top-4 left-4 w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all">
                    <span className="text-xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  
                  {/* Hover Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight size={20} />
                  </div>
                  
                  {/* Bio Preview on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                      {designer.bio}
                    </p>
                    <div className="flex items-center text-sm text-white font-medium">
                      <span>View Portfolio</span>
                      <ArrowUpRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              
                {/* Designer Info */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold group-hover:text-gray-300 transition-colors">
                      {designer.name}
                    </h2>
                    <p className="text-gray-400 mt-1">{designer.nameKo}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{designer.role}</p>
                    
                    {/* Instagram */}
                    {designer.instagramHandle && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                        <Instagram size={16} />
                        <span>{designer.instagramHandle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-zinc-900 to-black rounded-full border border-white/10">
            <p className="text-gray-400">Join the creative journey</p>
            <a 
              href="mailto:contact@redux.com" 
              className="text-white font-medium hover:text-gray-300 transition-colors"
            >
              Get in Touch →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}