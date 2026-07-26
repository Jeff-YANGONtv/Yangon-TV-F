import { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { socialsApi } from '../services/api';

// Social platform color mapping
const SOCIAL_COLORS = {
  FaFacebook: 'from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700',
  FaTelegram: 'from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500',
  FaYoutube: 'from-red-600 to-red-800 hover:from-red-500 hover:to-red-700',
  FaTiktok: 'from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800',
  FaEnvelope: 'from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500',
};

const DEFAULT_COLOR = 'from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800';

export default function Links() {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socialsApi.list()
      .then((res) => {
        const items = res.data || [];
        // Sort by display_order
        items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setSocials(items);
      })
      .catch(() => setSocials([]))
      .finally(() => setLoading(false));
  }, []);

  const socialCards = [
    { name: 'Telegram', icon: FaIcons.FaTelegram, url: 'https://t.me/yangontv', desc: 'Join our Telegram channel for instant updates', cta: 'Join', color: SOCIAL_COLORS.FaTelegram },
    { name: 'TikTok', icon: FaIcons.FaTiktok, url: 'https://tiktok.com/@yangontv', desc: 'Watch short recaps and exclusive clips', cta: 'Follow', color: SOCIAL_COLORS.FaTiktok },
    { name: 'Facebook', icon: FaIcons.FaFacebook, url: 'https://facebook.com/yangontv', desc: 'Like our page and never miss a release', cta: 'Like', color: SOCIAL_COLORS.FaFacebook },
    { name: 'Contact Us', icon: FaIcons.FaEnvelope, url: 'mailto:yangontv.office@gmail.com', desc: 'yangontv.office@gmail.com', cta: 'Email', color: SOCIAL_COLORS.FaEnvelope },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Connect with Yangon TV
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Follow us on social media and stay updated with the latest films and series.
        </p>
      </div>

      {/* Dynamic Social Cards from API */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-[#1a1a1a] rounded-xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2a2a2a] rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2" />
                <div className="h-3 bg-[#2a2a2a] rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : socials.length > 0 ? (
        <div className="space-y-4">
          {socials.map((social) => {
            const IconComp = FaIcons[social.icon] || FaIcons.FaLink;
            const colorClass = SOCIAL_COLORS[social.icon] || DEFAULT_COLOR;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-gradient-to-r ${colorClass} rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <IconComp size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{social.name}</h3>
                    <p className="text-sm text-white/70">{social.url}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold text-sm">
                    Open
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        /* Fallback: Default social cards */
        <div className="space-y-4">
          {socialCards.map((card) => (
            <a
              key={card.name}
              href={card.url}
              target="_blank"
              rel={card.name === 'Contact Us' ? 'noopener' : 'noopener noreferrer'}
              className={`block bg-gradient-to-r ${card.color} rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <card.icon size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{card.name}</h3>
                  <p className="text-sm text-white/70">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-white font-semibold text-sm">
                  {card.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
