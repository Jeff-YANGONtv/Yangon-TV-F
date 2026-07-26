import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { showsApi, resolveMediaUrl } from '../services/api';
import AdBanner from '../components/AdBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import MovieCard from '../components/MovieCard';

export default function SeriesDetail() {
  const { id } = useParams();
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
        const res = await showsApi.detail(id);
        const showData = res.data || res;
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
  }, [id]);

  if (loading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorMessage message="Failed to load series details" onRetry={() => window.location.reload()} />;
  if (!show) return <ErrorMessage message="Series not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Series Detail Content */}
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
        {/* Poster */}
        <div className="shrink-0">
          <img
            src={resolveMediaUrl(show.poster) || '/placeholder-poster.png'}
            alt={show.name}
            className="w-64 md:w-72 aspect-[2/3] object-cover rounded-xl shadow-2xl"
            onError={(e) => { e.target.src = '/placeholder-poster.png'; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{show.name}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {show.release_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {show.release_date}
              </span>
            )}
            {show.seasons?.length > 0 && (
              <span className="flex items-center gap-1">
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
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"
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
                <div key={season.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                  {/* Season Header */}
                  <button
                    onClick={() => setExpandedSeason(isExpanded ? null : season.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#222] transition-colors"
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
                      {season.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="flex items-center justify-between px-5 py-3 border-b border-gray-800/50 last:border-b-0 hover:bg-[#222] transition-colors"
                        >
                          <span className="text-sm text-gray-300">{episode.name}</span>
                          <div className="flex items-center gap-2">
                            {episode.streaming_links?.length > 0 && (
                              <a
                                href={episode.streaming_links[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Watch
                              </a>
                            )}
                            {episode.download_links?.length > 0 && (
                              <a
                                href={episode.download_links[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 hover:border-red-500 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Download
                              </a>
                            )}
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
        <Link to="/series" className="text-red-500 hover:text-red-400 transition-colors text-sm">
          ← Back to All Series
        </Link>
      </div>
    </div>
  );
}
