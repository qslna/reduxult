'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthState {
  isAuthenticated: boolean;
  adminToken: string | null;
  lastActivity: number;
  sessionTimeout: number; // 24 hours in milliseconds
  login: (password: string) => boolean;
  logout: () => void;
  checkSession: () => boolean;
  updateActivity: () => void;
}

const ADMIN_PASSWORD = 'redux2025';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminToken: null,
      lastActivity: Date.now(),
      sessionTimeout: SESSION_TIMEOUT,
      
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          set({
            isAuthenticated: true,
            adminToken: token,
            lastActivity: Date.now(),
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          adminToken: null,
          lastActivity: Date.now(),
        });
      },
      
      checkSession: () => {
        const { isAuthenticated, lastActivity, sessionTimeout } = get();
        const now = Date.now();
        
        if (isAuthenticated && (now - lastActivity) > sessionTimeout) {
          get().logout();
          return false;
        }
        
        return isAuthenticated;
      },
      
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
    }),
    {
      name: 'redux-admin-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminToken: state.adminToken,
        lastActivity: state.lastActivity,
      }),
    }
  )
);

export function useAdminAuth() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {
    isAuthenticated,
    login,
    logout,
    checkSession,
    updateActivity,
  } = useAdminAuthStore();

  // Check session on mount and periodically
  useEffect(() => {
    checkSession();
    
    const interval = setInterval(() => {
      checkSession();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkSession]);

  // Update activity on user interactions
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  const attemptLogin = (password: string): boolean => {
    return login(password);
  };

  const requestAdminAccess = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  return {
    isAuthenticated,
    showLoginModal,
    setShowLoginModal,
    attemptLogin,
    logout,
    requestAdminAccess,
  };
}