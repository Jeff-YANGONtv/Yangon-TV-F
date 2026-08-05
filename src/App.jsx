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
import AuthModal from './components/AuthModal'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useAuthEvents } from './hooks/useAuthEvents'
import NotificationDisplay from './components/NotificationDisplay'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, openAuthModal } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      openAuthModal();
    }
  }, [loading, isAuthenticated, openAuthModal]);

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
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

function AppContent() {
  const { isAuthModalOpen, closeAuthModal, openAuthModal } = useAuth();
  const location = useLocation();
  useAuthEvents();

  useEffect(() => {
    if (location.state?.showAuth) {
      openAuthModal();
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, openAuthModal]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:slug" element={<MovieDetail />} />
          <Route path="/series" element={<Shows />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/links" element={<Links />} />
          
          <Route path="/movies/:slug/watch" element={<ProtectedRoute><MovieWatch /></ProtectedRoute>} />
          <Route path="/series/:slug/watch" element={<ProtectedRoute><SeriesWatch /></ProtectedRoute>} />
          
          <Route path="/auth" element={<Navigate to="/" state={{ showAuth: true }} replace />} />
          <Route path="/login" element={<Navigate to="/" state={{ showAuth: true }} replace />} />
          <Route path="/register" element={<Navigate to="/" state={{ showAuth: true }} replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <NotificationDisplay />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
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
