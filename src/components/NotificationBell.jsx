import { FaBell, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';
import { useRef, useEffect } from 'react';

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    isDropdownOpen, 
    setIsDropdownOpen, 
    toggleDropdown 
  } = useNotifications();
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
        aria-label="Notifications"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-morphism-dark rounded-2xl shadow-2xl z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 font-bold uppercase tracking-wider">
              {notifications.length} Total
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="mx-auto text-gray-600 mb-3 opacity-20" size={40} />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-white/5 transition-colors group">
                    <div className="flex gap-3">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        n.type === 'warning' ? 'bg-orange-500/20 text-orange-500' :
                        n.type === 'error' ? 'bg-red-500/20 text-red-500' :
                        n.type === 'success' ? 'bg-green-500/20 text-green-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {n.type === 'warning' ? <FaExclamationTriangle size={14} /> :
                         n.type === 'error' ? <FaExclamationTriangle size={14} /> :
                         n.type === 'success' ? <FaCheckCircle size={14} /> :
                         <FaInfoCircle size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white mb-1 truncate">{n.title}</h4>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-2">
                          {n.message}
                        </p>
                        {n.link_url && (
                          <a 
                            href={n.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors"
                          >
                            View Details <FaExternalLinkAlt size={8} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-white/10 bg-black/40">
              <button 
                className="w-full py-2 text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                onClick={() => setIsDropdownOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
