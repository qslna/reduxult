/**
 * Skip to Content 링크
 * 접근성 향상을 위한 컴포넌트
 */

'use client';

export default function SkipToContent() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[10000] bg-black text-white px-4 py-2 rounded-md border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      메인 콘텐츠로 바로가기
    </a>
  );
}