'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, Designer } from '@/types';
import ImageGallery from '@/components/ui/ImageGallery';
import EditableImage from '@/components/admin/EditableImage';

interface Props {
  project: Project;
  designers: Designer[];
}

export default function ProjectDetail({ project, designers }: Props) {
  const [projectData, setProjectData] = useState(project);

  const handleMainImageUpdate = (newSrc: string) => {
    const newImages = [...projectData.images];
    newImages[0] = newSrc;
    setProjectData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <section className="section-padding">
      <div className="container">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="heading-1 mb-4">{projectData.title}</h1>
          <p className="text-xl text-gray-400 mb-2">{projectData.titleKo}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mt-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(projectData.date).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{designers.map(d => d.name).join(', ')}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[16/9] overflow-hidden rounded-lg bg-zinc-900 mb-16"
        >
          <EditableImage
            src={projectData.images[0]}
            alt={projectData.title}
            className="object-cover"
            sizes="100vw"
            onUpdate={handleMainImageUpdate}
            category={`projects/${project.id}`}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="heading-3 mb-6">About This Project</h2>
          <div className="space-y-4 text-gray-400">
            <p className="body-large">{projectData.description}</p>
            <p className="body-large">{projectData.descriptionKo}</p>
          </div>
        </motion.div>

        {/* Gallery */}
        {projectData.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="heading-3 mb-8">Gallery</h2>
            <ImageGallery
              images={projectData.images.slice(1)}
              columns={3}
              category={`projects/${project.id}/gallery`}
              editable
              onImagesUpdate={(newImages) => {
                setProjectData(prev => ({
                  ...prev,
                  images: [prev.images[0], ...newImages]
                }));
              }}
            />
          </motion.div>
        )}

        {/* Video Section */}
        {projectData.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20"
          >
            <h2 className="heading-3 mb-8">Project Video</h2>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900">
              <video
                controls
                className="w-full h-full"
                poster={projectData.images[0]}
              >
                <source src={projectData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        )}

        {/* Designers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <h2 className="heading-3 mb-8">Designers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {designers.map((designer) => (
              <Link
                key={designer.id}
                href={`/designers/${designer.id}`}
                className="group flex items-center gap-4 p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={designer.profileImage}
                    alt={designer.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-gray-300 transition-colors">
                    {designer.name}
                  </h3>
                  <p className="text-sm text-gray-500">{designer.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}