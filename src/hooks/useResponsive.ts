'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  RESPONSIVE_BREAKPOINTS, 
  responsiveUtils, 
  type ResponsiveState, 
  type UseResponsiveOptions 
} from '@/lib/responsive-design';

/**
 * Custom hook for responsive design management
 * 반응형 디자인을 위한 커스텀 훅
 */
export function useResponsive(options: UseResponsiveOptions = {}) {
  const { defaultBreakpoint = 'lg', debounceMs = 150 } = options;

  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR 호환성을 위한 초기 상태
    if (typeof window === 'undefined') {
      return {
        breakpoint: defaultBreakpoint,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        screenWidth: 1280,
        screenHeight: 720
      };
    }

    // 클라이언트 측 초기 상태
    const breakpoint = responsiveUtils.getCurrentBreakpoint();
    const isTouchDevice = responsiveUtils.isTouchDevice();
    
    return {
      breakpoint,
      isMobile: ['xs', 'sm'].includes(breakpoint),
      isTablet: breakpoint === 'md',
      isDesktop: ['lg', 'xl', '2xl', '3xl', '4xl'].includes(breakpoint),
      isTouchDevice,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  });

  // 디바운스된 업데이트 함수
  const updateState = useCallback(() => {
    const breakpoint = responsiveUtils.getCurrentBreakpoint();
    const newState: ResponsiveState = {
      breakpoint,
      isMobile: ['xs', 'sm'].includes(breakpoint),
      isTablet: breakpoint === 'md',
      isDesktop: ['lg', 'xl', '2xl', '3xl', '4xl'].includes(breakpoint),
      isTouchDevice: responsiveUtils.isTouchDevice(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };

    setState(prevState => {
      // 상태가 실제로 변경된 경우에만 업데이트
      if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
        return newState;
      }
      return prevState;
    });
  }, []);

  // 디바운스 함수
  const debounce = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  }, []);

  const debouncedUpdate = useCallback(
    debounce(updateState, debounceMs),
    [updateState, debounceMs]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 초기 상태 업데이트
    updateState();

    // 리사이즈 이벤트 리스너
    const handleResize = () => {
      debouncedUpdate();
    };

    // 오리엔테이션 변경 이벤트 리스너
    const handleOrientationChange = () => {
      // 오리엔테이션 변경 후 약간의 지연을 두고 업데이트
      setTimeout(updateState, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateState, debouncedUpdate]);

  return state;
}

/**
 * 특정 브레이크포인트 체크 훅
 */
export function useBreakpoint(breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${RESPONSIVE_BREAKPOINTS[breakpoint]})`);
    
    // 초기 상태 설정
    setIsMatch(mediaQuery.matches);

    // 변경 감지
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return isMatch;
}

/**
 * 브레이크포인트 범위 체크 훅
 */
export function useBreakpointRange(
  minBreakpoint: keyof typeof RESPONSIVE_BREAKPOINTS,
  maxBreakpoint?: keyof typeof RESPONSIVE_BREAKPOINTS
) {
  const [isInRange, setIsInRange] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateRange = () => {
      const currentBp = responsiveUtils.getCurrentBreakpoint();
      const breakpoints = Object.keys(RESPONSIVE_BREAKPOINTS);
      const currentIndex = breakpoints.indexOf(currentBp);
      const minIndex = breakpoints.indexOf(minBreakpoint);
      const maxIndex = maxBreakpoint ? breakpoints.indexOf(maxBreakpoint) : breakpoints.length - 1;

      setIsInRange(currentIndex >= minIndex && currentIndex <= maxIndex);
    };

    updateRange();

    const handleResize = () => {
      updateRange();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [minBreakpoint, maxBreakpoint]);

  return isInRange;
}

/**
 * 디바이스 타입 감지 훅
 */
export function useDeviceType() {
  const { isMobile, isTablet, isDesktop, isTouchDevice } = useResponsive();

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  } as const;
}

/**
 * 화면 크기 감지 훅
 */
export function useScreenSize() {
  const { screenWidth, screenHeight } = useResponsive();

  return {
    width: screenWidth,
    height: screenHeight,
    aspectRatio: screenWidth / screenHeight,
    isLandscape: screenWidth > screenHeight,
    isPortrait: screenHeight > screenWidth
  } as const;
}

/**
 * 반응형 값 선택 훅
 */
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && values.mobile !== undefined) return values.mobile;
  if (isTablet && values.tablet !== undefined) return values.tablet;
  if (isDesktop && values.desktop !== undefined) return values.desktop;
  return values.default;
}

/**
 * 미디어 쿼리 훅
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * 프리퍼드 모션 설정 훅
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * 고대비 모드 감지 훅
 */
export function useHighContrast() {
  return useMediaQuery('(prefers-contrast: high)');
}

/**
 * 다크모드 선호도 감지 훅
 */
export function usePrefersDark() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * 컨테이너 쿼리를 위한 커스텀 훅
 */
export function useContainerQuery(containerRef: React.RefObject<HTMLDivElement | null>, query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // 간단한 컨테이너 쿼리 파싱 (예: "(min-width: 500px)")
        const match = query.match(/\(([^)]+)\)/);
        if (!match) return;
        
        const condition = match[1];
        const [property, value] = condition.split(':').map(s => s.trim());
        const numValue = parseFloat(value);
        
        let result = false;
        if (property === 'min-width') {
          result = width >= numValue;
        } else if (property === 'max-width') {
          result = width <= numValue;
        } else if (property === 'min-height') {
          result = height >= numValue;
        } else if (property === 'max-height') {
          result = height <= numValue;
        }
        
        setMatches(result);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, query]);

  return matches;
}

// 반응형 이미지 최적화를 위한 훅
export function useResponsiveImage() {
  const { screenWidth, isMobile, isTablet } = useResponsive();

  const getOptimalImageSize = useCallback((baseWidth: number, baseHeight: number) => {
    let multiplier = 1;
    
    if (isMobile) {
      multiplier = Math.min(screenWidth / baseWidth, 1);
    } else if (isTablet) {
      multiplier = Math.min(screenWidth / baseWidth, 1.5);
    } else {
      multiplier = Math.min(screenWidth / baseWidth, 2);
    }

    return {
      width: Math.round(baseWidth * multiplier),
      height: Math.round(baseHeight * multiplier),
      multiplier
    };
  }, [screenWidth, isMobile, isTablet]);

  const getSrcSet = useCallback((imagePath: string, sizes: number[]) => {
    return sizes
      .map(size => `${imagePath}?w=${size} ${size}w`)
      .join(', ');
  }, []);

  return {
    getOptimalImageSize,
    getSrcSet,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
  };
}