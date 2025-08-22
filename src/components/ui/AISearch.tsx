'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'designer' | 'exhibition' | 'about' | 'page';
  title: string;
  description: string;
  url: string;
  relevance: number;
}

/**
 * 2025년 기준 AI 기반 지능형 검색 컴포넌트
 * 자연어 처리 및 의미 기반 검색 지원
 */
export default function AISearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 검색 데이터베이스 (실제로는 API나 벡터 DB 사용)
  const searchDatabase: SearchResult[] = [
    { type: 'designer', title: 'Kim Bomin', description: 'Fashion Designer & Film Director', url: '/designers/kim-bomin', relevance: 1 },
    { type: 'designer', title: 'Park Parang', description: 'Fashion Designer', url: '/designers/park-parang', relevance: 1 },
    { type: 'designer', title: 'Lee Taehyeon', description: 'Fashion Designer', url: '/designers/lee-taehyeon', relevance: 1 },
    { type: 'designer', title: 'Choi Eunsol', description: 'Fashion Designer', url: '/designers/choi-eunsol', relevance: 1 },
    { type: 'designer', title: 'Kim Gyeongsu', description: 'Fashion Designer', url: '/designers/kim-gyeongsu', relevance: 1 },
    { type: 'exhibition', title: 'THE ROOM OF [ ]', description: '5명의 패션 디자이너가 만들어가는 창작의 공간', url: '/exhibitions', relevance: 1 },
    { type: 'exhibition', title: 'CINE MODE', description: 'Fashion Film Exhibition', url: '/exhibitions#cine-mode', relevance: 1 },
    { type: 'about', title: 'Fashion Film', description: 'REDUX의 패션 필름 프로젝트', url: '/about/fashion-film', relevance: 1 },
    { type: 'about', title: 'Visual Art', description: '시각 예술과 패션의 만남', url: '/about/visual-art', relevance: 1 },
    { type: 'about', title: 'Memory', description: '기억과 패션의 아카이브', url: '/about/memory', relevance: 1 },
    { type: 'about', title: 'Process', description: '창작 과정의 기록', url: '/about/installation', relevance: 1 },
    { type: 'about', title: 'Collective', description: 'REDUX 집단 창작', url: '/about/collective', relevance: 1 },
    { type: 'page', title: 'Contact', description: '문의 및 연락처', url: '/contact', relevance: 1 },
  ];

  // AI 검색 제안 생성
  const generateSuggestions = (input: string) => {
    if (input.length < 2) return [];
    
    const suggestedQueries = [
      '패션 디자이너 검색',
      '전시 정보 보기',
      'Kim Bomin 포트폴리오',
      'REDUX 소개',
      '최신 컬렉션',
      'Fashion Film 프로젝트',
    ];
    
    return suggestedQueries.filter(s => 
      s.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 3);
  };

  // AI 기반 검색 (시뮬레이션)
  const performAISearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    // 실제로는 벡터 임베딩과 의미 검색을 수행
    await new Promise(resolve => setTimeout(resolve, 500)); // 검색 시뮬레이션
    
    const lowerQuery = searchQuery.toLowerCase();
    const searchResults = searchDatabase.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description.toLowerCase().includes(lowerQuery);
      
      // 관련성 점수 계산
      if (titleMatch) item.relevance = 1;
      else if (descMatch) item.relevance = 0.7;
      else item.relevance = 0.3;
      
      return titleMatch || descMatch;
    });
    
    // 관련성 순으로 정렬
    searchResults.sort((a, b) => b.relevance - a.relevance);
    
    setResults(searchResults);
    setIsSearching(false);
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performAISearch(query);
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 단축키 (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 검색어 변경시 제안 업데이트
  useEffect(() => {
    setSuggestions(generateSuggestions(query));
    if (query.length > 2) {
      performAISearch(query);
    }
  }, [query]);

  const navigateToResult = (url: string) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    router.push(url);
  };

  return (
    <>
      {/* 검색 버튼 */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="fixed top-20 right-6 z-[90] flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="AI Search (Cmd+K)"
        title="AI Search (Cmd+K)"
      >
        <Sparkles className="w-4 h-4" />
        <Search className="w-4 h-4" />
        <span className="hidden md:inline text-sm">AI Search</span>
        <kbd className="hidden md:inline px-2 py-0.5 text-xs bg-white/10 rounded">⌘K</kbd>
      </button>

      {/* 검색 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[1002] bg-black/80 backdrop-blur-sm">
          <div 
            ref={searchRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* 검색 헤더 */}
            <div className="p-6 border-b border-white/10">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="AI로 검색하기... (예: Kim Bomin, 전시 정보, Fashion Film)"
                    className="flex-1 bg-transparent text-white placeholder-white/50 text-lg focus:outline-none"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      setResults([]);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/50" />
                  </button>
                </div>
              </form>
              
              {/* 검색 제안 */}
              {suggestions.length > 0 && query.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 text-sm rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 검색 결과 */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigateToResult(result.url)}
                      className="w-full flex items-start gap-4 p-4 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <div className="mt-1">
                        {result.type === 'designer' && <span className="text-blue-400">👤</span>}
                        {result.type === 'exhibition' && <span className="text-green-400">🎨</span>}
                        {result.type === 'about' && <span className="text-purple-400">📖</span>}
                        {result.type === 'page' && <span className="text-gray-400">📄</span>}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{result.title}</h3>
                        <p className="text-white/60 text-sm mt-1">{result.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/40">{result.url}</span>
                          {result.relevance > 0.8 && (
                            <span className="px-2 py-0.5 bg-amber-300/20 text-amber-300 text-xs rounded-full">
                              Best Match
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length > 2 && !isSearching ? (
                <div className="p-8 text-center text-white/50">
                  <p>검색 결과가 없습니다</p>
                  <p className="text-sm mt-2">다른 검색어를 시도해보세요</p>
                </div>
              ) : (
                <div className="p-8 text-center text-white/50">
                  <p className="text-sm">검색어를 입력하거나 제안된 검색어를 선택하세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}