/**
 * Focus Trap 컴포넌트
 * 모달이나 드롭다운에서 포커스를 가두어 접근성을 향상시킴
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  className?: string;
  restoreFocus?: boolean;
}

export default function FocusTrap({ 
  children, 
  isActive, 
  onEscape, 
  className = '',
  restoreFocus = true 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 현재 포커스된 엘리먼트 저장
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // 포커스 가능한 엘리먼트들을 찾는 함수
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[role="button"]:not([disabled])',
        '[role="link"]:not([disabled])',
        '[role="menuitem"]:not([disabled])',
        '[contenteditable="true"]'
      ];

      return Array.from(
        container.querySelectorAll(focusableSelectors.join(','))
      ) as HTMLElement[];
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 키 처리
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Tab 키 처리
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: 역방향
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab: 정방향
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    // 초기 포커스 설정
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 클린업
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // 포커스 복원
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActive, onEscape, restoreFocus]);

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}