'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Camera,
  Video,
  Type,
  Image as ImageIcon,
  Palette,
  Layout,
  Sparkles,
  Wand2,
  Upload,
  Link,
  Copy,
  Check,
  X,
  ArrowRight,
  Zap,
  Layers,
  Edit3,
  Save,
  Eye,
  Download,
  Share2,
  Settings,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import Image from 'next/image';

// Content creation templates
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'section' | 'card' | 'gallery' | 'text' | 'media';
  elements: any[];
  preview: string;
  tags: string[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  icon: React.ComponentType<any>;
  completed: boolean;
  required: boolean;
}

interface InstagramStyleContentWorkflowProps {
  onComplete: (content: any) => void;
  onCancel: () => void;
  initialData?: any;
  pageId: string;
  className?: string;
}

export default function InstagramStyleContentWorkflow({
  onComplete,
  onCancel,
  initialData,
  pageId,
  className = ''
}: InstagramStyleContentWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState(initialData || {});
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Content templates
  const templates: ContentTemplate[] = [
    {
      id: 'hero-modern',
      name: 'Modern Hero',
      description: 'Clean hero section with video background and gradient overlay',
      category: 'hero',
      elements: [],
      preview: '/templates/hero-modern.jpg',
      tags: ['video', 'gradient', 'modern', 'minimal']
    },
    {
      id: 'gallery-masonry',
      name: 'Masonry Gallery',
      description: 'Instagram-style masonry layout for showcasing images',
      category: 'gallery',
      elements: [],
      preview: '/templates/gallery-masonry.jpg',
      tags: ['images', 'masonry', 'gallery', 'responsive']
    },
    {
      id: 'text-editorial',
      name: 'Editorial Text',
      description: 'Magazine-style text layout with typography focus',
      category: 'text',
      elements: [],
      preview: '/templates/text-editorial.jpg',
      tags: ['typography', 'text', 'editorial', 'magazine']
    },
    {
      id: 'media-split',
      name: 'Split Media',
      description: 'Half image, half text layout for content sections',
      category: 'section',
      elements: [],
      preview: '/templates/media-split.jpg',
      tags: ['image', 'text', 'split', 'section']
    }
  ];

  // Workflow steps
  const steps: WorkflowStep[] = [
    {
      id: 'template',
      title: 'Choose Template',
      description: 'Select a starting template for your content',
      component: TemplateSelector,
      icon: Layout,
      completed: !!selectedTemplate,
      required: true
    },
    {
      id: 'content',
      title: 'Add Content',
      description: 'Add your text, images, and other content',
      component: ContentEditor,
      icon: Edit3,
      completed: false,
      required: true
    },
    {
      id: 'style',
      title: 'Customize Style',
      description: 'Adjust colors, fonts, and layout',
      component: StyleCustomizer,
      icon: Palette,
      completed: false,
      required: false
    },
    {
      id: 'preview',
      title: 'Preview',
      description: 'Preview your content across different devices',
      component: ContentPreview,
      icon: Eye,
      completed: false,
      required: false
    }
  ];

  const handleStepComplete = (stepId: string, data: any) => {
    setWorkflowData((prev: any) => ({
      ...prev,
      [stepId]: data
    }));

    // Auto-advance to next step
    const currentStepIndex = steps.findIndex(step => step.id === stepId);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(currentStepIndex + 1);
    }
  };

  const handleFinish = async () => {
    setIsCreating(true);
    try {
      await onComplete(workflowData);
    } finally {
      setIsCreating(false);
    }
  };

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className={`w-full h-screen bg-black text-white flex ${className}`}>
      {/* Sidebar */}
      <div className="w-80 bg-gray-900/90 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Content Creator</h1>
              <p className="text-xs text-white/60">Instagram-style workflow</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFinish}
              disabled={isCreating || !steps.filter(s => s.required).every(s => s.completed)}
              className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Finish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.completed;
              const isAccessible = index <= currentStep || isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && setCurrentStep(index)}
                  disabled={!isAccessible}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/30 border border-purple-400/50'
                      : isCompleted
                      ? 'bg-green-500/20 border border-green-400/50'
                      : isAccessible
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-gray-700/30 border border-gray-600/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-purple-500'
                        : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">{step.title}</h3>
                        {step.required && (
                          <span className="text-xs text-orange-400">*</span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">{step.description}</p>
                    </div>
                    {isActive && (
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>Progress</span>
            <span>{Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
              style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Step Header */}
        <div className="h-16 bg-gray-800/90 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <currentStepData.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{currentStepData.title}</h2>
              <p className="text-sm text-white/60">{currentStepData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>Step {currentStep + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-hidden">
          <CurrentStepComponent
            data={workflowData[currentStepData.id]}
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onComplete={(data: any) => handleStepComplete(currentStepData.id, data)}
            pageId={pageId}
          />
        </div>
      </div>
    </div>
  );
}

// Template Selector Component
function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect, 
  onComplete 
}: any) {
  const [category, setCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid },
    { id: 'hero', name: 'Hero Sections', icon: Monitor },
    { id: 'gallery', name: 'Galleries', icon: ImageIcon },
    { id: 'text', name: 'Text Content', icon: Type },
    { id: 'section', name: 'Sections', icon: Layout }
  ];

  const filteredTemplates = category === 'all' 
    ? templates 
    : templates.filter((t: ContentTemplate) => t.category === category);

  const handleTemplateSelect = (template: ContentTemplate) => {
    onTemplateSelect(template);
    onComplete(template);
  };

  return (
    <div className="w-full h-full flex">
      {/* Category Sidebar */}
      <div className="w-64 bg-gray-800/50 border-r border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  category === cat.id
                    ? 'bg-purple-600/30 border border-purple-400/50 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: ContentTemplate) => (
            <motion.button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`group relative bg-white/5 rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-purple-400 bg-purple-500/20'
                  : 'hover:bg-white/10'
              }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Template Preview */}
              <div className="aspect-video bg-gray-700 rounded-xl mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <Layout className="w-8 h-8 text-white/40" />
                </div>
              </div>

              {/* Template Info */}
              <h4 className="font-semibold text-white mb-2">{template.name}</h4>
              <p className="text-sm text-white/60 mb-3">{template.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Selected Indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Content Editor Component
function ContentEditor({ data, onComplete }: any) {
  const [content, setContent] = useState(data || {
    title: '',
    subtitle: '',
    description: '',
    images: [],
    videos: []
  });

  const handleSubmit = () => {
    onComplete(content);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Title</label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Subtitle</label>
            <input
              type="text"
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your subtitle..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={content.description}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder="Enter your description..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Continue to Styling
          </button>
        </div>
      </div>
    </div>
  );
}

// Style Customizer Component
function StyleCustomizer({ data, onComplete }: any) {
  const [styles, setStyles] = useState(data || {
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontFamily: 'Inter'
  });

  const handleSubmit = () => {
    onComplete(styles);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
              <input
                type="color"
                value={styles.primaryColor}
                onChange={(e) => setStyles({ ...styles, primaryColor: e.target.value })}
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Secondary Color</label>
              <input
                type="color"
                value={styles.secondaryColor}
                onChange={(e) => setStyles({ ...styles, secondaryColor: e.target.value })}
                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Continue to Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// Content Preview Component
function ContentPreview({ data, onComplete }: any) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const devices = [
    { id: 'mobile' as const, name: 'Mobile', icon: Smartphone },
    { id: 'tablet' as const, name: 'Tablet', icon: Tablet },
    { id: 'desktop' as const, name: 'Desktop', icon: Monitor }
  ];

  const getDeviceClasses = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Device Selector */}
      <div className="p-4 border-b border-white/10 flex items-center justify-center gap-2">
        {devices.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setDevice(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              device === id
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{name}</span>
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-800/50">
        <div className={`${getDeviceClasses()} bg-black rounded-lg border border-white/20 overflow-hidden`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Content Preview</p>
              <p className="text-sm text-white/40 mt-2">Your content will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={() => onComplete({})}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Looks Good!
        </button>
      </div>
    </div>
  );
}