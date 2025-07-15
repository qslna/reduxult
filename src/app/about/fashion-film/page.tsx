'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { FASHION_FILM_IDS, getGoogleDriveEmbedUrl, getGoogleDriveThumbnailUrl } from '@/utils/drive-utils';
import { DESIGNERS } from '@/utils/constants';

export default function FashionFilmPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const fashionFilms = Object.entries(FASHION_FILM_IDS).map(([key, id]) => {
    const designerId = key.replace('designer-', '');
    const designer = DESIGNERS.find(d => d.id.includes(designerId));
    
    return {
      id: key,
      driveId: id,
      title: designer?.name || key,
      titleKo: designer?.nameKo || '',
      thumbnail: getGoogleDriveThumbnailUrl(id),
      embedUrl: getGoogleDriveEmbedUrl(id)
    };
  });

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="heading-1 mb-4">Fashion Film</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              움직임과 이야기가 있는 패션의 새로운 표현
            </p>
          </motion.div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fashionFilms.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(film.embedUrl)}
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-900 mb-4">
                  <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // Fallback for thumbnail errors
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold group-hover:text-gray-300 transition-colors">
                  {film.title}
                </h3>
                {film.titleKo && (
                  <p className="text-sm text-gray-500">{film.titleKo}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            
            <iframe
              src={selectedVideo}
              className="w-full h-full"
              allow="autoplay"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}