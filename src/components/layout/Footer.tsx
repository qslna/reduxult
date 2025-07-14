import Link from 'next/link';
import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-white/10">
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">REDUX</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/redux_official"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/designers" className="text-gray-400 hover:text-white transition-colors">
                  Designers
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-gray-400 hover:text-white transition-colors">
                  Exhibitions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:contact@redux.kr" className="hover:text-white transition-colors">
                  contact@redux.kr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  서울특별시 강남구<br />
                  Seoul, South Korea
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} REDUX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}