import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import echo from '../utils/echo';

const NotificationContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://khaki-yak-457838.hostingersite.com/api';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/public/notifications`);
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        // For simplicity, we assume all fetched notifications are "new" if they are not in local storage
        const seenIds = JSON.parse(localStorage.getItem('seen_notification_ids') || '[]');
        const unread = res.data.filter(n => !seenIds.includes(n.id)).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  const markAllAsSeen = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem('seen_notification_ids', JSON.stringify(allIds));
    setUnreadCount(0);
  }, [notifications]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen) {
      markAllAsSeen();
    }
  };

  useEffect(() => {
    fetchNotifications();

    const pollingInterval = setInterval(fetchNotifications, 60000);

    let channel;
    try {
      channel = echo.channel('notifications-channel');
      channel.listen('.NotificationBroadcasted', (data) => {
        if (data.notification) {
          setNotifications(prev => {
            if (prev.some(n => n.id === data.notification.id)) return prev;
            return [data.notification, ...prev];
          });
          setUnreadCount(prev => prev + 1);
          
          // Also trigger a custom event for the NotificationDisplay popup if needed
          window.dispatchEvent(new CustomEvent('newNotification', { detail: data.notification }));
        }
      });
    } catch (err) {
      console.warn('WebSocket connection failed:', err);
    }

    return () => {
      clearInterval(pollingInterval);
      if (channel) {
        channel.stopListening('.NotificationBroadcasted');
      }
    };
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      isDropdownOpen, 
      setIsDropdownOpen, 
      toggleDropdown,
      markAllAsSeen 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
