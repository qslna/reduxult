'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Grid, Plus, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import EditableImage from '@/components/admin/EditableImage';
import EditableVideo from '@/components/admin/EditableVideo';
import Lightbox from '@/components/ui/Lightbox';
import useContentStore from '@/store/useContentStore';

interface Props {
  category: Category;
}

interface Section {
  title: string;
  titleKo: string;
  content: string;
  contentKo: string;
}

const categoryContent: Record<string, {
  sections: Section[];
  processSteps?: { title: string; description: string }[];
}> = {
  collective: {
    sections: [
      {
        title: 'Our Collective Vision',
        titleKo: '우리의 비전',
        content: 'REDUX is a creative collective formed by six fashion designers. We maintain our individual perspectives and styles while collaborating under a unified vision.',
        contentKo: 'REDUX는 6인의 패션 디자이너가 모여 만든 창작 집단입니다. 우리는 각자의 고유한 시각과 스타일을 유지하면서도, 하나의 통합된 비전 아래 협업합니다.'
      },
      {
        title: 'Beyond Fashion',
        titleKo: '패션을 넘어서',
        content: 'We pursue communication with art, culture, and society beyond fashion, aiming to create new aesthetic experiences. Our work becomes a medium that captures the identity and stories of the wearer.',
        contentKo: '패션을 넘어 예술, 문화, 사회와의 소통을 추구하며, 새로운 미학적 경험을 창조하고자 합니다. 우리의 작업은 단순한 의류 디자인을 넘어서, 착용자의 정체성과 이야기를 담아내는 매개체가 됩니다.'
      },
      {
        title: 'Creative Synergy',
        titleKo: '창의적 시너지',
        content: 'Each REDUX collection is born through dialogue and experimentation among designers with different backgrounds and perspectives. This process creates unpredictable creative synergy.',
        contentKo: 'REDUX의 각 컬렉션은 서로 다른 배경과 관점을 가진 디자이너들의 대화와 실험을 통해 탄생합니다. 이러한 과정은 예측할 수 없는 창의적 시너지를 만들어냅니다.'
      }
    ],
    processSteps: [
      {
        title: 'Research',
        description: '트렌드와 문화적 맥락을 연구하고, 각자의 영감을 공유하며 컬렉션의 방향성을 설정합니다.'
      },
      {
        title: 'Collaboration',
        description: '개별 작업과 공동 작업을 병행하며, 지속적인 피드백과 실험을 통해 작품을 발전시킵니다.'
      },
      {
        title: 'Creation',
        description: '최종 컬렉션은 개인의 창의성과 집단의 통합된 비전이 조화롭게 어우러진 결과물입니다.'
      }
    ]
  },
  'visual-art': {
    sections: [
      {
        title: 'Visual Language',
        titleKo: '시각적 언어',
        content: 'Our visual art transcends the boundaries between fashion and fine art, creating a new form of expression that speaks through color, form, and texture.',
        contentKo: '우리의 비주얼 아트는 패션과 순수 예술의 경계를 넘나들며, 색채와 형태, 질감을 통해 말하는 새로운 표현 형식을 창조합니다.'
      },
      {
        title: 'Experimental Approach',
        titleKo: '실험적 접근',
        content: 'Each piece is an experiment in pushing the boundaries of traditional fashion photography and art direction, creating immersive visual narratives.',
        contentKo: '각 작품은 전통적인 패션 사진과 아트 디렉션의 경계를 확장하는 실험이며, 몰입감 있는 시각적 내러티브를 창조합니다.'
      }
    ]
  },
  'fashion-film': {
    sections: [
      {
        title: 'Moving Fashion',
        titleKo: '움직이는 패션',
        content: 'Fashion films allow us to bring our designs to life, showing not just the garments but the emotions, stories, and worlds they inhabit.',
        contentKo: '패션 필름은 우리의 디자인에 생명을 불어넣어, 단순한 의류가 아닌 그것이 담고 있는 감정과 이야기, 세계관을 보여줍니다.'
      },
      {
        title: 'Cinematic Vision',
        titleKo: '영화적 비전',
        content: 'We approach each film as a short cinematic piece, where fashion becomes a character in a larger narrative about identity and transformation.',
        contentKo: '우리는 각 필름을 하나의 단편 영화로 접근하며, 패션은 정체성과 변화에 대한 더 큰 내러티브 속 캐릭터가 됩니다.'
      }
    ]
  },
  'installation': {
    sections: [
      {
        title: 'Spatial Experience',
        titleKo: '공간적 경험',
        content: 'Our installations transform spaces into immersive environments where fashion, art, and architecture converge to create unique sensory experiences.',
        contentKo: '우리의 설치 작품은 공간을 몰입형 환경으로 변화시켜, 패션과 예술, 건축이 융합되어 독특한 감각적 경험을 만들어냅니다.'
      },
      {
        title: 'Interactive Elements',
        titleKo: '상호작용 요소',
        content: 'Visitors become participants in our installations, their presence and movement completing the artistic vision we present.',
        contentKo: '관람객은 우리 설치 작품의 참여자가 되며, 그들의 존재와 움직임이 우리가 제시하는 예술적 비전을 완성합니다.'
      }
    ]
  },
  'memory': {
    sections: [
      {
        title: 'Collective Memory',
        titleKo: '집단 기억',
        content: 'Memory serves as both inspiration and medium in our work, exploring how personal and collective memories shape our understanding of fashion and identity.',
        contentKo: '기억은 우리 작업의 영감이자 매개체로, 개인적이고 집단적인 기억이 패션과 정체성에 대한 이해를 어떻게 형성하는지 탐구합니다.'
      },
      {
        title: 'Temporal Layers',
        titleKo: '시간의 층위',
        content: 'Each piece contains layers of time and memory, creating garments that are both contemporary and timeless, personal and universal.',
        contentKo: '각 작품은 시간과 기억의 층위를 담고 있어, 동시대적이면서도 시대를 초월하고, 개인적이면서도 보편적인 의류를 창조합니다.'
      }
    ]
  }
};

export default function AboutCategoryDetail({ category }: Props) {
  const { 
    isAdmin, 
    aboutImages, 
    updateCategoryImage,
    addAboutImage, 
    removeAboutImage,
    updateCategory
  } = useContentStore();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  
  const categoryImages = aboutImages[category.id] || [];
  const content = categoryContent[category.id] || { sections: [] };
  
  const handleCoverImageUpdate = (newSrc: string) => {
    updateCategoryImage(category.id, newSrc);
  };
  
  const handleVideoUpdate = (newUrl: string) => {
    updateCategory(category.id, { videoUrl: newUrl });
  };
  
  const handleAddImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Temporary placeholder - EditableImage will handle actual upload
        const placeholderUrl = 'https://ik.imagekit.io/t914/redux/placeholder.jpg';
        addAboutImage(category.id, placeholderUrl);
      }
    };
    fileInput.click();
  };
  
  const handleRemoveImage = (index: number) => {
    removeAboutImage(category.id, index);
  };

  return (
    <section className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <EditableImage
          src={category.coverImage || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
          alt={category.title}
          className="object-cover"
          sizes="100vw"
          onImageUpdate={handleCoverImageUpdate}
          category={`about/${category.id}/cover`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/about"
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-black/70 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{category.title}</h1>
              <p className="text-xl text-gray-300">{category.titleKo}</p>
              <p className="text-lg text-gray-400 mt-4 max-w-3xl">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container py-16">
        {/* Content Sections */}
        <div className="max-w-4xl mx-auto mb-20">
          {content.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="mb-16 last:mb-0"
            >
              <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
              <p className="text-lg text-gray-400 mb-6">{section.titleKo}</p>
              <div className="space-y-4">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {section.content}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {section.contentKo}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Process Steps (if available) */}
        {content.processSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative bg-zinc-900 p-8 rounded-xl overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
                  <div className="absolute top-4 right-4 text-7xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 relative z-10">{step.title}</h3>
                  <p className="text-gray-400 relative z-10">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Video Section */}
        {(category.videoUrl || isAdmin) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8">Featured Video</h2>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
              <EditableVideo
                src={category.videoUrl || ''}
                className="w-full h-full object-cover"
                controls={false}
                autoPlay={videoPlaying}
                muted={videoMuted}
                loop
                onUpdate={handleVideoUpdate}
                category={`about/${category.id}/video`}
              />
              
              {/* Custom Video Controls */}
              {category.videoUrl && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                    >
                      {videoPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                      onClick={() => setVideoMuted(!videoMuted)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                    >
                      {videoMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Gallery</h2>
              <p className="text-gray-400">Visual exploration of {category.title}</p>
            </div>
            {isAdmin && (
              <button
                onClick={handleAddImage}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Plus size={18} />
                <span>Add Image</span>
              </button>
            )}
          </div>
          
          {categoryImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <EditableImage
                    src={image}
                    alt={`${category.title} gallery ${index + 1}`}
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onImageUpdate={(newSrc) => {
                      const newImages = [...categoryImages];
                      newImages[index] = newSrc;
                      // This would update through the store
                    }}
                    category={`about/${category.id}/gallery`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image Number */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
              
              {/* Add New Image Button (Admin Only) */}
              {isAdmin && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + categoryImages.length * 0.05 }}
                  onClick={handleAddImage}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 border-2 border-dashed border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center group"
                >
                  <div className="text-center">
                    <Plus size={48} className="mx-auto mb-2 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors">Add Image</span>
                  </div>
                </motion.button>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900 rounded-xl">
              <Grid size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">No images in gallery yet</p>
              {isAdmin && (
                <button
                  onClick={handleAddImage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus size={20} />
                  <span>Add First Image</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Lightbox */}
      <Lightbox
        images={categoryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex(prev => (prev + 1) % categoryImages.length)}
        onPrevious={() => setCurrentImageIndex(prev => (prev - 1 + categoryImages.length) % categoryImages.length)}
      />
    </section>
  );
}