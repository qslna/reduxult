'use client';

import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  avatar?: string;
  lastLogin?: Date;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  adminToken: string | null;
  lastActivity: number;
  sessionTimeout: number;
  loginAttempts: number;
  lockoutUntil: number | null;
  login: (credentials: { username?: string; password: string; remember?: boolean }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkSession: () => boolean;
  updateActivity: () => void;
  resetLockout: () => void;
}

// Enhanced security with multiple admin levels
const ADMIN_CREDENTIALS = {
  'super_admin': {
    password: 'redux2025!admin',
    user: {
      id: 'sa_001',
      username: 'Super Admin',
      role: 'super_admin' as const,
      permissions: ['all'],
      avatar: '👑'
    }
  },
  'admin': {
    password: 'redux2025',
    user: {
      id: 'a_001', 
      username: 'Admin',
      role: 'admin' as const,
      permissions: ['manage_media', 'edit_content', 'view_analytics'],
      avatar: '⚡'
    }
  },
  'editor': {
    password: 'redux_editor',
    user: {
      id: 'e_001',
      username: 'Content Editor', 
      role: 'editor' as const,
      permissions: ['edit_content', 'manage_media'],
      avatar: '✏️'
    }
  }
};

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      adminToken: null,
      lastActivity: Date.now(),
      sessionTimeout: SESSION_TIMEOUT,
      loginAttempts: 0,
      lockoutUntil: null,
      
      login: async (credentials) => {
        const { password, remember = false } = credentials;
        const state = get();
        
        // Check if locked out
        if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
          const remainingMinutes = Math.ceil((state.lockoutUntil - Date.now()) / 60000);
          return {
            success: false,
            error: `Account locked. Try again in ${remainingMinutes} minute(s).`
          };
        }

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find matching credentials
        const adminEntry = Object.entries(ADMIN_CREDENTIALS).find(([_, cred]) => 
          cred.password === password
        );

        if (adminEntry) {
          const [role, { user }] = adminEntry;
          const token = `redux_${role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          set({
            isAuthenticated: true,
            user: { ...user, lastLogin: new Date() },
            adminToken: token,
            lastActivity: Date.now(),
            loginAttempts: 0,
            lockoutUntil: null,
            sessionTimeout: remember ? SESSION_TIMEOUT * 7 : SESSION_TIMEOUT, // 7 days if remembered
          });

          return { success: true };
        } else {
          const newAttempts = state.loginAttempts + 1;
          const shouldLockout = newAttempts >= MAX_LOGIN_ATTEMPTS;
          
          set({
            loginAttempts: newAttempts,
            lockoutUntil: shouldLockout ? Date.now() + LOCKOUT_DURATION : null,
          });

          return {
            success: false,
            error: shouldLockout 
              ? `Too many failed attempts. Account locked for 15 minutes.`
              : `Invalid password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempt(s) remaining.`
          };
        }
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
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

      resetLockout: () => {
        set({
          loginAttempts: 0,
          lockoutUntil: null,
        });
      },
    }),
    {
      name: 'redux-admin-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        adminToken: state.adminToken,
        lastActivity: state.lastActivity,
        loginAttempts: state.loginAttempts,
        lockoutUntil: state.lockoutUntil,
      }),
    }
  )
);

export function useAdminAuth() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const {
    isAuthenticated,
    user,
    login,
    logout,
    checkSession,
    updateActivity,
    loginAttempts,
    lockoutUntil,
    resetLockout
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

  // Clear error when modal closes
  useEffect(() => {
    if (!showLoginModal) {
      setLoginError(null);
    }
  }, [showLoginModal]);

  const attemptLogin = useCallback(async (credentials: { 
    password: string; 
    remember?: boolean 
  }): Promise<boolean> => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        setShowLoginModal(false);
        return true;
      } else {
        setLoginError(result.error || 'Login failed');
        return false;
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  }, [login]);

  const requestAdminAccess = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    logout();
    setShowLoginModal(false);
    setLoginError(null);
  }, [logout]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }, [isAuthenticated, user]);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.role === role;
  }, [isAuthenticated, user]);

  // Get remaining lockout time in minutes
  const getLockoutRemaining = useCallback((): number => {
    if (!lockoutUntil) return 0;
    return Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 60000));
  }, [lockoutUntil]);

  // Check if currently locked out
  const isLockedOut = useCallback((): boolean => {
    return lockoutUntil !== null && Date.now() < lockoutUntil;
  }, [lockoutUntil]);

  return {
    // Auth state
    isAuthenticated,
    isAdmin: isAuthenticated,
    user,
    
    // UI state
    showLoginModal,
    setShowLoginModal,
    isLoggingIn,
    loginError,
    
    // Actions
    attemptLogin,
    logout: handleLogout,
    requestAdminAccess,
    resetLockout,
    
    // Utilities
    hasPermission,
    hasRole,
    
    // Security info
    loginAttempts,
    isLockedOut: isLockedOut(),
    lockoutRemaining: getLockoutRemaining(),
  };
}