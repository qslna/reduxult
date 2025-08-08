'use client';

import { useEffect } from 'react';
import { initializeMobileOptimization } from '@/utils/mobileOptimization';

/**
 * 클라이언트 사이드에서 모바일 최적화를 초기화하는 컴포넌트
 * 
 * 이 컴포넌트는 다음과 같은 최적화를 적용합니다:
 * - 터치 인터랙션 최적화
 * - 성능 모드 (저사양 디바이스)
 * - 동작 감소 모드
 * - 데이터 절약 모드
 * - 화면 방향 변경 처리
 */
export default function ClientMobileOptimizer() {
  useEffect(() => {
    // DOM이 완전히 로드된 후 실행
    const timer = setTimeout(() => {
      try {
        initializeMobileOptimization();
      } catch (error) {
        console.warn('모바일 최적화 초기화 중 오류가 발생했습니다:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}