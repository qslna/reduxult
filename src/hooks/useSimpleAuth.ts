'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'redux2025';
const STORAGE_KEY = 'redux-admin-auth';

export function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 로컬 스토리지에서 인증 상태 복원 - 클라이언트에서만
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  }, [isClient]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  };

  const requestAdminAccess = () => {
    setShowLoginModal(true);
  };

  return {
    isAuthenticated,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    requestAdminAccess
  };
}