import { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaExternalLinkAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import echo from '../utils/echo';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://khaki-yak-457838.hostingersite.com/api';

export default function NotificationDisplay() {
  const [notifications, setNotifications] = useState([]);
  const [closedIds, setClosedIds] = useState([]);
  const lastFetchedIds = useRef(new Set());

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/public/notifications`);
      if (Array.isArray(res.data)) {
        const newNotifications = res.data;
        setNotifications(prev => {
          // Merge new notifications with existing ones, avoiding duplicates
          const existingIds = new Set(prev.map(n => n.id));
          const filteredNew = newNotifications.filter(n => !existingIds.has(n.id));
          return [...filteredNew, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    // 1. Initial fetch
    fetchNotifications();

    // 2. Setup Polling (fallback)
    const pollingInterval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds

    // 3. Listen for real-time updates (WebSocket)
    let channel;
    try {
      channel = echo.channel('notifications-channel');
      channel.listen('.NotificationBroadcasted', (data) => {
        console.log('New notification received via WebSocket:', data);
        if (data.notification) {
          setNotifications(prev => {
            if (prev.some(n => n.id === data.notification.id)) return prev;
            return [data.notification, ...prev];
          });
        }
      });
    } catch (err) {
      console.warn('WebSocket connection failed, relying on polling:', err);
    }

    return () => {
      clearInterval(pollingInterval);
      if (channel) {
        channel.stopListening('.NotificationBroadcasted');
      }
    };
  }, []);

  const handleClose = (id) => {
    setClosedIds(prev => [...prev, id]);
  };

  const visibleNotifications = notifications.filter(n => !closedIds.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      {visibleNotifications.map((n) => (
        <div 
          key={n.id}
          className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-right duration-300"
        >
          <div className="flex gap-3">
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              n.type === 'warning' ? 'bg-orange-500/20 text-orange-500' :
              n.type === 'error' ? 'bg-red-500/20 text-red-500' :
              n.type === 'success' ? 'bg-green-500/20 text-green-500' :
              'bg-blue-500/20 text-blue-500'
            }`}>
              {n.type === 'warning' ? <FaExclamationTriangle size={20} /> :
               n.type === 'error' ? <FaExclamationTriangle size={20} /> :
               n.type === 'success' ? <FaCheckCircle size={20} /> :
               <FaInfoCircle size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-white truncate pr-2">{n.title}</h4>
                <button 
                  onClick={() => handleClose(n.id)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 mb-2">{n.message}</p>
              
              {n.link_url && (
                <a 
                  href={n.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider transition-colors"
                >
                  Learn More <FaExternalLinkAlt size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
