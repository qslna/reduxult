/**
 * Page Configuration System
 * 각 페이지별 설정 및 메타데이터 관리
 */

export interface PageConfig {
  id: string;
  name: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  sections: PageSection[];
  seo: SEOConfig;
  layout: LayoutConfig;
}

export interface PageSection {
  id: string;
  name: string;
  type: 'hero' | 'gallery' | 'text' | 'video' | 'grid' | 'showcase';
  editable: boolean;
  config?: Record<string, any>;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface LayoutConfig {
  hasNavigation: boolean;
  hasFooter: boolean;
  theme: 'light' | 'dark' | 'auto';
  background?: string;
}

// 메인 페이지 설정
export const homePageConfig: PageConfig = {
  id: 'home',
  name: 'Home',
  path: '/',
  title: 'REDUX - Fashion Design Collective',
  description: 'REDUX는 5인의 패션 디자이너로 구성된 창작 집단입니다.',
  keywords: ['fashion', 'design', 'collective', 'redux', 'designers'],
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      editable: true,
      config: {
        hasVideo: true,
        hasTitle: true,
        hasSubtitle: true,
        hasCTA: true
      }
    },
    {
      id: 'showcase',
      name: 'Designer Showcase',
      type: 'showcase',
      editable: true,
      config: {
        gridColumns: 3,
        showProfiles: true,
        showExhibitions: true
      }
    }
  ],
  seo: {
    title: 'REDUX - Fashion Design Collective',
    description: 'REDUX는 5인의 패션 디자이너로 구성된 창작 집단입니다.',
    keywords: ['fashion', 'design', 'collective', 'redux', 'designers'],
    ogTitle: 'REDUX - Fashion Design Collective',
    ogDescription: 'REDUX는 5인의 패션 디자이너로 구성된 창작 집단입니다.',
    ogImage: '/images/og-home.jpg'
  },
  layout: {
    hasNavigation: true,
    hasFooter: true,
    theme: 'dark',
    background: 'gradient'
  }
};

// About 페이지 설정
export const aboutPageConfig: PageConfig = {
  id: 'about',
  name: 'About',
  path: '/about',
  title: 'About REDUX',
  description: 'REDUX 패션 디자인 집단에 대해 알아보세요.',
  keywords: ['about', 'redux', 'fashion', 'collective', 'story'],
  sections: [
    {
      id: 'intro',
      name: 'Introduction',
      type: 'text',
      editable: true
    },
    {
      id: 'categories',
      name: 'Categories',
      type: 'grid',
      editable: true,
      config: {
        categories: ['Fashion Film', 'Visual Art', 'Memory', 'Installation', 'Collective']
      }
    }
  ],
  seo: {
    title: 'About REDUX - Fashion Design Collective',
    description: 'REDUX 패션 디자인 집단에 대해 알아보세요.',
    keywords: ['about', 'redux', 'fashion', 'collective', 'story']
  },
  layout: {
    hasNavigation: true,
    hasFooter: true,
    theme: 'dark'
  }
};

// Memory 페이지 설정
export const memoryPageConfig: PageConfig = {
  id: 'memory',
  name: 'Memory',
  path: '/about/memory',
  title: 'Memory - REDUX',
  description: 'REDUX의 추억과 순간들을 담은 갤러리입니다.',
  keywords: ['memory', 'redux', 'gallery', 'moments', 'archive'],
  sections: [
    {
      id: 'hero',
      name: 'Memory Hero',
      type: 'hero',
      editable: true
    },
    {
      id: 'gallery',
      name: 'Memory Gallery',
      type: 'gallery',
      editable: true,
      config: {
        layout: 'masonry',
        allowUpload: true,
        maxImages: 100
      }
    }
  ],
  seo: {
    title: 'Memory - REDUX Fashion Collective',
    description: 'REDUX의 추억과 순간들을 담은 갤러리입니다.',
    keywords: ['memory', 'redux', 'gallery', 'moments', 'archive']
  },
  layout: {
    hasNavigation: false,
    hasFooter: false,
    theme: 'dark'
  }
};

// Fashion Film 페이지 설정
export const fashionFilmPageConfig: PageConfig = {
  id: 'fashion-film',
  name: 'Fashion Film',
  path: '/about/fashion-film',
  title: 'Fashion Film - REDUX',
  description: 'REDUX 디자이너들의 패션 필름 작품들을 만나보세요.',
  keywords: ['fashion', 'film', 'video', 'redux', 'designers'],
  sections: [
    {
      id: 'hero',
      name: 'Fashion Film Hero',
      type: 'hero',
      editable: true
    },
    {
      id: 'films',
      name: 'Films Gallery',
      type: 'video',
      editable: true,
      config: {
        videoType: 'google-drive',
        showThumbnails: true
      }
    }
  ],
  seo: {
    title: 'Fashion Film - REDUX',
    description: 'REDUX 디자이너들의 패션 필름 작품들을 만나보세요.',
    keywords: ['fashion', 'film', 'video', 'redux', 'designers']
  },
  layout: {
    hasNavigation: false,
    hasFooter: false,
    theme: 'dark'
  }
};

// 디자이너 페이지 설정
export const designersPageConfig: PageConfig = {
  id: 'designers',
  name: 'Designers',
  path: '/designers',
  title: 'Designers - REDUX',
  description: 'REDUX를 구성하는 5인의 패션 디자이너들을 만나보세요.',
  keywords: ['designers', 'fashion', 'redux', 'profiles', 'portfolio'],
  sections: [
    {
      id: 'hero',
      name: 'Designers Hero',
      type: 'hero',
      editable: true
    },
    {
      id: 'grid',
      name: 'Designers Grid',
      type: 'grid',
      editable: true,
      config: {
        gridColumns: 3,
        showBio: true,
        showPortfolio: true
      }
    }
  ],
  seo: {
    title: 'Designers - REDUX Fashion Collective',
    description: 'REDUX를 구성하는 5인의 패션 디자이너들을 만나보세요.',
    keywords: ['designers', 'fashion', 'redux', 'profiles', 'portfolio']
  },
  layout: {
    hasNavigation: true,
    hasFooter: true,
    theme: 'dark'
  }
};

// 전시 페이지 설정
export const exhibitionsPageConfig: PageConfig = {
  id: 'exhibitions',
  name: 'Exhibitions',
  path: '/exhibitions',
  title: 'Exhibitions - REDUX',
  description: 'REDUX의 전시회와 쇼케이스를 확인하세요.',
  keywords: ['exhibitions', 'shows', 'redux', 'fashion', 'events'],
  sections: [
    {
      id: 'hero',
      name: 'Exhibitions Hero',
      type: 'hero',
      editable: true
    },
    {
      id: 'cinemode',
      name: 'CINE MODE',
      type: 'gallery',
      editable: true,
      config: {
        title: 'CINE MODE',
        description: 'Our first major exhibition'
      }
    },
    {
      id: 'theroom',
      name: 'THE ROOM OF []',
      type: 'gallery',
      editable: true,
      config: {
        title: 'THE ROOM OF []',
        description: 'Our latest collaborative work'
      }
    }
  ],
  seo: {
    title: 'Exhibitions - REDUX',
    description: 'REDUX의 전시회와 쇼케이스를 확인하세요.',
    keywords: ['exhibitions', 'shows', 'redux', 'fashion', 'events']
  },
  layout: {
    hasNavigation: true,
    hasFooter: true,
    theme: 'dark'
  }
};

// 연락처 페이지 설정
export const contactPageConfig: PageConfig = {
  id: 'contact',
  name: 'Contact',
  path: '/contact',
  title: 'Contact - REDUX',
  description: 'REDUX와 연락하고 협업을 문의하세요.',
  keywords: ['contact', 'redux', 'collaboration', 'inquiry'],
  sections: [
    {
      id: 'hero',
      name: 'Contact Hero',
      type: 'hero',
      editable: true
    },
    {
      id: 'form',
      name: 'Contact Form',
      type: 'text',
      editable: false,
      config: {
        hasForm: true,
        hasMap: false
      }
    }
  ],
  seo: {
    title: 'Contact - REDUX',
    description: 'REDUX와 연락하고 협업을 문의하세요.',
    keywords: ['contact', 'redux', 'collaboration', 'inquiry']
  },
  layout: {
    hasNavigation: true,
    hasFooter: true,
    theme: 'dark'
  }
};

// 모든 페이지 설정 통합
export const allPageConfigs: Record<string, PageConfig> = {
  home: homePageConfig,
  about: aboutPageConfig,
  memory: memoryPageConfig,
  'fashion-film': fashionFilmPageConfig,
  designers: designersPageConfig,
  exhibitions: exhibitionsPageConfig,
  contact: contactPageConfig
};

// 페이지 설정 조회 함수
export const getPageConfig = (pageId: string): PageConfig | null => {
  return allPageConfigs[pageId] || null;
};

// 경로로 페이지 설정 조회
export const getPageConfigByPath = (path: string): PageConfig | null => {
  return Object.values(allPageConfigs).find(config => config.path === path) || null;
};

// 편집 가능한 섹션 조회
export const getEditableSections = (pageId: string): PageSection[] => {
  const config = getPageConfig(pageId);
  return config?.sections.filter(section => section.editable) || [];
};

// SEO 메타데이터 생성
export const generateSEOMetadata = (pageId: string) => {
  const config = getPageConfig(pageId);
  if (!config) return {};

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords.join(', '),
    openGraph: {
      title: config.seo.ogTitle || config.seo.title,
      description: config.seo.ogDescription || config.seo.description,
      images: config.seo.ogImage ? [{ url: config.seo.ogImage }] : []
    }
  };
};

export default allPageConfigs;