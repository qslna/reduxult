'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Calendar, User, ArrowDown, Settings } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getDriveThumbnail, getDrivePreview, FASHION_FILM_IDS } from '@/utils/drive-utils';
import { useImageKit } from '@/lib/imagekit-client';
import { buildImageKitUrl } from '@/lib/imagekit';
import { useAdmin } from '@/hooks/useAdmin';
import VideoThumbnailManager from '@/components/admin/VideoThumbnailManager';
import StaticGallery from '@/components/gallery/StaticGallery';
import FloatingParticles from '@/components/ui/FloatingParticles';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Image from 'next/image';

const fashionFilms = [
  {
    id: 'hwangjinsu',
    designer: '황진수',
    title: 'Conceptual Boundaries',
    duration: '3:24',
    year: '2024',
    description: '개념적 패션의 경계를 탐구하는 실험적 영상 작품',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-hwangjinsu']),
    thumbnailKey: 'fashion-film-hwangjinsu-thumb',
    fallbackThumbnail: '/images/designers/hwangjinsu/cinemode/📌NOR_7689.jpg'
  },
  {
    id: 'choieunsol',
    designer: '최은솔',
    title: 'Sustainable Stories',
    duration: '2:47',
    year: '2024',
    description: '지속가능한 패션을 통한 환경 메시지 전달',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-choieunsol']),
    thumbnailKey: 'fashion-film-choieunsol-thumb',
    fallbackThumbnail: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg'
  },
  {
    id: 'parkparang',
    designer: '박파랑',
    title: 'Textile Dreams',
    duration: '4:12',
    year: '2024',
    description: '실험적 텍스타일이 만들어내는 몽환적 세계',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-parkparang']),
    thumbnailKey: 'fashion-film-parkparang-thumb',
    fallbackThumbnail: '/images/profile/Park Parang.jpg'
  },
  {
    id: 'leetaehyeon',
    designer: '이태현',
    title: 'Digital Fusion',
    duration: '3:56',
    year: '2024',
    description: '디지털과 아날로그의 경계를 허무는 패션 필름',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-leetaehyeon']),
    thumbnailKey: 'fashion-film-leetaehyeon-thumb',
    fallbackThumbnail: '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg'
  },
  {
    id: 'kimbomin',
    designer: '김보민',
    title: 'Avant-garde Motion',
    duration: '3:33',
    year: '2024',
    description: '아방가르드 패션의 역동적 움직임을 담은 영상',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-kimbomin']),
    thumbnailKey: 'fashion-film-kimbomin-thumb',
    fallbackThumbnail: '/images/designers/kimbomin/cinemode/김보민 사진.jpg'
  },
  {
    id: 'kimgyeongsu',
    designer: '김경수',
    title: 'Minimalist Poetry',
    duration: '2:18',
    year: '2024',
    description: '미니멀한 아름다움을 시적으로 표현한 작품',
    videoUrl: getDrivePreview(FASHION_FILM_IDS['designer-kimgyeongsu']),
    thumbnailKey: 'fashion-film-kimgyeongsu-thumb',
    fallbackThumbnail: '/images/designers/kimgyeongsu/Showcase/IMG_2544.HEIC'
  }
];

export default function FashionFilmPage() {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdmin } = useAdmin();
  const { listFiles } = useImageKit();

  // 썸네일 로드
  useEffect(() => {
    loadThumbnails();
  }, []);

  const loadThumbnails = async () => {
    try {
      const files = await listFiles('fashion-film');
      const thumbnailMap: Record<string, string> = {};
      
      files.forEach(file => {
        const filmId = fashionFilms.find(film => 
          file.name.includes(film.thumbnailKey) || file.filePath.includes(film.thumbnailKey)
        );
        if (filmId) {
          thumbnailMap[filmId.id] = file.url;
        }
      });
      
      setThumbnails(thumbnailMap);
    } catch (error) {
      console.error('썸네일 로드 실패:', error);
    }
  };

  const getThumbnailUrl = (film: typeof fashionFilms[0]) => {
    return thumbnails[film.id] 
      ? buildImageKitUrl(thumbnails[film.id], { width: 600, height: 338, quality: 80 })
      : film.fallbackThumbnail;
  };

  const handleThumbnailUpdate = (filmId: string, thumbnailUrl: string) => {
    setThumbnails(prev => ({
      ...prev,
      [filmId]: thumbnailUrl
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ScrollProgress />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 overflow-hidden">
        {/* Floating Particles */}
        <FloatingParticles count={30} className="opacity-20" />
        
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 20% 80%, #purple 0%, transparent 50%), radial-gradient(circle at 80% 20%, #blue 0%, transparent 50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Text content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                  FASHION FILM
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                움직이는 이미지로 표현하는 패션
                <br className="hidden md:block" />
                Motion Meets Fashion
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-400 leading-relaxed max-w-2xl"
              >
                REDUX의 패션 필름은 정적인 이미지를 넘어 시간의 흐름 속에서 
                펼쳐지는 패션의 새로운 서사를 만들어냅니다.
              </motion.p>
            </motion.div>

            {/* Right side - Dynamic Video Stack Gallery */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="flex justify-center lg:justify-end"
            >
              <StaticGallery 
                folder="fashion-film"
                layout="stack"
                maxItems={6}
                title="Fashion Film Collection"
                className="w-full max-w-sm"
                stackStyle="spread"
                href="/admin/gallery?folder=fashion-film"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono mb-2">WATCH</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Designer Films Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                DESIGNER FILMS
              </span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-400 max-w-3xl mx-auto"
            >
              각 디자이너의 고유한 철학과 미학을 영상으로 구현한 패션 필름 컬렉션
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {fashionFilms.map((film, index) => (
              <motion.div
                key={film.id}
                variants={fadeIn}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateX: 5,
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Image
                      src={getThumbnailUrl(film)}
                      alt={`${film.title} 썸네일`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3}
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Video Preview Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => window.open(film.videoUrl, '_blank')}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm"
                      >
                        <Play className="w-8 h-8 text-white fill-current" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
                    {film.duration}
                  </div>
                </div>

                {/* Film Info */}
                <div className="p-6">
                  <motion.h3 
                    className="text-xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {film.title}
                  </motion.h3>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {film.designer}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {film.year}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {film.description}
                  </p>

                  {/* Watch Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(film.videoUrl, '_blank')}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    시청하기
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Film Gallery Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              영상 아카이브
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              REDUX의 모든 패션 필름과 영상 작업들을 한 곳에서 만나보세요.
            </p>
          </motion.div>

          <StaticGallery
            folder="fashion-film"
            layout="grid"
            columns={2}
            title=""
            acceptedTypes="videos"
            className="mt-8"
          />
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Behind The Scenes
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              패션 필름 제작 과정과 창작 뒤의 이야기들
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '기획 & 컨셉',
                description: '디자이너와의 협업을 통한 영상 컨셉 개발',
                icon: '🎬'
              },
              {
                title: '촬영 & 연출',
                description: '전문 크루와 함께하는 고퀄리티 영상 제작',
                icon: '📹'
              },
              {
                title: '편집 & 후반작업',
                description: '스토리텔링을 완성하는 정교한 편집 과정',
                icon: '✂️'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 bg-gray-900/30 rounded-xl border border-white/10"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              움직이는 패션의 미래
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              REDUX의 패션 필름은 단순한 영상을 넘어 <br className="hidden md:block" />
              새로운 패션 경험의 가능성을 제시합니다.
            </p>
            
            <motion.a
              href="/designers"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              디자이너 보기
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Admin Panel */}
      {isAdmin && (
        <>
          {/* Admin Toggle Button */}
          <motion.button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.button>

          {/* Admin Panel */}
          {showAdminPanel && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm overflow-y-auto"
            >
              <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-white">패션 필름 썸네일 관리</h2>
                    <button
                      onClick={() => setShowAdminPanel(false)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fashionFilms.map((film) => (
                      <VideoThumbnailManager
                        key={film.id}
                        videoId={film.id}
                        videoTitle={`${film.designer} - ${film.title}`}
                        thumbnailKey={film.thumbnailKey}
                        fallbackThumbnail={film.fallbackThumbnail}
                        onThumbnailUpdate={(url) => handleThumbnailUpdate(film.id, url)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}