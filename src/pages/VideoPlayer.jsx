import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * VideoPlayer — Plays videos from various sources
 * Query params:
 *   - url: The video URL (YouTube, direct MP4, etc.)
 *   - title: Video title (optional)
 *   - type: 'movie' or 'series' (optional, for back link)
 *   - id: Content ID (optional, for back link)
 */
export default function VideoPlayer() {
  const [searchParams] = useSearchParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [title, setTitle] = useState('Video Player');
  const [contentType, setContentType] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = searchParams.get('url');
    const videoTitle = searchParams.get('title') || 'Video Player';
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!url) {
      setError('No video URL provided');
      return;
    }

    setVideoUrl(url);
    setTitle(videoTitle);
    setContentType(type);
    setContentId(id);
  }, [searchParams]);

  // Determine if URL is YouTube
  const isYouTube = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Determine if URL is nstream.cc
  const isNStream = (url) => {
    if (!url) return false;
    return url.includes('nstream.cc');
  };

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return null;
  };

  // Determine back link
  const getBackLink = () => {
    if (contentType === 'movie' && contentId) {
      return `/movies/${contentId}`;
    }
    if (contentType === 'series' && contentId) {
      return `/series/${contentId}`;
    }
    return '/';
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <Link to={getBackLink()} className="text-red-500 hover:text-red-400 transition-colors">
            ← Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = isYouTube(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : null;
  const nstreamUrl = isNStream(videoUrl) ? videoUrl : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Video Container */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {youtubeEmbedUrl || nstreamUrl ? (
          // Embed Player (YouTube or nstream.cc)
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={youtubeEmbedUrl || nstreamUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          // HTML5 Video Player for direct video files
          <video
            width="100%"
            height="100%"
            controls
            autoPlay
            className="w-full h-full bg-black"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Video Info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400 text-sm">
          {youtubeEmbedUrl ? 'Playing from YouTube' : 'Playing from direct source'}
        </p>
      </div>

      {/* Back Button */}
      <div className="py-4">
        <Link
          to={getBackLink()}
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Video Information</h3>
        <p className="text-xs text-gray-400 break-all">
          <strong>Source:</strong> {videoUrl}
        </p>
      </div>
    </div>
  );
}
