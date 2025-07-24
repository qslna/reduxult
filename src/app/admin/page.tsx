'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CMSLayout from '@/components/cms/CMSLayout';
import { cmsClient } from '@/lib/cms-client';
import { layoutUtils } from '@/lib/design-system';
import { FileText, Image, User, Database, TrendingUp, Clock } from 'lucide-react';

interface DashboardStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalMedia: number;
  totalUsers: number;
  recentActivity: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalMedia: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load content types and get stats
      const contentTypesResponse = await cmsClient.getContentTypes(1, 10);
      const mediaResponse = await cmsClient.getMediaItems({ limit: 1 });
      
      // Calculate basic stats (in real implementation, this would come from API)
      let totalContent = 0;
      let publishedContent = 0;
      let draftContent = 0;

      if (contentTypesResponse.success && contentTypesResponse.data) {
        for (const contentType of contentTypesResponse.data) {
          // Get content for each type
          const contentResponse = await cmsClient.getContentItems(contentType.name, { limit: 100 });
          if (contentResponse.success && contentResponse.data) {
            totalContent += contentResponse.data.length;
            publishedContent += contentResponse.data.filter(item => item.status === 'published').length;
            draftContent += contentResponse.data.filter(item => item.status === 'draft').length;
          }
        }
      }

      setStats({
        totalContent,
        publishedContent,
        draftContent,
        totalMedia: mediaResponse.meta?.pagination?.total || 0,
        totalUsers: 1, // Placeholder
        recentActivity: [] // Placeholder
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Content',
      value: stats.totalContent,
      icon: FileText,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Published',
      value: stats.publishedContent,
      icon: TrendingUp,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Drafts',
      value: stats.draftContent,
      icon: Clock,
      color: 'yellow',
      change: '+3%'
    },
    {
      title: 'Media Files',
      value: stats.totalMedia,
      icon: Image,
      color: 'purple',
      change: '+15%'
    }
  ];

  if (isLoading) {
    return (
      <CMSLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome to REDUX CMS</h1>
          <p className="text-blue-100">
            Manage your portfolio content, media, and website settings from this dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = {
              blue: 'bg-blue-600',
              green: 'bg-green-600',
              yellow: 'bg-yellow-600',
              purple: 'bg-purple-600'
            };

            return (
              <div key={card.title} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  </div>
                  <div className={layoutUtils.combineClasses(
                    'p-3 rounded-lg',
                    colorClasses[card.color as keyof typeof colorClasses]
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-400 text-sm font-medium">{card.change}</span>
                  <span className="text-gray-400 text-sm ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/content/designer/new"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <User className="w-5 h-5 text-blue-400" />
                <span className="text-white">Add New Designer</span>
              </Link>
              <Link
                href="/admin/content/exhibition/new"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-white">Create Exhibition</span>
              </Link>
              <a
                href="/admin/media"
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Image className="w-5 h-5 text-purple-400" />
                <span className="text-white">Upload Media</span>
              </a>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">ImageKit CDN</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Services</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Backup</span>
                <span className="text-gray-400 text-sm">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-gray-500 text-sm">Activity will appear here as you use the CMS</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CMSLayout>
  );
}