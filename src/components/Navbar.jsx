import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <nav className="sticky top-0 z-50 glass-morphism-dark border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl sm:text-2xl font-extrabold text-red-500 tracking-tighter">
            YANGON <span className="text-white">TV</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={`transition-all duration-300 flex items-center gap-2 ${
                isActive(path)
                  ? 'text-red-500 drop-shadow-[0_0_8px_#ef4444]'
                  : 'text-gray-400 hover:text-red-500 hover:scale-110'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-red-500"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-morphism-dark border-t border-gray-800 mobile-menu-enter">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-red-500/20 text-red-500 drop-shadow-[0_0_8px_#ef4444]'
                    : 'text-gray-400 hover:bg-white/10 hover:text-red-500'
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
