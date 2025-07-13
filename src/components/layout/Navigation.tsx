'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Image, Mail, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useThemeStore } from '@/store/useThemeStore';

const navigationItems = [
  { 
    label: 'About', 
    href: '/about',
    icon: User,
    dropdown: [
      { label: 'Collective', href: '/about/collective' },
      { label: 'Fashion Film', href: '/about/fashion-film' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Process', href: '/about/installation' },
      { label: 'Memory', href: '/about/memory' },
    ]
  },
  { 
    label: 'Designers', 
    href: '/designers',
    icon: Image,
  },
  { 
    label: 'Exhibitions', 
    href: '/exhibitions',
    icon: Calendar
  },
  { 
    label: 'Contact', 
    href: '/contact',
    icon: Mail
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'backdrop-blur-lg bg-black/10' : 'bg-transparent',
          currentTheme && `theme-${currentTheme}`
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-white font-space-grotesk"
              >
                REDUX
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300',
                      'hover:text-white/80 focus-ring',
                      pathname === item.href ? 'text-white' : 'text-white/70'
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>

                  {/* Desktop Dropdown */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 glass rounded-lg overflow-hidden"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdown.map((dropdownItem, index) => (
                            <motion.div
                              key={dropdownItem.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={dropdownItem.href}
                                className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                              >
                                {dropdownItem.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors focus-ring"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden glass-dark border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg',
                          'hover:bg-white/10 focus-ring',
                          pathname === item.href ? 'text-white bg-white/5' : 'text-white/70'
                        )}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                      
                      {item.dropdown && (
                        <button
                          onClick={() => handleDropdownToggle(item.label)}
                          className="p-2 text-white/70 hover:text-white transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.div>
                        </button>
                      )}
                    </div>

                    {/* Mobile Dropdown */}
                    {item.dropdown && (
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-8 space-y-1"
                          >
                            {item.dropdown.map((dropdownItem, dropIndex) => (
                              <motion.div
                                key={dropdownItem.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: dropIndex * 0.05 }}
                              >
                                <Link
                                  href={dropdownItem.href}
                                  className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-all duration-200"
                                >
                                  {dropdownItem.label}
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20" />
    </>
  );
}