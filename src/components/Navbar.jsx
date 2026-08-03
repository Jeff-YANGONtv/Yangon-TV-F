import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaFilm, FaTv, FaInfoCircle, FaLink, FaBars, FaTimes, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/movies', icon: FaFilm, label: 'Movies' },
    { path: '/series', icon: FaTv, label: 'Series' },
    { path: '/links', icon: FaLink, label: 'Links' },
    { path: '/about', icon: FaInfoCircle, label: 'About Us' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-black/90 via-black/85 to-black/80 backdrop-blur-xl border-b border-red-500/20 shadow-lg shadow-red-500/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="text-xl sm:text-2xl font-extrabold text-red-500 tracking-tighter group-hover:drop-shadow-[0_0_12px_#ef4444] transition-all duration-300">
            YANGON <span className="text-white">TV</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                aria-label={label}
                className={`transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive(path)
                    ? 'text-red-500 bg-red-500/10 backdrop-blur-sm border border-red-500/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/5'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {!isAuthPage && (
            <>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-2 px-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10"
                  >
                    <FaUser size={18} />
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-morphism-dark rounded-xl shadow-2xl py-2 z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <FaSignOutAlt size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="btn-3d flex items-center gap-2 !py-2 !px-4"
                >
                  <FaSignInAlt size={18} />
                  <span className="hidden sm:inline text-sm font-bold">Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {!isAuthPage && mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-red-500/20 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'text-red-500 bg-red-500/10 backdrop-blur-sm border border-red-500/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/5'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              >
                <FaSignOutAlt size={20} />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
