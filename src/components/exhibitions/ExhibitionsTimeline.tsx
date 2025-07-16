'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EXHIBITIONS } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function ExhibitionsTimeline() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Get unique years from exhibitions
  const years = Array.from(new Set(EXHIBITIONS.map(e => e.year))).sort((a, b) => b - a);
  
  const filteredExhibitions = selectedYear 
    ? EXHIBITIONS.filter(e => e.year === selectedYear)
    : EXHIBITIONS;

  return (
    <section className="section-padding">
      <div className="container">
        {/* Year Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-12 justify-center px-4">
          <button
            onClick={() => setSelectedYear(null)}
            className={cn(
              'px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base',
              selectedYear === null
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            )}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                'px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base',
                selectedYear === year
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative px-4 sm:px-0">
          {/* Vertical Line */}
          <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800" />
          
          {/* Exhibition Items */}
          <div className="space-y-12">
            {filteredExhibitions.map((exhibition, index) => (
              <div
                key={exhibition.id}
                className={cn(
                  'relative flex items-center',
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 sm:left-8 md:left-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full -translate-x-1/2 z-10" />
                
                {/* Content */}
                <div className={cn(
                  'flex-1 ml-12 sm:ml-16 md:ml-0',
                  index % 2 === 0 ? 'md:pr-8 lg:pr-12 md:text-right' : 'md:pl-8 lg:pl-12'
                )}>
                  <div className="bg-zinc-900 rounded-lg overflow-hidden">
                    {/* Image */}
                    {exhibition.images.length > 0 && (
                      <div className="relative aspect-video">
                        <Image
                          src={exhibition.images[0]}
                          alt={exhibition.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    
                    {/* Details */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2">{exhibition.title}</h3>
                      <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{exhibition.titleKo}</p>
                      
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{exhibition.startDate} - {exhibition.endDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{exhibition.venue}</span>
                        </div>
                        
                        {exhibition.participants.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{exhibition.participants.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      {exhibition.description && (
                        <p className="mt-3 sm:mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
                          {exhibition.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredExhibitions.length === 0 && (
          <div className="text-center py-12 sm:py-20 px-4">
            <p className="text-gray-400 text-sm sm:text-base">
              선택한 연도의 전시가 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}