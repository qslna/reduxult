// SEO Optimization System - 고급 SEO 최적화 시스템
// 메타데이터, 구조화된 데이터, 성능 기반 SEO 최적화

import { Metadata } from 'next';

// 기본 SEO 설정
export const DEFAULT_SEO = {
  title: 'REDUX - Fashion Creative Collective',
  description: 'REDUX는 6인의 패션 디자이너로 구성된 창작 집단입니다. 패션 필름, 비주얼 아트, 설치 작품을 통해 새로운 패션의 가능성을 탐구합니다.',
  keywords: ['패션', '디자인', '크리에이티브', '패션필름', '비주얼아트', '설치작품', 'fashion', 'design', 'creative', 'collective'],
  author: 'REDUX Creative Collective',
  language: 'ko',
  region: 'KR',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: '#000000',
  siteUrl: 'https://reduxult.vercel.app',
  siteName: 'REDUX',
  type: 'website',
  locale: 'ko_KR',
  alternateLocales: ['en_US'],
  twitterCard: 'summary_large_image',
  twitterSite: '@redux_collective',
  facebookAppId: ''
} as const;

// 페이지별 SEO 설정
export const PAGE_SEO_CONFIG = {
  home: {
    title: 'REDUX - 패션 크리에이티브 컬렉티브',
    description: 'REDUX는 6인의 패션 디자이너로 구성된 창작 집단입니다. 혁신적인 패션 디자인과 창작 활동을 통해 새로운 예술적 가능성을 탐구합니다.',
    keywords: ['REDUX', '패션 컬렉티브', '패션 디자인', '크리에이티브', '한국 패션'],
    canonical: '/',
    ogImage: '/images/og/home.jpg',
    structuredData: {
      '@type': 'Organization',
      name: 'REDUX',
      url: DEFAULT_SEO.siteUrl,
      logo: `${DEFAULT_SEO.siteUrl}/images/logo.png`,
      description: DEFAULT_SEO.description,
      sameAs: [
        'https://instagram.com/redux_collective',
        'https://twitter.com/redux_collective'
      ]
    }
  },

  about: {
    title: 'About - REDUX 소개',
    description: 'REDUX 컬렉티브의 철학과 비전, 그리고 우리가 추구하는 창작 방향에 대해 알아보세요. 패션 필름, 비주얼 아트, 설치 작품 등 다양한 영역에서의 활동을 소개합니다.',
    keywords: ['REDUX 소개', '패션 컬렉티브 철학', '창작 비전', '패션 아트'],
    canonical: '/about',
    ogImage: '/images/og/about.jpg',
    structuredData: {
      '@type': 'AboutPage',
      name: 'About REDUX',
      description: 'REDUX 컬렉티브의 철학과 비전'
    }
  },

  designers: {
    title: 'Designers - REDUX 디자이너들',
    description: '6인의 독창적인 패션 디자이너들을 만나보세요. 각자의 고유한 스타일과 창작 철학을 바탕으로 혁신적인 패션 작품을 선보입니다.',
    keywords: ['패션 디자이너', 'REDUX 멤버', '한국 패션 디자이너', '크리에이티브 디자이너'],
    canonical: '/designers',
    ogImage: '/images/og/designers.jpg',
    structuredData: {
      '@type': 'CollectionPage',
      name: 'REDUX Designers',
      description: '6인의 패션 디자이너로 구성된 창작 집단'
    }
  },

  exhibitions: {
    title: 'Exhibitions - REDUX 전시',
    description: 'REDUX의 전시 정보와 프로젝트를 확인하세요. CINE MODE, THE ROOM OF [] 등 혁신적인 패션 전시와 설치 작품을 소개합니다.',
    keywords: ['패션 전시', 'CINE MODE', 'THE ROOM OF', '패션 설치 작품', '패션 프로젝트'],
    canonical: '/exhibitions',
    ogImage: '/images/og/exhibitions.jpg',
    structuredData: {
      '@type': 'ExhibitionEvent',
      name: 'REDUX Exhibitions',
      description: 'REDUX 컬렉티브의 전시 및 프로젝트'
    }
  },

  contact: {
    title: 'Contact - REDUX 연락처',
    description: 'REDUX와 함께 작업하고 싶으시거나 문의사항이 있으시면 언제든 연락주세요. 협업, 의뢰, 인터뷰 등 모든 문의를 환영합니다.',
    keywords: ['REDUX 연락처', '패션 협업', '디자인 의뢰', '패션 컬렉티브 문의'],
    canonical: '/contact',
    ogImage: '/images/og/contact.jpg',
    structuredData: {
      '@type': 'ContactPage',
      name: 'Contact REDUX'
    }
  }
} as const;

// 구조화된 데이터 생성
export const generateStructuredData = (type: keyof typeof PAGE_SEO_CONFIG, additionalData?: any) => {
  const baseData = {
    '@context': 'https://schema.org',
    ...PAGE_SEO_CONFIG[type].structuredData,
    ...additionalData
  };

  return JSON.stringify(baseData);
};

// 디자이너 개별 페이지 구조화된 데이터
export const generateDesignerStructuredData = (designer: {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  portfolio: string[];
  instagram?: string;
}) => {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: designer.name,
    jobTitle: designer.role,
    description: designer.bio,
    image: `${DEFAULT_SEO.siteUrl}${designer.image}`,
    url: `${DEFAULT_SEO.siteUrl}/designers/${designer.id}`,
    sameAs: designer.instagram ? [designer.instagram] : [],
    worksFor: {
      '@type': 'Organization',
      name: 'REDUX',
      url: DEFAULT_SEO.siteUrl
    },
    knowsAbout: ['Fashion Design', 'Creative Direction', 'Visual Art'],
    alumniOf: '패션 디자인 전공' // 실제 데이터로 교체 필요
  });
};

// 전시 구조화된 데이터
export const generateExhibitionStructuredData = (exhibition: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
}) => {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: exhibition.title,
    description: exhibition.description,
    startDate: exhibition.startDate,
    organizer: {
      '@type': 'Organization',
      name: 'REDUX',
      url: DEFAULT_SEO.siteUrl
    }
  };

  if (exhibition.endDate) {
    structuredData.endDate = exhibition.endDate;
  }

  if (exhibition.location) {
    structuredData.location = {
      '@type': 'Place',
      name: exhibition.location
    };
  }

  if (exhibition.image) {
    structuredData.image = `${DEFAULT_SEO.siteUrl}${exhibition.image}`;
  }

  return JSON.stringify(structuredData);
};

// 메타데이터 생성 함수
export const generateMetadata = (
  pageType: keyof typeof PAGE_SEO_CONFIG,
  overrides: Partial<{
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    ogImage: string;
    noindex: boolean;
  }> = {}
): Metadata => {
  const config = PAGE_SEO_CONFIG[pageType];
  const siteUrl = DEFAULT_SEO.siteUrl;
  
  const title = overrides.title || config.title;
  const description = overrides.description || config.description;
  const canonical = `${siteUrl}${overrides.canonical || config.canonical}`;
  const ogImage = `${siteUrl}${overrides.ogImage || config.ogImage}`;
  const keywords = overrides.keywords || config.keywords;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: DEFAULT_SEO.author }],
    robots: overrides.noindex ? 'noindex, nofollow' : DEFAULT_SEO.robots,
    viewport: DEFAULT_SEO.viewport,
    themeColor: DEFAULT_SEO.themeColor,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SEO.siteName,
      locale: DEFAULT_SEO.locale,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_SEO.twitterSite,
      title,
      description,
      images: [ogImage]
    },

    // 기본 메타 태그
    other: {
      'application-name': DEFAULT_SEO.siteName,
      'apple-mobile-web-app-title': DEFAULT_SEO.siteName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': DEFAULT_SEO.themeColor,
      'msapplication-tap-highlight': 'no'
    },

    // 정규 URL
    alternates: {
      canonical
    }
  };

  return metadata;
};

// 사이트맵 생성을 위한 URL 목록
export const generateSitemapUrls = () => {
  const baseUrl = DEFAULT_SEO.siteUrl;
  const urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/designers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/exhibitions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }
  ];

  // 디자이너 개별 페이지 추가
  const designerIds = ['kimbomin', 'parkparang', 'leetaehyeon', 'choieunsol', 'hwangjinsu', 'kimgyeongsu'];
  designerIds.forEach(id => {
    urls.push({
      url: `${baseUrl}/designers/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    });
  });

  // About 서브페이지 추가
  const aboutPages = ['collective', 'fashion-film', 'memory', 'visual-art', 'installation'];
  aboutPages.forEach(page => {
    urls.push({
      url: `${baseUrl}/about/${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    });
  });

  return urls;
};

// robots.txt 생성
export const generateRobotsTxt = () => {
  const siteUrl = DEFAULT_SEO.siteUrl;
  
  return `User-agent: *
Allow: /

# 특정 봇 최적화
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# 관리자 페이지 제외
Disallow: /admin/
Disallow: /api/

# 사이트맵 위치
Sitemap: ${siteUrl}/sitemap.xml

# 추가 사이트맵
Sitemap: ${siteUrl}/sitemap-images.xml
Sitemap: ${siteUrl}/sitemap-news.xml`;
};

// JSON-LD 스크립트 태그 생성 (JSX 요소 대신 객체 반환)
export const createJsonLdScript = (structuredData: string) => {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: structuredData }
  };
};

// 성능 기반 SEO 최적화
export const seoPerformanceOptimization = {
  // 중요 CSS 인라인화 (JSX 요소 대신 객체 반환)
  inlineCriticalCSS: (criticalCss: string) => {
    return {
      type: 'text/css',
      dangerouslySetInnerHTML: { __html: criticalCss }
    };
  },

  // 리소스 힌트 생성 (문자열 배열로 반환)
  generateResourceHints: () => {
    const hints = [
      // DNS prefetch
      '<link rel="dns-prefetch" href="//fonts.googleapis.com" />',
      '<link rel="dns-prefetch" href="//ik.imagekit.io" />',
      
      // Preconnect
      '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
      
      // Module preload
      '<link rel="modulepreload" href="/app/layout.js" />',
      '<link rel="modulepreload" href="/app/page.js" />'
    ];
    
    return hints;
  },

  // 이미지 SEO 최적화
  optimizeImageSEO: (images: { src: string; alt: string; title?: string }[]) => {
    return images.map((img, index) => ({
      ...img,
      loading: index < 3 ? 'eager' : 'lazy', // 상위 3개 이미지만 즉시 로드
      decoding: 'async',
      fetchPriority: index === 0 ? 'high' : 'auto' // 첫 번째 이미지는 고우선순위
    }));
  }
};

// 로컬 SEO (한국 특화)
export const localSEO = {
  // 한국어 SEO 최적화
  koreanSEOOptimization: {
    // 한글 키워드 최적화
    optimizeKoreanKeywords: (keywords: string[]) => {
      const koreanKeywords = [
        ...keywords,
        // 한국어 변형 추가
        ...keywords.map(keyword => `${keyword} 한국`),
        ...keywords.map(keyword => `${keyword} 서울`),
        // 영어-한국어 조합
        ...keywords.map(keyword => `Korean ${keyword}`)
      ];
      
      return Array.from(new Set(koreanKeywords)); // 중복 제거
    },

    // 한국 검색엔진 최적화
    koreanSearchEngines: {
      naver: {
        verification: '<meta name="naver-site-verification" content="[NAVER_VERIFICATION_CODE]" />',
        searchAdvisor: '<meta name="NaverBot" content="All" />',
        webmaster: '<meta name="NaverBot" content="index,follow" />'
      },
      daum: {
        verification: '<meta name="DaumVerification" content="[DAUM_VERIFICATION_CODE]" />',
        description: '<meta name="Daumoa" content="index,follow" />'
      }
    }
  },

  // 지역 정보
  locationData: {
    country: 'KR',
    region: 'Seoul',
    timezone: 'Asia/Seoul',
    currency: 'KRW',
    language: 'ko-KR'
  }
};

// SEO 체크리스트
export const seoChecklist = {
  // 기술적 SEO
  technical: [
    'robots.txt 파일 존재',
    'sitemap.xml 생성',
    'SSL 인증서 적용',
    '페이지 로딩 속도 최적화',
    '모바일 친화적 디자인',
    '구조화된 데이터 마크업',
    '메타 태그 최적화',
    '이미지 alt 태그',
    '내부 링크 구조'
  ],

  // 콘텐츠 SEO
  content: [
    '고유한 페이지 제목',
    '메타 설명 최적화',
    '헤딩 태그 구조화',
    '키워드 밀도 적정',
    '콘텐츠 품질',
    '이미지 최적화',
    '로딩 속도',
    '사용자 경험'
  ],

  // 로컬 SEO
  local: [
    '한국어 키워드 최적화',
    '네이버 웹마스터 도구 등록',
    '다음 검색등록',
    '지역 특화 콘텐츠',
    '한국 시간대 설정'
  ]
};

// SEO 성능 측정
export const measureSEO = async () => {
  if (typeof window === 'undefined') return null;

  const metrics = {
    // Core Web Vitals
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    
    // 추가 메트릭
    ttfb: 0, // Time to First Byte
    fcp: 0,  // First Contentful Paint
    
    // SEO 점수
    seoScore: 0
  };

  try {
    // Performance API를 사용한 측정
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    metrics.ttfb = navigation.responseStart - navigation.requestStart;
    metrics.fcp = navigation.loadEventEnd - (navigation as any).navigationStart;

    // SEO 점수 계산 (간단한 알고리즘)
    const hasTitle = !!document.title;
    const hasDescription = !!document.querySelector('meta[name="description"]');
    const hasKeywords = !!document.querySelector('meta[name="keywords"]');
    const hasOgTags = !!document.querySelector('meta[property^="og:"]');
    const hasStructuredData = !!document.querySelector('script[type="application/ld+json"]');
    
    metrics.seoScore = [hasTitle, hasDescription, hasKeywords, hasOgTags, hasStructuredData]
      .filter(Boolean).length * 20; // 각 항목당 20점
    
    return metrics;
  } catch (error) {
    console.error('SEO 측정 실패:', error);
    return null;
  }
};