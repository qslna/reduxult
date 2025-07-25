'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import CMSManager from './CMSManager';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

export default function FloatingCMSButton() {
  const [showCMS, setShowCMS] = useState(false);
  const { requestAdminAccess } = useSimpleAuth();

  const handleCMSOpen = () => {
    requestAdminAccess();
    setShowCMS(true);
  };

  const handleCMSClose = () => {
    setShowCMS(false);
  };

  return (
    <>
      {/* Floating CMS Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
        onClick={handleCMSOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
        aria-label="Open CMS Manager"
      >
        <Settings className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          CMS 관리
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </motion.button>

      {/* CMS Manager */}
      <CMSManager isOpen={showCMS} onClose={handleCMSClose} />
    </>
  );
}