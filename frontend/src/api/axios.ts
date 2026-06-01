import axios from 'axios';

// Strapi typically runs on port 1337 locally
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if we need auth tokens later
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetcher = async (url: string) => {
  const { data } = await apiClient.get(url);
  return data;
};
