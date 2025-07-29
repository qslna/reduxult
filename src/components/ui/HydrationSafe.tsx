'use client';

import { useEffect, useState, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * 하이드레이션 안전 컴포넌트
 * 서버와 클라이언트 렌더링 간의 불일치를 방지합니다.
 */
export default function HydrationSafe({ 
  children, 
  fallback = null, 
  className 
}: HydrationSafeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 컴포넌트가 클라이언트에서 마운트되었음을 표시
    setIsClient(true);
  }, []);

  // 서버 사이드 렌더링 중에는 fallback 또는 null 반환
  if (!isClient) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  // 클라이언트에서만 실제 children 렌더링
  return <div className={className}>{children}</div>;
}

/**
 * 조건부 클라이언트 렌더링 훅
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * 클라이언트 전용 컴포넌트 HOC
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  const isClient = useIsClient();
  
  if (!isClient) return fallback;
  return <>{children}</>;
}

/**
 * DOM 접근이 필요한 컴포넌트를 위한 안전한 래퍼
 */
export function SafeDOMComponent({ 
  children, 
  fallback = null 
}: { 
  children: () => ReactNode; 
  fallback?: ReactNode; 
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // DOM이 완전히 준비된 후에만 렌더링
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return fallback;
  
  try {
    return <>{children()}</>;
  } catch (error) {
    console.warn('SafeDOMComponent error:', error);
    return fallback;
  }
}