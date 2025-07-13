'use client';

import { useState, useEffect } from 'react';

interface AdminSession {
  expiry: number;
  username: string;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<AdminSession | null>(null);

  useEffect(() => {
    const checkAdminSession = () => {
      try {
        // 브라우저에서만 localStorage 사용
        if (typeof window === 'undefined') {
          setIsAdmin(false);
          setAdminData(null);
          return;
        }

        const session = localStorage.getItem('redux_admin_session');
        if (!session) {
          setIsAdmin(false);
          setAdminData(null);
          return;
        }

        const sessionData: AdminSession = JSON.parse(session);
        const now = new Date().getTime();
        
        if (sessionData.expiry <= now) {
          // Session expired
          localStorage.removeItem('redux_admin_session');
          setIsAdmin(false);
          setAdminData(null);
          return;
        }

        setIsAdmin(true);
        setAdminData(sessionData);
      } catch (error) {
        console.error('Error checking admin session:', error);
        setIsAdmin(false);
        setAdminData(null);
      }
    };

    // Check on mount
    checkAdminSession();

    // 브라우저에서만 이벤트 리스너 등록
    if (typeof window !== 'undefined') {
      // Listen for storage changes (login/logout in other tabs)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'redux_admin_session') {
          checkAdminSession();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Check every minute for session expiry
      const interval = setInterval(checkAdminSession, 60000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple auth check (in production, this would call an API)
    if (username === 'admin' && password === 'redux2025') {
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      const sessionData: AdminSession = { expiry, username };
      
      // 브라우저에서만 localStorage 사용
      if (typeof window !== 'undefined') {
        localStorage.setItem('redux_admin_session', JSON.stringify(sessionData));
      }
      setIsAdmin(true);
      setAdminData(sessionData);
      return true;
    }
    return false;
  };

  const logout = () => {
    // 브라우저에서만 localStorage 사용
    if (typeof window !== 'undefined') {
      localStorage.removeItem('redux_admin_session');
    }
    setIsAdmin(false);
    setAdminData(null);
  };

  return {
    isAdmin,
    adminData,
    login,
    logout,
  };
}