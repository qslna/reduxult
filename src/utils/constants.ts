export const DESIGNERS = {
  hwangjinsu: {
    id: 'hwangjinsu',
    name: 'Hwang Jinsu',
    nameKo: '황진수',
    nameEn: 'Hwang Jinsu',
    handle: 'hwangjinsu',
    instagramHandle: 'j_j_j_j_j_h',
    role: 'Fashion Designer',
    theme: 'jinsu' as const,
    description: '실험적이고 아방가르드한 디자인을 추구하는 패션 디자이너',
    profileImage: '/images/profile/Hwang Jinsu.jpg',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#000000',
      accent: '#FF0000'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/j_j_j_j_j_h'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  },
  choieunsol: {
    id: 'choieunsol',
    name: 'Choi Eunsol',
    nameKo: '최은솔',
    nameEn: 'Choi Eunsol',
    handle: 'choieunsol',
    instagramHandle: 'choieunsol.of',
    role: 'Fashion Designer',
    theme: 'eunsol' as const,
    description: '자연과 인간의 조화를 담은 지속가능한 패션을 추구',
    profileImage: '/images/profile/Choi Eunsol.jpeg',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#1a1a1a',
      accent: '#4a4a4a'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/choieunsol.of'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  },
  parkparang: {
    id: 'parkparang',
    name: 'Park Parang',
    nameKo: '박파랑',
    nameEn: 'Park Parang',
    handle: 'parkparang',
    instagramHandle: 'rannx8m',
    role: 'Visual Artist',
    theme: 'parang' as const,
    description: '시각적 내러티브를 통해 현대 사회를 탐구하는 비주얼 아티스트',
    profileImage: '/images/profile/Park Parang.jpg',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#0000FF',
      accent: '#00FFFF'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/rannx8m'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  },
  leetaehyeon: {
    id: 'leetaehyeon',
    name: 'Lee Taehyeon',
    nameKo: '이태현',
    nameEn: 'Lee Taehyeon',
    handle: 'leetaehyeon',
    instagramHandle: 'tododope',
    role: 'Fashion Designer',
    theme: 'taehyeon' as const,
    description: '전통과 현대의 경계를 넘나드는 크리에이티브 디렉터',
    profileImage: '/images/profile/Lee Taehyeon.jpg',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#FF6B00',
      accent: '#FFD600'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/tododope'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  },
  kimbomin: {
    id: 'kimbomin',
    name: 'Kim Bomin',
    nameKo: '김보민',
    nameEn: 'Kim Bomin',
    handle: 'kimbomin',
    instagramHandle: 'minectivbe',
    role: 'Creative Director',
    theme: 'bomin' as const,
    description: '미니멀하면서도 임팩트 있는 디자인을 추구하는 크리에이티브 디렉터',
    profileImage: '/images/profile/Kim Bomin.webp',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#FF1493',
      accent: '#FF69B4'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/minectivbe'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  },
  kimgyeongsu: {
    id: 'kimgyeongsu',
    name: 'Kim Gyeongsu',
    nameKo: '김경수',
    nameEn: 'Kim Gyeongsu',
    handle: 'kimgyeongsu',
    instagramHandle: 'gang._.soo__',
    role: 'Fashion Designer',
    theme: 'gyeongsu' as const,
    description: '구조적 실루엣과 혁신적인 소재를 탐구하는 패션 디자이너',
    profileImage: '/images/profile/Kim Gyeongsu.webp',
    portfolioImages: [] as string[],
    bio: '',
    skills: [],
    colors: {
      primary: '#2c2c2c',
      accent: '#8b8b8b'
    },
    fonts: {
      primary: 'Space Grotesk',
      display: 'Space Grotesk'
    },
    contact: {
      instagram: 'https://instagram.com/gang._.soo__'
    },
    galleries: {
      portfolio: [],
      cinemode: [],
      experimental: []
    }
  }
};

export const DESIGNER_LIST = Object.values(DESIGNERS);

export const NAVIGATION_ITEMS = [
  {
    label: 'About',
    dropdown: [
      { label: 'Collective', href: '/about/collective' },
      { label: 'Fashion Film', href: '/about/fashion-film' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Process', href: '/about/installation' },
      { label: 'Memory', href: '/about/memory' }
    ]
  },
  {
    label: 'Designers',
    href: '/designers'
  },
  {
    label: 'Exhibitions',
    href: '/exhibitions'
  },
  {
    label: 'Contact',
    href: '/contact'
  }
];

export const GALLERY_CATEGORIES = ['portfolio', 'cinemode', 'experimental'] as const;

export const IMAGE_FORMATS = {
  thumbnail: { width: 300, height: 300, quality: 80 },
  gallery: { width: 800, height: 800, quality: 85 },
  full: { width: 1920, height: 1920, quality: 90 }
};

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8
  },
  ease: {
    out: [0.65, 0, 0.35, 1],
    inOut: [0.65, 0, 0.35, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  }
};

export const STACK_GALLERY_CONFIG = {
  maxItems: 3,
  rotation: {
    min: -15,
    max: 15
  },
  offset: {
    x: { min: -20, max: 20 },
    y: { min: -10, max: 10 }
  },
  scale: {
    hover: 1.05,
    base: 1
  }
};