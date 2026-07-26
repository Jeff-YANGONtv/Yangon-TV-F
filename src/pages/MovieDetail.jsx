import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { moviesApi, resolveMediaUrl } from '../services/api';
import { toSlugWithId, extractIdFromSlug } from '../utils/slug';
import AdBanner from '../components/AdBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import MovieCard from '../components/MovieCard';

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);

        // Extract numeric ID from slug (e.g. "the-dark-knight-42" -> 42)
        const id = extractIdFromSlug(slug);
        if (!id) {
          setError('Invalid movie URL');
          setLoading(false);
          return;
        }

        const res = await moviesApi.detail(id);
        setMovie(res.data || res);

        // Fetch related movies (same genre)
        const relatedRes = await moviesApi.list(1);
        const allMovies = relatedRes.data || [];
        const movieData = res.data || res;
        const related = allMovies.filter(
          (m) => m.id !== movieData.id && m.genres?.some((g) => movieData.genres?.includes(g))
        ).slice(0, 12);
        setRelatedMovies(related);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorMessage message="Failed to load movie details" onRetry={() => window.location.reload()} />;
  if (!movie) return <ErrorMessage message="Movie not found" />;

  const movieSlug = toSlugWithId(movie.name, movie.id);
  const watchSlug = `${movieSlug}/watch`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Movie Detail Content */}
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 glass-morphism rounded-2xl">
        {/* Poster */}
        <div className="shrink-0 flex justify-center md:justify-start">
          <img
            src={resolveMediaUrl(movie.poster) || '/placeholder-poster.png'}
            alt={movie.name}
            className="w-48 sm:w-56 md:w-64 lg:w-72 aspect-[2/3] object-cover rounded-xl shadow-2xl hover:shadow-red-500/50 transition-shadow duration-300"
            onError={(e) => { e.target.src = '/placeholder-poster.png'; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            {movie.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400">
            {movie.release_date && (
              <span className="flex items-center gap-1 px-3 py-1 glass-morphism-dark rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {movie.release_date}
              </span>
            )}
            {movie.views !== undefined && (
              <span className="flex items-center gap-1 px-3 py-1 glass-morphism-dark rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {movie.views > 1000 ? `${(movie.views / 1000).toFixed(1)}k` : movie.views} views
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full glass-morphism-dark"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Cast */}
          {movie.casts?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Cast</h3>
              <p className="text-sm text-gray-400">{movie.casts.join(', ')}</p>
            </div>
          )}

          {/* Review / Description */}
          {movie.review && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Overview</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{movie.review}</p>
            </div>
          )}

          {/* Streaming Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Streaming Links</h3>
            {movie.streaming_links?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {movie.streaming_links.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/movies/${movieSlug}/watch?url=${encodeURIComponent(link)}&title=${encodeURIComponent(movie.name)}&linkIndex=${i}`)}
                    className="btn-3d text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch {movie.streaming_links.length > 1 ? `#${i + 1}` : 'Now'}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No streaming links available yet</p>
            )}
          </div>

          {/* Download Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Download Links</h3>
            {movie.download_links?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {movie.download_links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-secondary text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {movie.download_links.length > 1 ? `#${i + 1}` : ''}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No download links available yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner position="middle" />

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="my-6 px-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedMovies.map((m) => (
              <MovieCard key={m.id} item={m} type="movie" />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad */}
      <AdBanner position="bottom" />

      {/* Back to movies */}
      <div className="py-6 text-center">
        <Link to="/movies" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5">
          ← Back to All Movies
        </Link>
      </div>
    </div>
  );
}
