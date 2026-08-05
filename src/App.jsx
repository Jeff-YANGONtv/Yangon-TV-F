import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
import Shows from './pages/Shows'
import SeriesDetail from './pages/SeriesDetail'
import About from './pages/About'
import Links from './pages/Links'
import MovieWatch from './pages/MovieWatch'
import SeriesWatch from './pages/SeriesWatch'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useAuthEvents } from './hooks/useAuthEvents'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return children;
};

const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  useAuthEvents(); // Listen for real-time auth events

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "min-h-[calc(100vh-200px)]" : ""}>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:slug" element={<MovieDetail />} />
          <Route path="/series" element={<Shows />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/links" element={<Links />} />
          
          {/* Auth Route - Only accessible without login */}
          <Route path="/auth" element={<PublicAuthRoute><AuthPage /></PublicAuthRoute>} />
          
          {/* Protected Routes - Require authentication */}
          <Route path="/movies/:slug/watch" element={<ProtectedRoute><MovieWatch /></ProtectedRoute>} />
          <Route path="/series/:slug/watch" element={<ProtectedRoute><SeriesWatch /></ProtectedRoute>} />
          
          {/* Redirect old login/register to new auth page */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
