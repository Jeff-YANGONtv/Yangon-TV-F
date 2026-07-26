import { useEffect, useState } from 'react';
import { adsApi, resolveMediaUrl } from '../services/api';

/**
 * AdBanner — Reusable component that fetches and displays ads for a given position.
 * Props:
 *   position — "top" | "middle" | "bottom"
 */
export default function AdBanner({ position = 'middle' }) {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    adsApi.byPosition(position)
      .then((res) => {
        const items = res.data || [];
        // Sort by display_order
        items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setAds(items);
      })
      .catch(() => setError(true));
  }, [position]);

  // Fail silently — don't render anything on error
  if (error || ads.length === 0) return null;

  return (
    <div className="ads-banner-container my-4">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative rounded-lg overflow-hidden shadow-lg"
        >
          {ad.type === 'banner' && ad.content ? (
            <img
              src={resolveMediaUrl(ad.content)}
              alt={ad.name}
              className="w-full h-auto"
              loading="lazy"
            />
          ) : (
            <div className="bg-[#1a1a1a] text-center py-4 text-red-500 font-semibold">
              {ad.content}
            </div>
          )}
          <span className="absolute top-1 right-2 text-[10px] text-gray-500 uppercase tracking-wider">
            Advertisement
          </span>
        </a>
      ))}
    </div>
  );
}
