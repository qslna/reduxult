'use client';

import { useEffect, useState } from 'react';
import RevolutionaryCMSDashboard from '@/components/cms/RevolutionaryCMSDashboard';
import { useCMSAuthStore } from '@/store/useCMSAuthStore';

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading } = useCMSAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <RevolutionaryCMSDashboard />;
}