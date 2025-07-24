// Navigation configuration - 네비게이션 설정
// 모든 네비게이션 링크와 드롭다운 메뉴 정의

export interface NavigationItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  href: string;
}

// Main navigation items
export const navigationItems: NavigationItem[] = [
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Fashion Film', href: '/about/fashion-film' },
      { label: 'Memory', href: '/about/memory' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Process', href: '/about/installation' },
      { label: 'Collective', href: '/about/collective' }
    ]
  },
  {
    label: 'Designers',
    href: '/designers',
    dropdown: [
      { label: 'Kim Bomin', href: '/designers/kimbomin' },
      { label: 'Park Parang', href: '/designers/parkparang' },
      { label: 'Lee Taehyeon', href: '/designers/leetaehyeon' },
      { label: 'Choi Eunsol', href: '/designers/choieunsol' },
      { label: 'Hwang Jinsu', href: '/designers/hwangjinsu' },
      { label: 'Kim Gyeongsu', href: '/designers/kimgyeongsu' }
    ]
  },
  {
    label: 'Exhibitions',
    href: '/exhibitions',
    dropdown: [
      { label: 'CINE MODE', href: '/exhibitions#cine-mode' },
      { label: 'THE ROOM OF [ ]', href: '/exhibitions#the-room' }
    ]
  },
  {
    label: 'Contact',
    href: '/contact'
  }
];

// Social media links
export const socialLinks = [
  { 
    label: 'Instagram', 
    href: 'https://instagram.com/redux.official',
    active: true
  },
  { 
    label: 'YouTube', 
    href: '#',
    active: false
  },
  { 
    label: 'Behance', 
    href: '#',
    active: false
  }
];

// Footer navigation (subset of main navigation)
export const footerNavigation = navigationItems.filter(item => 
  ['About', 'Designers', 'Exhibitions', 'Contact'].includes(item.label)
).map(item => ({
  label: item.label,
  href: item.href
}));

// Mobile navigation with expanded items
export const mobileNavigationItems = navigationItems.map(item => ({
  ...item,
  dropdown: item.dropdown ? [
    { label: `All ${item.label}`, href: item.href },
    ...item.dropdown
  ] : undefined
}));

// Utility functions
export const navigationUtils = {
  // Get all navigation paths for sitemap generation
  getAllPaths: (): string[] => {
    const paths: string[] = [];
    
    navigationItems.forEach(item => {
      paths.push(item.href);
      if (item.dropdown) {
        item.dropdown.forEach(dropdownItem => {
          // Only add non-hash URLs
          if (!dropdownItem.href.includes('#')) {
            paths.push(dropdownItem.href);
          }
        });
      }
    });
    
    return Array.from(new Set(paths)); // Remove duplicates
  },

  // Check if a path is active
  isActivePath: (currentPath: string, itemPath: string): boolean => {
    if (itemPath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(itemPath);
  },

  // Find navigation item by path
  findItemByPath: (path: string): NavigationItem | DropdownItem | null => {
    for (const item of navigationItems) {
      if (item.href === path) return item;
      
      if (item.dropdown) {
        const dropdownItem = item.dropdown.find(d => d.href === path);
        if (dropdownItem) return dropdownItem;
      }
    }
    return null;
  }
};