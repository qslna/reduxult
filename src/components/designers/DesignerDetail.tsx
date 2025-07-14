'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Instagram } from 'lucide-react';
import { Designer } from '@/types';

interface Props {
  designer: Designer;
}

export default function DesignerDetail({ designer }: Props) {
  return (
    <section className="section-padding">
      <div className="container">
        {/* Back Button */}
        <Link
          href="/designers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span>Back to Designers</span>
        </Link>

        {/* Designer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Profile Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900">
            <Image
              src={designer.profileImage}
              alt={designer.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="heading-1 mb-4">{designer.name}</h1>
            <p className="text-xl text-gray-400 mb-2">{designer.nameKo}</p>
            <p className="text-lg text-gray-500 mb-8">{designer.role}</p>
            
            <p className="body-large text-gray-400 mb-12">
              {designer.bio}
            </p>

            {/* Social Links */}
            <a
              href={`https://instagram.com/${designer.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-md hover:bg-white/20 transition-colors w-fit"
            >
              <Instagram size={20} />
              <span>@{designer.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Portfolio Section */}
        <div>
          <h2 className="heading-3 mb-8">Portfolio</h2>
          
          {designer.portfolioImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designer.portfolioImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900"
                >
                  <Image
                    src={image}
                    alt={`${designer.name} portfolio ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900 rounded-lg">
              <p className="text-gray-400">포트폴리오가 곧 공개됩니다</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}