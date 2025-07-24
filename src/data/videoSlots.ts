// Video Slots Configuration
// Defines all manageable video slots throughout the REDUX website

import { VideoSlot } from '@/components/cms/VideoSlotManager';

export interface PageVideoSlots {
  [key: string]: VideoSlot[];
}

// Default video constraints for different slot types
export const videoConstraints = {
  hero: {
    maxFileSize: 200 * 1024 * 1024, // 200MB
    maxDuration: 120, // 2 minutes
    allowedFormats: ['video/mp4', 'video/webm', 'video/mov'],
    requireThumbnail: true
  },
  designer: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxDuration: 600, // 10 minutes
    allowedFormats: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
    requireThumbnail: false
  },
  fashion: {
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    maxDuration: 1800, // 30 minutes
    allowedFormats: ['video/mp4', 'video/webm', 'video/mov'],
    requireThumbnail: true
  },
  showcase: {
    maxFileSize: 300 * 1024 * 1024, // 300MB
    maxDuration: 300, // 5 minutes
    allowedFormats: ['video/mp4', 'video/webm'],
    requireThumbnail: true
  }
};

// All video slots organized by page/section
export const videoSlots: PageVideoSlots = {
  // Home Page Video Slots
  home: [
    {
      id: 'hero-main-video',
      name: 'Main Hero Video',
      description: 'Primary hero video that plays on the homepage',
      constraints: videoConstraints.hero,
      folder: '/redux-cms/home/hero',
      tags: ['home', 'hero', 'main'],
      supportedProviders: ['upload', 'google-drive', 'youtube', 'vimeo']
    }
  ],

  // Designer Video Slots (Google Drive Integration)
  designers: [
    {
      id: 'kimbomin-showcase',
      name: 'Kim Bomin Showcase Video',
      description: 'Main showcase video for Kim Bomin\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/kimbomin',
      tags: ['designers', 'showcase', 'kimbomin'],
      supportedProviders: ['upload', 'google-drive']
    },
    {
      id: 'parkparang-showcase',
      name: 'Park Parang Showcase Video',
      description: 'Main showcase video for Park Parang\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/parkparang',
      tags: ['designers', 'showcase', 'parkparang'],
      supportedProviders: ['upload', 'google-drive']
    },
    {
      id: 'leetaehyeon-showcase',
      name: 'Lee Taehyeon Showcase Video',
      description: 'Main showcase video for Lee Taehyeon\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/leetaehyeon',
      tags: ['designers', 'showcase', 'leetaehyeon'],
      supportedProviders: ['upload', 'google-drive']
    },
    {
      id: 'choieunsol-showcase',
      name: 'Choi Eunsol Showcase Video',
      description: 'Main showcase video for Choi Eunsol\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/choieunsol',
      tags: ['designers', 'showcase', 'choieunsol'],
      supportedProviders: ['upload', 'google-drive']
    },
    {
      id: 'hwangjinsu-showcase',
      name: 'Hwang Jinsu Showcase Video',
      description: 'Main showcase video for Hwang Jinsu\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/hwangjinsu',
      tags: ['designers', 'showcase', 'hwangjinsu'],
      supportedProviders: ['upload', 'google-drive']
    },
    {
      id: 'kimgyeongsu-showcase',
      name: 'Kim Gyeongsu Showcase Video',
      description: 'Main showcase video for Kim Gyeongsu\'s work',
      constraints: videoConstraints.designer,
      folder: '/redux-cms/designers/videos/kimgyeongsu',
      tags: ['designers', 'showcase', 'kimgyeongsu'],
      supportedProviders: ['upload', 'google-drive']
    }
  ],

  // About - Fashion Film Section
  'about-fashion-film': [
    {
      id: 'fashion-film-main',
      name: 'Main Fashion Film',
      description: 'Primary fashion film showcase',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/about/fashion-film',
      tags: ['about', 'fashion-film', 'main'],
      supportedProviders: ['upload', 'google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'fashion-film-bts',
      name: 'Behind the Scenes',
      description: 'Behind the scenes footage of fashion film production',
      constraints: videoConstraints.showcase,
      folder: '/redux-cms/about/fashion-film/bts',
      tags: ['about', 'fashion-film', 'bts'],
      supportedProviders: ['upload', 'google-drive']
    }
  ],

  // Fashion Film Gallery Videos
  'fashion-films': [
    {
      id: 'film-01-norma-limousine',
      name: 'NORMA LIMOUSINE',
      description: 'Fashion film by Kim Bomin - NORMA LIMOUSINE',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'kimbomin', 'norma-limousine'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'film-02-hwang-jinsu',
      name: 'Hwang Jinsu Fashion Film',
      description: 'Fashion film showcase by Hwang Jinsu',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'hwangjinsu'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'film-03-collective-work',
      name: 'REDUX Collective Work',
      description: 'Collaborative fashion film by REDUX collective',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'collective'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'film-04-park-parang',
      name: 'Park Parang Showcase',
      description: 'Fashion film by Park Parang',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'parkparang'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'film-05-lee-taehyeon',
      name: 'Lee Taehyeon Creative Film',
      description: 'Creative fashion film by Lee Taehyeon',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'leetaehyeon'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'film-06-choi-eunsol',
      name: 'Choi Eunsol Film',
      description: 'Fashion film by Choi Eunsol',
      constraints: videoConstraints.fashion,
      folder: '/redux-cms/fashion-films',
      tags: ['fashion-film', 'choieunsol'],
      supportedProviders: ['google-drive', 'youtube', 'vimeo']
    }
  ],

  // Exhibition Videos
  exhibitions: [
    {
      id: 'cine-mode-video',
      name: 'CINE MODE Exhibition Video',
      description: 'Documentation video of the CINE MODE exhibition',
      constraints: videoConstraints.showcase,
      folder: '/redux-cms/exhibitions/cine-mode',
      tags: ['exhibitions', 'cine-mode', 'documentation'],
      supportedProviders: ['upload', 'google-drive', 'youtube', 'vimeo']
    },
    {
      id: 'the-room-video',
      name: 'THE ROOM OF [ ] Video',
      description: 'Video documentation of THE ROOM OF [ ] exhibition',
      constraints: videoConstraints.showcase,
      folder: '/redux-cms/exhibitions/the-room',
      tags: ['exhibitions', 'the-room', 'documentation'],
      supportedProviders: ['upload', 'google-drive', 'youtube', 'vimeo']
    }
  ],

  // Process/Installation Videos
  'about-installation': [
    {
      id: 'installation-process',
      name: 'Installation Process Video',
      description: 'Time-lapse of installation and creative process',
      constraints: videoConstraints.showcase,
      folder: '/redux-cms/about/installation',
      tags: ['about', 'installation', 'process', 'timelapse'],
      supportedProviders: ['upload', 'google-drive']
    }
  ],

  // Memory Section Videos
  'about-memory': [
    {
      id: 'memory-archive',
      name: 'Memory Archive Video',
      description: 'Video compilation of REDUX memories and archive footage',
      constraints: videoConstraints.showcase,
      folder: '/redux-cms/about/memory',
      tags: ['about', 'memory', 'archive'],
      supportedProviders: ['upload', 'google-drive']
    }
  ]
};

// Helper functions for working with video slots
export const videoSlotUtils = {
  // Get all slots for a specific page
  getSlotsForPage(pageId: string): VideoSlot[] {
    return videoSlots[pageId] || [];
  },

  // Get a specific slot by ID
  getSlotById(slotId: string): VideoSlot | null {
    for (const pageSlots of Object.values(videoSlots)) {
      const slot = pageSlots.find(s => s.id === slotId);
      if (slot) return slot;
    }
    return null;
  },

  // Get all slots with a specific tag
  getSlotsByTag(tag: string): VideoSlot[] {
    const matchingSlots: VideoSlot[] = [];
    for (const pageSlots of Object.values(videoSlots)) {
      for (const slot of pageSlots) {
        if (slot.tags?.includes(tag)) {
          matchingSlots.push(slot);
        }
      }
    }
    return matchingSlots;
  },

  // Get all designer video slots
  getDesignerSlots(): VideoSlot[] {
    return this.getSlotsByTag('designers');
  },

  // Get all fashion film slots
  getFashionFilmSlots(): VideoSlot[] {
    return this.getSlotsByTag('fashion-film');
  },

  // Get all slots in a specific folder
  getSlotsByFolder(folder: string): VideoSlot[] {
    const matchingSlots: VideoSlot[] = [];
    for (const pageSlots of Object.values(videoSlots)) {
      for (const slot of pageSlots) {
        if (slot.folder === folder) {
          matchingSlots.push(slot);
        }
      }
    }
    return matchingSlots;
  },

  // Get slots by provider
  getSlotsByProvider(provider: 'upload' | 'google-drive' | 'youtube' | 'vimeo'): VideoSlot[] {
    const matchingSlots: VideoSlot[] = [];
    for (const pageSlots of Object.values(videoSlots)) {
      for (const slot of pageSlots) {
        if (slot.supportedProviders?.includes(provider)) {
          matchingSlots.push(slot);
        }
      }
    }
    return matchingSlots;
  },

  // Get total number of slots
  getTotalSlotCount(): number {
    return Object.values(videoSlots).reduce((total, pageSlots) => total + pageSlots.length, 0);
  },

  // Get slots organized by page for admin interface
  getAllSlotsGrouped(): { page: string; slots: VideoSlot[] }[] {
    return Object.entries(videoSlots).map(([page, slots]) => ({
      page,
      slots
    }));
  },

  // Validate video URL
  validateVideoUrl(url: string): { valid: boolean; provider?: string; error?: string } {
    try {
      const urlObj = new URL(url);
      
      // Google Drive
      if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          return { valid: true, provider: 'google-drive' };
        }
        return { valid: false, error: 'Invalid Google Drive URL format' };
      }
      
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
          videoId = url.split('watch?v=')[1].split('&')[0];
        }
        if (videoId) {
          return { valid: true, provider: 'youtube' };
        }
        return { valid: false, error: 'Invalid YouTube URL format' };
      }
      
      // Vimeo
      if (url.includes('vimeo.com')) {
        const match = url.match(/vimeo\.com\/(\d+)/);
        if (match) {
          return { valid: true, provider: 'vimeo' };
        }
        return { valid: false, error: 'Invalid Vimeo URL format' };
      }
      
      return { valid: false, error: 'Unsupported video provider' };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  },

  // Validate slot configuration
  validateSlot(slot: VideoSlot): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!slot.id) errors.push('Slot ID is required');
    if (!slot.name) errors.push('Slot name is required');
    if (!slot.folder) errors.push('Folder path is required');
    if (!slot.tags || slot.tags.length === 0) errors.push('At least one tag is required');

    if (slot.constraints) {
      if (slot.constraints.maxFileSize && slot.constraints.maxFileSize < 0) {
        errors.push('Max file size must be positive');
      }
      if (slot.constraints.maxDuration && slot.constraints.maxDuration < 1) {
        errors.push('Max duration must be at least 1 second');
      }
    }

    if (slot.supportedProviders && slot.supportedProviders.length === 0) {
      errors.push('At least one supported provider is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// Default current videos (Google Drive links from existing data)
export const defaultCurrentVideos: Record<string, VideoSlot['currentVideo']> = {
  'hero-main-video': {
    url: '/videos/hero-video.mp4',
    filename: 'hero-video.mp4',
    title: 'REDUX Hero Video',
    description: 'Main hero video showcasing REDUX collective',
    provider: 'upload'
  },
  'film-01-norma-limousine': {
    url: 'https://drive.google.com/file/d/1q2w3e4r5t6y7u8i9o0p/preview',
    filename: 'norma-limousine',
    title: 'NORMA LIMOUSINE',
    description: 'Fashion film by Kim Bomin featuring NORMA LIMOUSINE collection',
    provider: 'google-drive',
    embedId: '1q2w3e4r5t6y7u8i9o0p',
    thumbnailUrl: '/images/designers/kimbomin/cinemode/NOR_7419-11.jpg'
  },
  'kimbomin-showcase': {
    url: 'https://drive.google.com/file/d/kimbomin_showcase_video/preview',
    filename: 'kimbomin-showcase',
    title: 'Kim Bomin Creative Showcase',
    description: 'Showcase of Kim Bomin\'s latest fashion designs and creative process',
    provider: 'google-drive',
    embedId: 'kimbomin_showcase_video'
  },
  'parkparang-showcase': {
    url: 'https://drive.google.com/file/d/parkparang_showcase_video/preview',
    filename: 'parkparang-showcase',
    title: 'Park Parang Design Journey',
    description: 'Journey through Park Parang\'s innovative design concepts',
    provider: 'google-drive',
    embedId: 'parkparang_showcase_video'
  },
  'leetaehyeon-showcase': {
    url: 'https://drive.google.com/file/d/leetaehyeon_showcase_video/preview',
    filename: 'leetaehyeon-showcase',
    title: 'Lee Taehyeon Artistic Vision',
    description: 'Exploration of Lee Taehyeon\'s artistic vision and design philosophy',
    provider: 'google-drive',
    embedId: 'leetaehyeon_showcase_video'
  },
  'choieunsol-showcase': {
    url: 'https://drive.google.com/file/d/choieunsol_showcase_video/preview',
    filename: 'choieunsol-showcase',
    title: 'Choi Eunsol Creative Process',
    description: 'Behind the scenes look at Choi Eunsol\'s creative process',
    provider: 'google-drive',
    embedId: 'choieunsol_showcase_video'
  },
  'hwangjinsu-showcase': {
    url: 'https://drive.google.com/file/d/hwangjinsu_showcase_video/preview',
    filename: 'hwangjinsu-showcase',
    title: 'Hwang Jinsu Fashion Evolution',
    description: 'Evolution of Hwang Jinsu\'s fashion design approach',
    provider: 'google-drive',
    embedId: 'hwangjinsu_showcase_video'
  },
  'kimgyeongsu-showcase': {
    url: 'https://drive.google.com/file/d/kimgyeongsu_showcase_video/preview',
    filename: 'kimgyeongsu-showcase',
    title: 'Kim Gyeongsu Design Philosophy',
    description: 'Deep dive into Kim Gyeongsu\'s design philosophy and techniques',
    provider: 'google-drive',
    embedId: 'kimgyeongsu_showcase_video'
  }
};