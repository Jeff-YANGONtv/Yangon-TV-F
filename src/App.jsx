import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
import Shows from './pages/Shows'
import SeriesDetail from './pages/SeriesDetail'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/series" element={<Shows />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
