'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Instagram, Plus, Grid3X3, Camera, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Designer } from '@/types';
import EditableImage from '@/components/admin/EditableImage';
import Lightbox from '@/components/ui/Lightbox';
import useContentStore from '@/store/useContentStore';

interface Props {
  designer: Designer;
}

export default function DesignerDetail({ designer }: Props) {
  const { isAdmin, updateDesigner, updateDesignerImage, addDesignerPortfolioImage, removeDesignerPortfolioImage } = useContentStore();
  const [designerData, setDesignerData] = useState(designer);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about'>('portfolio');

  // Sync with store updates
  useEffect(() => {
    setDesignerData(designer);
  }, [designer]);

  const handleProfileImageUpdate = (newSrc: string) => {
    updateDesignerImage(designer.id, 'profile', newSrc);
    setDesignerData(prev => ({ ...prev, profileImage: newSrc }));
  };

  const handleCoverImageUpdate = (newSrc: string) => {
    updateDesignerImage(designer.id, 'cover', newSrc);
    setDesignerData(prev => ({ ...prev, coverImage: newSrc }));
  };

  const handlePortfolioImageUpdate = (index: number, newSrc: string) => {
    const newImages = [...designerData.portfolioImages];
    newImages[index] = newSrc;
    updateDesigner(designer.id, { portfolioImages: newImages });
    setDesignerData(prev => ({ ...prev, portfolioImages: newImages }));
  };

  const handlePortfolioImageDelete = (index: number) => {
    removeDesignerPortfolioImage(designer.id, index);
    const newImages = designerData.portfolioImages.filter((_, i) => i !== index);
    setDesignerData(prev => ({ ...prev, portfolioImages: newImages }));
  };

  const handleAddPortfolioImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // This would be handled by EditableImage component
        // For now, we'll add a placeholder
        const placeholderUrl = 'https://ik.imagekit.io/t914/redux/placeholder.jpg';
        addDesignerPortfolioImage(designer.id, placeholderUrl);
        setDesignerData(prev => ({ 
          ...prev, 
          portfolioImages: [...prev.portfolioImages, placeholderUrl] 
        }));
      }
    };
    fileInput.click();
  };

  return (
    <section className="min-h-screen bg-black">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <EditableImage
          src={designerData.coverImage}
          alt={`${designerData.name} cover`}
          className="object-cover"
          sizes="100vw"
          onUpdate={handleCoverImageUpdate}
          category={`designers/${designer.id}/cover`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/designers"
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-black/70 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        {/* Designer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{designerData.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <p className="text-gray-300">{designerData.nameKo}</p>
                <span className="text-gray-500">•</span>
                <p className="text-gray-400">{designerData.role}</p>
                {designerData.instagramHandle && (
                  <>
                    <span className="text-gray-500">•</span>
                    <a
                      href={`https://instagram.com/${designerData.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Instagram size={18} />
                      <span>{designerData.instagramHandle}</span>
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar - Profile & Bio */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Profile Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 mb-8">
              <EditableImage
                src={designerData.profileImage}
                alt={designerData.name}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                onUpdate={handleProfileImageUpdate}
                category={`designers/${designer.id}/profile`}
              />
            </div>

            {/* Bio */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed">
                  {designerData.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-800">
                <div>
                  <p className="text-2xl font-bold">{designerData.portfolioImages.length}</p>
                  <p className="text-sm text-gray-400">Works</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2024</p>
                  <p className="text-sm text-gray-400">Joined</p>
                </div>
              </div>

              {/* Social Links */}
              {designerData.instagramHandle && (
                <a
                  href={`https://instagram.com/${designerData.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Instagram size={20} />
                  <span>Follow on Instagram</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Tabs */}
            <div className="flex items-center gap-8 mb-8 border-b border-gray-800">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-4 px-2 font-medium transition-all ${
                  activeTab === 'portfolio' 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid3X3 size={18} />
                  <span>Portfolio</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-2 font-medium transition-all ${
                  activeTab === 'about' 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash size={18} />
                  <span>About</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'portfolio' ? (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Portfolio Grid */}
                  {designerData.portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {designerData.portfolioImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 cursor-pointer group"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setLightboxOpen(true);
                          }}
                        >
                          <EditableImage
                            src={image}
                            alt={`${designerData.name} portfolio ${index + 1}`}
                            className="object-cover hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            onUpdate={(newSrc) => handlePortfolioImageUpdate(index, newSrc)}
                            onDelete={() => handlePortfolioImageDelete(index)}
                            category={`designers/${designer.id}/portfolio`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Add New Image Button (Admin Only) */}
                      {isAdmin && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: designerData.portfolioImages.length * 0.05 }}
                          onClick={handleAddPortfolioImage}
                          className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 border-2 border-dashed border-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center group"
                        >
                          <div className="text-center">
                            <Plus size={48} className="mx-auto mb-2 text-gray-600 group-hover:text-gray-400 transition-colors" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors">Add Image</span>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-zinc-900 rounded-lg">
                      <Camera size={48} className="mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400 mb-4">포트폴리오가 곧 공개됩니다</p>
                      {isAdmin && (
                        <button
                          onClick={handleAddPortfolioImage}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Plus size={20} />
                          <span>Add First Image</span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="prose prose-invert max-w-none"
                >
                  <h3 className="text-2xl font-bold mb-6">Designer Story</h3>
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      {designerData.bio}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Specialties</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li>• Conceptual Fashion Design</li>
                          <li>• Visual Art Direction</li>
                          <li>• Creative Consulting</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-3">Experience</h4>
                        <ul className="space-y-2 text-gray-400">
                          <li>• REDUX Collective (2024 - Present)</li>
                          <li>• Independent Designer</li>
                          <li>• Fashion Week Participant</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={designerData.portfolioImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex(prev => (prev + 1) % designerData.portfolioImages.length)}
        onPrevious={() => setCurrentImageIndex(prev => (prev - 1 + designerData.portfolioImages.length) % designerData.portfolioImages.length)}
      />
    </section>
  );
}