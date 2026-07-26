import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFilm, FaTv, FaInfoCircle } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/movies', icon: FaFilm, label: 'Movies' },
    { path: '/series', icon: FaTv, label: 'Series' },
    { path: '/about', icon: FaInfoCircle, label: 'About Us' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-500">
          YGNTV
        </Link>

        {/* Icon Navigation */}
        <div className="flex gap-10 items-center">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={`transition-all duration-300 ${
                isActive(path)
                  ? 'text-red-500 drop-shadow-[0_0_8px_#ef4444]'
                  : 'text-gray-400 hover:text-red-500 hover:scale-110'
              }`}
            >
              <Icon size={24} />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
