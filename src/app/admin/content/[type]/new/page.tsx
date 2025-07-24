'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/cms/CMSLayout';
import ContentEditor from '@/components/cms/ContentEditor';
import { ContentType, ContentItem, cmsClient } from '@/lib/cms-client';

export default function NewContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeName = params.type as string;

  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentTypeName) {
      loadContentType();
    }
  }, [contentTypeName]);

  const loadContentType = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await cmsClient.getContentTypes();
      if (response.success && response.data) {
        const type = response.data.find(t => t.name === contentTypeName);
        if (type) {
          setContentType(type);
        } else {
          setError('Content type not found');
        }
      } else {
        setError(response.error?.message || 'Failed to load content type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (newItem: ContentItem) => {
    router.push(`/admin/content/${contentTypeName}`);
  };

  const handleCancel = () => {
    router.push(`/admin/content/${contentTypeName}`);
  };

  if (isLoading) {
    return (
      <CMSLayout title="Create Content">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading content type...</div>
        </div>
      </CMSLayout>
    );
  }

  if (error || !contentType) {
    return (
      <CMSLayout title="Create Content">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-400 mb-4">{error || 'Content type not found'}</div>
          <button
            onClick={() => router.push('/admin/content')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Content
          </button>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title={`Create ${contentType.displayName}`}>
      <ContentEditor
        contentType={contentType}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CMSLayout>
  );
}