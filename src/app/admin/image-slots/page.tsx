'use client';

import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import ImageSlotManager, { ImageSlot } from '@/components/cms/ImageSlotManager';
import { useImageSlotsStore, useImageSlotsStats } from '@/store/useImageSlotsStore';
import { imageSlotUtils } from '@/data/imageSlots';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  BarChart3, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'with-images' | 'empty' | 'errors';

export default function ImageSlotsPage() {
  const { isAuthenticated, isLoading } = useCMSAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['home', 'designers', 'about-visual-art']));
  const [showStats, setShowStats] = useState(true);

  const store = useImageSlotsStore();
  const stats = useImageSlotsStats();

  // Get all slots grouped by page
  const allSlotsGrouped = useMemo(() => {
    return imageSlotUtils.getAllSlotsGrouped().map(({ page, slots }) => ({
      page,
      displayName: getPageDisplayName(page),
      slots: slots.map(slot => ({
        ...slot,
        currentImage: store.getSlotImage(slot.id),
        isLoading: store.isSlotLoading(slot.id),
        error: store.getSlotError(slot.id)
      }))
    }));
  }, [store]);

  // Filter and search slots
  const filteredSlotsGrouped = useMemo(() => {
    return allSlotsGrouped.map(({ page, displayName, slots }) => ({
      page,
      displayName,
      slots: slots.filter(slot => {
        // Search filter
        const matchesSearch = !searchQuery || 
          slot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          slot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          slot.id.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filter
        const matchesFilter = (() => {
          switch (filterType) {
            case 'with-images':
              return !!slot.currentImage;
            case 'empty':
              return !slot.currentImage;
            case 'errors':
              return !!slot.error;
            case 'all':
            default:
              return true;
          }
        })();

        return matchesSearch && matchesFilter;
      })
    })).filter(({ slots }) => slots.length > 0);
  }, [allSlotsGrouped, searchQuery, filterType]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading image slots...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  function getPageDisplayName(pageId: string): string {
    const displayNames: Record<string, string> = {
      'home': 'Home Page',
      'designers': 'Designer Profiles',
      'about': 'About Page',
      'about-visual-art': 'About - Visual Art',
      'about-fashion-film': 'About - Fashion Film',
      'about-memory': 'About - Memory',
      'about-installation': 'About - Installation',
      'about-collective': 'About - Collective',
      'exhibitions': 'Exhibitions',
      'contact': 'Contact Page'
    };
    return displayNames[pageId] || pageId;
  }

  const handleSlotUpdate = (slot: ImageSlot, newImage: ImageSlot['currentImage']) => {
    store.updateSlotImage(slot.id, newImage);
  };

  const handleSlotDelete = (slot: ImageSlot) => {
    store.deleteSlotImage(slot.id);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (expandedSections.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const expandAllSections = () => {
    setExpandedSections(new Set(allSlotsGrouped.map(({ page }) => page)));
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            Image Slots Manager
          </h1>
          <p className="text-white/60">
            Manage all image slots throughout the REDUX website from one central location
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            {showStats ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>

        {/* Statistics Cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stats.totalSlots}</div>
                  <div className="text-blue-300 text-sm">Total Slots</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stats.slotsWithImages}</div>
                  <div className="text-green-300 text-sm">With Images</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl p-6 border border-orange-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stats.emptySlots}</div>
                  <div className="text-orange-300 text-sm">Empty Slots</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <Loader className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stats.loadingSlots}</div>
                  <div className="text-purple-300 text-sm">Uploading</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl p-6 border border-red-400/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stats.errorSlots}</div>
                  <div className="text-red-300 text-sm">Errors</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search image slots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                >
                  <option value="all">All Slots</option>
                  <option value="with-images">With Images</option>
                  <option value="empty">Empty Slots</option>
                  <option value="errors">With Errors</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Section Controls */}
              <div className="flex gap-2">
                <button
                  onClick={expandAllSections}
                  className="px-3 py-2 text-sm bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllSections}
                  className="px-3 py-2 text-sm bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Collapse All
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Slots by Section */}
        <div className="space-y-6">
          {filteredSlotsGrouped.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No matching slots found</h3>
              <p className="text-white/60 mb-4">
                Try adjusting your search query or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredSlotsGrouped.map(({ page, displayName, slots }) => (
              <div
                key={page}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Section Header */}
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection(page)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                      {expandedSections.has(page) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                    </div>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                      {slots.length} slot{slots.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>{slots.filter(s => s.currentImage).length} with images</span>
                    <span>•</span>
                    <span>{slots.filter(s => !s.currentImage).length} empty</span>
                  </div>
                </div>

                {/* Section Content */}
                {expandedSections.has(page) && (
                  <div className="px-6 pb-6">
                    <div className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-6'
                    }>
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <ImageSlotManager
                            slot={slot}
                            onImageUpdate={handleSlotUpdate}
                            onImageDelete={handleSlotDelete}
                            size={viewMode === 'grid' ? 'medium' : 'small'}
                            layout={viewMode === 'grid' ? 'expanded' : 'compact'}
                            showPreview={true}
                            adminMode={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}