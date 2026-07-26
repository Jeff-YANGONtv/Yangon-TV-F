import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { moviesApi, showsApi, resolveMediaUrl } from '../services/api';
import AdBanner from '../components/AdBanner';
import MovieCard from '../components/MovieCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [recentMovies, setRecentMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider state
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [recentRes, moviesRes, seriesRes] = await Promise.all([
          moviesApi.list(1),
          moviesApi.list(1),
          showsApi.list(1),
        ]);
        setRecentMovies(recentRes.data || []);
        setPopularMovies(moviesRes.data || []);
        setPopularSeries(seriesRes.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (recentMovies.length <= 1) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % recentMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recentMovies.length]);

  if (error) {
    return <ErrorMessage message="Failed to load content" onRetry={() => window.location.reload()} />;
  }

  const featured = recentMovies[sliderIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Top Ad Banner */}
      <AdBanner position="top" />

      {/* Hero Slider / Recently Added */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recently Added Movies
          </h2>
          <Link to="/movies" className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="relative h-[300px] sm:h-[400px] bg-[#1a1a1a] rounded-xl overflow-hidden" />
          </div>
        ) : featured ? (
          <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden group">
            {/* Backdrop */}
            <img
              src={resolveMediaUrl(featured.poster) || '/placeholder-poster.png'}
              alt={featured.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            {/* Content */}
            <div className="relative h-full flex items-end p-6 sm:p-8">
              <div className="max-w-lg">
                <span className="inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded mb-2">
                  {featured.genres?.[0] || 'Movie'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{featured.name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-4 hidden sm:block">
                  {featured.review}
                </p>
                <Link
                  to={`/movies/${featured.id}`}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Watch Now
                </Link>
              </div>
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {recentMovies.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSliderIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === sliderIndex ? 'bg-red-500 w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            {/* Nav arrows */}
            <button
              onClick={() => setSliderIndex((prev) => (prev - 1 + recentMovies.length) % recentMovies.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSliderIndex((prev) => (prev + 1) % recentMovies.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </section>

      {/* Popular Movies Row */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            Popular Movies
          </h2>
          <Link to="/movies" className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="grid" count={6} />
        ) : popularMovies.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No movies available.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {popularMovies.map((movie) => (
              <div key={movie.id} className="shrink-0 w-[140px] sm:w-[160px]">
                <MovieCard item={movie} type="movie" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Middle Ad Banner */}
      <AdBanner position="middle" />

      {/* Popular Series Row */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Popular Series
          </h2>
          <Link to="/series" className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="grid" count={6} />
        ) : popularSeries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No series available.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {popularSeries.map((show) => (
              <div key={show.id} className="shrink-0 w-[140px] sm:w-[160px]">
                <MovieCard item={show} type="series" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Ad Banner */}
      <AdBanner position="bottom" />
    </div>
  );
}
