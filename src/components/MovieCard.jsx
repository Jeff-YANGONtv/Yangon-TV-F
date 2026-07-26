import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../services/api';

export default function MovieCard({ item, type = 'movie' }) {
  const linkTo = type === 'series' ? `/series/${item.id}` : `/movies/${item.id}`;

  return (
    <Link
      to={linkTo}
      className="group block rounded-lg overflow-hidden bg-[#1a1a1a] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={resolveMediaUrl(item.poster) || '/placeholder-poster.png'}
          alt={item.name || item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-poster.png'; }}
        />
        {/* Genre badge */}
        {item.genres?.[0] && (
          <span className="absolute top-2 left-2 text-[10px] bg-red-500/80 text-white px-2 py-0.5 rounded">
            {item.genres[0]}
          </span>
        )}
        {/* Rating badge */}
        {item.views !== undefined && (
          <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {item.views > 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium text-white truncate">{item.name || item.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.release_date || item.releaseDate || ''}
        </p>
      </div>
    </Link>
  );
}
