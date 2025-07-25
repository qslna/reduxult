'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';
import InstagramStylePageEditor, { EditableElement, PageEditorConfig } from '@/components/cms/InstagramStylePageEditor';
import { getPageConfig } from '@/data/pageConfigs';
import { contentStorage } from '@/lib/contentStorage';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useCMSAuthStore();
  const [pageConfig, setPageConfig] = useState<PageEditorConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageId = params.pageId as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isLoading]);

  // Load page configuration
  useEffect(() => {
    if (pageId) {
      loadPageConfig();
    }
  }, [pageId]);

  const loadPageConfig = async () => {
    try {
      setIsLoadingConfig(true);
      setError(null);

      const config = getPageConfig(pageId);
      if (!config) {
        setError(`Page configuration not found for "${pageId}"`);
        return;
      }

      // Load saved content if it exists
      const savedElements = await contentStorage.loadPageContent(pageId);
      if (savedElements) {
        // Merge saved content with configuration
        const updatedConfig: PageEditorConfig = {
          ...config,
          editableElements: savedElements
        };
        setPageConfig(updatedConfig);
      } else {
        setPageConfig(config);
      }
    } catch (error) {
      console.error('Failed to load page config:', error);
      setError('Failed to load page configuration');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSave = async (elements: EditableElement[]) => {
    try {
      // Save content using the content storage system
      const authorId = 'admin'; // In a real app, get this from the authenticated user
      
      const version = await contentStorage.savePageContent(
        pageId,
        elements,
        authorId,
        `Content update at ${new Date().toLocaleString()}`,
        true // Publish immediately
      );

      console.log('Page saved successfully:', version);
      
      // Show success message
      // In a real implementation, you might want to use a toast notification
      alert(`Page saved successfully as version ${version.version}!`);
      
      // Reload the configuration to reflect any changes
      await loadPageConfig();
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page. Please try again.');
      throw error;
    }
  };

  const handlePreview = () => {
    if (pageConfig) {
      window.open(pageConfig.previewUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading page configuration...</p>
        </div>
      </div>
    );
  }

  if (error || !pageConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-white/60 mb-6">
            {error || `The page "${pageId}" could not be found or is not configured for editing.`}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push('/admin/content')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Content Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-gray-900/90 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/content')}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Back to Content Management"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-white/20"></div>
          <div>
            <h1 className="text-sm font-medium text-white">
              Editing: {pageConfig.pageName}
            </h1>
            <p className="text-xs text-white/60">
              {pageConfig.sections.length} sections • {pageConfig.editableElements.length} elements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="px-3 py-1.5 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Preview Live
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="h-[calc(100vh-3.5rem)]">
        <InstagramStylePageEditor
          config={pageConfig}
          onSave={handleSave}
          onPreview={handlePreview}
          className="h-full"
        />
      </div>
    </div>
  );
}