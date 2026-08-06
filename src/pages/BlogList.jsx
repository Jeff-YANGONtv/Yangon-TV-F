import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaSearch, FaArrowRight, FaTelegram } from 'react-icons/fa';
import { blogsApi, resolveMediaUrl } from '../services/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchBlogs = async (pageNum = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await blogsApi.list(pageNum, searchQuery);
      if (res && res.data) {
        setBlogs(res.data);
        setLastPage(res.last_page || 1);
        setPage(res.current_page || 1);
      } else if (Array.isArray(res)) {
        setBlogs(res);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, search);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Telegram Blog Header Style */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <FaTelegram size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Yangon TV Announcement & Blog
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Latest official announcements, updates, and community news from Yangon TV, crafted in a clean, minimalist Telegram blog style.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <FaSearch size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements or news..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-800 rounded-xl focus:outline-none focus:border-red-500 text-sm text-gray-200 placeholder-gray-500 transition-all shadow-inner"
          />
        </div>

        {/* Blog Posts List (Telegram Style Cards) */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/40 border border-gray-800/60 rounded-2xl">
            <p className="text-gray-400 text-lg">No announcements or blog posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="bg-gray-900/60 hover:bg-gray-900/90 border border-gray-800/80 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 transition-all duration-300 shadow-xl group"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {post.thumbnail && (
                    <div className="w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-800">
                      <img
                        src={resolveMediaUrl(post.thumbnail)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2.5">
                      <span className="flex items-center gap-1.5 bg-gray-800/80 px-2.5 py-1 rounded-md text-gray-300">
                        <FaCalendarAlt size={12} className="text-red-400" />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaEye size={12} className="text-gray-400" />
                        {post.views || 0} views
                      </span>
                      <span className="text-red-400 font-medium ml-auto">
                        {post.author || 'Admin'}
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors mb-2.5">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt || post.content?.replace(/<[^>]*>?/gm, '')}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 group-hover:text-red-300 transition-colors"
                    >
                      <span>Read full announcement</span>
                      <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => fetchBlogs(page - 1, search)}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:border-red-500 transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {lastPage}
            </span>
            <button
              onClick={() => fetchBlogs(page + 1, search)}
              disabled={page >= lastPage}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:border-red-500 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
