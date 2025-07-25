'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'redux2025';
const STORAGE_KEY = 'redux-admin-auth';

export function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로컬 스토리지에서 인증 상태 복원
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
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