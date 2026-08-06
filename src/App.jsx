import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
// Deployment: 2026-08-05 23:55:00
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
import NotificationDisplay from './components/NotificationDisplay'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppContent() {
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
          
          <Route path="/movies/:slug/watch" element={<MovieWatch />} />
          <Route path="/series/:slug/watch" element={<SeriesWatch />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <NotificationDisplay />
    </div>
  )
}

export default function App() {
  return (
    <AppContent />
  )
}
