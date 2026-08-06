import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaEye, FaUser, FaShareAlt } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { blogsApi, resolveMediaUrl } from '../services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await blogsApi.getBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch blog detail:', err);
        setError('Blog post not found or removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{error || 'Post not found'}</h1>
        <Link
          to="/blog"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-600/30"
        >
          Back to Announcements
        </Link>
      </div>
    );
  }

  // Sanitize HTML content safely
  const cleanContent = DOMPurify.sanitize(post.content || '');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors mb-8 bg-gray-900/60 border border-gray-800 px-4 py-2 rounded-xl"
        >
          <FaArrowLeft size={14} />
          <span>Back to Announcements</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-800/80 text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-red-400 font-medium">
                <FaUser size={14} />
                {post.author || 'Admin'}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt size={14} className="text-gray-400" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </span>
              <span className="flex items-center gap-1.5">
                <FaEye size={14} className="text-gray-400" />
                {post.views || 0} views
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              <ShareIcon />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </header>

        {/* Thumbnail Image */}
        {post.thumbnail && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-gray-800/80 bg-gray-900 shadow-2xl">
            <img
              src={resolveMediaUrl(post.thumbnail)}
              alt={post.title}
              className="w-full max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* Article Body Content (Rich Text Rendered Safely) */}
        <article className="prose prose-invert prose-red max-w-none text-gray-300 leading-relaxed space-y-6 text-base sm:text-lg">
          <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </article>
      </div>
    </div>
  );
}

function ShareIcon() {
  return <FaShareAlt size={12} />;
}
