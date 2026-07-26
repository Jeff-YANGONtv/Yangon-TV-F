import { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { socialsApi } from '../services/api';

const MARQUEE_TEXT = `All recap videos, background commentary, summaries, and Burmese-subtitled translations on Yangon TV are original creations of ours. However, Yangon TV does not hold the copyright to the underlying films. We fully respect and comply with all applicable copyright laws—both domestic and international—pertaining to the original creators and rights holders. If you believe that your copyrighted work has been used in a manner constituting infringement, please contact us via yangontv.office@gmail.com.`;

export default function Footer() {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    socialsApi.list()
      .then((res) => setSocials(res.data || []))
      .catch(() => setSocials([]));
  }, []);

  return (
    <footer className="bg-black/90 border-t border-gray-800">
      {/* Social Icons Row */}
      {socials.length > 0 && (
        <div className="flex justify-center gap-6 py-6 px-4">
          {socials.map((social) => {
            const IconComp = FaIcons[social.icon] || FaIcons.FaLink;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
                aria-label={social.name}
              >
                <IconComp size={28} />
              </a>
            );
          })}
        </div>
      )}

      {/* Copyright Line */}
      <div className="text-center py-4 text-gray-500 text-sm">
        © 2026 Yangon TV
      </div>

      {/* Red LED Marquee */}
      <div className="marquee-wrapper">
        <span className="marquee-text">{MARQUEE_TEXT}</span>
      </div>
    </footer>
  );
}
