'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, ArrowUpRight, Users, Camera, Grid, Eye, Star, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import useContentStore from '@/store/useContentStore';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function DesignersGrid() {
  const { designers } = useContentStore();
  const { isAdmin } = useAdminAuth();
  const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'gallery'>('gallery');

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

  // Get role-specific attributes
  const getRoleAttributes = (role: string) => {
    switch(role) {
      case 'Creative Director':
        return { color: 'from-purple-500 to-indigo-600', icon: Star };
      case 'Fashion Designer':
        return { color: 'from-pink-500 to-rose-600', icon: Heart };
      case 'Visual Artist':
        return { color: 'from-blue-500 to-cyan-600', icon: Eye };
      case 'Installation Artist':
        return { color: 'from-green-500 to-teal-600', icon: Grid };
      default:
        return { color: 'from-gray-500 to-gray-600', icon: Award };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="flex items-center justify-center gap-4 mb-8" variants={fadeInUp}>
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
                DESIGNERS
              </h1>
              <Users className="w-8 h-8 text-purple-400" />
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
              variants={fadeInUp}
            >
              6인의 크리에이티브 디렉터가 만들어가는 REDUX의 비전과 각자의 고유한 창작 세계를 경험해보세요.
            </motion.p>

            {/* View Mode Toggle */}
            <motion.div 
              className="flex items-center justify-center gap-4 mb-12"
              variants={fadeInUp}
            >
              <button
                onClick={() => setViewMode('compact')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'compact'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Users size={18} />
                Compact View
              </button>
              <button
                onClick={() => setViewMode('gallery')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'gallery'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Grid size={18} />
                Gallery Boxes
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Designers Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={viewMode === 'gallery' 
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-12'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            }
          >
            {designers.map((designer, index) => {
              const roleAttrs = getRoleAttributes(designer.role);
              const IconComponent = roleAttrs.icon;
              
              return (
                <motion.div
                  key={designer.id}
                  variants={itemVariants}
                  className="group"
                >
                  {viewMode === 'gallery' ? (
                    // Gallery Box Layout
                    <div 
                      className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10"
                      onClick={() => setSelectedDesigner(selectedDesigner === designer.id ? null : designer.id)}
                    >
                      {/* Designer Header */}
                      <div className="p-6 border-b border-gray-700/50">
                        <div className="flex items-center gap-4">
                          {/* Profile Image */}
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-800">
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                              <IconComponent className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
                          </div>
                          
                          {/* Designer Info */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                              {designer.name}
                            </h3>
                            <p className="text-gray-300 mb-2">{designer.nameKo}</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 bg-gradient-to-r ${roleAttrs.color} text-white text-xs font-medium rounded-full uppercase tracking-wider`}>
                                {designer.role}
                              </span>
                              {designer.instagramHandle && (
                                <a
                                  href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-white transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Instagram size={16} />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Link 
                            href={`/designers/${designer.id}`}
                            className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowUpRight size={20} className="text-purple-400 group-hover:text-white" />
                          </Link>
                        </div>
                      </div>

                      {/* Bio Section */}
                      <div className="px-6 py-4 border-b border-gray-700/50">
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {designer.bio}
                        </p>
                      </div>

                      {/* Gallery Box Preview */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Portfolio Preview
                          </h4>
                          <span className="text-xs text-gray-500">
                            {designer.portfolioImages?.length || 0} works
                          </span>
                        </div>
                        
                        {/* Gallery Boxes */}
                        {isAdmin && selectedDesigner === designer.id ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h5 className="text-sm font-medium text-purple-400 mb-3">
                                Gallery Box Management - {designer.name}
                              </h5>
                              <InstagramStyleCMS
                                galleryId={`${designer.id}-gallery-boxes`}
                                aspectRatio="square"
                                columns={2}
                                maxItems={6}
                                allowedTypes={['image']}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((_, boxIndex) => (
                              <motion.div
                                key={boxIndex}
                                className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: boxIndex * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Camera className="w-4 h-4 text-gray-500" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        {/* Preview Stats */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {Math.floor(Math.random() * 500 + 100)} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={12} />
                              {Math.floor(Math.random() * 50 + 10)} likes
                            </span>
                          </div>
                          <span className="text-xs text-purple-400">
                            {selectedDesigner === designer.id && isAdmin ? 'Managing gallery ↑' : 'Click to explore →'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Compact Layout
                    <Link href={`/designers/${designer.id}`} className="block">
                      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                        {/* Profile Section */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-purple-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                              {designer.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{designer.nameKo}</p>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        </div>
                        
                        {/* Role Badge */}
                        <div className="mb-3">
                          <span className={`px-3 py-1 bg-gradient-to-r ${roleAttrs.color} text-white text-xs font-medium rounded-full uppercase tracking-wider`}>
                            {designer.role}
                          </span>
                        </div>
                        
                        {/* Bio Preview */}
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                          {designer.bio}
                        </p>
                        
                        {/* Mini Gallery */}
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4].map((_, boxIndex) => (
                            <div 
                              key={boxIndex}
                              className="aspect-square bg-gray-800 rounded flex items-center justify-center"
                            >
                              <Camera className="w-3 h-3 text-gray-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-8 tracking-[0.05em] uppercase">
              JOIN THE CREATIVE COLLECTIVE
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              REDUX 디자이너들과 함께 새로운 창작의 여정을 시작하세요. 우리는 항상 재능 있는 크리에이터들을 찾고 있습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} />
                Join Our Team
              </motion.a>
              <motion.a
                href="/about/collective"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Notes */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-6 right-6 md:left-auto md:right-20 md:w-80 bg-purple-900/90 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 z-40"
        >
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Designers Grid</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Gallery View: 6 designers with gallery boxes</p>
            <p>• Each designer: 6 preview gallery slots</p>
            <p>• Total: 36 manageable gallery preview slots</p>
            <p>• Click on designers to manage gallery boxes</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}