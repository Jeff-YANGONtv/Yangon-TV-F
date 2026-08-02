import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adsApi, resolveMediaUrl } from '../services/api';

export default function AdSlider({ position = 'top' }) {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adsApi.byPosition(position)
      .then((res) => {
        const items = res.data || [];
        items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setAds(items);
      })
      .catch((err) => console.error('Failed to fetch ads:', err))
      .finally(() => setLoading(false));
  }, [position]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (loading || ads.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#1a1a1a] aspect-[21/9] sm:aspect-[25/7] mb-6 shadow-2xl border border-white/5">
      <AnimatePresence mode="wait">
        <motion.a
          key={ads[currentIndex].id}
          href={ads[currentIndex].link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 block"
        >
          {ads[currentIndex].type === 'banner' && ads[currentIndex].content ? (
            <img
              src={resolveMediaUrl(ads[currentIndex].content)}
              alt={ads[currentIndex].name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                {ads[currentIndex].content}
              </h3>
            </div>
          )}
          
          {/* Overlay for text readability if it's an image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-4 left-6 z-10">
            <span className="text-[10px] bg-black/50 backdrop-blur px-2 py-0.5 rounded text-gray-400 uppercase tracking-widest">
              Sponsored
            </span>
          </div>
        </motion.a>
      </AnimatePresence>

      {/* Indicators */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-20">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-red-500 w-6' : 'bg-white/30 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
