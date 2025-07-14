// Designer types
export interface Designer {
  id: string;
  name: string;
  nameKo: string;
  nameEn: string;
  role: string;
  description: string;
  profileImage: string;
  instagramHandle: string;
  instagramUrl: string;
  portfolioImages: string[];
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Gallery types
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// About section types
export interface AboutSection {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

// CMS types
export interface ImageUpload {
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export interface CMSConfig {
  allowedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
}