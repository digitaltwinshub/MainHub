import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { XIcon, CheckCircleIcon, InformationCircleIcon, ExclamationIcon } from '@heroicons/react/24/outline';

const NotificationToast = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`
        ${getBgColor()}
        border rounded-lg shadow-lg p-4 mb-2 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {notification.icon || getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  const [visibleToasts, setVisibleToasts] = useState(new Set());

  // Show only toast notifications
  const toastNotifications = notifications.filter(n => n.type === 'toast' || !n.category);

  const handleClose = (id) => {
    removeNotification(id);
    setVisibleToasts(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  if (toastNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toastNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
