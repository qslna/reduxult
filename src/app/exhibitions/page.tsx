'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';

interface Exhibition {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  venue: string;
  location: string;
  description: string;
  status: 'upcoming' | 'current' | 'past';
  featured: boolean;
}

const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: 'REDUX66: 창의적 비전',
    subtitle: '세계 최고 수준의 디자이너 포트폴리오 전시',
    date: '2025.07.15 - 2025.08.30',
    venue: 'Seoul Museum of Art',
    location: 'Seoul, Korea',
    description: '세 명의 디자이너가 선보이는 혁신적인 작품들을 통해 현대 디자인의 새로운 가능성을 탐구합니다.',
    status: 'upcoming',
    featured: true,
  },
  {
    id: '2', 
    title: 'Minimalist Futures',
    subtitle: 'LEE TAEHYEON 개인전',
    date: '2025.06.01 - 2025.06.30',
    venue: 'Gallery Platform',
    location: 'Seoul, Korea',
    description: '미니멀리즘을 통해 미래의 디자인 언어를 제시하는 이태현의 개인전입니다.',
    status: 'current',
    featured: true,
  },
];

export default function ExhibitionsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'current' | 'past'>('all');

  const filteredExhibitions = exhibitions.filter(exhibition => {
    if (selectedStatus === 'all') return true;
    return exhibition.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                EXHIBITIONS
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
            >
              창의적 비전과 혁신적 디자인을 선보이는 전시회들을 만나보세요
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'all', label: '전체' },
              { key: 'upcoming', label: '예정' },
              { key: 'current', label: '진행중' },
              { key: 'past', label: '종료' },
            ].map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => setSelectedStatus(key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedStatus === key
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredExhibitions.map((exhibition) => (
              <motion.div
                key={exhibition.id}
                variants={fadeIn}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="p-8">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exhibition.status === 'current'
                          ? 'bg-green-500/20 text-green-400'
                          : exhibition.status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {exhibition.status === 'current' && '진행중'}
                      {exhibition.status === 'upcoming' && '예정'}
                      {exhibition.status === 'past' && '종료'}
                    </span>
                    
                    {exhibition.featured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {exhibition.title}
                  </h3>
                  
                  {exhibition.subtitle && (
                    <p className="text-lg text-gray-400 mb-4">
                      {exhibition.subtitle}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar size={16} />
                      <span className="text-sm">{exhibition.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin size={16} />
                      <span className="text-sm">{exhibition.venue}, {exhibition.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {exhibition.description}
                  </p>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
                  >
                    자세히 보기
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredExhibitions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">
                현재 선택한 필터에 해당하는 전시회가 없습니다.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}