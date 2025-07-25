'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Type, 
  Video, 
  Link, 
  Settings,
  Sparkles,
  Palette,
  Layout,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Undo,
  Redo,
  Copy,
  Trash2,
  Move,
  Plus,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import Image from 'next/image';

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'section' | 'background';
  content: any;
  position: { x: number; y: number; width: number; height: number };
  styles: Record<string, any>;
  metadata: {
    pageId: string;
    sectionId?: string;
    label: string;
    description?: string;
    required?: boolean;
    maxLength?: number;
    allowedTypes?: string[];
  };
}

export interface PageEditorConfig {
  pageId: string;
  pageName: string;
  previewUrl: string;
  editableElements: EditableElement[];
  sections: Array<{
    id: string;
    name: string;
    description: string;
    elements: string[]; // element IDs
  }>;
}

interface InstagramStylePageEditorProps {
  config: PageEditorConfig;
  onSave: (elements: EditableElement[]) => Promise<void>;
  onPreview: () => void;
  isPreviewMode?: boolean;
  className?: string;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type EditMode = 'edit' | 'preview' | 'responsive';

export default function InstagramStylePageEditor({
  config,
  onSave,
  onPreview,
  isPreviewMode = false,
  className = ''
}: InstagramStylePageEditorProps) {
  const [elements, setElements] = useState<EditableElement[]>(config.editableElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('edit');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [history, setHistory] = useState<EditableElement[][]>([config.editableElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showMinimap, setShowMinimap] = useState(false);

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(elements) !== JSON.stringify(config.editableElements);
    setHasChanges(hasChanges);
  }, [elements, config.editableElements]);

  // Handle undo/redo
  const addToHistory = (newElements: EditableElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  const updateElement = (elementId: string, updates: Partial<EditableElement>) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleSave = async () => {
    try {
      await onSave(elements);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const getViewportClasses = () => {
    const base = 'transition-all duration-300 ease-in-out mx-auto border border-white/20 bg-black overflow-hidden';
    switch (viewMode) {
      case 'mobile':
        return `${base} w-[375px] h-[667px] rounded-[2.5rem] shadow-2xl`;
      case 'tablet':
        return `${base} w-[768px] h-[1024px] rounded-2xl shadow-xl`;
      case 'desktop':
      default:
        return `${base} w-full h-full rounded-lg`;
    }
  };

  const getSelectedElementData = () => {
    return selectedElement ? elements.find(el => el.id === selectedElement) : null;
  };

  return (
    <div className={`w-full h-screen bg-gray-900 text-white overflow-hidden ${className}`}>
      {/* Top Toolbar */}
      <div className="h-16 bg-gray-800/90 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-purple-400" />
            {config.pageName} Editor
          </h1>
          <div className="flex items-center gap-1 text-sm text-white/60">
            <span>{elements.length} elements</span>
            {hasChanges && <span className="text-orange-400">• Unsaved changes</span>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {[
              { mode: 'desktop' as ViewMode, icon: Monitor, label: 'Desktop' },
              { mode: 'tablet' as ViewMode, icon: Tablet, label: 'Tablet' },
              { mode: 'mobile' as ViewMode, icon: Smartphone, label: 'Mobile' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-gray-600'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Edit Mode Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {[
              { mode: 'edit' as EditMode, icon: Edit3, label: 'Edit' },
              { mode: 'preview' as EditMode, icon: Eye, label: 'Preview' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setEditMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  editMode === mode 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-gray-600'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* History Controls */}
          <div className="flex gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 text-white/60 hover:text-white hover:bg-gray-700 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-white/60 hover:text-white hover:bg-gray-700 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white/60 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title="Toggle Sidebar"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              hasChanges
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800/95 backdrop-blur-sm border-r border-white/10 overflow-hidden flex flex-col"
            >
              {/* Sidebar Tabs */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 'elements', label: 'Elements', icon: Grid },
                  { id: 'properties', label: 'Properties', icon: Settings },
                  { id: 'layers', label: 'Layers', icon: Layout }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className="flex-1 p-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors border-b-2 border-transparent hover:border-purple-400"
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Elements List */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Page Elements
                  </h3>
                  <div className="space-y-2">
                    {config.sections.map(section => (
                      <div key={section.id} className="space-y-2">
                        <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
                          {section.name}
                        </div>
                        {section.elements.map(elementId => {
                          const element = elements.find(el => el.id === elementId);
                          if (!element) return null;

                          const Icon = element.type === 'text' ? Type :
                                      element.type === 'image' ? ImageIcon :
                                      element.type === 'video' ? Video :
                                      element.type === 'button' ? MousePointer : Layout;

                          return (
                            <button
                              key={elementId}
                              onClick={() => setSelectedElement(elementId)}
                              className={`w-full p-3 text-left rounded-lg transition-colors flex items-center gap-3 ${
                                selectedElement === elementId
                                  ? 'bg-purple-600/30 border border-purple-400/50'
                                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <Icon className="w-4 h-4 text-white/60" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {element.metadata.label}
                                </div>
                                <div className="text-xs text-white/40 truncate">
                                  {element.type}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Element Properties */}
                {selectedElement && (
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Properties
                    </h3>
                    <ElementPropertyEditor
                      element={getSelectedElementData()!}
                      onUpdate={(updates) => updateElement(selectedElement, updates)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-900 p-6 overflow-auto">
          <div className={getViewportClasses()}>
            <PageCanvas
              elements={elements}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              onElementUpdate={updateElement}
              editMode={editMode}
              viewMode={viewMode}
              previewUrl={config.previewUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Element Property Editor Component
interface ElementPropertyEditorProps {
  element: EditableElement;
  onUpdate: (updates: Partial<EditableElement>) => void;
}

function ElementPropertyEditor({ element, onUpdate }: ElementPropertyEditorProps) {
  return (
    <div className="space-y-4">
      {/* Basic Properties */}
      <div>
        <label className="block text-xs font-medium text-white/60 mb-2">Label</label>
        <input
          type="text"
          value={element.metadata.label}
          onChange={(e) => onUpdate({
            metadata: { ...element.metadata, label: e.target.value }
          })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Content Based on Type */}
      {element.type === 'text' && (
        <div>
          <label className="block text-xs font-medium text-white/60 mb-2">Content</label>
          <textarea
            value={element.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            rows={3}
          />
        </div>
      )}

      {element.type === 'image' && (
        <div>
          <label className="block text-xs font-medium text-white/60 mb-2">Image URL</label>
          <input
            type="url"
            value={element.content.url || ''}
            onChange={(e) => onUpdate({
              content: { ...element.content, url: e.target.value }
            })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      )}

      {/* Styling Properties */}
      <div>
        <label className="block text-xs font-medium text-white/60 mb-2">Background Color</label>
        <input
          type="color"
          value={element.styles.backgroundColor || '#000000'}
          onChange={(e) => onUpdate({
            styles: { ...element.styles, backgroundColor: e.target.value }
          })}
          className="w-full h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/60 mb-2">Text Color</label>
        <input
          type="color"
          value={element.styles.color || '#ffffff'}
          onChange={(e) => onUpdate({
            styles: { ...element.styles, color: e.target.value }
          })}
          className="w-full h-10 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}

// Page Canvas Component
interface PageCanvasProps {
  elements: EditableElement[];
  selectedElement: string | null;
  onElementSelect: (id: string | null) => void;
  onElementUpdate: (id: string, updates: Partial<EditableElement>) => void;
  editMode: EditMode;
  viewMode: ViewMode;
  previewUrl: string;
}

function PageCanvas({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  editMode,
  viewMode,
  previewUrl
}: PageCanvasProps) {
  if (editMode === 'preview') {
    return (
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Page Preview"
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-auto">
      {elements.map(element => (
        <div
          key={element.id}
          className={`absolute cursor-pointer transition-all ${
            selectedElement === element.id 
              ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black' 
              : 'hover:ring-1 hover:ring-white/30'
          }`}
          style={{
            left: element.position.x,
            top: element.position.y,
            width: element.position.width,
            height: element.position.height,
            ...element.styles
          }}
          onClick={() => onElementSelect(element.id)}
        >
          {element.type === 'text' && (
            <div className="w-full h-full flex items-center justify-center p-2">
              {element.content}
            </div>
          )}
          {element.type === 'image' && element.content.url && (
            <Image
              src={element.content.url}
              alt={element.metadata.label}
              fill
              className="object-cover rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}