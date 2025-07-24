// Responsive Design System - Advanced responsive utilities and breakpoint management
// 전문적인 반응형 디자인을 위한 고급 유틸리티 시스템

export const RESPONSIVE_BREAKPOINTS = {
  // 모바일 우선 디자인을 위한 브레이크포인트
  xs: '475px',      // 작은 모바일
  sm: '640px',      // 모바일
  md: '768px',      // 태블릿
  lg: '1024px',     // 데스크탑
  xl: '1280px',     // 대형 데스크탑
  '2xl': '1536px',  // 초대형 데스크탑
  '3xl': '1920px',  // 4K 모니터
  '4xl': '2560px'   // 8K/프로페셔널 디스플레이
} as const;

// 디바이스별 최적화 설정
export const DEVICE_CONFIGS = {
  mobile: {
    breakpoint: 'sm',
    maxWidth: '640px',
    touchOptimized: true,
    minTouchTarget: '44px',
    scrollBehavior: 'smooth',
    orientation: ['portrait', 'landscape']
  },
  tablet: {
    breakpoint: 'md',
    maxWidth: '1024px',
    touchOptimized: true,
    minTouchTarget: '44px',
    scrollBehavior: 'smooth',
    orientation: ['portrait', 'landscape']
  },
  desktop: {
    breakpoint: 'lg',
    minWidth: '1024px',
    touchOptimized: false,
    hoverEffects: true,
    keyboardNavigation: true
  },
  largeDesktop: {
    breakpoint: 'xl',
    minWidth: '1280px',
    enhanced: true,
    animations: 'full'
  }
} as const;

// 반응형 타이포그래피 시스템
export const RESPONSIVE_TYPOGRAPHY = {
  // 헤드라인 - 디바이스별 최적화
  heroTitle: {
    mobile: {
      fontSize: 'clamp(2.5rem, 12vw, 4rem)',
      lineHeight: '0.95',
      letterSpacing: '-0.02em',
      marginBottom: '1rem'
    },
    tablet: {
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      lineHeight: '0.9',
      letterSpacing: '-0.025em',
      marginBottom: '1.5rem'
    },
    desktop: {
      fontSize: 'clamp(4rem, 8vw, 8rem)',
      lineHeight: '0.9',
      letterSpacing: '-0.03em',
      marginBottom: '2rem'
    }
  },

  // 섹션 타이틀
  sectionTitle: {
    mobile: {
      fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.015em'
    },
    tablet: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    },
    desktop: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    }
  },

  // 본문 텍스트
  bodyText: {
    mobile: {
      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
      lineHeight: '1.6',
      letterSpacing: '0.01em'
    },
    tablet: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      lineHeight: '1.7',
      letterSpacing: '0.01em'
    },
    desktop: {
      fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
      lineHeight: '1.7',
      letterSpacing: '0.01em'
    }
  },

  // 네비게이션
  navigation: {
    mobile: {
      fontSize: 'clamp(1rem, 4vw, 1.25rem)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    tablet: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    desktop: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }
} as const;

// 반응형 간격 시스템
export const RESPONSIVE_SPACING = {
  // 섹션 패딩
  section: {
    mobile: {
      paddingTop: 'clamp(60px, 15vw, 100px)',
      paddingBottom: 'clamp(60px, 15vw, 100px)'
    },
    tablet: {
      paddingTop: 'clamp(80px, 12vw, 120px)',
      paddingBottom: 'clamp(80px, 12vw, 120px)'
    },
    desktop: {
      paddingTop: 'clamp(120px, 10vw, 200px)',
      paddingBottom: 'clamp(120px, 10vw, 200px)'
    }
  },

  // 컨테이너 패딩
  container: {
    mobile: '1rem',      // 16px
    tablet: '1.5rem',    // 24px
    desktop: '2rem',     // 32px
    wide: '2.5rem'       // 40px
  },

  // 그리드 갭
  grid: {
    mobile: '1rem',      // 16px
    tablet: '1.5rem',    // 24px
    desktop: '2rem'      // 32px
  },

  // 버튼 패딩
  button: {
    mobile: '12px 20px',
    tablet: '14px 24px',
    desktop: '16px 32px'
  }
} as const;

// 반응형 레이아웃 클래스
export const RESPONSIVE_LAYOUT = {
  // 컨테이너
  container: {
    base: 'w-full mx-auto',
    mobile: 'px-4 max-w-none',
    tablet: 'px-6 max-w-none',
    desktop: 'px-8 max-w-7xl',
    wide: 'px-8 max-w-[1600px]'
  },

  // 그리드 시스템
  grid: {
    // 1열에서 시작해서 점진적으로 증가
    adaptive: {
      base: 'grid gap-4',
      mobile: 'grid-cols-1',
      tablet: 'md:grid-cols-2 md:gap-6',
      desktop: 'lg:grid-cols-3 lg:gap-8',
      wide: 'xl:grid-cols-4'
    },
    
    // 갤러리용 그리드
    gallery: {
      base: 'grid gap-2',
      mobile: 'grid-cols-1',
      tablet: 'md:grid-cols-2 md:gap-1',
      desktop: 'lg:grid-cols-3 lg:gap-2',
      wide: 'xl:grid-cols-4'
    },

    // 카드 레이아웃
    cards: {
      base: 'grid gap-6',
      mobile: 'grid-cols-1',
      tablet: 'sm:grid-cols-2 md:gap-8',
      desktop: 'lg:grid-cols-3 lg:gap-10',
      wide: 'xl:grid-cols-4'
    }
  },

  // 플렉스 레이아웃
  flex: {
    // 스택 레이아웃 (모바일에서 세로, 데스크탑에서 가로)
    stack: {
      base: 'flex',
      mobile: 'flex-col space-y-4',
      tablet: 'md:flex-row md:space-y-0 md:space-x-6',
      desktop: 'lg:space-x-8'
    },

    // 센터 정렬
    center: {
      base: 'flex items-center justify-center',
      responsive: 'flex-col md:flex-row'
    },

    // 양끝 정렬
    between: {
      base: 'flex items-center justify-between',
      mobile: 'flex-col space-y-4',
      tablet: 'md:flex-row md:space-y-0'
    }
  }
} as const;

// 터치 디바이스 최적화
export const TOUCH_OPTIMIZATION = {
  // 최소 터치 영역 크기
  minTouchTarget: '44px',
  
  // 터치 친화적 버튼
  button: {
    base: 'min-h-[44px] min-w-[44px] touch-manipulation',
    padding: 'px-6 py-3 md:px-4 md:py-2',
    spacing: 'mx-2 my-1'
  },

  // 터치 친화적 링크
  link: {
    base: 'block py-3 px-4 md:py-1 md:px-2',
    navigation: 'block py-4 px-6 md:py-2 md:px-4'
  },

  // 스크롤 최적화
  scroll: {
    smooth: 'scroll-smooth',
    snap: 'scroll-snap-type-y-mandatory',
    container: 'overflow-x-hidden overflow-y-auto -webkit-overflow-scrolling-touch'
  }
} as const;

// 모션 축소 지원
export const MOTION_PREFERENCES = {
  // 애니메이션 축소 모드
  reduced: {
    duration: '0.01ms',
    disable: 'motion-reduce:transition-none motion-reduce:animate-none',
    transform: 'motion-reduce:transform-none'
  },

  // 일반 모션
  normal: {
    duration: '300ms',
    easing: 'ease-in-out',
    transform: 'transform transition-transform'
  }
} as const;

// 접근성 최적화
export const ACCESSIBILITY = {
  // 포커스 관리
  focus: {
    visible: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
    ring: 'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    skip: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50'
  },

  // 스크린 리더
  screenReader: {
    only: 'sr-only',
    focusable: 'sr-only focus:not-sr-only'
  },

  // 고대비 지원
  highContrast: {
    text: 'contrast-more:text-black contrast-more:bg-white',
    border: 'contrast-more:border-black'
  },

  // ARIA 레이블
  aria: {
    label: '[aria-label]',
    hidden: '[aria-hidden="true"]',
    expanded: '[aria-expanded]'
  }
} as const;

// 반응형 유틸리티 함수
export const responsiveUtils = {
  // 브레이크포인트 체크
  isBreakpoint: (breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS): boolean => {
    if (typeof window === 'undefined') return false;
    const bp = RESPONSIVE_BREAKPOINTS[breakpoint];
    return window.matchMedia(`(min-width: ${bp})`).matches;
  },

  // 현재 브레이크포인트 가져오기
  getCurrentBreakpoint: (): string => {
    if (typeof window === 'undefined') return 'xs';
    
    const breakpoints = Object.entries(RESPONSIVE_BREAKPOINTS);
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      const [name, size] = breakpoints[i];
      if (window.matchMedia(`(min-width: ${size})`).matches) {
        return name;
      }
    }
    return 'xs';
  },

  // 디바이스 타입 감지
  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    const breakpoint = responsiveUtils.getCurrentBreakpoint();
    if (['xs', 'sm'].includes(breakpoint)) return 'mobile';
    if (breakpoint === 'md') return 'tablet';
    return 'desktop';
  },

  // 터치 디바이스 감지
  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // 반응형 클래스 생성
  createResponsiveClass: (
    baseClass: string,
    variants: Partial<Record<keyof typeof RESPONSIVE_BREAKPOINTS, string>>
  ): string => {
    const classes = [baseClass];
    
    Object.entries(variants).forEach(([breakpoint, className]) => {
      if (className) {
        classes.push(`${breakpoint}:${className}`);
      }
    });

    return classes.join(' ');
  },

  // 반응형 값 계산
  getResponsiveValue: <T>(
    values: Partial<Record<'mobile' | 'tablet' | 'desktop', T>>,
    fallback: T
  ): T => {
    const deviceType = responsiveUtils.getDeviceType();
    return values[deviceType] || fallback;
  },

  // CSS 커스텀 프로퍼티 설정
  setCSSCustomProperties: (properties: Record<string, string | number>): void => {
    if (typeof document === 'undefined') return;
    
    Object.entries(properties).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        key.startsWith('--') ? key : `--${key}`,
        String(value)
      );
    });
  }
};

// 반응형 훅을 위한 타입
export interface UseResponsiveOptions {
  defaultBreakpoint?: keyof typeof RESPONSIVE_BREAKPOINTS;
  debounceMs?: number;
}

// 반응형 상태 타입
export interface ResponsiveState {
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
}

// 반응형 설정 타입
export interface ResponsiveConfig {
  breakpoints: typeof RESPONSIVE_BREAKPOINTS;
  typography: typeof RESPONSIVE_TYPOGRAPHY;
  spacing: typeof RESPONSIVE_SPACING;
  layout: typeof RESPONSIVE_LAYOUT;
}

// 전체 반응형 설정 내보내기
export const RESPONSIVE_CONFIG: ResponsiveConfig = {
  breakpoints: RESPONSIVE_BREAKPOINTS,
  typography: RESPONSIVE_TYPOGRAPHY,
  spacing: RESPONSIVE_SPACING,
  layout: RESPONSIVE_LAYOUT
} as const;

// 주요 반응형 클래스 조합
export const RESPONSIVE_CLASSES = {
  // 페이지 레이아웃
  page: [
    'min-h-screen',
    'overflow-x-hidden',
    RESPONSIVE_LAYOUT.container.base,
    RESPONSIVE_LAYOUT.container.mobile,
    RESPONSIVE_LAYOUT.container.tablet,
    RESPONSIVE_LAYOUT.container.desktop
  ].join(' '),

  // 히어로 섹션
  hero: [
    'min-h-screen',
    'flex items-center justify-center',
    'text-center',
    'relative',
    'px-4 md:px-6 lg:px-8',
    'py-20 md:py-24 lg:py-32'
  ].join(' '),

  // 콘텐츠 섹션
  section: [
    'w-full',
    'px-4 md:px-6 lg:px-8',
    'py-16 md:py-20 lg:py-24',
    'max-w-7xl mx-auto'
  ].join(' '),

  // 네비게이션
  navigation: [
    'fixed top-0 left-0 w-full z-50',
    'transition-all duration-300',
    'px-4 md:px-6 lg:px-8',
    'py-4 md:py-6'
  ].join(' ')
} as const;