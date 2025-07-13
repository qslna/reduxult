'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { cn } from '@/utils/cn';
import { useThemeStore } from '@/store/useThemeStore';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/redux66',
    icon: Instagram,
  },
  {
    name: 'Email',
    href: 'mailto:hello@redux66.com',
    icon: Mail,
  },
];

const footerLinks = [
  {
    title: 'About',
    links: [
      { name: 'Visual Art', href: '/about/visual-art' },
      { name: 'Collective', href: '/about/collective' },
      { name: 'Fashion Film', href: '/about/fashion-film' },
      { name: 'Installation', href: '/about/installation' },
      { name: 'Memory', href: '/about/memory' },
    ],
  },
  {
    title: 'Designers',
    links: [
      { name: 'LEE TAEHYEON', href: '/designers/leetaehyeon' },
      { name: 'KIM BOMIN', href: '/designers/kimbomin' },
      { name: 'PARK PARANG', href: '/designers/parkparang' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { name: 'Exhibitions', href: '/exhibitions' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const { currentTheme } = useThemeStore();

  return (
    <footer className={cn(
      'relative bg-black text-white overflow-hidden',
      currentTheme && `theme-${currentTheme}`
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="pt-16 pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div variants={fadeIn} className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <motion.h2
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  REDUX66
                </motion.h2>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                세계 최고 수준의 디자이너 포트폴리오 플랫폼. 
                창의적 비전과 혁신적 디자인이 만나는 공간.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <MapPin size={16} />
                  <span>Seoul, South Korea</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Mail size={16} />
                  <a 
                    href="mailto:hello@redux66.com" 
                    className="hover:text-white transition-colors"
                  >
                    hello@redux66.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section, index) => (
              <motion.div
                key={section.title}
                variants={fadeIn}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            variants={fadeIn}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <social.icon 
                      size={20} 
                      className="text-gray-400 group-hover:text-white transition-colors" 
                    />
                  </motion.a>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} REDUX66. All rights reserved.
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Brand Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-6 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs text-gray-500">
              세계 최고 수준의 디자이너 포트폴리오
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-white/3 to-transparent rounded-full blur-2xl" />
    </footer>
  );
}