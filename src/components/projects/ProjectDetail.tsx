'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Grid3X3, ChevronRight, Plus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, Designer } from '@/types';
import EditableImage from '@/components/admin/EditableImage';
import EditableVideo from '@/components/admin/EditableVideo';
import Lightbox from '@/components/ui/Lightbox';
import useContentStore from '@/store/useContentStore';

interface Props {
  project: Project;
  designers: Designer[];
}

export default function ProjectDetail({ project, designers }: Props) {
  const { 
    isAdmin, 
    projects, 
    categories,
    updateProjectImage, 
    addProjectGalleryImage, 
    removeProjectGalleryImage,
    updateProject 
  } = useContentStore();
  
  const [projectData, setProjectData] = useState(project);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  
  // Sync with store updates
  useEffect(() => {
    const updatedProject = projects.find(p => p.id === project.id);
    if (updatedProject) {
      setProjectData(updatedProject);
    }
  }, [projects, project.id]);
  
  const category = categories.find(c => c.id === projectData.category);
  const relatedProjects = projects
    .filter(p => p.id !== projectData.id && p.category === projectData.category)
    .slice(0, 3);

  const handleMainImageUpdate = (newSrc: string) => {
    updateProjectImage(project.id, 'cover', newSrc, 0);
  };
  
  const handleGalleryImageUpdate = (index: number, newSrc: string) => {
    updateProjectImage(project.id, 'gallery', newSrc, index + 1);
  };
  
  const handleAddImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const placeholderUrl = 'https://ik.imagekit.io/t914/redux/placeholder.jpg';
        addProjectGalleryImage(project.id, placeholderUrl);
      }
    };
    fileInput.click();
  };
  
  const handleRemoveImage = (index: number) => {
    removeProjectGalleryImage(project.id, index + 1);
  };
  
  const handleVideoUpdate = (newUrl: string) => {
    updateProject(project.id, { videoUrl: newUrl });
  };

  return (
    <section className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <EditableImage
          src={projectData.images[0] || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
          alt={projectData.title}
          className="object-cover"
          sizes="100vw"
          onUpdate={handleMainImageUpdate}
          category={`projects/${project.id}/hero`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/projects"
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-black/70 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        
        {/* Category Badge */}
        <div className="absolute top-8 right-8">
          <span className="inline-block px-4 py-2 bg-black/50 backdrop-blur-md text-sm rounded-full border border-white/20">
            {category?.title || 'Uncategorized'}
          </span>
        </div>

        {/* Project Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{projectData.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{projectData.titleKo}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={18} />
                  <span>{new Date(projectData.date).getFullYear()}</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={18} />
                  <span>{designers.length} Designer{designers.length > 1 ? 's' : ''}</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Grid3X3 size={18} />
                  <span>{projectData.images.length} Images</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-6">About This Project</h2>
            <div className="space-y-6">
              <p className="text-xl leading-relaxed text-gray-300">
                {projectData.description}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                {projectData.descriptionKo}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-6">Project Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white">{new Date(projectData.date).toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Category</p>
                <p className="text-white">{category?.title}</p>
              </div>
              <div className="p-4 bg-zinc-900 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Participants</p>
                <p className="text-white">{designers.map(d => d.name).join(', ')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Project Gallery</h2>
              <p className="text-gray-400">
                {showAllImages ? 'Showing all images' : `Showing ${Math.min(6, projectData.images.length - 1)} of ${projectData.images.length - 1} images`}
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={handleAddImage}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Plus size={18} />
                <span>Add Image</span>
              </button>
            )}
          </div>
          
          {projectData.images.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectData.images.slice(1, showAllImages ? undefined : 7).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(index + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <EditableImage
                    src={image}
                    alt={`${projectData.title} gallery ${index + 1}`}
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onUpdate={(newSrc) => handleGalleryImageUpdate(index, newSrc)}
                    onDelete={isAdmin ? () => handleRemoveImage(index) : undefined}
                    category={`projects/${project.id}/gallery`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 2}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900 rounded-xl">
              <Grid3X3 size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">No additional images in gallery</p>
              {isAdmin && (
                <button
                  onClick={handleAddImage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus size={20} />
                  <span>Add First Gallery Image</span>
                </button>
              )}
            </div>
          )}

          {/* Show More Button */}
          {projectData.images.length > 7 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => setShowAllImages(!showAllImages)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <span>{showAllImages ? 'Show Less' : 'Show All Images'}</span>
                <ChevronRight className={`transition-transform ${showAllImages ? 'rotate-90' : ''}`} size={18} />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Project Video</h2>
              <p className="text-gray-400">Behind the scenes and process</p>
            </div>
          </div>
          
          <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
            {(projectData.videoUrl || isAdmin) ? (
              <EditableVideo
                src={projectData.videoUrl || ''}
                className="w-full h-full object-cover"
                poster={projectData.images[0]}
                controls={true}
                autoPlay={false}
                muted={false}
                loop={false}
                onUpdate={handleVideoUpdate}
                category={`projects/${project.id}/video`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No video available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Designers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">Created By</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Link
                  href={`/designers/${designer.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900 mb-4">
                    <EditableImage
                      src={designer.profileImage}
                      alt={designer.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onUpdate={() => {}}
                      category={`designers/${designer.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm">View Profile</span>
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                      {designer.name}
                    </h3>
                    <p className="text-gray-400">{designer.nameKo}</p>
                    <p className="text-sm text-gray-500 mt-1">{designer.role}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="border-t border-gray-800 pt-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Related Projects</h2>
                  <p className="text-gray-400">More from {category?.title}</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <Link href={`/projects/${relatedProject.id}`} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 mb-4">
                        <EditableImage
                          src={relatedProject.images[0] || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
                          alt={relatedProject.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onUpdate={() => {}}
                          category={`projects/${relatedProject.id}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-sm text-gray-400">{relatedProject.titleKo}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Lightbox */}
      <Lightbox
        images={projectData.images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex(prev => (prev + 1) % projectData.images.length)}
        onPrevious={() => setCurrentImageIndex(prev => (prev - 1 + projectData.images.length) % projectData.images.length)}
      />
    </section>
  );
}