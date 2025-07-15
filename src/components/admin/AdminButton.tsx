'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminPanel from './AdminPanel';

export default function AdminButton() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 개발 모드에서만 표시하거나, 특정 키 조합으로 활성화
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Shift + A 조합으로 관리자 버튼 토글
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // 개발 모드에서는 항상 표시
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        title="Admin Panel"
      >
        <Settings size={24} />
      </motion.button>

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
}