'use client';

import Link from 'next/link';
import ProfileImage from '@/components/ui/ProfileImage';
import { DESIGNERS } from '@/utils/constants';
import { Instagram } from 'lucide-react';

// 미리보기를 위한 디자이너 선택 (처음 6명)
const previewDesigners = Object.values(DESIGNERS).slice(0, 6);

export default function DesignersPreview() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">DESIGNERS</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            REDUX66을 이끄는 6인의 창의적인 디자이너들을 만나보세요
          </p>
        </div>

        {/* Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewDesigners.map((designer) => (
            <Link
              key={designer.id}
              href={`/designers/${designer.handle}`}
              className="group"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                {/* Profile Image Container */}
                <div className="p-8 flex justify-center">
                  <ProfileImage
                    src={designer.profileImage}
                    alt={designer.name}
                    size="lg"
                  />
                </div>

                {/* Designer Info */}
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {designer.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{designer.nameKo}</p>
                  <p className="text-gray-400 mb-4">{designer.role}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {designer.description}
                  </p>

                  {/* Instagram Link */}
                  <a
                    href={designer.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">@{designer.instagramHandle}</span>
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/designers"
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            모든 디자이너 보기
          </Link>
        </div>
      </div>
    </section>
  );
}