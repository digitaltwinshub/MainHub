import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { 
  BellIcon, 
  CheckCircleIcon, 
  InformationCircleIcon, 
  ExclamationIcon,
  XIcon,
  CheckIcon,
  TrashIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const NotificationCenterPage = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    removeNotification 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, project, team, system
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedNotifications.forEach(id => markAsRead(id));
    setSelectedNotifications(new Set());
  };

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => removeNotification(id));
    setSelectedNotifications(new Set());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getNotificationIcon = (notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.category) {
      case 'project':
        return '📁';
      case 'team':
        return '👥';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-8 h-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/notifications/settings')}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <CogIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-6">
            {['all', 'unread', 'project', 'team', 'system'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`
                  px-4 py-2 text-sm rounded-lg transition-colors
                  ${filter === filterType 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedNotifications.size} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleMarkSelectedAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'You have no unread notifications.' 
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Select All Checkbox */}
            {filteredNotifications.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.size === filteredNotifications.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Select all</span>
                </label>
              </div>
            )}

            {/* Notification Items */}
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  bg-white rounded-lg shadow-sm border p-4 transition-all
                  ${!notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
                  ${selectedNotifications.has(notification.id) ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications(prev => new Set([...prev, notification.id]));
                      } else {
                        setSelectedNotifications(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(notification.id);
                          return newSet;
                        });
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <h3 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                              {notification.title}
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatTimestamp(notification.timestamp)}</span>
                            <span className="capitalize">{notification.category}</span>
                            {!notification.read && (
                              <span className="text-blue-600 font-medium">Unread</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Mark as read"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;
