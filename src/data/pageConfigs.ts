import { PageEditorConfig, EditableElement } from '@/components/cms/InstagramStylePageEditor';

export type { PageEditorConfig, EditableElement };

// Home Page Configuration
export const homePageConfig: PageEditorConfig = {
  pageId: 'home',
  pageName: 'Home Page',
  previewUrl: '/',
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Main hero area with video and title',
      elements: ['hero-title', 'hero-subtitle', 'hero-video', 'hero-background']
    },
    {
      id: 'showcase',
      name: 'Showcase Section',
      description: 'Grid showcase of designers and work',
      elements: ['showcase-title', 'showcase-grid']
    }
  ],
  editableElements: [
    {
      id: 'hero-title',
      type: 'text',
      content: 'REDUX',
      position: { x: 50, y: 200, width: 600, height: 100 },
      styles: {
        fontSize: '4rem',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'home',
        sectionId: 'hero',
        label: 'Hero Title',
        description: 'Main title displayed in hero section',
        required: true,
        maxLength: 20
      }
    },
    {
      id: 'hero-subtitle',
      type: 'text',
      content: 'CONTEMPORARY FASHION COLLECTIVE',
      position: { x: 50, y: 320, width: 600, height: 50 },
      styles: {
        fontSize: '1.2rem',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'home',
        sectionId: 'hero',
        label: 'Hero Subtitle',
        description: 'Subtitle text below main title',
        required: false,
        maxLength: 100
      }
    },
    {
      id: 'hero-video',
      type: 'video',
      content: {
        url: '/videos/hero-bg.mp4',
        autoplay: true,
        loop: true,
        muted: true
      },
      position: { x: 0, y: 0, width: 1920, height: 1080 },
      styles: {
        objectFit: 'cover',
        zIndex: -1
      },
      metadata: {
        pageId: 'home',
        sectionId: 'hero',
        label: 'Hero Background Video',
        description: 'Background video for hero section',
        required: false,
        allowedTypes: ['video/mp4', 'video/webm']
      }
    },
    {
      id: 'hero-background',
      type: 'background',
      content: {
        type: 'gradient',
        value: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
      },
      position: { x: 0, y: 0, width: 1920, height: 1080 },
      styles: {
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
        zIndex: 1
      },
      metadata: {
        pageId: 'home',
        sectionId: 'hero',
        label: 'Hero Background Overlay',
        description: 'Overlay background for hero section'
      }
    }
  ]
};

// About Page Configuration
export const aboutPageConfig: PageEditorConfig = {
  pageId: 'about',
  pageName: 'About Page',
  previewUrl: '/about',
  sections: [
    {
      id: 'intro',
      name: 'Introduction',
      description: 'Main about content and introduction',
      elements: ['about-title', 'about-description', 'about-image']
    },
    {
      id: 'categories',
      name: 'Categories',
      description: 'About category preview cards',
      elements: ['categories-grid']
    }
  ],
  editableElements: [
    {
      id: 'about-title',
      type: 'text',
      content: 'ABOUT REDUX',
      position: { x: 100, y: 150, width: 800, height: 80 },
      styles: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'about',
        sectionId: 'intro',
        label: 'About Page Title',
        description: 'Main title for about page',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'about-description',
      type: 'text',
      content: 'REDUX는 6인의 패션 디자이너로 구성된 창작 집단입니다. 우리는 현대적이고 혁신적인 패션을 통해 새로운 문화를 만들어가고 있습니다.',
      position: { x: 100, y: 250, width: 800, height: 120 },
      styles: {
        fontSize: '1.2rem',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: '1.6',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'about',
        sectionId: 'intro',
        label: 'About Description',
        description: 'Main description text for about page',
        required: true,
        maxLength: 500
      }
    }
  ]
};

// Designers Page Configuration
export const designersPageConfig: PageEditorConfig = {
  pageId: 'designers',
  pageName: 'Designers Page',
  previewUrl: '/designers',
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Hero section with main title and subtitle',
      elements: ['hero-title', 'hero-subtitle']
    },
    {
      id: 'grid',
      name: 'Designers Grid',
      description: 'Grid of designer profiles',
      elements: ['designers-grid']
    }
  ],
  editableElements: [
    {
      id: 'hero-title',
      type: 'text',
      content: 'SIX DESIGNERS',
      position: { x: 50, y: 200, width: 600, height: 100 },
      styles: {
        fontSize: 'clamp(48px, 8vw, 80px)',
        fontWeight: 300,
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '0.2em',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'designers',
        sectionId: 'hero',
        label: 'Hero Title',
        description: 'Main title for designers page hero section',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'hero-subtitle',
      type: 'text',
      content: 'One Collective Vision',
      position: { x: 50, y: 320, width: 600, height: 50 },
      styles: {
        fontSize: '18px',
        fontWeight: '400',
        color: '#999999',
        textAlign: 'center',
        letterSpacing: '2px',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'designers',
        sectionId: 'hero',
        label: 'Hero Subtitle',
        description: 'Subtitle for designers page hero section',
        required: false,
        maxLength: 100
      }
    }
  ]
};

// Contact Page Configuration
export const contactPageConfig: PageEditorConfig = {
  pageId: 'contact',
  pageName: 'Contact Page',
  previewUrl: '/contact',
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Hero section with main title and CTA',
      elements: ['hero-title', 'hero-subtitle', 'cta-text']
    },
    {
      id: 'contact-info',
      name: 'Contact Information',
      description: 'Contact information section',
      elements: ['section-title', 'section-description', 'social-text']
    },
    {
      id: 'form',
      name: 'Contact Form',
      description: 'Contact form section',
      elements: ['form-title', 'form-description', 'submit-text']
    }
  ],
  editableElements: [
    {
      id: 'hero-title',
      type: 'text',
      content: 'CONNECT',
      position: { x: 50, y: 200, width: 600, height: 100 },
      styles: {
        fontSize: 'clamp(50px, 12vw, 140px)',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'hero',
        label: 'Hero Title',
        description: 'Main title for contact page hero section',
        required: true,
        maxLength: 20
      }
    },
    {
      id: 'hero-subtitle',
      type: 'text',
      content: "Let's Create Something Extraordinary",
      position: { x: 50, y: 320, width: 600, height: 50 },
      styles: {
        fontSize: 'clamp(14px, 2vw, 18px)',
        fontWeight: '300',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'hero',
        label: 'Hero Subtitle',
        description: 'Subtitle for contact page hero section',
        required: false,
        maxLength: 100
      }
    },
    {
      id: 'cta-text',
      type: 'text',
      content: 'Ready to Connect',
      position: { x: 50, y: 420, width: 600, height: 50 },
      styles: {
        fontSize: '14px',
        fontWeight: '300',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'hero',
        label: 'CTA Text',
        description: 'Call-to-action text in hero section',
        required: false,
        maxLength: 50
      }
    },
    {
      id: 'section-title',
      type: 'text',
      content: "Let's\\nConnect",
      position: { x: 100, y: 100, width: 400, height: 100 },
      styles: {
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'contact-info',
        label: 'Contact Info Title',
        description: 'Title for contact information section',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'section-description',
      type: 'text',
      content: '우리와 함께 만들어갈\\n새로운 프로젝트를 이야기해보세요',
      position: { x: 100, y: 220, width: 400, height: 60 },
      styles: {
        fontSize: '14px',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'Inter',
        lineHeight: '1.6'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'contact-info',
        label: 'Contact Info Description',
        description: 'Description for contact information section',
        required: false,
        maxLength: 200
      }
    },
    {
      id: 'form-title',
      type: 'text',
      content: 'Start a\\nConversation',
      position: { x: 500, y: 100, width: 400, height: 100 },
      styles: {
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'form',
        label: 'Form Title',
        description: 'Title for contact form section',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'form-description',
      type: 'text',
      content: '당신의 아이디어를 들려주세요. 함께 만들어갈 이야기가 기다리고 있습니다.',
      position: { x: 500, y: 220, width: 400, height: 60 },
      styles: {
        fontSize: '14px',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'Inter',
        lineHeight: '1.6'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'form',
        label: 'Form Description',
        description: 'Description for contact form section',
        required: false,
        maxLength: 200
      }
    },
    {
      id: 'submit-text',
      type: 'text',
      content: 'Send Message',
      position: { x: 500, y: 400, width: 200, height: 40 },
      styles: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'form',
        label: 'Submit Button Text',
        description: 'Text for form submit button',
        required: true,
        maxLength: 30
      }
    },
    {
      id: 'social-text',
      type: 'text',
      content: 'Follow Our Journey',
      position: { x: 100, y: 400, width: 300, height: 30 },
      styles: {
        fontSize: '12px',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'left',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'contact',
        sectionId: 'contact-info',
        label: 'Social Links Text',
        description: 'Text above social media links',
        required: false,
        maxLength: 50
      }
    }
  ]
};

// Exhibitions Page Configuration
export const exhibitionsPageConfig: PageEditorConfig = {
  pageId: 'exhibitions',
  pageName: 'Exhibitions Page',
  previewUrl: '/exhibitions',
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Hero section with main title and subtitle',
      elements: ['hero-title', 'hero-subtitle']
    },
    {
      id: 'cine-mode',
      name: 'CINE MODE Exhibition',
      description: 'CINE MODE exhibition information',
      elements: ['cine-title', 'cine-description-1', 'cine-description-2', 'cine-cta', 'cine-gallery-title', 'cine-gallery-description']
    },
    {
      id: 'room',
      name: 'THE ROOM Exhibition',
      description: 'THE ROOM exhibition information',
      elements: ['room-title', 'room-description-1', 'room-description-2', 'room-cta', 'room-gallery-title', 'room-gallery-description']
    },
    {
      id: 'future',
      name: 'Future Exhibitions',
      description: 'Future exhibitions section',
      elements: ['future-title', 'future-description-1', 'future-description-2', 'future-cta']
    }
  ],
  editableElements: [
    {
      id: 'hero-title',
      type: 'text',
      content: 'EXHIBITIONS',
      position: { x: 50, y: 200, width: 600, height: 100 },
      styles: {
        fontSize: 'clamp(60px, 12vw, 180px)',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'hero',
        label: 'Hero Title',
        description: 'Main title for exhibitions page hero section',
        required: true,
        maxLength: 20
      }
    },
    {
      id: 'hero-subtitle',
      type: 'text',
      content: 'Redefining Fashion Through Space',
      position: { x: 50, y: 320, width: 600, height: 50 },
      styles: {
        fontSize: 'clamp(14px, 2vw, 18px)',
        fontWeight: '300',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'hero',
        label: 'Hero Subtitle',
        description: 'Subtitle for exhibitions page hero section',
        required: false,
        maxLength: 100
      }
    },
    {
      id: 'cine-title',
      type: 'text',
      content: 'CINE\\nMODE',
      position: { x: 500, y: 100, width: 400, height: 100 },
      styles: {
        fontSize: 'clamp(42px, 6vw, 72px)',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'cine-mode',
        label: 'CINE MODE Title',
        description: 'Title for CINE MODE exhibition',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'cine-description-1',
      type: 'text',
      content: 'REDUX의 \'CINE MODE\' 패션 필름 전시회는 단순한 스타일 전시를 넘어 영상에 각자의 이야기를 담아 관객들과의 유대감 형성에 집중한 전시입니다.',
      position: { x: 500, y: 220, width: 400, height: 80 },
      styles: {
        fontSize: 'clamp(15px, 2vw, 17px)',
        fontWeight: '300',
        color: '#444444',
        textAlign: 'left',
        fontFamily: 'Inter',
        lineHeight: '1.7'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'cine-mode',
        label: 'CINE MODE Description 1',
        description: 'First description paragraph for CINE MODE exhibition',
        required: false,
        maxLength: 300
      }
    },
    {
      id: 'cine-description-2',
      type: 'text',
      content: '6인의 디자이너가 각자의 관점으로 풀어낸 패션 필름을 통해 시각적 서사를 경험할 수 있습니다.',
      position: { x: 500, y: 320, width: 400, height: 60 },
      styles: {
        fontSize: '14px',
        fontWeight: '300',
        color: '#666666',
        textAlign: 'left',
        fontFamily: 'Inter',
        lineHeight: '1.7'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'cine-mode',
        label: 'CINE MODE Description 2',
        description: 'Second description paragraph for CINE MODE exhibition',
        required: false,
        maxLength: 200
      }
    },
    {
      id: 'cine-cta',
      type: 'text',
      content: 'Explore Exhibition',
      position: { x: 500, y: 420, width: 200, height: 40 },
      styles: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'cine-mode',
        label: 'CINE MODE CTA',
        description: 'Call-to-action button text for CINE MODE exhibition',
        required: true,
        maxLength: 30
      }
    },
    {
      id: 'future-title',
      type: 'text',
      content: 'FUTURE\\nEXHIBITIONS',
      position: { x: 100, y: 100, width: 500, height: 120 },
      styles: {
        fontSize: 'clamp(48px, 8vw, 96px)',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Playfair Display'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'future',
        label: 'Future Exhibitions Title',
        description: 'Title for future exhibitions section',
        required: true,
        maxLength: 50
      }
    },
    {
      id: 'future-description-1',
      type: 'text',
      content: 'REDUX는 계속해서 새로운 형태의 전시를 준비하고 있습니다.',
      position: { x: 100, y: 250, width: 600, height: 60 },
      styles: {
        fontSize: 'clamp(16px, 2.5vw, 20px)',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Inter',
        lineHeight: '1.8'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'future',
        label: 'Future Description 1',
        description: 'First description for future exhibitions',
        required: false,
        maxLength: 200
      }
    },
    {
      id: 'future-description-2',
      type: 'text',
      content: '패션과 예술의 경계를 넘나들며, 관객과 함께 만들어가는 특별한 경험을 선사하겠습니다.',
      position: { x: 100, y: 330, width: 600, height: 60 },
      styles: {
        fontSize: 'clamp(14px, 2vw, 16px)',
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Inter',
        lineHeight: '1.7'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'future',
        label: 'Future Description 2',
        description: 'Second description for future exhibitions',
        required: false,
        maxLength: 200
      }
    },
    {
      id: 'future-cta',
      type: 'text',
      content: 'Stay Updated',
      position: { x: 300, y: 420, width: 200, height: 40 },
      styles: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontFamily: 'Inter'
      },
      metadata: {
        pageId: 'exhibitions',
        sectionId: 'future',
        label: 'Future CTA',
        description: 'Call-to-action button text for future exhibitions',
        required: true,
        maxLength: 30
      }
    }
  ]
};

// All page configurations
export const pageConfigs = {
  home: homePageConfig,
  about: aboutPageConfig,
  designers: designersPageConfig,
  contact: contactPageConfig,
  exhibitions: exhibitionsPageConfig
};

// Utility functions
export const getPageConfig = (pageId: string): PageEditorConfig | null => {
  return pageConfigs[pageId as keyof typeof pageConfigs] || null;
};

export const getAllPageConfigs = (): PageEditorConfig[] => {
  return Object.values(pageConfigs);
};

export const getEditableElementsBySection = (config: PageEditorConfig, sectionId: string): EditableElement[] => {
  const section = config.sections.find(s => s.id === sectionId);
  if (!section) return [];
  
  return config.editableElements.filter(element => 
    section.elements.includes(element.id)
  );
};