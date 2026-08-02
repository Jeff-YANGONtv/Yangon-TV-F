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
import Login from './pages/Login'
import Register from './pages/Register'
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
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ showAuth: true }} replace />;
  }
  
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/movies/:slug" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
          <Route path="/movies/:slug/watch" element={<ProtectedRoute><MovieWatch /></ProtectedRoute>} />
          <Route path="/series" element={<ProtectedRoute><Shows /></ProtectedRoute>} />
          <Route path="/series/:slug" element={<ProtectedRoute><SeriesDetail /></ProtectedRoute>} />
          <Route path="/series/:slug/watch" element={<ProtectedRoute><SeriesWatch /></ProtectedRoute>} />
          <Route path="/links" element={<ProtectedRoute><Links /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
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
