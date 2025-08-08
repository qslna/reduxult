/**
 * 404 페이지 - 향상된 에러 처리
 */

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지를 찾을 수 없습니다. REDUX 홈페이지로 돌아가세요.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-white/10 font-['Playfair_Display'] leading-none">
            404
          </h1>
          <div className="relative -mt-20 md:-mt-32">
            <h2 className="text-4xl md:text-6xl font-light text-white font-['Playfair_Display'] tracking-wide">
              Lost in the VOID
            </h2>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-gray-400 mb-4">
            페이지를 찾을 수 없습니다
          </p>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다. 
            아래 링크를 통해 다른 페이지로 이동해보세요.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4 mb-12">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium text-lg hover:scale-105 transform"
          >
            홈페이지로 돌아가기
          </Link>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/about"
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded transition-all duration-300"
            >
              About
            </Link>
            <Link
              href="/designers"
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded transition-all duration-300"
            >
              Designers
            </Link>
            <Link
              href="/exhibitions"
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded transition-all duration-300"
            >
              Exhibitions
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded transition-all duration-300"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-sm text-gray-600">
          <p>문제가 지속되면 <Link href="/contact" className="text-gray-400 hover:text-white underline">연락처</Link>를 통해 문의해주세요.</p>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 border border-white/5 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}