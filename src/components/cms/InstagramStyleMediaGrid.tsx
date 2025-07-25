'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Volume2,
  VolumeX,
  X,
  Search,
  Filter,
  Star,
  Eye,
  Download,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  User,
  Image as ImageIcon,
  Video as VideoIcon
} from 'lucide-react';
import { MicroInteraction, StaggerContainer } from '@/components/ui/PageTransition';

/**
 * Phase 3: Revolutionary Instagram-Style CMS System
 * Instagram-inspired media grid with modern interactions
 */

interface MediaItem {
  id: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video';
  title: string;
  description?: string;
  tags: string[];
  uploadedAt: Date;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number; // for videos
  likes: number;
  isLiked: boolean;
  isFavorited: boolean;
  views: number;
  author: {
    name: string;
    avatar?: string;
  };
  location?: string;
  usage: {
    usedIn: string[];
    lastUsed?: Date;
  };
}

interface InstagramStyleMediaGridProps {
  items: MediaItem[];
  onItemSelect?: (item: MediaItem) => void;
  onItemLike?: (item: MediaItem) => void;
  onItemFavorite?: (item: MediaItem) => void;
  onItemEdit?: (item: MediaItem) => void;
  onItemDelete?: (item: MediaItem) => void;
  className?: string;
  layout?: 'masonry' | 'grid' | 'stories';
  showStats?: boolean;
  enableInfiniteScroll?: boolean;
}

export default function InstagramStyleMediaGrid({
  items,
  onItemSelect,
  onItemLike,
  onItemFavorite,
  onItemEdit,
  onItemDelete,
  className = '',
  layout = 'masonry',
  showStats = true,
  enableInfiniteScroll = true
}: InstagramStyleMediaGridProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'views'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likes - a.likes;
      case 'views':
        return b.views - a.views;
      case 'date':
      default:
        return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    }
  });

  // Get all unique tags
  const allTags = Array.from(new Set(items.flatMap(item => item.tags)));

  const handleItemClick = useCallback((item: MediaItem) => {
    setSelectedItem(item);
    onItemSelect?.(item);
  }, [onItemSelect]);

  const handleLike = useCallback((e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    onItemLike?.(item);
  }, [onItemLike]);

  const handleFavorite = useCallback((e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    onItemFavorite?.(item);
  }, [onItemFavorite]);

  return (
    <div className={`instagram-media-grid ${className}`}>
      {/* Instagram-Style Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
            <p className="text-white/60">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Filter Toggle */}
            <MicroInteraction>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full transition-all ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </MicroInteraction>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Sort By</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'date', label: 'Date', icon: Calendar },
                      { value: 'likes', label: 'Likes', icon: Heart },
                      { value: 'views', label: 'Views', icon: Eye }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value as any)}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-all ${
                          sortBy === value 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-3">Filter by Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 10).map(tag => (
                      <MicroInteraction key={tag} type="tap">
                        <button
                          onClick={() => {
                            setSelectedTags(prev => 
                              prev.includes(tag) 
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                          }`}
                        >
                          #{tag}
                        </button>
                      </MicroInteraction>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Media Grid */}
      <div ref={gridRef} className="relative">
        {layout === 'masonry' ? (
          <MasonryGrid items={filteredItems} onItemClick={handleItemClick} onLike={handleLike} onFavorite={handleFavorite} showStats={showStats} />
        ) : layout === 'stories' ? (
          <StoriesLayout items={filteredItems} onItemClick={handleItemClick} onLike={handleLike} onFavorite={handleFavorite} />
        ) : (
          <RegularGrid items={filteredItems} onItemClick={handleItemClick} onLike={handleLike} onFavorite={handleFavorite} showStats={showStats} />
        )}
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <InstagramStyleModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onLike={() => onItemLike?.(selectedItem)}
            onFavorite={() => onItemFavorite?.(selectedItem)}
            onEdit={() => onItemEdit?.(selectedItem)}
            onDelete={() => onItemDelete?.(selectedItem)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Masonry Grid Layout Component
function MasonryGrid({ 
  items, 
  onItemClick, 
  onLike, 
  onFavorite, 
  showStats 
}: {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  onLike: (e: React.MouseEvent, item: MediaItem) => void;
  onFavorite: (e: React.MouseEvent, item: MediaItem) => void;
  showStats: boolean;
}) {
  return (
    <StaggerContainer delay={0.05}>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="break-inside-avoid mb-6"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
          >
            <InstagramCard 
              item={item} 
              onClick={onItemClick}
              onLike={onLike}
              onFavorite={onFavorite}
              showStats={showStats}
              layout="masonry"
            />
          </motion.div>
        ))}
      </div>
    </StaggerContainer>
  );
}

// Regular Grid Layout Component
function RegularGrid({ 
  items, 
  onItemClick, 
  onLike, 
  onFavorite, 
  showStats 
}: {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  onLike: (e: React.MouseEvent, item: MediaItem) => void;
  onFavorite: (e: React.MouseEvent, item: MediaItem) => void;
  showStats: boolean;
}) {
  return (
    <StaggerContainer delay={0.05}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
          >
            <InstagramCard 
              item={item} 
              onClick={onItemClick}
              onLike={onLike}
              onFavorite={onFavorite}
              showStats={showStats}
              layout="grid"
            />
          </motion.div>
        ))}
      </div>
    </StaggerContainer>
  );
}

// Stories Layout Component (Horizontal scroll)
function StoriesLayout({ 
  items, 
  onItemClick, 
  onLike, 
  onFavorite 
}: {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  onLike: (e: React.MouseEvent, item: MediaItem) => void;
  onFavorite: (e: React.MouseEvent, item: MediaItem) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {items.slice(0, 20).map((item) => (
        <motion.div
          key={item.id}
          className="flex-shrink-0 w-32 h-48"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            onClick={() => onItemClick(item)}
            className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1"
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900">
              {item.type === 'image' ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Instagram-style Card Component
function InstagramCard({
  item,
  onClick,
  onLike,
  onFavorite,
  showStats,
  layout
}: {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  onLike: (e: React.MouseEvent, item: MediaItem) => void;
  onFavorite: (e: React.MouseEvent, item: MediaItem) => void;
  showStats: boolean;
  layout: 'grid' | 'masonry';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <motion.div
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
      onClick={() => onClick(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Media Content */}
      <div className={`relative ${layout === 'grid' ? 'aspect-square' : ''}`}>
        {item.type === 'image' ? (
          <img
            src={item.thumbnail || item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative">
            <img
              src={item.thumbnail || item.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        )}

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.views}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <MicroInteraction>
            <button
              onClick={(e) => onFavorite(e, item)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                item.isFavorited 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-black/20 text-white hover:bg-black/40'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${item.isFavorited ? 'fill-current' : ''}`} />
            </button>
          </MicroInteraction>
          
          <MicroInteraction>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickActions(!showQuickActions);
              }}
              className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </MicroInteraction>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
            {item.description && (
              <p className="text-white/60 text-xs mt-1 line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MicroInteraction type="tap">
              <button
                onClick={(e) => onLike(e, item)}
                className={`flex items-center gap-1 transition-all ${
                  item.isLiked ? 'text-red-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                {showStats && <span className="text-xs">{item.likes}</span>}
              </button>
            </MicroInteraction>
            
            {showStats && (
              <>
                <div className="flex items-center gap-1 text-white/60">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">{item.views}</span>
                </div>
                
                <div className="text-white/40 text-xs">
                  {item.uploadedAt.toLocaleDateString()}
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-white/40" />
              <span className="text-white/40 text-xs">
                {item.tags.slice(0, 2).join(', ')}
                {item.tags.length > 2 && '...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Instagram-style Modal Component
function InstagramStyleModal({
  item,
  onClose,
  onLike,
  onFavorite,
  onEdit,
  onDelete
}: {
  item: MediaItem;
  onClose: () => void;
  onLike: () => void;
  onFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Media Section */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="max-w-full max-h-full"
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{item.author.name}</span>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h2 className="text-white font-semibold text-lg mb-2">{item.title}</h2>
              {item.description && (
                <p className="text-white/70 text-sm mb-4">{item.description}</p>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                <div className="text-center">
                  <div className="text-white font-semibold">{item.likes}</div>
                  <div className="text-white/60 text-xs">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{item.views}</div>
                  <div className="text-white/60 text-xs">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{item.usage.usedIn.length}</div>
                  <div className="text-white/60 text-xs">Used</div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Uploaded:</span>
                  <span>{item.uploadedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Size:</span>
                  <span>{(item.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                {item.dimensions && (
                  <div className="flex justify-between text-white/60">
                    <span>Dimensions:</span>
                    <span>{item.dimensions.width} × {item.dimensions.height}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onLike}
                    className={`flex items-center gap-2 transition-all ${
                      item.isLiked ? 'text-red-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${item.isLiked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={onFavorite}
                    className={`transition-all ${
                      item.isFavorited ? 'text-yellow-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${item.isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="text-white/60 hover:text-white transition-all">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onEdit}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={onDelete}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}