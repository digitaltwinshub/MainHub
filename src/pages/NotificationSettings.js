import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { 
  BellIcon, 
  CogIcon,
  CheckCircleIcon,
  XIcon
} from '@heroicons/react/24/outline';

const NotificationSettings = () => {
  const { notifySystem } = useNotifications();
  
  const [settings, setSettings] = useState({
    enableProjectNotifications: true,
    enableTeamNotifications: true,
    enableSystemNotifications: true,
    enableToastNotifications: true,
    enableSoundNotifications: false,
    autoMarkAsRead: false,
    notificationDuration: 5000,
    maxNotifications: 50
  });

  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setSaved(true);
    notifySystem('Settings Saved', 'Your notification preferences have been updated.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const resetSettings = () => {
    const defaultSettings = {
      enableProjectNotifications: true,
      enableTeamNotifications: true,
      enableSystemNotifications: true,
      enableToastNotifications: true,
      enableSoundNotifications: false,
      autoMarkAsRead: false,
      notificationDuration: 5000,
      maxNotifications: 50
    };
    setSettings(defaultSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(defaultSettings));
    notifySystem('Settings Reset', 'Notification settings have been reset to defaults.', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CogIcon className="w-8 h-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          </div>
          <p className="text-gray-600">
            Customize how you receive and manage notifications across the Digital Twins Hub.
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            
            {/* Notification Types */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="project-notifications" className="text-sm font-medium text-gray-700">
                      Project Notifications
                    </label>
                    <p className="text-sm text-gray-500">Get notified when projects are added or updated</p>
                  </div>
                  <input
                    type="checkbox"
                    id="project-notifications"
                    checked={settings.enableProjectNotifications}
                    onChange={(e) => handleSettingChange('enableProjectNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="team-notifications" className="text-sm font-medium text-gray-700">
                      Team Notifications
                    </label>
                    <p className="text-sm text-gray-500">Updates about team members and activities</p>
                  </div>
                  <input
                    type="checkbox"
                    id="team-notifications"
                    checked={settings.enableTeamNotifications}
                    onChange={(e) => handleSettingChange('enableTeamNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="system-notifications" className="text-sm font-medium text-gray-700">
                      System Notifications
                    </label>
                    <p className="text-sm text-gray-500">Important system alerts and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    id="system-notifications"
                    checked={settings.enableSystemNotifications}
                    onChange={(e) => handleSettingChange('enableSystemNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="toast-notifications" className="text-sm font-medium text-gray-700">
                      Toast Notifications
                    </label>
                    <p className="text-sm text-gray-500">Show pop-up notifications for important events</p>
                  </div>
                  <input
                    type="checkbox"
                    id="toast-notifications"
                    checked={settings.enableToastNotifications}
                    onChange={(e) => handleSettingChange('enableToastNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="sound-notifications" className="text-sm font-medium text-gray-700">
                      Sound Notifications
                    </label>
                    <p className="text-sm text-gray-500">Play sound for new notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    id="sound-notifications"
                    checked={settings.enableSoundNotifications}
                    onChange={(e) => handleSettingChange('enableSoundNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="auto-mark-read" className="text-sm font-medium text-gray-700">
                      Auto-Mark as Read
                    </label>
                    <p className="text-sm text-gray-500">Automatically mark notifications as read when viewed</p>
                  </div>
                  <input
                    type="checkbox"
                    id="auto-mark-read"
                    checked={settings.autoMarkAsRead}
                    onChange={(e) => handleSettingChange('autoMarkAsRead', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notification-duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Toast Notification Duration
                  </label>
                  <select
                    id="notification-duration"
                    value={settings.notificationDuration}
                    onChange={(e) => handleSettingChange('notificationDuration', parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3000}>3 seconds</option>
                    <option value={5000}>5 seconds</option>
                    <option value={8000}>8 seconds</option>
                    <option value={10000}>10 seconds</option>
                    <option value={0}>Don't auto-hide</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="max-notifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Notifications to Store
                  </label>
                  <select
                    id="max-notifications"
                    value={settings.maxNotifications}
                    onChange={(e) => handleSettingChange('maxNotifications', parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={25}>25 notifications</option>
                    <option value={50}>50 notifications</option>
                    <option value={100}>100 notifications</option>
                    <option value={200}>200 notifications</option>
                    <option value={0}>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <button
                  onClick={resetSettings}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset to Defaults
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    {saved ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save Settings</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BellIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Notifications</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Notifications are stored locally in your browser and will persist between sessions. 
                You can manage your notification preferences here to customize your experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
