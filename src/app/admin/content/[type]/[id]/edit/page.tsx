'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CMSLayout from '@/components/cms/CMSLayout';
import ContentEditor from '@/components/cms/ContentEditor';
import { ContentType, ContentItem, cmsClient } from '@/lib/cms-client';

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentTypeName = params.type as string;
  const contentId = params.id as string;

  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentTypeName && contentId) {
      loadData();
    }
  }, [contentTypeName, contentId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load content type
      const typeResponse = await cmsClient.getContentTypes();
      if (typeResponse.success && typeResponse.data) {
        const type = typeResponse.data.find(t => t.name === contentTypeName);
        if (!type) {
          setError('Content type not found');
          return;
        }
        setContentType(type);

        // Load content item
        const itemResponse = await cmsClient.getContentItem(contentTypeName, contentId);
        if (itemResponse.success && itemResponse.data) {
          setContentItem(itemResponse.data);
        } else {
          setError(itemResponse.error?.message || 'Content item not found');
        }
      } else {
        setError(typeResponse.error?.message || 'Failed to load content type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (updatedItem: ContentItem) => {
    setContentItem(updatedItem);
    router.push(`/admin/content/${contentTypeName}`);
  };

  const handleCancel = () => {
    router.push(`/admin/content/${contentTypeName}`);
  };

  if (isLoading) {
    return (
      <CMSLayout title="Edit Content">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading content...</div>
        </div>
      </CMSLayout>
    );
  }

  if (error || !contentType || !contentItem) {
    return (
      <CMSLayout title="Edit Content">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-400 mb-4">{error || 'Content not found'}</div>
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
    <CMSLayout title={`Edit ${contentItem.title}`}>
      <ContentEditor
        contentType={contentType}
        contentItem={contentItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CMSLayout>
  );
}