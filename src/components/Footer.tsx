'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Designers', href: '/designers' },
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Navigation Links */}
          <motion.nav
            className="flex flex-col md:flex-row gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-light uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Copyright */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-white/60 font-light">
              &copy; 2025 REDUX. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}