'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, Edit } from 'lucide-react';
import { Designer } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';

interface Props {
  designer: Designer;
}

export default function DesignerDetail({ designer }: Props) {
  const [isAdmin, setIsAdmin] = useState(false); // 임시로 false, 추후 인증 시스템 연결
  const [portfolioImages, setPortfolioImages] = useState(designer.portfolioImages);
  const [profileImage, setProfileImage] = useState(designer.profileImage);

  const handleProfileImageUpdate = (url: string) => {
    setProfileImage(url);
    // TODO: API 호출로 서버에 저장
  };

  const handlePortfolioImagesUpdate = (urls: string[]) => {
    setPortfolioImages(urls);
    // TODO: API 호출로 서버에 저장
  };

  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container">
        {/* Back Button */}
        <Link
          href="/designers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Designers</span>
        </Link>

        {/* Designer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={profileImage}
                alt={designer.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
              {isAdmin && (
                <button
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Edit profile image"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>
            
            {/* Admin Profile Image Uploader */}
            {isAdmin && (
              <div className="mt-4">
                <ImageUploader
                  currentImage={profileImage}
                  onImageChange={handleProfileImageUpdate}
                  folder={`designers/${designer.id}/profile`}
                  aspectRatio="square"
                />
              </div>
            )}
          </motion.div>

          {/* Designer Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {designer.name}
            </h1>
            <p className="text-xl text-gray-400 mb-2">{designer.nameKo}</p>
            <p className="text-lg text-gray-500 mb-6">{designer.role}</p>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              {designer.description}
            </p>
            
            {/* Social Links */}
            <a
              href={designer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-md hover:bg-white/20 transition-colors"
            >
              <Instagram size={20} />
              <span>@{designer.instagramHandle}</span>
            </a>

            {/* Admin Mode Toggle (임시) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                {isAdmin ? 'Exit Admin' : 'Admin Mode'}
              </button>
            )}
          </motion.div>
        </div>

        {/* Portfolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8">Portfolio</h2>
          
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-900 group"
              >
                <Image
                  src={image}
                  alt={`${designer.name} portfolio ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ))}
            
            {/* Admin: Add More Images */}
            {isAdmin && (
              <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center">
                <ImageUploader
                  currentImages={portfolioImages}
                  onImagesChange={handlePortfolioImagesUpdate}
                  folder={`designers/${designer.id}/portfolio`}
                  multiple
                  maxImages={20}
                />
              </div>
            )}
          </div>

          {/* Empty State */}
          {portfolioImages.length === 0 && !isAdmin && (
            <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-lg">
              <p className="text-gray-400">포트폴리오가 곧 공개됩니다</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}