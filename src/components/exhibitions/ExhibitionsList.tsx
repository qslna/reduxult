'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Exhibition {
  id: string;
  title: string;
  titleKo: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  coverImage: string;
  images: string[];
  status: 'upcoming' | 'ongoing' | 'past';
}

// 임시 전시 데이터
const EXHIBITIONS: Exhibition[] = [
  {
    id: 'redux-2024-fw',
    title: 'REDUX 2024 F/W Collection',
    titleKo: '리덕스 2024 F/W 컬렉션',
    date: '2024-10-15',
    endDate: '2024-10-20',
    location: 'Seoul Fashion Week, DDP',
    description: '6인의 디자이너가 선보이는 2024 가을/겨울 컬렉션',
    coverImage: '/images/exhibitions/2024-fw-cover.jpg',
    images: [],
    status: 'upcoming',
  },
  {
    id: 'memory-traces',
    title: 'Memory Traces',
    titleKo: '기억의 흔적',
    date: '2024-07-01',
    endDate: '2024-07-31',
    location: 'REDUX Gallery, Seoul',
    description: '시간과 기억을 주제로 한 인스톨레이션 전시',
    coverImage: '/images/exhibitions/memory-traces-cover.jpg',
    images: [],
    status: 'ongoing',
  },
  {
    id: 'collective-vision',
    title: 'Collective Vision',
    titleKo: '집단적 비전',
    date: '2024-03-15',
    endDate: '2024-04-15',
    location: 'Art Center Nabi, Seoul',
    description: 'REDUX 첫 번째 그룹 전시회',
    coverImage: '/images/exhibitions/collective-vision-cover.jpg',
    images: [],
    status: 'past',
  },
];

export default function ExhibitionsList() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');

  const filteredExhibitions = EXHIBITIONS.filter(
    (exhibition) => filter === 'all' || exhibition.status === filter
  );

  const getStatusLabel = (status: Exhibition['status']) => {
    switch (status) {
      case 'upcoming':
        return { label: '예정', color: 'text-blue-400' };
      case 'ongoing':
        return { label: '진행중', color: 'text-green-400' };
      case 'past':
        return { label: '종료', color: 'text-gray-500' };
    }
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (endDate) {
      const end = new Date(endDate);
      return `${start.toLocaleDateString('ko-KR', options)} - ${end.toLocaleDateString('ko-KR', options)}`;
    }
    
    return start.toLocaleDateString('ko-KR', options);
  };

  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            EXHIBITIONS
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-8">
            REDUX의 전시 및 공연 기록을 만나보세요
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4">
            {(['all', 'upcoming', 'ongoing', 'past'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors',
                  filter === status
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                )}
              >
                {status === 'all' && '전체'}
                {status === 'upcoming' && '예정'}
                {status === 'ongoing' && '진행중'}
                {status === 'past' && '지난 전시'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Exhibitions List */}
        <div className="space-y-12">
          {filteredExhibitions.map((exhibition, index) => {
            const statusInfo = getStatusLabel(exhibition.status);
            
            return (
              <motion.article
                key={exhibition.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-900">
                  <Image
                    src={exhibition.coverImage}
                    alt={exhibition.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      'px-3 py-1 text-sm font-medium bg-black/70 backdrop-blur-sm rounded-full',
                      statusInfo.color
                    )}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-2">{exhibition.title}</h2>
                  <p className="text-lg text-gray-400 mb-4">{exhibition.titleKo}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={18} />
                      <span>{formatDateRange(exhibition.date, exhibition.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin size={18} />
                      <span>{exhibition.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">{exhibition.description}</p>

                  {exhibition.status !== 'past' && (
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors w-fit">
                      {exhibition.status === 'upcoming' ? '사전 등록' : '방문 예약'}
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExhibitions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-lg"
          >
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">
              {filter === 'upcoming' && '예정된 전시가 없습니다'}
              {filter === 'ongoing' && '진행 중인 전시가 없습니다'}
              {filter === 'past' && '지난 전시가 없습니다'}
              {filter === 'all' && '전시가 없습니다'}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}