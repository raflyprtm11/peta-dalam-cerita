import { getToken } from '../utils/auth.js';
import { saveStory, getAllStories } from '../utils/indexedDB.js';

const API_BASE = '/api';

const storyApi = {
  async register({ name, email, password }) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getStories({ page = 1, size = 10, location = 0 } = {}) {
    const url = new URL(`${API_BASE}/stories`, window.location.origin);
    url.searchParams.set('page', page);
    url.searchParams.set('size', size);
    url.searchParams.set('location', location);

    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(url, { headers });
      if (res.status === 401) {
        window.location.hash = '#/login';
        return [];
      }
      const { listStory } = await res.json();

      for (const story of listStory) {
        await saveStory(story);
      }

      return listStory;
    } catch (error) {
      console.warn('Fetch stories gagal, fallback ke IndexedDB:', error);
      const cachedStories = await getAllStories();
      return cachedStories;
    }
  },

  async createStory({ description, photoBlob, lat, lon }) {
    const token = getToken();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoBlob, 'story.png');
    if (lat != null) formData.append('lat', lat);
    if (lon != null) formData.append('lon', lon);

    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return res.json();
  },

  async createStoryAsGuest({ description, photoBlob, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoBlob, 'story.png');
    if (lat != null) formData.append('lat', lat);
    if (lon != null) formData.append('lon', lon);

    const res = await fetch(`${API_BASE}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async getStoryById(id) {
    const res = await fetch(`${API_BASE}/stories/${id}`);
    const { story } = await res.json();
    return story;
  },

  async subscribePush({ endpoint, p256dh, auth }) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint, keys: { p256dh, auth } }),
    });
    return res.json();
  },

  async unsubscribePush({ endpoint }) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    return res.json();
  },
};

export default storyApi;
