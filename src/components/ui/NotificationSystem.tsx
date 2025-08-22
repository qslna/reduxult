/**
 * 알림 시스템 컴포넌트
 * 에러, 성공, 정보 메시지를 사용자에게 표시
 */

'use client';

import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Hook for using notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification Provider
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notificationData
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove if not persistent
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// Individual notification component
function NotificationItem({ notification, onRemove }: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30';
      case 'error':
        return 'bg-red-900/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-blue-900/20 border-blue-500/30';
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-sm w-full animate-slide-in-right`}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {notification.title && (
            <p className="text-sm font-medium text-white mb-1">
              {notification.title}
            </p>
          )}
          <p className="text-sm text-gray-300 break-words">
            {notification.message}
          </p>
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-white transition-colors"
          aria-label="알림 닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Container for all notifications
function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}

// Quick notification functions
export const showNotification = {
  success: (message: string, title?: string, options?: Partial<Notification>) => ({
    type: 'success' as const,
    message,
    title,
    ...options
  }),
  
  error: (message: string, title?: string, options?: Partial<Notification>) => ({
    type: 'error' as const,
    message,
    title,
    duration: 8000, // Errors stay longer
    ...options
  }),
  
  warning: (message: string, title?: string, options?: Partial<Notification>) => ({
    type: 'warning' as const,
    message,
    title,
    ...options
  }),
  
  info: (message: string, title?: string, options?: Partial<Notification>) => ({
    type: 'info' as const,
    message,
    title,
    ...options
  })
};

export default NotificationProvider;