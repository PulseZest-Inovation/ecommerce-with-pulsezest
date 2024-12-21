'use client'
import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextProps {
  success: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: NotificationType, message: string, description?: string) => {
    api[type]({
      message,
      description,
    });
  };

  const contextValue = {
    success: (message: string, description?: string) => notify('success', message, description),
    info: (message: string, description?: string) => notify('info', message, description),
    warning: (message: string, description?: string) => notify('warning', message, description),
    error: (message: string, description?: string) => notify('error', message, description),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
