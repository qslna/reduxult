import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { DESIGNERS } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">REDUX</h3>
            <p className="text-gray-400 text-sm">
              Korean Fashion Designer Collective
            </p>
            <p className="text-gray-400 text-sm mt-2">
              실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/designers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Designers
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Designers */}
          <div>
            <h4 className="font-semibold mb-4">Designers</h4>
            <ul className="space-y-2">
              {DESIGNERS.map((designer) => (
                <li key={designer.id}>
                  <a
                    href={designer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Instagram size={14} />
                    {designer.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2024 REDUX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:info@redux.kr"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://instagram.com/redux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}