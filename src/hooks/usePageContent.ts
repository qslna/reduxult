import { useState, useEffect } from 'react';
import { EditableElement } from '@/components/cms/InstagramStylePageEditor';
import { contentStorage } from '@/lib/contentStorage';
import { getPageConfig } from '@/data/pageConfigs';

export interface UsePageContentResult {
  elements: EditableElement[];
  isLoading: boolean;
  error: string | null;
  metadata: any;
  reload: () => Promise<void>;
}

/**
 * Hook for loading and managing page content
 * Automatically falls back to default configuration if no saved content exists
 */
export function usePageContent(pageId: string): UsePageContentResult {
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First try to load saved content
      const savedElements = await contentStorage.loadPageContent(pageId);
      
      if (savedElements && savedElements.length > 0) {
        // Use saved content
        setElements(savedElements);
        
        // Load metadata
        const pageMetadata = contentStorage.getPageMetadata(pageId);
        setMetadata(pageMetadata);
      } else {
        // Fall back to default configuration
        const defaultConfig = getPageConfig(pageId);
        if (defaultConfig) {
          setElements(defaultConfig.editableElements);
          setMetadata({
            pageId,
            isDefault: true,
            lastModified: 0,
            version: 0
          });
        } else {
          throw new Error(`No configuration found for page: ${pageId}`);
        }
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
      setElements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      loadContent();
    }
  }, [pageId]);

  return {
    elements,
    isLoading,
    error,
    metadata,
    reload: loadContent
  };
}

/**
 * Hook for getting specific element content by ID
 */
export function useElementContent(pageId: string, elementId: string) {
  const { elements, isLoading, error } = usePageContent(pageId);
  
  const element = elements.find(el => el.id === elementId);
  
  return {
    element,
    content: element?.content,
    styles: element?.styles,
    isLoading,
    error
  };
}

/**
 * Hook for getting text content specifically
 */
export function useTextContent(pageId: string, elementId: string, fallback: string = '') {
  const { element, isLoading, error } = useElementContent(pageId, elementId);
  
  const textContent = element?.type === 'text' ? element.content : fallback;
  
  return {
    text: textContent,
    isLoading,
    error,
    element
  };
}

/**
 * Hook for getting image content specifically
 */
export function useImageContent(pageId: string, elementId: string) {
  const { element, isLoading, error } = useElementContent(pageId, elementId);
  
  const imageContent = element?.type === 'image' ? element.content : null;
  
  return {
    url: imageContent?.url,
    alt: imageContent?.alt || element?.metadata?.label,
    isLoading,
    error,
    element
  };
}

/**
 * Hook for getting video content specifically
 */
export function useVideoContent(pageId: string, elementId: string) {
  const { element, isLoading, error } = useElementContent(pageId, elementId);
  
  const videoContent = element?.type === 'video' ? element.content : null;
  
  return {
    url: videoContent?.url,
    autoplay: videoContent?.autoplay,
    loop: videoContent?.loop,
    muted: videoContent?.muted,
    isLoading,
    error,
    element
  };
}

/**
 * Hook for getting all elements of a specific type
 */
export function useElementsByType(pageId: string, type: string) {
  const { elements, isLoading, error } = usePageContent(pageId);
  
  const filteredElements = elements.filter(el => el.type === type);
  
  return {
    elements: filteredElements,
    isLoading,
    error
  };
}

/**
 * Hook for getting elements by section
 */
export function useElementsBySection(pageId: string, sectionId: string) {
  const { elements, isLoading, error } = usePageContent(pageId);
  
  const sectionElements = elements.filter(el => el.metadata.sectionId === sectionId);
  
  return {
    elements: sectionElements,
    isLoading,
    error
  };
}