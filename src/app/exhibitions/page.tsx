'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Eye, Grid, List, Sparkles, Star, Camera, Video, Image as ImageIcon } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { EXHIBITIONS } from '@/utils/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ExhibitionsPage() {
  const { isAdmin } = useAdminAuth();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get unique years from exhibitions
  const years = Array.from(new Set(EXHIBITIONS.map(e => e.year))).sort((a, b) => b - a);
  
  const filteredExhibitions = selectedYear 
    ? EXHIBITIONS.filter(e => e.year === selectedYear)
    : EXHIBITIONS;

  // Exhibition type categories
  const exhibitionTypes = [
    {
      id: 'solo',
      title: 'SOLO EXHIBITIONS',
      subtitle: '개인전',
      description: '개별 아티스트의 독창적인 세계관을 깊이 있게 탐구하는 개인 전시',
      icon: '🎨',
      galleryId: 'exhibitions-solo'
    },
    {
      id: 'group',
      title: 'GROUP EXHIBITIONS',
      subtitle: '단체전',
      description: 'REDUX 멤버들의 협업과 시너지를 통해 창조되는 집단 창작물',
      icon: '👥',
      galleryId: 'exhibitions-group'
    },
    {
      id: 'fashion-show',
      title: 'FASHION SHOWS',
      subtitle: '패션쇼',
      description: '런웨이를 통해 선보이는 혁신적인 패션 디자인과 스타일링',
      icon: '👗',
      galleryId: 'exhibitions-fashion'
    },
    {
      id: 'installation',
      title: 'INSTALLATIONS',
      subtitle: '설치미술',
      description: '공간과 상호작용하며 관객에게 몰입적 경험을 제공하는 설치 작품',
      icon: '🏛️',
      galleryId: 'exhibitions-installation'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(219, 39, 119, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `
          }} />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center justify-center mb-8"
            variants={fadeInUp}
          >
            <Sparkles className="w-12 h-12 text-purple-400 mr-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              EXHIBITIONS
            </h1>
            <Sparkles className="w-12 h-12 text-purple-400 ml-6" />
          </motion.div>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
            variants={fadeInUp}
          >
            REDUX의 창작 여정을 기록한 전시, 공연, 그리고 특별한 순간들을 경험해보세요.
          </motion.p>

          {/* Hero Gallery */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Hero Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId="exhibitions-hero"
                  aspectRatio="16:9"
                  columns={2}
                  maxItems={4}
                  allowedTypes={['image', 'video']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((_, index) => (
                  <motion.div
                    key={index}
                    className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 text-sm">Exhibition {index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Exhibition Types Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-[0.05em] uppercase">
              EXHIBITION TYPES
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              다양한 형태의 전시를 통해 REDUX의 창작 세계를 탐구하고 경험할 수 있습니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exhibitionTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10 h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {type.title}
                  </h3>
                  
                  <h4 className="text-base font-medium mb-4 text-gray-300">
                    {type.subtitle}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {type.description}
                  </p>

                  {/* Type Gallery */}
                  {isAdmin ? (
                    <div className="mt-4">
                      <h5 className="text-xs font-medium mb-3 text-purple-400">Type Gallery</h5>
                      <InstagramStyleCMS
                        galleryId={type.galleryId}
                        aspectRatio="4:3"
                        columns={1}
                        maxItems={3}
                        allowedTypes={['image', 'video']}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Timeline/Grid Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-[0.05em] uppercase">
              EXHIBITION ARCHIVE
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              REDUX의 모든 전시 기록을 연도별, 형태별로 탐색해보세요.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mb-12">
            {/* Year Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedYear(null)}
                className={cn(
                  'px-4 py-2 rounded-full transition-all text-sm font-medium',
                  selectedYear === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                )}
              >
                All Years
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all text-sm font-medium',
                    selectedYear === year
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-900 rounded-full p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2',
                  viewMode === 'timeline'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <List size={16} />
                Timeline
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2',
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Grid size={16} />
                Grid
              </button>
            </div>
          </div>

          {/* Exhibitions Display */}
          <AnimatePresence mode="wait">
            {viewMode === 'timeline' ? (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Vertical Line */}
                <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-700" />
                
                {/* Timeline Items */}
                <div className="space-y-12">
                  {filteredExhibitions.map((exhibition, index) => (
                    <motion.div
                      key={exhibition.id}
                      className={cn(
                        'relative flex items-center',
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      )}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-6 sm:left-8 md:left-1/2 w-4 h-4 bg-purple-500 rounded-full -translate-x-1/2 z-10 shadow-lg shadow-purple-500/50" />
                      
                      {/* Content */}
                      <div className={cn(
                        'flex-1 ml-12 sm:ml-16 md:ml-0',
                        index % 2 === 0 ? 'md:pr-8 lg:pr-12 md:text-right' : 'md:pl-8 lg:pl-12'
                      )}>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                          {/* Exhibition Gallery */}
                          {isAdmin ? (
                            <div className="p-6">
                              <h4 className="text-sm font-medium mb-3 text-purple-400">Exhibition Gallery</h4>
                              <InstagramStyleCMS
                                galleryId={`exhibition-${exhibition.id}`}
                                aspectRatio="16:9"
                                columns={1}
                                maxItems={5}
                                allowedTypes={['image', 'video']}
                              />
                            </div>
                          ) : (
                            exhibition.images.length > 0 && (
                              <div className="relative aspect-video">
                                <Image
                                  src={exhibition.images[0]}
                                  alt={exhibition.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            )
                          )}
                          
                          {/* Details */}
                          <div className="p-6">
                            <h3 className="text-2xl font-bold mb-2 text-white hover:text-purple-400 transition-colors">
                              {exhibition.title}
                            </h3>
                            <p className="text-gray-400 mb-4">{exhibition.titleKo}</p>
                            
                            <div className="space-y-2 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{exhibition.startDate} - {exhibition.endDate}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span>{exhibition.venue}</span>
                              </div>
                              
                              {exhibition.participants.length > 0 && (
                                <div className="flex items-start gap-2">
                                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span>{exhibition.participants.join(', ')}</span>
                                </div>
                              )}
                            </div>
                            
                            {exhibition.description && (
                              <p className="text-gray-400 leading-relaxed">
                                {exhibition.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredExhibitions.map((exhibition, index) => (
                  <motion.div
                    key={exhibition.id}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Exhibition Gallery */}
                    {isAdmin ? (
                      <div className="p-4">
                        <h4 className="text-xs font-medium mb-2 text-purple-400">Exhibition Gallery</h4>
                        <InstagramStyleCMS
                          galleryId={`exhibition-grid-${exhibition.id}`}
                          aspectRatio="16:9"
                          columns={1}
                          maxItems={3}
                          allowedTypes={['image', 'video']}
                        />
                      </div>
                    ) : (
                      exhibition.images.length > 0 && (
                        <div className="relative aspect-video">
                          <Image
                            src={exhibition.images[0]}
                            alt={exhibition.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )
                    )}
                    
                    {/* Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                        {exhibition.title}
                      </h3>
                      <p className="text-gray-400 mb-3 text-sm">{exhibition.titleKo}</p>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{exhibition.startDate} - {exhibition.endDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{exhibition.venue}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {filteredExhibitions.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Eye className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">
                선택한 연도의 전시가 없습니다.
              </p>
            </motion.div>
          )}
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
              JOIN OUR NEXT EXHIBITION
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              REDUX와 함께 새로운 전시를 기획하고 창작의 여정에 동참하세요. 독창적인 아이디어와 열정적인 참여를 기다립니다.
            </p>
            
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star size={20} />
              Propose Exhibition
            </motion.a>
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Exhibitions</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 4 media slots</p>
            <p>• Exhibition Types: 4 galleries (3 slots each)</p>
            <p>• Individual Exhibitions: 5 slots each</p>
            <p>• Total: 16+ exhibition galleries</p>
            <p>• Timeline/Grid view modes available</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}