import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove toast notifications after 5 seconds
    if (notification.type === 'toast') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  // Project-specific notification helpers
  const notifyProjectAdded = (projectName) => {
    addNotification({
      type: 'success',
      title: 'New Project Added',
      message: `Project "${projectName}" has been successfully added.`,
      category: 'project',
      icon: '📁'
    });
  };

  const notifyProjectUpdated = (projectName, changes) => {
    addNotification({
      type: 'info',
      title: 'Project Updated',
      message: `Project "${projectName}" has been updated. ${changes}`,
      category: 'project',
      icon: '✏️'
    });
  };

  const notifyTeamUpdate = (message) => {
    addNotification({
      type: 'info',
      title: 'Team Update',
      message,
      category: 'team',
      icon: '👥'
    });
  };

  const notifySystem = (title, message, type = 'info') => {
    addNotification({
      type,
      title,
      message,
      category: 'system',
      icon: type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    notifyProjectAdded,
    notifyProjectUpdated,
    notifyTeamUpdate,
    notifySystem
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
