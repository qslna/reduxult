'use client';

import Link from 'next/link';
import { Instagram, ArrowUpRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';
import useContentStore from '@/store/useContentStore';

export default function DesignersPreview() {
  const { designers, updateDesignerImage } = useContentStore();
  const featuredDesigners = designers.filter(d => d.featured).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="section-padding bg-black">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Creative Team</span>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Designers</h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            창의성과 열정으로 가득한 6인의 디자이너를 만나보세요
          </p>
        </motion.div>

        {/* Designers Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {featuredDesigners.map((designer, index) => (
            <motion.div
              key={designer.id}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/designers/${designer.id}`} className="block">
                {/* Profile Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-gradient-to-b from-zinc-900 to-black">
                  <EditableImage
                    src={designer.profileImage}
                    alt={designer.name}
                    className="transition-all duration-700 group-hover:scale-110 w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onUpdate={(newSrc) => updateDesignerImage(designer.id, 'profile', newSrc)}
                    category={`designers/${designer.id}`}
                    priority={index === 0}
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <ArrowUpRight size={20} />
                    </div>
                    
                    {/* Bio Preview */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {designer.bio}
                      </p>
                      <div className="flex items-center text-sm text-white font-medium">
                        <span>View Portfolio</span>
                        <ArrowUpRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Designer Number */}
                  <div className="absolute top-4 left-4 text-6xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Designer Info */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold group-hover:text-gray-300 transition-colors">
                    {designer.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-gray-400">{designer.nameKo}</p>
                    <p className="text-sm text-gray-500">{designer.role}</p>
                  </div>
                  
                  {/* Instagram Handle */}
                  {designer.instagramHandle && (
                    <div className="flex items-center gap-2 pt-2">
                      <Instagram size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                        {designer.instagramHandle}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/designers"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black border border-white/20 rounded-full hover:border-white/40 transition-all duration-300 group"
          >
            <span className="text-lg font-medium">Meet All Designers</span>
            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}