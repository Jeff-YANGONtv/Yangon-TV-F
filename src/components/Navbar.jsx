import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaFilm, FaTv, FaInfoCircle, FaLink, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Menu Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
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
          </div>
        </div>
      )}
    </nav>
  );
}
