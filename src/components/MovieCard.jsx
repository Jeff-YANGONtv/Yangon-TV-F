import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../services/api';
import { toSlugWithId } from '../utils/slug';

export default function MovieCard({ item, type = 'movie' }) {
  const slug = toSlugWithId(item.name || item.title, item.id);
  const linkTo = type === 'series' ? `/series/${slug}` : `/movies/${slug}`;

  return (
    <Link
      to={linkTo}
      className="group block rounded-xl overflow-hidden glass-morphism hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={resolveMediaUrl(item.poster) || '/placeholder-poster.png'}
          alt={item.name || item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-poster.png'; }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Genre badge */}
        {item.genres?.[0] && (
          <span className="absolute top-2 left-2 text-[10px] sm:text-xs bg-red-500/90 backdrop-blur text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg">
            {item.genres[0]}
          </span>
        )}
        
        {/* Views badge */}
        {item.views !== undefined && (
          <span className="absolute top-2 right-2 text-[10px] sm:text-xs bg-black/70 backdrop-blur text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {item.views > 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
          </span>
        )}
      </div>
      
      {/* Card content */}
      <div className="p-3 sm:p-4 space-y-1">
        <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
          {item.name || item.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          {item.release_date || item.releaseDate || 'N/A'}
        </p>
      </div>
    </Link>
  );
}
