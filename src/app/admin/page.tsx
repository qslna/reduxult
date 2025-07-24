'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CMSLayout from '@/components/cms/CMSLayout';
import { cmsClient } from '@/lib/cms-client';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Image, 
  Video, 
  FileText, 
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  Sparkles
} from 'lucide-react';

interface DashboardStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  totalMedia: number;
  totalUsers: number;
  recentActivity: any[];
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  gradient: string;
  featured?: boolean;
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API calls with more realistic data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalContent: 42,
        publishedContent: 38,
        draftContent: 4,
        totalMedia: 156,
        totalUsers: 6,
        recentActivity: [
          {
            type: 'content',
            description: 'Updated Kim Bomin portfolio images',
            timestamp: '2 hours ago',
            user: 'Admin'
          },
          {
            type: 'media',
            description: 'Uploaded 5 new fashion film stills',
            timestamp: '4 hours ago',
            user: 'Admin'
          },
          {
            type: 'content',
            description: 'Published Visual Art collection',
            timestamp: '1 day ago', 
            user: 'Admin'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'New Designer Profile',
      description: 'Add a new designer to the collective',
      href: '/admin/content/designer/new',
      icon: Users,
      gradient: 'from-violet-500 to-purple-600',
      featured: true
    },
    {
      title: 'Upload Media',
      description: 'Add images and videos to gallery',
      href: '/admin/media',
      icon: Image,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Fashion Film',
      description: 'Create new film showcase',
      href: '/admin/videos',
      icon: Video,
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      title: 'Exhibition',
      description: 'Launch new exhibition page',
      href: '/admin/content/exhibition/new',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-600'
    }
  ];

  const statCards = [
    {
      title: 'Total Content',
      value: stats.totalContent,
      change: '+12%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: FileText,
      gradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Published',
      value: stats.publishedContent,
      change: '+8%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 to-green-500/10'
    },
    {
      title: 'Media Files',
      value: stats.totalMedia,
      change: '+23%',
      changeType: 'positive' as const,
      description: 'vs last month',
      icon: Image,
      gradient: 'from-violet-500/10 to-purple-500/10'
    },
    {
      title: 'Designers',
      value: stats.totalUsers,
      change: '0%',
      changeType: 'neutral' as const,
      description: 'active profiles',
      icon: Users,
      gradient: 'from-rose-500/10 to-pink-500/10'
    }
  ];

  if (isLoading) {
    return (
      <CMSLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-white/70 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back to REDUX
                </h1>
                <p className="text-lg text-white/70 mb-4">
                  Manage your fashion collective's digital presence
                </p>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const changeColor = card.changeType === 'positive' ? 'text-emerald-400' : 'text-gray-400';
            
            return (
              <div 
                key={card.title} 
                className="group relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-white/20 transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
                        {card.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                        {card.change}
                      </div>
                      <div className="text-xs text-white/50">{card.description}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">{card.title}</h3>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Quick Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                    action.featured 
                      ? 'md:col-span-2 bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-2 border-violet-500/30 hover:border-violet-400/50' 
                      : 'bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl border transition-all duration-300 ${
                        action.featured 
                          ? 'bg-violet-500/20 border-violet-400/30 group-hover:bg-violet-500/30'
                          : 'bg-white/10 border-white/20 group-hover:bg-white/20'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-white/70">{action.description}</p>
                    </div>
                    
                    {action.featured && (
                      <div className="mt-4 flex items-center gap-2 text-violet-300">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Get Started</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              <Link 
                href="/admin/activity"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/50 mb-2">No recent activity</p>
                <p className="text-white/30 text-sm">Activity will appear here as you use the CMS</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>by {activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-green-400" />
              System Status
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'API Services', status: 'Healthy', color: 'green' },
                { label: 'Database', status: 'Connected', color: 'green' },
                { label: 'ImageKit CDN', status: 'Online', color: 'green' },
                { label: 'Storage', status: '67% Used', color: 'yellow' }
              ].map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-white/70 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.color === 'green' ? 'bg-green-400' :
                      item.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      item.color === 'green' ? 'text-green-400' :
                      item.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Last Backup</span>
                  <span className="text-white/70">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </CMSLayout>
  );
}