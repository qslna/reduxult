'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

/**
 * 2025년 기준 다국어 지원 컴포넌트
 * 글로벌 패션 시장을 위한 멀티언어 지원
 */
export default function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState<string>('ko');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 저장된 언어 설정 불러오기
    const savedLang = localStorage.getItem('redux-language') || 'ko';
    setCurrentLang(savedLang);
    document.documentElement.lang = savedLang;
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('redux-language', langCode);
    document.documentElement.lang = langCode;
    setIsOpen(false);
    
    // 실제 구현시 여기서 언어 변경 로직 추가
    // 예: i18n 라이브러리 연동, API 호출 등
    console.log(`Language changed to: ${langCode}`);
  };

  if (!mounted) return null;

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="fixed top-20 right-6 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Change language"
        title="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden shadow-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                currentLang === lang.code ? 'bg-white/5 text-amber-300' : 'text-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}