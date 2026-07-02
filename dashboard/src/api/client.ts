import axios from 'axios';
import { SESSION_KEY } from '../auth/session';
import type { SessionData } from '../types/auth.types';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ─── Request Interceptor — attach Bearer token ────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session: SessionData = JSON.parse(raw);
        if (session.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      }
    } catch {
      // session data corrupted — ignore
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — handle 401 globally ───────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session and redirect to login
      localStorage.removeItem(SESSION_KEY);
      // Avoid hard dependency on router; dispatch a custom event instead
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
