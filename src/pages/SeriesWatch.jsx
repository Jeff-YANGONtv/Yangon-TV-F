import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { showsApi } from '../services/api';
import { extractIdFromSlug } from '../utils/slug';
import { encodeStreamLink, decodeStreamLink, getYouTubeEmbedUrl } from '../utils/streamLink';

/**
 * SeriesWatch — Embedded video player for a series episode
 * Route: /series/{slug}/watch
 * Query params: stream (encoded stream link), title, linkIndex
 */
export default function SeriesWatch() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const streamEncoded = searchParams.get('stream');
  const linkIndex = parseInt(searchParams.get('linkIndex') || '0', 10);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);
        const id = extractIdFromSlug(slug);
        if (!id) {
          setError('Invalid series URL');
          setLoading(false);
          return;
        }
        const res = await showsApi.detail(id);
        setShow(res.data || res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  // Decode the stream link
  const streamData = decodeStreamLink(streamEncoded);

  // Find download links for the same episode
  const findEpisodeDownloads = (showData, targetLink) => {
    if (!showData?.seasons || !targetLink) return [];
    const targetSrc = decodeStreamLink(targetLink)?.src;
    if (!targetSrc) return [];
    for (const season of showData.seasons) {
      if (!season.episodes) continue;
      for (const episode of season.episodes) {
        if (episode.streaming_links?.some(l => {
          const parsed = decodeStreamLink(l);
          return parsed?.src === targetSrc;
        })) {
          return episode.download_links || [];
        }
      }
    }
    return [];
  };

  // Find all episode links for link switching
  const findEpisodeLinks = (showData, targetLink) => {
    if (!showData?.seasons || !targetLink) return [];
    const targetSrc = decodeStreamLink(targetLink)?.src;
    if (!targetSrc) return [];
    for (const season of showData.seasons) {
      if (!season.episodes) continue;
      for (const episode of season.episodes) {
        if (episode.streaming_links?.some(l => {
          const parsed = decodeStreamLink(l);
          return parsed?.src === targetSrc;
        })) {
          return episode.streaming_links;
        }
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg p-6 text-center animate-pulse">
          <div className="aspect-video bg-gray-800 rounded-lg mb-4" />
          <div className="h-6 bg-gray-800 rounded w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link to="/series" className="text-red-500 hover:text-red-400 transition-colors">
            ← Go Back to Series
          </Link>
        </div>
      </div>
    );
  }

  if (!streamData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Invalid Stream Link</h1>
          <p className="text-gray-300 mb-4">The video URL could not be decoded.</p>
          <Link to={`/series/${slug}`} className="text-red-500 hover:text-red-400 transition-colors">
            ← Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const title = searchParams.get('title') || 'Episode';

  // Determine rendering mode
  const youtubeEmbedUrl = streamData.type === 'youtube' ? getYouTubeEmbedUrl(streamData.src) : null;
  const isDirect = streamData.type === 'direct';
  const isIframeEmbed = streamData.type === 'nstream' || streamData.type === 'iframe';

  const episodeLinks = findEpisodeLinks(show, streamEncoded);
  const episodeDownloads = findEpisodeDownloads(show, streamEncoded);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Video Container */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {youtubeEmbedUrl ? (
          // YouTube embed
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={youtubeEmbedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : isIframeEmbed ? (
          // nstream or iframe — render the full raw HTML from backend
          <div
            className="aspect-video [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: streamData.raw }}
          />
        ) : isDirect ? (
          // Direct video file
          <div className="aspect-video">
            <video
              width="100%"
              height="100%"
              controls
              autoPlay
              className="w-full h-full bg-black"
            >
              <source src={streamData.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">Unsupported video format</p>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-gray-400 text-sm">
          {youtubeEmbedUrl ? 'Playing from YouTube' : streamData.type === 'nstream' ? 'Playing from nstream' : streamData.type === 'iframe' ? 'Playing from embed' : 'Playing from direct source'}
        </p>
      </div>

      {/* Switch Links */}
      {episodeLinks.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Available Links</h3>
          <div className="flex flex-wrap gap-3">
            {episodeLinks.map((link, i) => (
              <Link
                key={i}
                to={`/series/${slug}/watch?stream=${encodeURIComponent(encodeStreamLink(link))}&title=${encodeURIComponent(title)}&linkIndex=${i}`}
                className={`text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-lg transition-all ${
                  i === linkIndex
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Link {i + 1}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Download Links */}
      {episodeDownloads.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Download</h3>
          <div className="flex flex-wrap gap-3">
            {episodeDownloads.map((link, i) => (
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
                Download {episodeDownloads.length > 1 ? `#${i + 1}` : ''}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="py-4">
        <Link
          to={`/series/${slug}`}
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {show?.name || 'Series'}
        </Link>
      </div>
    </div>
  );
}
