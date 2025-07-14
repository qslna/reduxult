'use client';

import { useEffect } from 'react';

export default function ErrorOverlayRemover() {
  useEffect(() => {
    // Next.js 에러 오버레이를 주기적으로 제거
    const removeErrorOverlay = () => {
      // iframe 제거
      const iframes = document.querySelectorAll('iframe#webpack-dev-server-client-overlay, body > iframe[style*="position: fixed"]');
      iframes.forEach(iframe => iframe.remove());
      
      // nextjs-portal 제거
      const portals = document.querySelectorAll('nextjs-portal, body > nextjs-portal');
      portals.forEach(portal => portal.remove());
      
      // 에러 다이얼로그 제거
      const errorDialogs = document.querySelectorAll('#__next-build-error-dialog, [id^="__next-route-announcer"]');
      errorDialogs.forEach(dialog => dialog.remove());
      
      // body 스타일 복원
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.paddingRight = '0';
    };

    // 초기 실행
    removeErrorOverlay();
    
    // 주기적으로 확인 및 제거
    const interval = setInterval(removeErrorOverlay, 1000);
    
    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver(removeErrorOverlay);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}