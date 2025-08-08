'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // 실제 에러가 발생한 경우에만 표시
  // 단순 경고나 info 레벨 로그는 무시
  const isRealError = error?.message && !error.message.includes('hydration') && !error.message.includes('Warning');
  
  if (!isRealError) {
    // 실제 에러가 아닌 경우 빈 화면 표시하지 않음
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6 p-8">
        <h2 className="text-4xl font-bold text-white">오류가 발생했습니다</h2>
        <p className="text-gray-400 max-w-md">
          페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}