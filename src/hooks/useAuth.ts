'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or cookie)
    const checkAuth = async () => {
      try {
        // 브라우저에서만 localStorage 사용
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('auth-token');
        if (token) {
          // Verify token with backend
          // For now, we'll just check if it exists
          setUser({
            id: 'admin',
            username: 'admin',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // 브라우저에서만 localStorage 사용
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
        }
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // 브라우저에서만 localStorage 사용
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}