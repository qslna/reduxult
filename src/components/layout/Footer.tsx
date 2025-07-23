import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-[1600px] mx-auto px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <ul className="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
            <li>
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/designers" 
                className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                Designers
              </Link>
            </li>
            <li>
              <Link 
                href="/exhibitions" 
                className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                Exhibitions
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                Contact
              </Link>
            </li>
          </ul>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              &copy; {new Date().getFullYear()} REDUX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}