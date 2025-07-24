'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CMSLayout from '@/components/cms/CMSLayout';
import { ContentType, ContentItem, cmsClient } from '@/lib/cms-client';
import { layoutUtils } from '@/lib/design-system';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';

export default function ContentTypePage() {
  const router = useRouter();
  const params = useParams();
  const contentTypeName = params.type as string;

  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (contentTypeName) {
      loadContentType();
      loadContentItems();
    }
  }, [contentTypeName, statusFilter, sortBy, sortOrder]);

  const loadContentType = async () => {
    try {
      const response = await cmsClient.getContentTypes();
      if (response.success && response.data) {
        const type = response.data.find(t => t.name === contentTypeName);
        setContentType(type || null);
      }
    } catch (error) {
      console.error('Failed to load content type:', error);
    }
  };

  const loadContentItems = async () => {
    try {
      setIsLoading(true);
      const response = await cmsClient.getContentItems(contentTypeName, {
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' : undefined,
        limit: 50
      });
      
      if (response.success && response.data) {
        setContentItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load content items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await cmsClient.deleteContentItem(contentTypeName, itemId);
      if (response.success) {
        setContentItems(items => items.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Failed to delete content item:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-600/20 text-green-400 border-green-600';
      case 'draft':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600';
      case 'archived':
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
    }
  };

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!contentType) {
    return (
      <CMSLayout title="Content Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Content type not found</div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title={`${contentType.displayName} Content`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{contentType.displayName}</h1>
            <p className="text-gray-400">Manage {contentType.displayName.toLowerCase()} content</p>
          </div>
          <button
            onClick={() => router.push(`/admin/content/${contentTypeName}/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create {contentType.displayName}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'archived')}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-md px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updatedAt-desc">Latest Updated</option>
                <option value="updatedAt-asc">Oldest Updated</option>
                <option value="createdAt-desc">Latest Created</option>
                <option value="createdAt-asc">Oldest Created</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Items */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading content...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No matching content found' : `No ${contentType.displayName.toLowerCase()} content yet`}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' ? 
                'Try adjusting your search or filter criteria' :
                `Get started by creating your first ${contentType.displayName.toLowerCase()}`
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => router.push(`/admin/content/${contentTypeName}/new`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create {contentType.displayName}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{item.title}</div>
                          <div className="text-gray-400 text-sm">/{item.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={layoutUtils.combineClasses(
                          'inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          getStatusColor(item.status)
                        )}>
                          {getStatusIcon(item.status)}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(item.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/content/${contentTypeName}/${item.id}/edit`)}
                            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/${contentTypeName}/${item.slug}`, '_blank')}
                            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredItems.length} of {contentItems.length} items
            </span>
            <span>
              {contentItems.filter(item => item.status === 'published').length} published, {' '}
              {contentItems.filter(item => item.status === 'draft').length} drafts, {' '}
              {contentItems.filter(item => item.status === 'archived').length} archived
            </span>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}