// Core Types for REDUX Website

export interface Designer {
  id: string;
  name: string;
  nameKo: string;
  role: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  instagramHandle: string;
  portfolioImages: string[];
  featured: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: 'collective' | 'visual-art' | 'fashion-film' | 'installation' | 'memory';
  designers: string[]; // Designer IDs
  images: string[];
  videoUrl?: string;
  date: string;
  featured: boolean;
  order: number;
}

export interface Exhibition {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  year: number;
  participants: string[];
  images: string[];
  status: 'upcoming' | 'ongoing' | 'past';
  featured: boolean;
}

export interface CMSImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  uploadedAt: string;
  category: string;
}

export interface SiteSettings {
  heroVideo: string;
  heroImage: string;
  aboutText: string;
  aboutTextKo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  addressKo: string;
  socialLinks: {
    instagram: string;
    youtube?: string;
    facebook?: string;
  };
}