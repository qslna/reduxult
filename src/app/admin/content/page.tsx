'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CMSLayout from '@/components/cms/CMSLayout';
import { ContentType, cmsClient } from '@/lib/cms-client';
import { layoutUtils } from '@/lib/design-system';
import { Plus, FileText, Users, Calendar, Settings } from 'lucide-react';

export default function AdminContentPage() {
  const router = useRouter();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContentTypes();
  }, []);

  const loadContentTypes = async () => {
    try {
      setIsLoading(true);
      const response = await cmsClient.getContentTypes();
      
      if (response.success && response.data) {
        setContentTypes(response.data);
      }
    } catch (error) {
      console.error('Failed to load content types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForContentType = (name: string) => {
    switch (name) {
      case 'designer':
        return Users;
      case 'exhibition':
        return Calendar;
      case 'about_section':
        return FileText;
      default:
        return FileText;
    }
  };

  const getColorForContentType = (name: string) => {
    switch (name) {
      case 'designer':
        return 'blue';
      case 'exhibition':
        return 'green';
      case 'about_section':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <CMSLayout title="Content Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading content types...</div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Content Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Types</h1>
            <p className="text-gray-400">Manage different types of content for your website</p>
          </div>
          <button
            onClick={() => router.push('/admin/content/types/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Content Type
          </button>
        </div>

        {/* Content Types Grid */}
        {contentTypes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Content Types</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first content type</p>
            <button
              onClick={() => router.push('/admin/content/types/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Content Type
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType) => {
              const Icon = getIconForContentType(contentType.name);
              const color = getColorForContentType(contentType.name);
              
              const colorClasses = {
                blue: 'bg-blue-600 hover:bg-blue-700',
                green: 'bg-green-600 hover:bg-green-700',
                purple: 'bg-purple-600 hover:bg-purple-700',
                gray: 'bg-gray-600 hover:bg-gray-700'
              };

              return (
                <div
                  key={contentType.id}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/content/${contentType.name}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={layoutUtils.combineClasses(
                      'p-3 rounded-lg',
                      colorClasses[color as keyof typeof colorClasses]
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/content/types/${contentType.id}/edit`);
                      }}
                      className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {contentType.displayName}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {contentType.schema.fields.length} fields configured
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      {contentType.itemCount || 0} items
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/content/${contentType.name}/new`);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Content Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {contentTypes.reduce((sum, type) => sum + (type.itemCount || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{contentTypes.length}</div>
              <div className="text-gray-400 text-sm">Content Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {contentTypes.reduce((sum, type) => sum + type.schema.fields.length, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Fields</div>
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}