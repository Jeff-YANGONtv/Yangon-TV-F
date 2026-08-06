import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { moviesApi, showsApi, sortedMoviesApi, resolveMediaUrl } from '../services/api';
import { toSlugWithId } from '../utils/slug';
import AdBanner from '../components/AdBanner';
import AdSlider from '../components/AdSlider';
import MovieCard from '../components/MovieCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import echo from '../utils/echo';

export default function Home() {
  const navigate = useNavigate();

  const [recentMovies, setRecentMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider state
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    async function fetchData(showLoader = true) {
      try {
        if (showLoader) setLoading(true);
        const [recentRes, popularRes, seriesRes] = await Promise.all([
          moviesApi.list(1),
          sortedMoviesApi.list(1, 'views', 'desc'),
          showsApi.list(1),
        ]);
        setRecentMovies(recentRes.data || []);
        setPopularMovies(popularRes.data || []);
        setPopularSeries(seriesRes.data || []);
      } catch (err) {
        setError(err);
      } finally {
        if (showLoader) setLoading(false);
      }
    }

    // Initial fetch with loader
    fetchData(true);

    // Setup real-time event listeners for panel additions/updates without page refresh
    let moviesChannel, showsChannel, contentChannel;
    try {
      moviesChannel = echo.channel('movies-channel') || echo.channel('movies');
      if (moviesChannel) {
        moviesChannel.listen('.MovieAdded', (data) => {
          console.log('Real-time event: Movie added', data);
          fetchData(false);
        });
        moviesChannel.listen('.MovieUpdated', (data) => {
          console.log('Real-time event: Movie updated', data);
          fetchData(false);
        });
        moviesChannel.listen('.MovieBroadcasted', (data) => {
          console.log('Real-time event: Movie broadcasted', data);
          fetchData(false);
        });
      }

      showsChannel = echo.channel('shows-channel') || echo.channel('shows');
      if (showsChannel) {
        showsChannel.listen('.ShowAdded', (data) => {
          console.log('Real-time event: Show added', data);
          fetchData(false);
        });
        showsChannel.listen('.ShowUpdated', (data) => {
          console.log('Real-time event: Show updated', data);
          fetchData(false);
        });
        showsChannel.listen('.ShowBroadcasted', (data) => {
          console.log('Real-time event: Show broadcasted', data);
          fetchData(false);
        });
      }

      contentChannel = echo.channel('content-channel') || echo.channel('content');
      if (contentChannel) {
        contentChannel.listen('.ContentUpdated', (data) => {
          console.log('Real-time event: Content updated', data);
          fetchData(false);
        });
        contentChannel.listen('.DataUpdated', (data) => {
          console.log('Real-time event: Data updated', data);
          fetchData(false);
        });
      }
    } catch (err) {
      console.warn('Real-time WebSocket subscription initialization failed:', err);
    }

    // Background polling fallback every 45 seconds to ensure absolute consistency
    const pollInterval = setInterval(() => {
      fetchData(false);
    }, 45000);

    return () => {
      clearInterval(pollInterval);
      try {
        if (moviesChannel) {
          moviesChannel.stopListening('.MovieAdded');
          moviesChannel.stopListening('.MovieUpdated');
          moviesChannel.stopListening('.MovieBroadcasted');
        }
        if (showsChannel) {
          showsChannel.stopListening('.ShowAdded');
          showsChannel.stopListening('.ShowUpdated');
          showsChannel.stopListening('.ShowBroadcasted');
        }
        if (contentChannel) {
          contentChannel.stopListening('.ContentUpdated');
          contentChannel.stopListening('.DataUpdated');
        }
      } catch (e) {
        // ignore cleanup errors
      }
    };
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
      {/* Top Ad Slider */}
      <AdSlider position="top" />

      {/* Hero Slider / Recently Added */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Recently Added Movies</span>
            <span className="sm:hidden">Recently Added</span>
          </h2>
          <Link to="/movies" className="text-red-500 text-xs sm:text-sm flex items-center gap-1 hover:text-red-400 transition-colors font-medium">
            See All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden" />
          </div>
        ) : featured ? (
          <div className="relative h-[250px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden group glass-morphism">
            {/* Backdrop */}
            <img
              src={resolveMediaUrl(featured.poster) || '/placeholder-poster.png'}
              alt={featured.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
            
            {/* Content */}
            <div className="relative h-full flex items-end p-4 sm:p-6 md:p-8">
              <div className="max-w-xs sm:max-w-sm md:max-w-lg space-y-2 sm:space-y-3">
                <span className="inline-block text-xs sm:text-sm bg-red-500/90 backdrop-blur text-white px-3 py-1 rounded-full font-semibold">
                  {featured.genres?.[0] || 'Movie'}
                </span>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold line-clamp-2">{featured.name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 hidden sm:block">
                  {featured.review}
                </p>
                <button
                  onClick={() => {
                    const slug = featured.slug || toSlugWithId(featured.name, featured.id);
                    navigate(`/movies/${slug}`);
                  }}
                  className="btn-3d inline-flex text-xs sm:text-sm px-4 sm:px-5 py-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Watch Now
                </button>
              </div>
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {recentMovies.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSliderIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === sliderIndex ? 'bg-red-500 w-6 h-2' : 'bg-white/40 w-2 h-2 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Nav arrows */}
            <button
              onClick={() => setSliderIndex((prev) => (prev - 1 + recentMovies.length) % recentMovies.length)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSliderIndex((prev) => (prev + 1) % recentMovies.length)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}
      </section>

      {/* Popular Movies Row */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <span className="hidden sm:inline">Popular Movies</span>
            <span className="sm:hidden">Popular</span>
          </h2>
          <Link to="/movies" className="text-red-500 text-xs sm:text-sm flex items-center gap-1 hover:text-red-400 transition-colors font-medium">
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
          <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-hide">
            {popularMovies.map((movie) => (
              <div key={movie.id} className="shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
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
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Popular Series</span>
            <span className="sm:hidden">Series</span>
          </h2>
          <Link to="/series" className="text-red-500 text-xs sm:text-sm flex items-center gap-1 hover:text-red-400 transition-colors font-medium">
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
          <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-hide">
            {popularSeries.map((show) => (
              <div key={show.id} className="shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
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
