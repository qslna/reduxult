// About 페이지 카테고리별 갤러리 이미지 데이터

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface CategoryGallery {
  id: string;
  name: string;
  description: string;
  images: GalleryImage[];
  previewImages: GalleryImage[]; // 메인 About 페이지에서 미리보기용
}

export const aboutGalleries: CategoryGallery[] = [
  {
    id: 'fashion-film',
    name: 'Fashion Film',
    description: '패션필름을 통한 스토리텔링',
    images: [
      {
        src: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
        alt: 'Fashion Film - Choi Eunsol Scene 1',
        title: 'Choi Eunsol - CINE MODE',
        description: 'Fashion film scene from Choi Eunsol collection'
      },
      {
        src: '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg',
        alt: 'Fashion Film - Hwang Jinsu Scene 1',
        title: 'Hwang Jinsu - NOR Collection',
        description: 'Cinematic moment from Hwang Jinsu fashion film'
      },
      {
        src: '/images/designers/jangmingyu/cinemode/jangmingyufilm1.jpg',
        alt: 'Fashion Film - Jang Mingyu Scene 1',
        title: 'Jang Mingyu - Film Collection',
        description: 'Creative fashion film by Jang Mingyu'
      },
      {
        src: '/images/designers/kimbomin/cinemode/NOR_7987.jpg',
        alt: 'Fashion Film - Kim Bomin Scene 1',
        title: 'Kim Bomin - Visual Narrative',
        description: 'Fashion storytelling through Kim Bomin lens'
      },
      {
        src: '/images/designers/leesoyeon/cinemode/leesoyeonfilm1.jpg',
        alt: 'Fashion Film - Lee Soyeon Scene 1',
        title: 'Lee Soyeon - Motion Study',
        description: 'Dynamic fashion film by Lee Soyeon'
      },
      {
        src: '/images/designers/yangjiwon/cinemode/yangjiwonfilm1.jpg',
        alt: 'Fashion Film - Yang Jiwon Scene 1',
        title: 'Yang Jiwon - Cinematic Vision',
        description: 'Artistic fashion film by Yang Jiwon'
      }
    ],
    previewImages: [
      {
        src: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
        alt: 'Fashion Film Preview 1'
      },
      {
        src: '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg',
        alt: 'Fashion Film Preview 2'
      },
      {
        src: '/images/designers/jangmingyu/cinemode/jangmingyufilm1.jpg',
        alt: 'Fashion Film Preview 3'
      }
    ]
  },
  {
    id: 'visual-art',
    name: 'Visual Art',
    description: '시각예술을 통한 표현',
    images: [
      {
        src: '/images/about/visual-art/Metamorphosis.png',
        alt: 'Visual Art - Metamorphosis',
        title: 'Metamorphosis',
        description: 'Visual art piece exploring transformation'
      },
      {
        src: '/images/about/visual-art/Renewal.png',
        alt: 'Visual Art - Renewal',
        title: 'Renewal',
        description: 'Artistic interpretation of rebirth and renewal'
      },
      {
        src: '/images/about/visual-art/Revival.png',
        alt: 'Visual Art - Revival',
        title: 'Revival',
        description: 'Contemporary visual art on revival themes'
      },
      {
        src: '/images/about/visual-art/Transformation.png',
        alt: 'Visual Art - Transformation',
        title: 'Transformation',
        description: 'Artistic exploration of change and evolution'
      },
      {
        src: '/images/about/visual-art/Renovation.png',
        alt: 'Visual Art - Renovation',
        title: 'Renovation',
        description: 'Visual narrative on renovation and change'
      }
    ],
    previewImages: [
      {
        src: '/images/about/visual-art/Metamorphosis.png',
        alt: 'Visual Art Preview 1'
      },
      {
        src: '/images/about/visual-art/Renewal.png',
        alt: 'Visual Art Preview 2'
      },
      {
        src: '/images/about/visual-art/Revival.png',
        alt: 'Visual Art Preview 3'
      }
    ]
  },
  {
    id: 'memory',
    name: 'Memory',
    description: '기억에 남을 순간',
    images: [
      {
        src: '/images/about/memory/memory-collection-1.jpg',
        alt: 'Memory Collection 1',
        title: 'Nostalgic Moments',
        description: 'Capturing moments that remain in memory'
      },
      {
        src: '/images/about/memory/memory-collection-2.jpg',
        alt: 'Memory Collection 2',
        title: 'Temporal Fragments',
        description: 'Fragmented memories through visual narrative'
      },
      {
        src: '/images/about/memory/memory-collection-3.jpg',
        alt: 'Memory Collection 3',
        title: 'Remembered Spaces',
        description: 'Spaces that hold our deepest memories'
      },
      {
        src: '/images/about/memory/memory-collection-4.jpg',
        alt: 'Memory Collection 4',
        title: 'Emotional Landscapes',
        description: 'Landscapes of memory and emotion'
      }
    ],
    previewImages: [
      {
        src: '/images/exhibition/memory-1.jpg',
        alt: 'Memory Preview 1'
      },
      {
        src: '/images/exhibition/memory-2.jpg',
        alt: 'Memory Preview 2'
      },
      {
        src: '/images/exhibition/memory-3.jpg',
        alt: 'Memory Preview 3'
      }
    ]
  },
  {
    id: 'installation',
    name: 'Installation',
    description: '공간을 통한 경험',
    images: [
      {
        src: '/images/about/installation/installation-1.jpg',
        alt: 'Installation Art 1',
        title: 'Spatial Narrative',
        description: 'Installation exploring spatial relationships'
      },
      {
        src: '/images/about/installation/installation-2.jpg',
        alt: 'Installation Art 2',
        title: 'Interactive Environment',
        description: 'Interactive installation for audience engagement'
      },
      {
        src: '/images/about/installation/installation-3.jpg',
        alt: 'Installation Art 3',
        title: 'Immersive Experience',
        description: 'Immersive installation creating new experiences'
      },
      {
        src: '/images/about/installation/installation-4.jpg',
        alt: 'Installation Art 4',
        title: 'Material Exploration',
        description: 'Exploring materials in three-dimensional space'
      }
    ],
    previewImages: [
      {
        src: '/images/exhibition/installation-preview-1.jpg',
        alt: 'Installation Preview 1'
      },
      {
        src: '/images/exhibition/installation-preview-2.jpg',
        alt: 'Installation Preview 2'
      },
      {
        src: '/images/exhibition/installation-preview-3.jpg',
        alt: 'Installation Preview 3'
      }
    ]
  },
  {
    id: 'collective',
    name: 'Collective',
    description: '우리가 함께 만드는 이야기',
    images: [
      {
        src: '/images/designers/profile/collective-work-1.jpg',
        alt: 'Collective Work 1',
        title: 'Together We Create',
        description: 'Collaborative work by REDUX collective'
      },
      {
        src: '/images/designers/profile/collective-work-2.jpg',
        alt: 'Collective Work 2',
        title: 'Six Voices, One Vision',
        description: 'Unity in diversity through collective design'
      },
      {
        src: '/images/designers/profile/collective-work-3.jpg',
        alt: 'Collective Work 3',
        title: 'Shared Dreams',
        description: 'Dreams and visions shared among six designers'
      },
      {
        src: '/images/designers/profile/collective-work-4.jpg',
        alt: 'Collective Work 4',
        title: 'Creative Synergy',
        description: 'Synergy created through collaborative process'
      }
    ],
    previewImages: [
      {
        src: '/images/designers/choieunsol/profile/designer-placeholder.jpg',
        alt: 'Collective Preview 1'
      },
      {
        src: '/images/designers/hwangjinsu/profile/designer-placeholder.jpg',
        alt: 'Collective Preview 2'
      },
      {
        src: '/images/designers/jangmingyu/profile/designer-placeholder.jpg',
        alt: 'Collective Preview 3'
      }
    ]
  }
];

// 카테고리별 갤러리 데이터 가져오기
export const getCategoryGallery = (categoryId: string): CategoryGallery | undefined => {
  return aboutGalleries.find(gallery => gallery.id === categoryId);
};

// 모든 카테고리의 미리보기 이미지 가져오기
export const getAllPreviewImages = (): { [key: string]: GalleryImage[] } => {
  const previews: { [key: string]: GalleryImage[] } = {};
  aboutGalleries.forEach(gallery => {
    previews[gallery.id] = gallery.previewImages;
  });
  return previews;
};

// 랜덤 이미지 선택 (호버 효과용)
export const getRandomPreviewImage = (categoryId: string): GalleryImage | null => {
  const gallery = getCategoryGallery(categoryId);
  if (!gallery || gallery.previewImages.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * gallery.previewImages.length);
  return gallery.previewImages[randomIndex];
};

// 카테고리별 이미지 순환 (호버 애니메이션용)
export const getImageCycle = (categoryId: string, currentIndex: number = 0): GalleryImage | null => {
  const gallery = getCategoryGallery(categoryId);
  if (!gallery || gallery.previewImages.length === 0) return null;
  
  const nextIndex = (currentIndex + 1) % gallery.previewImages.length;
  return gallery.previewImages[nextIndex];
};