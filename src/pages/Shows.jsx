import { useState, useEffect, useCallback } from 'react';
import { showsApi, genresApi, resolveMediaUrl } from '../services/api';
import MovieCard from '../components/MovieCard';
import AdBanner from '../components/AdBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [genres, setGenres] = useState(['All']);
  const [totalCount, setTotalCount] = useState(0);

  const fetchShows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (searchQuery.trim()) {
        res = await showsApi.search(searchQuery.trim());
      } else {
        res = await showsApi.list(page);
      }
      const items = res.data || [];
      setShows(items);
      setTotalPages(res.last_page || 1);
      setTotalCount(res.total || items.length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  // Fetch genres from API
  const fetchGenres = useCallback(async () => {
    try {
      const res = await genresApi.list();
      const items = res.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const genreNames = items.map((g) => g.name).filter(Boolean);
        setGenres(['All', ...genreNames]);
      }
    } catch (err) {
      // Fallback: extract from loaded shows
      console.warn('Failed to fetch genres from API, extracting from shows.');
    }
  }, []);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
    setSearchQuery('');
    setPage(1);
  };

  const filteredShows = activeGenre === 'All'
    ? shows
    : shows.filter((s) => s.genres?.includes(activeGenre));

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    const pages = [];
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Search Section */}
      <section className="my-4">
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search series by title, genre..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-10 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Genre Pills */}
      {!searchQuery && (
        <section className="my-4">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeGenre === genre
                    ? 'bg-red-500 text-white'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Ad Banner */}
      <AdBanner position="middle" />

      {/* Series Grid */}
      <section className="my-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {searchQuery ? `Search: "${searchQuery}"` : activeGenre === 'All' ? 'All Series' : `${activeGenre} Series`}
          </h2>
          <span className="text-gray-500 text-sm">
            {totalCount} result{totalCount !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <LoadingSkeleton type="grid" count={12} />
        ) : error ? (
          <ErrorMessage message="Failed to load series" onRetry={fetchShows} />
        ) : filteredShows.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg text-gray-400 mb-2">No series found</h3>
            <p className="text-gray-500 text-sm">Try changing the filter or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredShows.map((show) => (
              <MovieCard key={show.id} item={show} type="series" />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 py-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </span>
          </button>

          <div className="flex gap-1">
            {getPaginationRange().map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-500">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-red-500 text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[#1a1a1a] rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
          >
            <span className="flex items-center gap-1">
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* Bottom Ad */}
      <AdBanner position="bottom" />
    </div>
  );
}
