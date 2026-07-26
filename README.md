# YGNTV Frontend — Complete UI Enhancement & Backend Integration

Enhanced React + Vite frontend for Yangon TV streaming platform with icon-only navigation, animated footer marquee, snowflake About page animation, and full integration with the live Laravel backend API (including movies, shows, ads banners, and social links).

## Tech Stack

- React 18
- Vite
- React Router DOM v6
- Tailwind CSS v3
- Axios
- React Icons
- Framer Motion

## How to Run Locally

```bash
npm install
cp .env.example .env  # ensure API URLs are set
npm run dev
```

The app will start at `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready for deployment.

## Project Structure

```
yangon-tv-frontend/
├── index.html                  # Vite entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml                # Netlify deploy config
├── .env                        # Environment variables (API URLs)
├── .env.example
├── public/
│   ├── favicon.png
│   └── placeholder-poster.png
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component with routing
    ├── index.css               # Global styles + marquee animations
    ├── components/
    │   ├── Navbar.jsx          # Icon-only sticky header
    │   ├── Footer.jsx          # Social icons + marquee
    │   ├── AdBanner.jsx        # Dynamic ad banner component
    │   ├── MovieCard.jsx       # Reusable movie/series card
    │   ├── LoadingSkeleton.jsx # Loading states
    │   └── ErrorMessage.jsx    # Error states with retry
    ├── pages/
    │   ├── Home.jsx            # Hero slider + popular rows
    │   ├── Movies.jsx          # Movies grid with search/filter/pagination
    │   ├── MovieDetail.jsx     # Single movie detail
    │   ├── Shows.jsx           # Series grid with filter/pagination
    │   ├── SeriesDetail.jsx    # Series with seasons/episodes accordion
    │   └── About.jsx           # Snowflake animation page
    ├── services/
    │   └── api.js              # API client + endpoints
    └── hooks/
        └── useApi.js           # Generic API fetch hook
```

## API Endpoints (Live Backend)

| Endpoint | Description |
|---|---|
| `GET /api/movies?p={page}` | Paginated movie list |
| `GET /api/movies/{id}` | Single movie detail |
| `GET /api/movies/search?q={query}` | Search movies |
| `GET /api/movies/filter?genre=...` | Filter movies by genre |
| `GET /api/shows?p={page}` | Paginated series list |
| `GET /api/shows/{id}` | Series detail with seasons/episodes |
| `GET /api/ads?position=top` | Ads by position (top/middle/bottom) |
| `GET /api/socials` | Social media links |

## Testing Checklist

- [x] Header shows 4 icons only, no text, evenly spaced with gap-10
- [x] Header stays sticky at top when scrolling
- [x] Active route icon glows red
- [x] Footer shows social icons row (fetched from API, hover works)
- [x] Footer shows © 2026 Yangon TV centered
- [x] Marquee scrolls right → left continuously with red LED pulse
- [x] Marquee pauses on hover
- [x] About page phrases fall like snowflakes with 120ms stagger
- [x] /movies page loads real posters from API
- [x] /shows page loads real series data
- [x] Movie detail page loads by URL id
- [x] Show detail page displays seasons/episodes accordion
- [x] AdBanner components load and display ads at correct positions
- [x] Poster URLs resolve correctly (MEDIA_BASE prefix applied)
- [x] Loading skeletons appear during fetch
- [x] Error states show retry buttons
- [x] Pagination uses ?p= query param correctly
- [x] Mobile responsive: no horizontal scroll on 320px
- [x] No console errors, no CORS errors
- [x] All external links open in new tab with rel="noopener noreferrer"

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React DOM rendering |
| react-router-dom | ^6.26.0 | Client-side routing |
| axios | ^1.7.0 | HTTP client |
| react-icons | ^5.4.0 | Icon library |
| framer-motion | ^11.0.0 | Animations |
| tailwindcss | ^3.4.0 | CSS utility framework |
| vite | ^5.4.0 | Build tool |

## Deploy

### Netlify

Push to the repo and Netlify will auto-deploy using `netlify.toml` configuration.

### Manual

```bash
npm run build
# Upload dist/ folder to your hosting
```

## Contact

- Email: yangontv.office@gmail.com
- Telegram: t.me/yangontv
- TikTok: @yangontv
- Facebook: facebook.com/yangontv
