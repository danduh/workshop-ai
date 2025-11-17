/**
 * NotificationContext - Global toast notification system
 * Provides methods to show success, error, info, and warning notifications
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { NotificationType } from '../types';

/**
 * Notification object interface
 */
interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

/**
 * Notification Context Value Interface
 */
interface NotificationContextValue {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

/**
 * Create Context
 */
const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

/**
 * Toast Component
 * Renders individual notification toast
 */
const Toast: React.FC<{
  notification: Notification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  const { id, type, message } = notification;

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [id, notification.duration, onDismiss]);

  // Icon and color configuration by type
  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } =
    config[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg ${bgColor} ${borderColor} animate-slide-in-right`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
      <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className={`flex-shrink-0 ${textColor} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
        aria-label="Dismiss notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * NotificationProvider Component
 * Wraps the application to provide global notification system
 */
export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Generate unique ID for notifications
   */
  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Add notification to the queue
   */
  const addNotification = useCallback(
    (type: NotificationType, message: string, duration?: number) => {
      const notification: Notification = {
        id: generateId(),
        type,
        message,
        duration: duration || 5000,
      };

      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  /**
   * Remove notification from the queue
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Show success notification
   */
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      addNotification('success', message, duration);
    },
    [addNotification]
  );

  /**
   * Show error notification
   */
  const showError = useCallback(
    (message: string, duration?: number) => {
      addNotification('error', message, duration);
    },
    [addNotification]
  );

  /**
   * Show info notification
   */
  const showInfo = useCallback(
    (message: string, duration?: number) => {
      addNotification('info', message, duration);
    },
    [addNotification]
  );

  /**
   * Show warning notification
   */
  const showWarning = useCallback(
    (message: string, duration?: number) => {
      addNotification('warning', message, duration);
    },
    [addNotification]
  );

  const value: NotificationContextValue = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toast Container - Fixed position, top-right */}
      {notifications.length > 0 && (
        <div
          className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {notifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
              <Toast
                notification={notification}
                onDismiss={removeNotification}
              />
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

/**
 * useNotification Hook
 * Access notification context in any component
 * @throws Error if used outside of NotificationProvider
 */
export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }

  return context;
};
