import { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function NotificationDisplay() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      const id = Date.now(); // Unique ID for the toast instance
      
      setToasts(prev => [...prev, { ...notification, toastId: id }]);
      
      // Auto-remove toast after 10 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.toastId !== id));
      }, 10000);
    };

    window.addEventListener('newNotification', handleNewNotification);
    return () => window.removeEventListener('newNotification', handleNewNotification);
  }, []);

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((n) => (
        <div 
          key={n.toastId}
          className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-right duration-300 ring-1 ring-red-500/20"
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
                  onClick={() => removeToast(n.toastId)}
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
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors"
                >
                  View Now <FaExternalLinkAlt size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
