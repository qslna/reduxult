'use client';

import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// 동적으로 CMS Manager 로드
const CMSManagerComponent = lazy(() => import('./CMSManager'));

interface LazyCMSManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 지연 로딩된 CMS Manager
 * 관리자 모드에서만 필요하므로 초기 번들에서 제외
 */
export default function LazyCMSManager({ isOpen, onClose }: LazyCMSManagerProps) {
  if (!isOpen) return null;

  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <LoadingSpinner size="large" />
            </div>
            <p className="text-white text-sm opacity-75">
              CMS 관리 패널을 로드하고 있습니다...
            </p>
          </div>
        </div>
      }
    >
      <CMSManagerComponent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}