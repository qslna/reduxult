'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Instagram } from 'lucide-react';
import { Designer } from '@/types';
import EditableImage from '@/components/admin/EditableImage';
import Lightbox from '@/components/ui/Lightbox';

interface Props {
  designer: Designer;
}

export default function DesignerDetail({ designer }: Props) {
  const [designerData, setDesignerData] = useState(designer);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
            <EditableImage
              src={designerData.profileImage}
              alt={designerData.name}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onUpdate={(newSrc) => setDesignerData(prev => ({ ...prev, profileImage: newSrc }))}
              category={`designers/${designer.id}/profile`}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="heading-1 mb-4">{designerData.name}</h1>
            <p className="text-xl text-gray-400 mb-2">{designerData.nameKo}</p>
            <p className="text-lg text-gray-500 mb-8">{designerData.role}</p>
            
            <p className="body-large text-gray-400 mb-12">
              {designerData.bio}
            </p>

            {/* Social Links */}
            <a
              href={`https://instagram.com/${designer.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-md hover:bg-white/20 transition-colors w-fit"
            >
              <Instagram size={20} />
              <span>@{designerData.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Portfolio Section */}
        <div>
          <h2 className="heading-3 mb-8">Portfolio</h2>
          
          {designerData.portfolioImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designerData.portfolioImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <EditableImage
                    src={image}
                    alt={`${designerData.name} portfolio ${index + 1}`}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onUpdate={(newSrc) => {
                      const newImages = [...designerData.portfolioImages];
                      newImages[index] = newSrc;
                      setDesignerData(prev => ({ ...prev, portfolioImages: newImages }));
                    }}
                    onDelete={() => {
                      const newImages = designerData.portfolioImages.filter((_, i) => i !== index);
                      setDesignerData(prev => ({ ...prev, portfolioImages: newImages }));
                    }}
                    category={`designers/${designer.id}/portfolio`}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
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

      {/* Lightbox */}
      <Lightbox
        images={designerData.portfolioImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex(prev => Math.min(prev + 1, designerData.portfolioImages.length - 1))}
        onPrevious={() => setCurrentImageIndex(prev => Math.max(prev - 1, 0))}
      />
    </section>
  );
}