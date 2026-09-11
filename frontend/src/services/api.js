// api.js - shared axios instance for all backend requests
// Centralizes the API base URL (from VITE_API_URL) and attaches the JWT automatically
import axios from 'axios';
import { getToken, logout } from './Auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL
});

// Attach the JWT to every request, if we have one
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, log the user out so the UI doesn't get stuck.
// Note: 403 is also used for "wrong role" (e.g. student hitting an advisor-only
// route) so we must NOT log out on 403, only on 401 (no/invalid/expired token).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
