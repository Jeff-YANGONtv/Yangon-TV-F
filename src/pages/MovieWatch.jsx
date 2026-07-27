import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import { moviesApi } from '../services/api';
import { extractTitleFromSlug, toSlugWithId, slugToTitle } from '../utils/slug';
import { encodeStreamLink, decodeStreamLink, getYouTubeEmbedUrl } from '../utils/streamLink';

/**
 * MovieWatch — Embedded video player for a movie
 * Route: /movies/{slug}/watch
 * Query params: stream (encoded stream link), title, linkIndex
 */
export default function MovieWatch() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const streamEncoded = searchParams.get('stream');
  const linkIndex = parseInt(searchParams.get('linkIndex') || '0', 10);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        setError(null);
        const titleSlug = extractTitleFromSlug(slug);
        if (!titleSlug) {
          setError('Invalid movie URL');
          setLoading(false);
          return;
        }
        const searchQuery = slugToTitle(titleSlug);
        const res = await moviesApi.search(searchQuery);
        const searchData = res.data || res;
        const searchResult = Array.isArray(searchData)
          ? searchData.find(m => toSlugWithId(m.name) === titleSlug) || searchData[0] || null
          : searchData;

        // Search doesn't include streaming_links, so fetch full detail by ID
        if (searchResult?.id) {
          const detailRes = await moviesApi.detail(searchResult.id);
          const movieData = detailRes.data || detailRes;
          setMovie(movieData);
        } else {
          setMovie(null);
        }
      } catch (err) {
        setError(err?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  // Decode the stream link
  const streamData = decodeStreamLink(streamEncoded);

  // HLS setup / cleanup
  useEffect(() => {
    if (streamData?.type !== 'hls') return;
    const video = videoRef.current;
    if (!video) return;

    // Safari supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamData.src;
      video.addEventListener('loadedmetadata', () => video.play());
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamData.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hlsRef.current = hls;
    } else {
      setError('HLS playback is not supported in this browser.');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamData]);

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
          <Link to="/movies" className="text-red-500 hover:text-red-400 transition-colors">
            ← Go Back to Movies
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
          <Link to={`/movies/${slug}`} className="text-red-500 hover:text-red-400 transition-colors">
            ← Back to Movie
          </Link>
        </div>
      </div>
    );
  }

  const title = searchParams.get('title') || movie?.name || 'Video Player';

  // Determine rendering mode
  const youtubeEmbedUrl = streamData.type === 'youtube' ? getYouTubeEmbedUrl(streamData.src) : null;
  const isDirect = streamData.type === 'direct';
  const isIframeEmbed = streamData.type === 'nstream' || streamData.type === 'iframe';
  const isHls = streamData.type === 'hls';

  // Check if there are other streaming links to switch between
  const allLinks = movie?.streaming_links || [];

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
              referrerPolicy="no-referrer"
              className="w-full h-full"
            />
          </div>
        ) : isIframeEmbed ? (
          // nstream or iframe — render clean iframe element
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={streamData.src}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        ) : isDirect || isHls ? (
          // Direct video file or HLS stream
          <div className="aspect-video">
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              controls
              autoPlay
              className="w-full h-full bg-black"
              {...(isDirect ? { src: streamData.src } : {})}
            >
              {!isHls && !isDirect ? null : null}
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
          {youtubeEmbedUrl
            ? 'Playing from YouTube'
            : isIframeEmbed
              ? 'Playing from embed'
              : isHls
                ? 'Playing HLS stream'
                : 'Playing from direct source'}
        </p>
      </div>

      {/* Switch Links */}
      {allLinks.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Available Links</h3>
          <div className="flex flex-wrap gap-3">
            {allLinks.map((link, i) => (
              <Link
                key={i}
                to={`/movies/${slug}/watch?stream=${encodeURIComponent(encodeStreamLink(link))}&title=${encodeURIComponent(title)}&linkIndex=${i}`}
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
      {movie?.download_links?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Download</h3>
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
        </div>
      )}

      {/* Telegram Channel Button */}
      <div className="mb-6">
        <a
          href="https://telegram.me/yangontv"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-sky-500/30 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          Watch Via Telegram Channel
        </a>
      </div>

      {/* Back Button */}
      <div className="py-4">
        <Link
          to={`/movies/${slug}`}
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {movie?.name || 'Movie'}
        </Link>
      </div>
    </div>
  );
}
