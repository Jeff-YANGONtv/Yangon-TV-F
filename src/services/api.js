import axios from 'axios';

const API_BASE = 'https://khaki-yak-457838.hostingersite.com/api';
const MEDIA_BASE = 'https://khaki-yak-457838.hostingersite.com';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
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
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) {
      throw new Error(body.message || 'API request failed');
    }
    return body.data;
  }
  return body;
};

export const moviesApi = {
  list: async (page = 1) => {
    const res = await client.get(`/movies`, { params: { page } });
    return unwrap(res);
  },
  search: async (query) => {
    const res = await client.get(`/movies/search`, { params: { q: query } });
    return unwrap(res);
  },
  get: async (id) => {
    const res = await client.get(`/movies/${id}`);
    return unwrap(res);
  },
  getBySlug: async (slug) => {
    const res = await client.get(`/movies/slug/${slug}`);
    return unwrap(res);
  },
};

export const sortedMoviesApi = {
  list: async (page = 1, sortBy = 'release_date', sortOrder = 'desc') => {
    const res = await client.get(`/movies/paginate-sorted`, {
      params: { page, sort_by: sortBy, sort_order: sortOrder },
    });
    return unwrap(res);
  },
};

export const showsApi = {
  list: async (page = 1) => {
    const res = await client.get(`/shows`, { params: { page } });
    return unwrap(res);
  },
  search: async (query) => {
    const res = await client.get(`/shows/search`, { params: { q: query } });
    return unwrap(res);
  },
  get: async (id) => {
    const res = await client.get(`/shows/${id}`);
    return unwrap(res);
  },
  getBySlug: async (slug) => {
    const res = await client.get(`/shows/slug/${slug}`);
    return unwrap(res);
  },
};

export const sortedShowsApi = {
  list: async (page = 1, sortBy = 'release_date', sortOrder = 'desc') => {
    const res = await client.get(`/shows/paginate-sorted`, {
      params: { page, sort_by: sortBy, sort_order: sortOrder },
    });
    return unwrap(res);
  },
};

export const seasonsApi = {
  getByShow: async (showId) => {
    const res = await client.get(`/shows/${showId}/seasons`);
    return unwrap(res);
  },
  get: async (id) => {
    const res = await client.get(`/seasons/${id}`);
    return unwrap(res);
  },
};

export const episodesApi = {
  getBySeason: async (seasonId) => {
    const res = await client.get(`/seasons/${seasonId}/episodes`);
    return unwrap(res);
  },
  get: async (id) => {
    const res = await client.get(`/episodes/${id}`);
    return unwrap(res);
  },
};

export const genresApi = {
  list: async () => {
    try {
      const res = await client.get(`/genres`);
      return unwrap(res);
    } catch {
      return [];
    }
  },
};

export const adsApi = {
  list: async () => {
    try {
      const res = await client.get(`/ads`);
      return unwrap(res);
    } catch {
      return [];
    }
  },
};

export const socialsApi = {
  list: async () => {
    try {
      const res = await client.get(`/socials`);
      return unwrap(res);
    } catch {
      return [];
    }
  },
};

export const notificationsApi = {
  publicList: async () => {
    try {
      const res = await client.get(`/public/notifications`);
      return unwrap(res);
    } catch {
      return [];
    }
  },
};

export default client;

export const blogsApi = {
  list: async (page = 1, search = '') => {
    try {
      const res = await client.get(`/public/blogs`, { params: { page, search } });
      return unwrap(res);
    } catch {
      return { data: [], current_page: 1, last_page: 1 };
    }
  },
  getBySlug: async (slug) => {
    const res = await client.get(`/public/blogs/${slug}`);
    return unwrap(res);
  },
};
