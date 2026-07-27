import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { showsApi, resolveMediaUrl } from '../services/api';
import { toSlugWithId, extractTitleFromSlug, slugToTitle } from '../utils/slug';
import { encodeStreamLink } from '../utils/streamLink';
import AdBanner from '../components/AdBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import MovieCard from '../components/MovieCard';

export default function SeriesDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [relatedShows, setRelatedShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);

        // Extract title slug and search for the series
        const titleSlug = extractTitleFromSlug(slug);
        if (!titleSlug) {
          setError('Invalid series URL');
          setLoading(false);
          return;
        }

        const searchQuery = slugToTitle(titleSlug);
        const res = await showsApi.search(searchQuery);
        const searchData = res.data || res;
        // Search may return an array of results; pick the best match
        const showData = Array.isArray(searchData)
          ? searchData.find(s => toSlugWithId(s.name) === titleSlug) || searchData[0] || null
          : searchData;
        setShow(showData);

        // Expand first season by default
        if (showData.seasons?.length > 0) {
          setExpandedSeason(showData.seasons[0].id);
        }

        // Fetch related shows
        const relatedRes = await showsApi.list(1);
        const allShows = relatedRes.data || [];
        const related = allShows.filter(
          (s) => s.id !== showData.id && s.genres?.some((g) => showData.genres?.includes(g))
        ).slice(0, 12);
        setRelatedShows(related);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorMessage message="Failed to load series details" onRetry={() => window.location.reload()} />;
  if (!show) return <ErrorMessage message="Series not found" />;

  const showSlug = toSlugWithId(show.name, show.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Series Detail Content */}
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 glass-morphism rounded-2xl">
        {/* Poster */}
        <div className="shrink-0 flex justify-center md:justify-start">
          <img
            src={resolveMediaUrl(show.poster) || '/placeholder-poster.png'}
            alt={show.name}
            className="w-48 sm:w-56 md:w-64 lg:w-72 aspect-[2/3] object-cover rounded-xl shadow-2xl hover:shadow-red-500/50 transition-shadow duration-300"
            onError={(e) => { e.target.src = '/placeholder-poster.png'; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            {show.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400">
            {show.release_date && (
              <span className="flex items-center gap-1 px-3 py-1 glass-morphism-dark rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {show.release_date}
              </span>
            )}
            {show.seasons?.length > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 glass-morphism-dark rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {show.seasons.length} Season{show.seasons.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Genres */}
          {show.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
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
          {show.casts?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Cast</h3>
              <p className="text-sm text-gray-400">{show.casts.join(', ')}</p>
            </div>
          )}

          {/* Review / Description */}
          {show.review && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Overview</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{show.review}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seasons / Episodes Accordion */}
      {show.seasons?.length > 0 && (
        <section className="my-6 px-4">
          <h2 className="text-xl font-bold mb-4">Episodes</h2>
          <div className="space-y-3">
            {show.seasons.map((season) => {
              const isExpanded = expandedSeason === season.id;
              const totalEpisodes = season.episodes?.length || 0;

              return (
                <div key={season.id} className="glass-morphism rounded-xl overflow-hidden">
                  {/* Season Header */}
                  <button
                    onClick={() => setExpandedSeason(isExpanded ? null : season.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white">{season.name}</span>
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{totalEpisodes} episode{totalEpisodes !== 1 ? 's' : ''}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {/* Episodes List */}
                  {isExpanded && season.episodes?.length > 0 && (
                    <div className="border-t border-gray-800">
                      {season.episodes.map((episode, idx) => (
                        <div
                          key={episode.id}
                          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3 gap-3 ${
                            idx < season.episodes.length - 1 ? 'border-b border-gray-800/50' : ''
                          } hover:bg-white/5 transition-colors`}
                        >
                          <span className="text-sm text-gray-300 font-medium">{episode.name}</span>
                          <div className="flex flex-wrap items-center gap-2">
                            {episode.streaming_links?.length > 0 && episode.streaming_links.map((link, i) => (
                              <button
                                key={`stream-${i}`}
                                onClick={() => navigate(`/series/${showSlug}/watch?stream=${encodeURIComponent(encodeStreamLink(link))}&title=${encodeURIComponent(episode.name)}&linkIndex=${i}`)}
                                className="btn-3d text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                                Watch {episode.streaming_links.length > 1 ? i + 1 : ''}
                              </button>
                            ))}
                            {episode.download_links?.length > 0 && episode.download_links.map((link, i) => (
                              <a
                                key={`down-${i}`}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-3d-secondary text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download {episode.download_links.length > 1 ? i + 1 : ''}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Ad Banner */}
      <AdBanner position="middle" />

      {/* Related Series */}
      {relatedShows.length > 0 && (
        <section className="my-6 px-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedShows.map((s) => (
              <MovieCard key={s.id} item={s} type="series" />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad */}
      <AdBanner position="bottom" />

      {/* Back to series */}
      <div className="py-6 text-center">
        <Link to="/series" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5">
          ← Back to All Series
        </Link>
      </div>
    </div>
  );
}
