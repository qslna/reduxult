import { Designer, AboutSection, NavItem } from '@/types';

// 디자이너 정보
export const DESIGNERS: Designer[] = [
  {
    id: 'hwangjinsu',
    name: 'Hwang Jinsu',
    nameKo: '황진수',
    nameEn: 'Hwang Jinsu',
    role: 'Fashion Designer',
    description: '실험적이고 아방가르드한 디자인을 추구하는 패션 디자이너',
    profileImage: '/images/profile/Hwang Jinsu.jpg',
    instagramHandle: 'j_j_j_j_j_h',
    instagramUrl: 'https://instagram.com/j_j_j_j_j_h',
    portfolioImages: [],
    theme: {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#ff0000',
    },
  },
  {
    id: 'choieunsol',
    name: 'Choi Eunsol',
    nameKo: '최은솔',
    nameEn: 'Choi Eunsol',
    role: 'Fashion Designer',
    description: '자연과 인간의 조화를 담은 지속가능한 패션을 추구',
    profileImage: '/images/profile/Choi Eunsol.jpeg',
    instagramHandle: 'choieunsol.of',
    instagramUrl: 'https://instagram.com/choieunsol.of',
    portfolioImages: [],
    theme: {
      primary: '#1a1a1a',
      secondary: '#2a2a2a',
      accent: '#4a4a4a',
    },
  },
  {
    id: 'parkparang',
    name: 'Park Parang',
    nameKo: '박파랑',
    nameEn: 'Park Parang',
    role: 'Visual Artist',
    description: '시각적 내러티브를 통해 현대 사회를 탐구하는 비주얼 아티스트',
    profileImage: '/images/profile/Park Parang.jpg',
    instagramHandle: 'rannx8m',
    instagramUrl: 'https://instagram.com/rannx8m',
    portfolioImages: [],
    theme: {
      primary: '#0000ff',
      secondary: '#000080',
      accent: '#00ffff',
    },
  },
  {
    id: 'leetaehyeon',
    name: 'Lee Taehyeon',
    nameKo: '이태현',
    nameEn: 'Lee Taehyeon',
    role: 'Fashion Designer',
    description: '전통과 현대의 경계를 넘나드는 크리에이티브 디렉터',
    profileImage: '/images/profile/Lee Taehyeon.jpg',
    instagramHandle: 'tododope',
    instagramUrl: 'https://instagram.com/tododope',
    portfolioImages: [],
    theme: {
      primary: '#ff6b00',
      secondary: '#ff8c00',
      accent: '#ffd600',
    },
  },
  {
    id: 'kimbomin',
    name: 'Kim Bomin',
    nameKo: '김보민',
    nameEn: 'Kim Bomin',
    role: 'Creative Director',
    description: '미니멀하면서도 임팩트 있는 디자인을 추구하는 크리에이티브 디렉터',
    profileImage: '/images/designer-placeholder.jpg',
    instagramHandle: 'minectivbe',
    instagramUrl: 'https://instagram.com/minectivbe',
    portfolioImages: [],
    theme: {
      primary: '#ff1493',
      secondary: '#ff69b4',
      accent: '#ffc0cb',
    },
  },
  {
    id: 'kimgyeongsu',
    name: 'Kim Gyeongsu',
    nameKo: '김경수',
    nameEn: 'Kim Gyeongsu',
    role: 'Fashion Designer',
    description: '구조적 실루엣과 혁신적인 소재를 탐구하는 패션 디자이너',
    profileImage: '/images/designer-placeholder.jpg',
    instagramHandle: 'gang._.soo__',
    instagramUrl: 'https://instagram.com/gang._.soo__',
    portfolioImages: [],
    theme: {
      primary: '#2c2c2c',
      secondary: '#4c4c4c',
      accent: '#8b8b8b',
    },
  },
];

// About 섹션
export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: 'collective',
    title: 'Collective',
    titleKo: '컬렉티브',
    description: '협업과 공동 창작을 통한 새로운 가능성을 발견합니다',
    coverImage: '/images/about/collective/cover.jpg',
    images: [],
  },
  {
    id: 'visual-art',
    title: 'Visual Art',
    titleKo: '비주얼 아트',
    description: '시각적 장르의 예술적 표현의 경계를 탐험합니다',
    coverImage: '/images/about/visual-art/cover.jpg',
    images: [],
  },
  {
    id: 'fashion-film',
    title: 'Fashion Film',
    titleKo: '패션 필름',
    description: '패션과 영상의 만남으로 스토리텔링을 완성합니다',
    coverImage: '/images/about/fashion-film/cover.jpg',
    images: [],
  },
  {
    id: 'installation',
    title: 'Installation',
    titleKo: '인스톨레이션',
    description: '공간과 관람객이 상호작용하는 통합 예술을 경험을 제공합니다',
    coverImage: '/images/about/installation/cover.jpg',
    images: [],
  },
  {
    id: 'memory',
    title: 'Memory',
    titleKo: '메모리',
    description: '기억과 시간의 흔적을 디자인으로 표현하는 이야기를 전합니다',
    coverImage: '/images/about/memory/cover.jpg',
    images: [],
  },
];

// 네비게이션
export const NAVIGATION: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    submenu: [
      { label: 'Collective', href: '/about/collective' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Fashion Film', href: '/about/fashion-film' },
      { label: 'Installation', href: '/about/installation' },
      { label: 'Memory', href: '/about/memory' },
    ],
  },
  {
    label: 'Designers',
    href: '/designers',
  },
  {
    label: 'Exhibitions',
    href: '/exhibitions',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

// CMS 설정
export const CMS_CONFIG = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 20,
};