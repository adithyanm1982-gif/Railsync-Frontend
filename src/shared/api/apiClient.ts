import axios from 'axios';

/**
 * Base client pointed at the FastAPI backend (backend/app/main.py).
 * Route modules under each feature's api folder build on this.
 * VITE_API_BASE_URL should point at wherever uvicorn serves the app,
 * e.g. http://localhost:8000
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://railway-production-c761.up.railway.app',
  timeout: 90_000, // Render free-tier cold start can be 50s+ (their own dashboard says so) -- give real headroom
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('railsync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('railsync_token');
    }
    return Promise.reject(error);
  }
);
