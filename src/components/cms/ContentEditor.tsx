'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ContentType, ContentItem, ContentField, cmsClient } from '@/lib/cms-client';
import { layoutUtils } from '@/lib/design-system';
import { Save, Eye, ArrowLeft, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContentEditorProps {
  contentType: ContentType;
  contentItem?: ContentItem;
  onSave?: (item: ContentItem) => void;
  onCancel?: () => void;
}

interface FormData {
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  meta: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  data: Record<string, any>;
}

export default function ContentEditor({ 
  contentType, 
  contentItem, 
  onSave, 
  onCancel 
}: ContentEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const isEditing = !!contentItem;

  // Initialize form with existing data or defaults
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      slug: contentItem?.slug || '',
      title: contentItem?.title || '',
      status: contentItem?.status?.toUpperCase() as any || 'DRAFT',
      meta: {
        title: contentItem?.meta?.title || '',
        description: contentItem?.meta?.description || '',
        keywords: contentItem?.meta?.keywords || []
      },
      data: contentItem?.data || {}
    }
  });

  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && watchedTitle && !watchedSlug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, watchedSlug, isEditing, setValue]);

  const handleSave = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        contentType: contentType.name,
        slug: formData.slug,
        title: formData.title,
        status: formData.status.toLowerCase() as 'draft' | 'published' | 'archived',
        meta: formData.meta,
        data: formData.data,
        publishedAt: formData.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
        media: []
      };

      let response;
      if (isEditing && contentItem) {
        response = await cmsClient.updateContentItem(
          contentType.name,
          contentItem.id,
          payload
        );
      } else {
        response = await cmsClient.createContentItem(contentType.name, payload);
      }

      if (response.success && response.data) {
        onSave?.(response.data);
        if (!onSave) {
          router.push(`/admin/content/${contentType.name}`);
        }
      } else {
        setError(response.error?.message || 'Failed to save content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/admin/content/${contentType.name}`);
    }
  };

  const renderField = (field: ContentField, value: any, onChange: (value: any) => void) => {
    const baseInputClass = layoutUtils.combineClasses(
      'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md',
      'text-white placeholder-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    );

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={baseInputClass}
            placeholder={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={layoutUtils.combineClasses(baseInputClass, 'min-h-[100px] resize-y')}
            placeholder={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case 'rich_text':
        return (
          <textarea
            className={layoutUtils.combineClasses(baseInputClass, 'min-h-[200px] resize-y')}
            placeholder={`${field.label} (Rich Text)`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={8}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={baseInputClass}
            placeholder={field.label}
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={baseInputClass}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="text-sm text-gray-300">{field.label}</span>
          </label>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              className={baseInputClass}
              placeholder="Image URL"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
            />
            {value && (
              <div className="relative w-32 h-32 bg-gray-700 rounded-md overflow-hidden">
                <img
                  src={value}
                  alt={field.label}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        );

      case 'gallery':
        const images = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((imageUrl: string, index: number) => (
                <div key={index} className="relative group">
                  <div className="w-full h-24 bg-gray-700 rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = images.filter((_, i) => i !== index);
                      onChange(newImages);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                className={layoutUtils.combineClasses(baseInputClass, 'flex-1')}
                placeholder="Add image URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const url = (e.target as HTMLInputElement).value.trim();
                    if (url) {
                      onChange([...images, url]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            className={baseInputClass}
            placeholder={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit' : 'Create'} {contentType.displayName}
            </h1>
            <p className="text-gray-400">{contentType.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSubmit(handleSave)}
            disabled={isLoading || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Basic fields */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className={layoutUtils.combineClasses(
                  'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md',
                  'text-white placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.title ? 'border-red-500' : ''
                )}
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug *
              </label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                className={layoutUtils.combineClasses(
                  'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md',
                  'text-white placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.slug ? 'border-red-500' : ''
                )}
                placeholder="url-friendly-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Content fields */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Content</h2>
          
          {contentType.schema.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label} {field.required && '*'}
              </label>
              {field.description && (
                <p className="text-xs text-gray-400 mb-2">{field.description}</p>
              )}
              {renderField(
                field,
                watch(`data.${field.name}`),
                (value) => setValue(`data.${field.name}`, value, { shouldDirty: true })
              )}
            </div>
          ))}
        </div>

        {/* SEO Meta */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">SEO Meta</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Title
            </label>
            <input
              {...register('meta.title')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meta Description
            </label>
            <textarea
              {...register('meta.description')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO description"
              rows={3}
            />
          </div>
        </div>
      </form>
    </div>
  );
}