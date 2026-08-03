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
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "min-h-[calc(100vh-200px)]" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/movies/:slug" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
          <Route path="/movies/:slug/watch" element={<ProtectedRoute><MovieWatch /></ProtectedRoute>} />
          <Route path="/series" element={<ProtectedRoute><Shows /></ProtectedRoute>} />
          <Route path="/series/:slug" element={<ProtectedRoute><SeriesDetail /></ProtectedRoute>} />
          <Route path="/series/:slug/watch" element={<ProtectedRoute><SeriesWatch /></ProtectedRoute>} />
          <Route path="/links" element={<ProtectedRoute><Links /></ProtectedRoute>} />
          
          {/* Redirect old login/register to new auth page */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
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
