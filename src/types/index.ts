// Common types for the application

export interface Designer {
  id: string;
  name: string;
  nameKo: string;
  nameEn: string;
  handle: string;
  instagramHandle: string;
  role: string;
  theme: 'taehyeon' | 'bomin' | 'parang' | 'eunsol' | 'jinsu' | 'gyeongsu';
  description: string;
  profileImage: string;
  portfolioImages: string[];
  bio?: string;
  skills?: string[];
  colors: {
    primary: string;
    accent: string;
  };
  fonts: {
    primary: string;
    display: string;
  };
  contact?: {
    email?: string;
    instagram?: string;
    website?: string;
  };
  galleries: {
    portfolio: GalleryImage[];
    cinemode: GalleryImage[];
    experimental: GalleryImage[];
  };
}

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  category: string;
  designer: string;
  width?: number;
  height?: number;
  tags?: string[];
  createdAt: Date;
  fileId?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  description: string;
  images: string[];
  venue?: string;
  status: 'upcoming' | 'current' | 'past';
}

export interface AboutSection {
  title: string;
  description: string;
  images: string[];
  href: string;
}

export interface ImageMetadata {
  id: string;
  url: string;
  alt: string;
  folder: string;
  fileId?: string; // ImageKit file ID
  uploadedAt: Date;
  updatedAt: Date;
}

export interface AdminSession {
  username: string;
  expiry: number;
  isActive: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ImageKitResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags?: string[];
  isPrivateFile: boolean;
  customCoordinates?: string;
  fileType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
      staggerChildren?: number;
      delayChildren?: number;
    };
  };
}

// Navigation types
export interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  href: string;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminLoginForm {
  username: string;
  password: string;
}

// 3D and Stack Gallery Types
export interface StackGalleryProps {
  images: GalleryImage[];
  className?: string;
  maxItems?: number;
  onItemClick?: (image: GalleryImage) => void;
}

export interface StackItemProps {
  image: GalleryImage;
  index: number;
  isHovered: boolean;
  className?: string;
  onClick?: () => void;
}

// Theme and Animation Types
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    primary: string;
    display: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
}

export interface CursorState {
  x: number;
  y: number;
  isPointer: boolean;
  isHidden: boolean;
}

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

// Component Props Types
export interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}