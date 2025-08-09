// CMS 슬롯 설정 및 관리
export type SlotType = 'single-image' | 'single-video' | 'gallery' | 'google-drive-video';

export interface MediaSlot {
  id: string;
  type: SlotType;
  name: string;
  description: string;
  category: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1=최고, 5=최낮음
  maxFiles?: number; // 갤러리용
  supportedFormats: string[];
  currentFiles: string[];
  page: string;
  section: string;
}

// CMS 슬롯 정의 - 우선순위 순으로 정렬
export const mediaSlots: MediaSlot[] = [
  // ⭐ 최고 우선순위 (Priority 1) - 9개 슬롯
  {
    id: 'main-hero-video',
    type: 'single-video',
    name: '메인 페이지 Hero 동영상',
    description: '메인 페이지 전체 화면 배경 동영상',
    category: 'main',
    priority: 1,
    supportedFormats: ['mp4', 'webm'],
    currentFiles: ['/VIDEO/main.mp4'],
    page: '/',
    section: 'hero'
  },
  
  // 디자이너 Fashion Film 동영상 (6개)
  {
    id: 'designer-kimbomin-film',
    type: 'google-drive-video',
    name: 'Kim Bomin 패션 필름',
    description: 'CHASING VOWS - Kim Bomin 패션 필름',
    category: 'fashion-film',
    priority: 1,
    supportedFormats: ['google-drive'],
    currentFiles: ['1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X'],
    page: '/about/fashion-film',
    section: 'films'
  },
  {
    id: 'designer-parkparang-film',
    type: 'google-drive-video',
    name: 'Park Parang 패션 필름',
    description: 'THE TIME BETWEEN - Park Parang 패션 필름',
    category: 'fashion-film',
    priority: 1,
    supportedFormats: ['google-drive'],
    currentFiles: ['15d901XRElkF5p7xiJYelIyblYFb-PtsD'],
    page: '/about/fashion-film',
    section: 'films'
  },
  {
    id: 'designer-leetaehyeon-film',
    type: 'google-drive-video',
    name: 'Lee Taehyeon 패션 필름',
    description: 'POLYHEDRON - Lee Taehyeon 패션 필름',
    category: 'fashion-film',
    priority: 1,
    supportedFormats: ['google-drive'],
    currentFiles: ['1fG2fchKvEG7i7Lo79K7250mgiVTse6ks'],
    page: '/about/fashion-film',
    section: 'films'
  },
  {
    id: 'designer-choieunsol-film',
    type: 'google-drive-video',
    name: 'Choi Eunsol 패션 필름',
    description: 'SOUL SUCKER - Choi Eunsol 패션 필름',
    category: 'fashion-film',
    priority: 1,
    supportedFormats: ['google-drive'],
    currentFiles: ['1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3'],
    page: '/about/fashion-film',
    section: 'films'
  },
  {
    id: 'designer-kimgyeongsu-film',
    type: 'google-drive-video',
    name: 'Kim Gyeongsu 패션 필름',
    description: 'TO BE REVEALED - Kim Gyeongsu 패션 필름',
    category: 'fashion-film',
    priority: 1,
    supportedFormats: ['google-drive'],
    currentFiles: ['1Hl594dd_MY714hZwmklTAPTc-pofe9bY'],
    page: '/about/fashion-film',
    section: 'films'
  },
  
  // 메인 페이지 디자이너 프로필 대표 이미지 (2개)
  {
    id: 'main-designer-profile-kimbomin',
    type: 'single-image',
    name: 'Kim Bomin 프로필 이미지',
    description: '메인 페이지 디자이너 그리드 - Kim Bomin',
    category: 'main-profiles',
    priority: 1,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Kim Bomin.webp'],
    page: '/',
    section: 'showcase'
  },
  {
    id: 'main-designer-profile-leetaehyeon',
    type: 'single-image',
    name: 'Lee Taehyeon 프로필 이미지',
    description: '메인 페이지 디자이너 그리드 - Lee Taehyeon (창립자)',
    category: 'main-profiles',
    priority: 1,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Lee Taehyeon.jpg'],
    page: '/',
    section: 'showcase'
  },

  // ⭐ 높은 우선순위 (Priority 2) - 25개 슬롯
  // 메인 페이지 디자이너 프로필 나머지 (4개)
  {
    id: 'main-designer-profile-parkparang',
    type: 'single-image',
    name: 'Park Parang 프로필 이미지',
    description: '메인 페이지 디자이너 그리드 - Park Parang',
    category: 'main-profiles',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Park Parang.jpg'],
    page: '/',
    section: 'showcase'
  },
  {
    id: 'main-designer-profile-choieunsol',
    type: 'single-image',
    name: 'Choi Eunsol 프로필 이미지',
    description: '메인 페이지 디자이너 그리드 - Choi Eunsol',
    category: 'main-profiles',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Choi Eunsol.jpeg'],
    page: '/',
    section: 'showcase'
  },
  {
    id: 'main-designer-profile-kimgyeongsu',
    type: 'single-image',
    name: 'Kim Gyeongsu 프로필 이미지',
    description: '메인 페이지 디자이너 그리드 - Kim Gyeongsu',
    category: 'main-profiles',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Kim Gyeongsu.webp'],
    page: '/',
    section: 'showcase'
  },

  // 메인 페이지 전시 프리뷰 (2개)
  {
    id: 'main-exhibition-cinemode',
    type: 'single-image',
    name: 'CINE MODE 전시 프리뷰',
    description: '메인 페이지 전시 프리뷰 - CINE MODE',
    category: 'main-exhibitions',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/exhibitions/cinemode/1.jpg'],
    page: '/',
    section: 'showcase'
  },
  {
    id: 'main-exhibition-theroom',
    type: 'single-image',
    name: 'THE ROOM OF [] 전시 프리뷰',
    description: '메인 페이지 전시 프리뷰 - THE ROOM OF []',
    category: 'main-exhibitions',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/exhibitions/theroom/qslna_mirror-box_installation_four_polished_steel_walls_refle_4ffced5d-0e8e-41c6-a7ad-8f08583b1c72_2.png'],
    page: '/',
    section: 'showcase'
  },

  // About Fashion Film 썸네일 갤러리 (6개)
  {
    id: 'about-fashionfilm-kimbomin-thumbnail',
    type: 'single-image',
    name: 'Kim Bomin 패션 필름 썸네일',
    description: 'About 페이지 패션 필름 썸네일 - Kim Bomin',
    category: 'about-fashion-film',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/kimbomin/cinemode/NOR_7419-11.jpg'],
    page: '/about/fashion-film',
    section: 'thumbnails'
  },
  {
    id: 'about-fashionfilm-parkparang-thumbnail',
    type: 'single-image',
    name: 'Park Parang 패션 필름 썸네일',
    description: 'About 페이지 패션 필름 썸네일 - Park Parang',
    category: 'about-fashion-film',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Park Parang.jpg'],
    page: '/about/fashion-film',
    section: 'thumbnails'
  },
  {
    id: 'about-fashionfilm-leetaehyeon-thumbnail',
    type: 'single-image',
    name: 'Lee Taehyeon 패션 필름 썸네일',
    description: 'About 페이지 패션 필름 썸네일 - Lee Taehyeon',
    category: 'about-fashion-film',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg'],
    page: '/about/fashion-film',
    section: 'thumbnails'
  },
  {
    id: 'about-fashionfilm-choieunsol-thumbnail',
    type: 'single-image',
    name: 'Choi Eunsol 패션 필름 썸네일',
    description: 'About 페이지 패션 필름 썸네일 - Choi Eunsol',
    category: 'about-fashion-film',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/choieunsol/cinemode/IMG_8617.jpeg'],
    page: '/about/fashion-film',
    section: 'thumbnails'
  },
  {
    id: 'about-fashionfilm-kimgyeongsu-thumbnail',
    type: 'single-image',
    name: 'Kim Gyeongsu 패션 필름 썸네일',
    description: 'About 페이지 패션 필름 썸네일 - Kim Gyeongsu',
    category: 'about-fashion-film',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/kimgyeongsu/Showcase/IMG_2544.jpg'],
    page: '/about/fashion-film',
    section: 'thumbnails'
  },

  // Exhibition CINE MODE 갤러리 (4개)
  {
    id: 'exhibition-cinemode-gallery',
    type: 'gallery',
    name: 'CINE MODE 전시 갤러리',
    description: 'CINE MODE 전시회 갤러리 이미지들',
    category: 'exhibitions',
    priority: 2,
    maxFiles: 10,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/exhibitions/cinemode/1.jpg',
      '/images/exhibitions/cinemode/2.jpg',
      '/images/exhibitions/cinemode/3.jpg',
      '/images/exhibitions/cinemode/4.jpg'
    ],
    page: '/exhibitions',
    section: 'cinemode-gallery'
  },

  // Exhibition THE ROOM 갤러리 (3개)
  {
    id: 'exhibition-theroom-gallery',
    type: 'gallery',
    name: 'THE ROOM OF [] 전시 갤러리',
    description: 'THE ROOM OF [] 전시회 갤러리 이미지들',
    category: 'exhibitions',
    priority: 2,
    maxFiles: 10,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/exhibitions/theroom/qslna_dawn_alleyway_low-angle_28_mm_R13_2025_layered_denim-ov_828e4c6e-0b81-4949-8c96-7e241f9a3c03_0.png',
      '/images/exhibitions/theroom/qslna_minimalist_concrete_courtyard_high-key_daylight_overcas_85d5cd51-4cd3-40e8-9111-12e1bf3c2bdd_0.png',
      '/images/exhibitions/theroom/qslna_mirror-box_installation_four_polished_steel_walls_refle_4ffced5d-0e8e-41c6-a7ad-8f08583b1c72_2.png',
      '/images/exhibitions/theroom/qslna_split-frame_triptych_left_strip--front_close-crop_of_ma_25f1d65c-d800-4e74-9a72-5919d703eeb2_1.png'
    ],
    page: '/exhibitions',
    section: 'theroom-gallery'
  },

  // 디자이너 커버 이미지 (6개)
  {
    id: 'designer-kimbomin-cover',
    type: 'single-image',
    name: 'Kim Bomin 커버 이미지',
    description: '디자이너 개별 페이지 커버 - Kim Bomin',
    category: 'designer-covers',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/kimbomin/cinemode/NOR_7419-11.jpg'],
    page: '/designers/kimbomin',
    section: 'cover'
  },
  {
    id: 'designer-parkparang-cover',
    type: 'single-image',
    name: 'Park Parang 커버 이미지',
    description: '디자이너 개별 페이지 커버 - Park Parang',
    category: 'designer-covers',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/profile/Park Parang.jpg'],
    page: '/designers/parkparang',
    section: 'cover'
  },
  {
    id: 'designer-leetaehyeon-cover',
    type: 'single-image',
    name: 'Lee Taehyeon 커버 이미지',
    description: '디자이너 개별 페이지 커버 - Lee Taehyeon',
    category: 'designer-covers',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg'],
    page: '/designers/leetaehyeon',
    section: 'cover'
  },
  {
    id: 'designer-choieunsol-cover',
    type: 'single-image',
    name: 'Choi Eunsol 커버 이미지',
    description: '디자이너 개별 페이지 커버 - Choi Eunsol',
    category: 'designer-covers',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/choieunsol/cinemode/IMG_8617.jpeg'],
    page: '/designers/choieunsol',
    section: 'cover'
  },
  {
    id: 'designer-kimgyeongsu-cover',
    type: 'single-image',
    name: 'Kim Gyeongsu 커버 이미지',
    description: '디자이너 개별 페이지 커버 - Kim Gyeongsu',
    category: 'designer-covers',
    priority: 2,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: ['/images/designers/kimgyeongsu/Showcase/IMG_5568.JPG'],
    page: '/designers/kimgyeongsu',
    section: 'cover'
  },

  // ⭐ 중간 우선순위 (Priority 3) - 50+ 개 슬롯
  // About Visual Art 갤러리
  {
    id: 'about-visualart-gallery',
    type: 'gallery',
    name: 'Visual Art 갤러리',
    description: 'About Visual Art 섹션 갤러리 이미지들',
    category: 'about-visual-art',
    priority: 3,
    maxFiles: 20,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/about/visual-art/Analog Memories.png',
      '/images/about/visual-art/Collective Vision.png',
      '/images/about/visual-art/Color Theory.png',
      '/images/about/visual-art/Digital Dreams.png',
      '/images/about/visual-art/Form & Void.png',
      '/images/about/visual-art/Metamorphosis.png',
      '/images/about/visual-art/Shadow Play.png',
      '/images/about/visual-art/Texture Study.png'
    ],
    page: '/about/visual-art',
    section: 'gallery'
  },

  // About Memory 갤러리 (대형)
  {
    id: 'about-memory-gallery',
    type: 'gallery',
    name: 'Memory 갤러리',
    description: 'About Memory 섹션 대형 갤러리 - 추억과 기억의 아카이브',
    category: 'about-memory',
    priority: 3,
    maxFiles: 100, // 대형 갤러리
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/about/memory/0C22A68E-AADF-4A8D-B5E7-44DDBA2EE64F.jpeg',
      '/images/about/memory/83C1CE7D-97A9-400F-9403-60E89979528A.jpg',
      '/images/about/memory/IMG_1728.jpeg',
      '/images/about/memory/IMG_3452.JPG',
      '/images/about/memory/IMG_3454.JPG',
      '/images/about/memory/IMG_3455.JPG',
      '/images/about/memory/IMG_3481.JPG',
      '/images/about/memory/IMG_3491.JPG',
      '/images/about/memory/IMG_3492.JPG',
      '/images/about/memory/IMG_3493.JPG',
      '/images/about/memory/IMG_4339.JPG',
      '/images/about/memory/IMG_4345.JPG',
      '/images/about/memory/IMG_4348.JPG',
      '/images/about/memory/IMG_4367.JPG',
      '/images/about/memory/IMG_5380.JPG',
      '/images/about/memory/IMG_5381.JPG',
      '/images/about/memory/IMG_5382.JPG',
      '/images/about/memory/IMG_5383.JPG',
      '/images/about/memory/IMG_7103.jpeg',
      '/images/about/memory/IMG_7146.jpeg',
      '/images/about/memory/IMG_7272.jpeg',
      '/images/about/memory/KakaoTalk_20250626_002430368.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_01.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_02.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_03.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_04.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_05.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_06.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_07.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_08.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_09.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_10.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_11.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_12.jpg',
      '/images/about/memory/KakaoTalk_20250626_002430368_13.jpg',
      '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-00 001.jpeg',
      '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 002.jpeg',
      '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 003.jpeg',
      '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 004.jpeg',
      '/images/about/memory/KakaoTalk_Photo_2025-06-29-18-44-01 005.jpeg',
      '/images/about/memory/스크린샷 2025-06-29 오후 6.34.28.png',
      '/images/about/memory/스크린샷 2025-06-29 오후 6.34.54.png',
      '/images/about/memory/스크린샷 2025-06-29 오후 6.35.10.png'
    ],
    page: '/about/memory',
    section: 'gallery'
  },

  // 디자이너 포트폴리오 갤러리 (6개 - 개별 관리)
  {
    id: 'designer-kimbomin-portfolio',
    type: 'gallery',
    name: 'Kim Bomin 포트폴리오',
    description: 'Kim Bomin 디자이너 포트폴리오 갤러리',
    category: 'designer-portfolios',
    priority: 3,
    maxFiles: 50,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 001.jpeg',
      '/images/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 002.jpeg',
      '/images/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 003.jpeg',
      '/images/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 004.jpeg',
      '/images/designers/kimbomin/cinemode/KakaoTalk_20250626_002430368_14.jpg',
      '/images/designers/kimbomin/cinemode/KakaoTalk_20250626_002430368_15.jpg'
    ],
    page: '/designers/kimbomin',
    section: 'portfolio'
  },
  {
    id: 'designer-parkparang-portfolio',
    type: 'gallery',
    name: 'Park Parang 포트폴리오',
    description: 'Park Parang 디자이너 포트폴리오 갤러리',
    category: 'designer-portfolios',
    priority: 3,
    maxFiles: 50,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/profile/Park Parang.jpg'
    ],
    page: '/designers/parkparang',
    section: 'portfolio'
  },
  {
    id: 'designer-leetaehyeon-portfolio',
    type: 'gallery',
    name: 'Lee Taehyeon 포트폴리오',
    description: 'Lee Taehyeon 디자이너 포트폴리오 갤러리',
    category: 'designer-portfolios',
    priority: 3,
    maxFiles: 50,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/designers/leetaehyeon/portfolio/15.png',
      '/images/designers/leetaehyeon/portfolio/21.png',
      '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_01.jpg',
      '/images/designers/leetaehyeon/cinemode/KakaoTalk_20250628_134001383_02.jpg'
    ],
    page: '/designers/leetaehyeon',
    section: 'portfolio'
  },
  {
    id: 'designer-choieunsol-portfolio',
    type: 'gallery',
    name: 'Choi Eunsol 포트폴리오',
    description: 'Choi Eunsol 디자이너 포트폴리오 갤러리',
    category: 'designer-portfolios',
    priority: 3,
    maxFiles: 50,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
      '/images/designers/choieunsol/cinemode/IMG_8618.jpeg',
      '/images/designers/choieunsol/cinemode/IMG_8619.jpeg',
      '/images/designers/choieunsol/cinemode/IMG_8620.jpeg',
      '/images/designers/choieunsol/cinemode/IMG_8621.jpeg'
    ],
    page: '/designers/choieunsol',
    section: 'portfolio'
  },
  {
    id: 'designer-kimgyeongsu-portfolio',
    type: 'gallery',
    name: 'Kim Gyeongsu 포트폴리오',
    description: 'Kim Gyeongsu 디자이너 포트폴리오 갤러리 (가장 많은 이미지)',
    category: 'designer-portfolios',
    priority: 3,
    maxFiles: 50,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [
      '/images/designers/kimgyeongsu/portfolio/IMG_5488.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5489.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5502.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5503.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5504.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5505.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5506.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5507.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5508.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5509.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5510.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5511.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5512.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5514.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5515.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5516.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5517.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5519.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5561.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5562.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5563.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5564.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5565.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5566.JPG',
      '/images/designers/kimgyeongsu/portfolio/IMG_5567.JPG'
    ],
    page: '/designers/kimgyeongsu',
    section: 'portfolio'
  },

  // ⭐ 낮은 우선순위 (Priority 4-5) - 향후 확장용
  // About Installation & Collective 갤러리는 향후 추가
  {
    id: 'about-installation-gallery',
    type: 'gallery',
    name: 'Installation 갤러리',
    description: 'About Installation 섹션 갤러리 (향후 추가)',
    category: 'about-installation',
    priority: 4,
    maxFiles: 20,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [],
    page: '/about/installation',
    section: 'gallery'
  },
  {
    id: 'about-collective-gallery',
    type: 'gallery',
    name: 'Collective 갤러리',
    description: 'About Collective 섹션 갤러리 (향후 추가)',
    category: 'about-collective',
    priority: 4,
    maxFiles: 20,
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    currentFiles: [],
    page: '/about/collective',
    section: 'gallery'
  }
];

// 카테고리별 슬롯 필터링 함수
export const getSlotsByCategory = (category: string): MediaSlot[] => {
  return mediaSlots.filter(slot => slot.category === category);
};

// 우선순위별 슬롯 필터링 함수
export const getSlotsByPriority = (priority: number): MediaSlot[] => {
  return mediaSlots.filter(slot => slot.priority === priority);
};

// 페이지별 슬롯 필터링 함수
export const getSlotsByPage = (page: string): MediaSlot[] => {
  return mediaSlots.filter(slot => slot.page === page);
};

// 특정 슬롯 찾기
export const getSlotById = (id: string): MediaSlot | undefined => {
  return mediaSlots.find(slot => slot.id === id);
};

// 슬롯 타입별 필터링
export const getSlotsByType = (type: SlotType): MediaSlot[] => {
  return mediaSlots.filter(slot => slot.type === type);
};

// CMS 관리 통계
export const getCMSStats = () => {
  const stats = {
    totalSlots: mediaSlots.length,
    byPriority: {
      1: getSlotsByPriority(1).length,
      2: getSlotsByPriority(2).length,
      3: getSlotsByPriority(3).length,
      4: getSlotsByPriority(4).length,
      5: getSlotsByPriority(5).length
    },
    byType: {
      'single-image': getSlotsByType('single-image').length,
      'single-video': getSlotsByType('single-video').length,
      'gallery': getSlotsByType('gallery').length,
      'google-drive-video': getSlotsByType('google-drive-video').length
    },
    byCategory: mediaSlots.reduce((acc, slot) => {
      acc[slot.category] = (acc[slot.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
  
  return stats;
};