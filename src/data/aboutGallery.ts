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
        src: '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg',
        alt: 'Fashion Film - Kim Bomin Scene 1',
        title: 'Kim Bomin - Visual Narrative',
        description: 'Fashion storytelling through Kim Bomin lens'
      },
      {
        src: '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg',
        alt: 'Fashion Film - Lee Taehyeon Scene 1',
        title: 'Lee Taehyeon - Motion Study',
        description: 'Dynamic fashion film by Lee Taehyeon'
      },
      {
        src: '/images/designers/hwangjinsu/cinemode/📌NOR_7699.jpg',
        alt: 'Fashion Film - Hwang Jinsu Scene 2',
        title: 'Hwang Jinsu - Creative Vision',
        description: 'Artistic fashion film by Hwang Jinsu'
      },
      {
        src: '/images/exhibitions/cinemode/1.jpg',
        alt: 'Fashion Film - Exhibition Scene',
        title: 'Exhibition Moments',
        description: 'Fashion film from REDUX exhibition'
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
        src: '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg',
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
        src: '/images/about/visual-art/Digital Dreams.png',
        alt: 'Visual Art - Digital Dreams',
        title: 'Digital Dreams',
        description: 'Digital visual art exploring contemporary themes'
      },
      {
        src: '/images/about/visual-art/Form & Void.png',
        alt: 'Visual Art - Form & Void',
        title: 'Form & Void',
        description: 'Contemporary visual art on form and space'
      },
      {
        src: '/images/about/visual-art/Collective Vision.png',
        alt: 'Visual Art - Collective Vision',
        title: 'Collective Vision',
        description: 'Artistic exploration of collective creativity'
      },
      {
        src: '/images/about/visual-art/Shadow Play.png',
        alt: 'Visual Art - Shadow Play',
        title: 'Shadow Play',
        description: 'Visual narrative through shadow and light'
      }
    ],
    previewImages: [
      {
        src: '/images/about/visual-art/Metamorphosis.png',
        alt: 'Visual Art Preview 1'
      },
      {
        src: '/images/about/visual-art/Digital Dreams.png',
        alt: 'Visual Art Preview 2'
      },
      {
        src: '/images/about/visual-art/Form & Void.png',
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
        src: '/images/about/memory/IMG_3452.JPG',
        alt: 'Memory Collection 1',
        title: 'Nostalgic Moments',
        description: 'Capturing moments that remain in memory'
      },
      {
        src: '/images/about/memory/IMG_7103.jpeg',
        alt: 'Memory Collection 2',
        title: 'Temporal Fragments',
        description: 'Fragmented memories through visual narrative'
      },
      {
        src: '/images/about/memory/IMG_5380.JPG',
        alt: 'Memory Collection 3',
        title: 'Remembered Spaces',
        description: 'Spaces that hold our deepest memories'
      },
      {
        src: '/images/about/memory/KakaoTalk_20250626_002430368_01.jpg',
        alt: 'Memory Collection 4',
        title: 'Emotional Landscapes',
        description: 'Landscapes of memory and emotion'
      }
    ],
    previewImages: [
      {
        src: '/images/about/memory/IMG_3452.JPG',
        alt: 'Memory Preview 1'
      },
      {
        src: '/images/about/memory/IMG_7103.jpeg',
        alt: 'Memory Preview 2'
      },
      {
        src: '/images/about/memory/IMG_5380.JPG',
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
        src: '/images/about/process/공간  연출.png',
        alt: 'Installation Art - Spatial Direction',
        title: 'Spatial Narrative',
        description: 'Installation exploring spatial relationships'
      },
      {
        src: '/images/about/process/디렉팅.png',
        alt: 'Installation Art - Directing',
        title: 'Interactive Environment',
        description: 'Interactive installation for audience engagement'
      },
      {
        src: '/images/about/process/아트 그래픽.png',
        alt: 'Installation Art - Art Graphics',
        title: 'Immersive Experience',
        description: 'Immersive installation creating new experiences'
      },
      {
        src: '/images/about/process/영상 & 편집.png',
        alt: 'Installation Art - Video & Editing',
        title: 'Material Exploration',
        description: 'Exploring materials in three-dimensional space'
      }
    ],
    previewImages: [
      {
        src: '/images/about/process/공간  연출.png',
        alt: 'Installation Preview 1'
      },
      {
        src: '/images/about/process/디렉팅.png',
        alt: 'Installation Preview 2'
      },
      {
        src: '/images/about/process/아트 그래픽.png',
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
        src: '/images/profile/Kim Bomin.webp',
        alt: 'Collective Work - Kim Bomin',
        title: 'Together We Create',
        description: 'Collaborative work by REDUX collective'
      },
      {
        src: '/images/profile/Hwang Jinsu.jpg',
        alt: 'Collective Work - Hwang Jinsu',
        title: 'Six Voices, One Vision',
        description: 'Unity in diversity through collective design'
      },
      {
        src: '/images/profile/Choi Eunsol.jpeg',
        alt: 'Collective Work - Choi Eunsol',
        title: 'Shared Dreams',
        description: 'Dreams and visions shared among six designers'
      },
      {
        src: '/images/profile/Lee Taehyeon.jpg',
        alt: 'Collective Work - Lee Taehyeon',
        title: 'Creative Synergy',
        description: 'Synergy created through collaborative process'
      }
    ],
    previewImages: [
      {
        src: '/images/profile/Kim Bomin.webp',
        alt: 'Collective Preview 1'
      },
      {
        src: '/images/profile/Hwang Jinsu.jpg',
        alt: 'Collective Preview 2'
      },
      {
        src: '/images/profile/Choi Eunsol.jpeg',
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