'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Fashion Film', href: '/about/fashion-film' },
      { label: 'Memory', href: '/about/memory' },
      { label: 'Visual Art', href: '/about/visual-art' },
      { label: 'Installation', href: '/about/installation' },
      { label: 'Collective', href: '/about/collective' },
    ],
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
      { label: 'Kim Gyeongsu', href: '/designers/kimgyeongsu' },
    ],
  },
  {
    label: 'Exhibitions',
    href: '/exhibitions',
    dropdown: [
      { label: 'CINE MODE', href: '/exhibitions#cine-mode' },
      { label: 'THE ROOM OF [ ]', href: '/exhibitions#the-room' },
    ],
  },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 md:py-4 bg-white/95 backdrop-blur-lg shadow-lg'
            : 'py-5 md:py-6 bg-transparent'
        }`}
        style={{ mixBlendMode: 'difference' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <motion.div
                className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white transition-all duration-300 group-hover:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                REDUX
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href || '#'}
                    className="text-sm font-light text-white uppercase tracking-wider transition-all duration-300 hover:text-accent-mocha relative py-2"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-accent-mocha to-accent-warm transition-all duration-500 group-hover:w-full" />
                  </Link>

                  {/* Dropdown */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 min-w-48 glass rounded-lg shadow-xl overflow-hidden"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="py-3">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                href={dropdownItem.href}
                                className="block px-6 py-3 text-xs text-white/90 uppercase tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-white hover:translate-x-1"
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 group"
              onClick={toggleMobileMenu}
              style={{ mixBlendMode: 'difference' }}
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div
              className="relative flex flex-col justify-center items-center min-h-screen px-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="w-full max-w-sm text-center mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    href={item.href || '#'}
                    className="block text-2xl font-light text-white tracking-wider py-4 hover:text-accent-mocha transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  
                  {item.dropdown && (
                    <div className="mt-4 space-y-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block text-sm text-white/70 tracking-wide py-2 hover:text-white transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}