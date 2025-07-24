// Image Slots Configuration
// Defines all manageable image slots throughout the REDUX website

import { ImageSlot } from '@/components/cms/ImageSlotManager';

export interface PageImageSlots {
  [key: string]: ImageSlot[];
}

// Default image constraints for different slot types
export const slotConstraints = {
  hero: {
    maxWidth: 1920,
    maxHeight: 1080,
    aspectRatio: '16:9',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
  },
  profile: {
    maxWidth: 800,
    maxHeight: 800,
    aspectRatio: '1:1',
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
  },
  gallery: {
    maxWidth: 1200,
    maxHeight: 1200,
    maxFileSize: 3 * 1024 * 1024, // 3MB
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
  },
  thumbnail: {
    maxWidth: 600,
    maxHeight: 400,
    aspectRatio: '3:2',
    maxFileSize: 1 * 1024 * 1024, // 1MB
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
  },
  background: {
    maxWidth: 1920,
    maxHeight: 1080,
    maxFileSize: 4 * 1024 * 1024, // 4MB
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
  }
};

// All image slots organized by page/section
export const imageSlots: PageImageSlots = {
  // Home Page Slots
  home: [
    {
      id: 'hero-video-background',
      name: 'Hero Background Image',
      description: 'Background image shown when video is turned off',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/home/hero',
      tags: ['home', 'hero', 'background']
    },
    {
      id: 'hero-video-poster',
      name: 'Hero Video Poster',
      description: 'Poster image for the hero video',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/home/hero',
      tags: ['home', 'hero', 'video-poster']
    }
  ],

  // Designer Profile Slots
  designers: [
    {
      id: 'kimbomin-profile',
      name: 'Kim Bomin Profile Photo',
      description: 'Main profile photo for Kim Bomin',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'kimbomin']
    },
    {
      id: 'parkparang-profile',
      name: 'Park Parang Profile Photo',
      description: 'Main profile photo for Park Parang',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'parkparang']
    },
    {
      id: 'leetaehyeon-profile',
      name: 'Lee Taehyeon Profile Photo',
      description: 'Main profile photo for Lee Taehyeon',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'leetaehyeon']
    },
    {
      id: 'choieunsol-profile',
      name: 'Choi Eunsol Profile Photo',
      description: 'Main profile photo for Choi Eunsol',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'choieunsol']
    },
    {
      id: 'hwangjinsu-profile',
      name: 'Hwang Jinsu Profile Photo',
      description: 'Main profile photo for Hwang Jinsu',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'hwangjinsu']
    },
    {
      id: 'kimgyeongsu-profile',
      name: 'Kim Gyeongsu Profile Photo',
      description: 'Main profile photo for Kim Gyeongsu',
      constraints: slotConstraints.profile,
      folder: '/redux-cms/designers/profiles',
      tags: ['designers', 'profile', 'kimgyeongsu']
    }
  ],

  // About Page Slots
  about: [
    {
      id: 'about-hero',
      name: 'About Page Hero Image',
      description: 'Main hero image for the About page',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/about/hero',
      tags: ['about', 'hero']
    }
  ],

  // About - Visual Art Section
  'about-visual-art': [
    {
      id: 'visual-art-1',
      name: 'Visual Art Image 1',
      description: 'First image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-2',
      name: 'Visual Art Image 2',
      description: 'Second image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-3',
      name: 'Visual Art Image 3',
      description: 'Third image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-4',
      name: 'Visual Art Image 4',
      description: 'Fourth image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-5',
      name: 'Visual Art Image 5',
      description: 'Fifth image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-6',
      name: 'Visual Art Image 6',
      description: 'Sixth image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-7',
      name: 'Visual Art Image 7',
      description: 'Seventh image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    },
    {
      id: 'visual-art-8',
      name: 'Visual Art Image 8',
      description: 'Eighth image in the Visual Art gallery',
      constraints: slotConstraints.gallery,
      folder: '/redux-cms/about/visual-art',
      tags: ['about', 'visual-art', 'gallery']
    }
  ],

  // About - Fashion Film Section
  'about-fashion-film': [
    {
      id: 'fashion-film-hero',
      name: 'Fashion Film Hero Image',
      description: 'Hero image for the Fashion Film section',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/about/fashion-film',
      tags: ['about', 'fashion-film', 'hero']
    }
  ],

  // About - Memory Section
  'about-memory': [
    {
      id: 'memory-hero',
      name: 'Memory Section Hero',
      description: 'Hero image for the Memory section',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/about/memory',
      tags: ['about', 'memory', 'hero']
    }
  ],

  // About - Installation Section
  'about-installation': [
    {
      id: 'installation-hero',
      name: 'Installation Hero Image',
      description: 'Hero image for the Installation/Process section',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/about/installation',
      tags: ['about', 'installation', 'hero']
    }
  ],

  // About - Collective Section
  'about-collective': [
    {
      id: 'collective-hero',
      name: 'Collective Hero Image',
      description: 'Hero image for the Collective section',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/about/collective',
      tags: ['about', 'collective', 'hero']
    }
  ],

  // Exhibition Slots
  exhibitions: [
    {
      id: 'cine-mode-hero',
      name: 'CINE MODE Exhibition Hero',
      description: 'Hero image for the CINE MODE exhibition',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/exhibitions/cine-mode',
      tags: ['exhibitions', 'cine-mode', 'hero']
    },
    {
      id: 'the-room-hero',
      name: 'THE ROOM OF [ ] Hero',
      description: 'Hero image for the THE ROOM OF [ ] exhibition',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/exhibitions/the-room',
      tags: ['exhibitions', 'the-room', 'hero']
    }
  ],

  // Contact Page Slots
  contact: [
    {
      id: 'contact-hero',
      name: 'Contact Page Hero',
      description: 'Hero image for the Contact page',
      constraints: slotConstraints.hero,
      folder: '/redux-cms/contact',
      tags: ['contact', 'hero']
    }
  ]
};

// Helper functions for working with image slots
export const imageSlotUtils = {
  // Get all slots for a specific page
  getSlotsForPage(pageId: string): ImageSlot[] {
    return imageSlots[pageId] || [];
  },

  // Get a specific slot by ID
  getSlotById(slotId: string): ImageSlot | null {
    for (const pageSlots of Object.values(imageSlots)) {
      const slot = pageSlots.find(s => s.id === slotId);
      if (slot) return slot;
    }
    return null;
  },

  // Get all slots with a specific tag
  getSlotsByTag(tag: string): ImageSlot[] {
    const matchingSlots: ImageSlot[] = [];
    for (const pageSlots of Object.values(imageSlots)) {
      for (const slot of pageSlots) {
        if (slot.tags?.includes(tag)) {
          matchingSlots.push(slot);
        }
      }
    }
    return matchingSlots;
  },

  // Get all slots in a specific folder
  getSlotsByFolder(folder: string): ImageSlot[] {
    const matchingSlots: ImageSlot[] = [];
    for (const pageSlots of Object.values(imageSlots)) {
      for (const slot of pageSlots) {
        if (slot.folder === folder) {
          matchingSlots.push(slot);
        }
      }
    }
    return matchingSlots;
  },

  // Get total number of slots
  getTotalSlotCount(): number {
    return Object.values(imageSlots).reduce((total, pageSlots) => total + pageSlots.length, 0);
  },

  // Get slots organized by page for admin interface
  getAllSlotsGrouped(): { page: string; slots: ImageSlot[] }[] {
    return Object.entries(imageSlots).map(([page, slots]) => ({
      page,
      slots
    }));
  },

  // Validate slot configuration
  validateSlot(slot: ImageSlot): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!slot.id) errors.push('Slot ID is required');
    if (!slot.name) errors.push('Slot name is required');
    if (!slot.folder) errors.push('Folder path is required');
    if (!slot.tags || slot.tags.length === 0) errors.push('At least one tag is required');

    if (slot.constraints) {
      if (slot.constraints.maxFileSize && slot.constraints.maxFileSize < 0) {
        errors.push('Max file size must be positive');
      }
      if (slot.constraints.maxWidth && slot.constraints.maxWidth < 1) {
        errors.push('Max width must be at least 1');
      }
      if (slot.constraints.maxHeight && slot.constraints.maxHeight < 1) {
        errors.push('Max height must be at least 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// Default current images (these would be loaded from a database in a real app)
export const defaultCurrentImages: Record<string, ImageSlot['currentImage']> = {
  'hero-video-background': {
    url: '/images/hero-background/background.png',
    filename: 'background.png',
    altText: 'REDUX hero background image'
  },
  'kimbomin-profile': {
    url: '/images/profile/Kim Bomin.webp',
    filename: 'Kim Bomin.webp',
    altText: 'Kim Bomin profile photo'
  },
  'parkparang-profile': {
    url: '/images/profile/Park Parang.webp',
    filename: 'Park Parang.webp',
    altText: 'Park Parang profile photo'
  },
  'leetaehyeon-profile': {
    url: '/images/profile/Lee Taehyeon.webp',
    filename: 'Lee Taehyeon.webp',
    altText: 'Lee Taehyeon profile photo'
  },
  'visual-art-1': {
    url: '/images/about/visual-art/1.png',
    filename: '1.png',
    altText: 'Visual art piece 1'
  },
  'visual-art-2': {
    url: '/images/about/visual-art/2.png',
    filename: '2.png',
    altText: 'Visual art piece 2'
  },
  'visual-art-3': {
    url: '/images/about/visual-art/3.png',
    filename: '3.png',
    altText: 'Visual art piece 3'
  },
  'visual-art-4': {
    url: '/images/about/visual-art/4.png',
    filename: '4.png',
    altText: 'Visual art piece 4'
  },
  'visual-art-5': {
    url: '/images/about/visual-art/5.png',
    filename: '5.png',
    altText: 'Visual art piece 5'
  },
  'visual-art-6': {
    url: '/images/about/visual-art/6.png',
    filename: '6.png',
    altText: 'Visual art piece 6'
  },
  'visual-art-7': {
    url: '/images/about/visual-art/7.png',
    filename: '7.png',
    altText: 'Visual art piece 7'
  },
  'visual-art-8': {
    url: '/images/about/visual-art/8.png',
    filename: '8.png',
    altText: 'Visual art piece 8'
  }
};