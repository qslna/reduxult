'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { GSAPAnimations } from '@/lib/animations';
import { navigationItems } from '@/data/navigation';

const navItems = navigationItems;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  // GSAP magnetic effect for nav items
  useEffect(() => {
    const navElements = document.querySelectorAll('.nav-item');
    const cleanupFunctions: (() => void)[] = [];

    navElements.forEach((element) => {
      const cleanup = GSAPAnimations.magneticEffect(element, {
        strength: 0.2,
        distance: 50
      });
      if (cleanup) cleanupFunctions.push(cleanup);
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);

  const handleSubmenuToggle = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const submenuVariants = {
    closed: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    open: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.nav 
      ref={navRef}
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-black/95 backdrop-blur-xl border-b border-white/20 shadow-2xl" 
          : "bg-black/70 backdrop-blur-lg border-b border-white/10"
      )}
      style={{
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20"
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="container relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo with enhanced animations */}
          <Link href="/" className="relative group">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  backgroundSize: '200% auto'
                }}
              >
                REDUX
              </motion.span>
              
              {/* Logo underline animation */}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.href} className="relative group">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.dropdown ? (
                    <button
                      className="nav-item flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10"
                      onMouseEnter={() => setActiveSubmenu(item.label)}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <span>{item.label}</span>
                      <motion.div
                        animate={{ rotate: activeSubmenu === item.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-item relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/10",
                        pathname === item.href 
                          ? "text-white bg-white/20" 
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      {item.label}
                      
                      {/* Active indicator */}
                      {pathname === item.href && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg"
                          layoutId="activeNavItem"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  )}
                </motion.div>

                {/* Submenu */}
                <AnimatePresence>
                  {item.dropdown && activeSubmenu === item.label && (
                    <motion.div
                      variants={submenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
                      onMouseEnter={() => setActiveSubmenu(item.label)}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      {item.dropdown.map((subitem, subIndex) => (
                        <motion.div
                          key={subitem.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <Link
                            href={subitem.href}
                            className={cn(
                              "block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200",
                              pathname === subitem.href && "text-white bg-white/20"
                            )}
                          >
                            {subitem.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={mobileItemVariants}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => handleSubmenuToggle(item.label)}
                          className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          <span>{item.label}</span>
                          <motion.div
                            animate={{ rotate: activeSubmenu === item.label ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {activeSubmenu === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4 mt-2 space-y-1"
                            >
                              {item.dropdown.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className={cn(
                                    "block px-4 py-2 text-base text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all",
                                    pathname === subitem.href && "text-white bg-white/20"
                                  )}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 text-lg font-medium rounded-lg transition-all",
                          pathname === item.href 
                            ? "text-white bg-white/20" 
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        style={{
          scaleX: useTransform(scrollY, [0, 2000], [0, 1]),
          transformOrigin: "left"
        }}
      />
    </motion.nav>
  );
}