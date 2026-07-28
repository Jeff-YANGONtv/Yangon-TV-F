import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://khaki-yak-457838.hostingersite.com/api';
const MEDIA_BASE = import.meta.env.VITE_MEDIA_BASE_URL || 'https://khaki-yak-457838.hostingersite.com';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Accept': 'application/json' },
});

// Resolve relative media paths to absolute URLs
export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Unwrap { success, data } envelope; throws on success=false
const unwrap = (res) => {
  const body = res.data;
  if (body?.success === false) {
    throw new Error(body.message || 'API returned success=false');
  }
  return body;
};

// --- Movies ---
export const moviesApi = {
  list: (page = 1) => client.get('/movies', { params: { p: page } }).then(unwrap),
  detail: (id) => client.get(`/movies/${id}`).then(unwrap),
  bySlug: (slug) => client.get(`/movies/slug/${slug}`).then(unwrap),
  search: (query) => client.get('/movies/search', { params: { query: query } }).then(unwrap),
  filter: (params) => client.get('/movies/filter', { params }).then(unwrap),
};

// --- Shows / Series ---
export const showsApi = {
  list: (page = 1) => client.get('/shows', { params: { p: page } }).then(unwrap),
  detail: (id) => client.get(`/shows/${id}`).then(unwrap),
  bySlug: (slug) => client.get(`/shows/slug/${slug}`).then(unwrap),
  search: (query) => client.get('/shows/search', { params: { query: query } }).then(unwrap),
  filter: (params) => client.get('/shows/filter', { params }).then(unwrap),
};

// --- Movies (sorted by views/date) ---
export const sortedMoviesApi = {
  list: (page = 1, sortBy = 'views', sortOrder = 'desc') =>
    client.get('/movies/paginate-sorted', { params: { p: page, sort_by: sortBy, sort_order: sortOrder, per_page: 20 } }).then(unwrap),
};

// --- Genres ---
export const genresApi = {
  list: () => client.get('/genres').then(unwrap),
};

// --- Ads ---
export const adsApi = {
  list: (params = {}) => client.get('/ads', { params }).then(unwrap),
  byPosition: (position) => client.get('/ads', { params: { position } }).then(unwrap),
  byType: (type) => client.get('/ads', { params: { type } }).then(unwrap),
};

// --- Socials ---
export const socialsApi = {
  list: () => client.get('/socials').then(unwrap),
};

export { client as default };
