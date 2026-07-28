import axios from 'axios';
import { store, authActions } from '@/store';
const client = axios.create({
  baseURL: process.env.API_BASE_URL ?? 'http://localhost:8080/api',
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const REFRESH_URL = '/auth/refresh';

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_URL;

    if (canRefresh) {
      originalRequest._retry = true;
      try {
        const res = await client.get(REFRESH_URL);
        const { token } = res.data;
        store.dispatch(authActions.setToken(token));
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client.request(originalRequest);
      } catch (refreshError) {
        store.dispatch(authActions.clearToken());
        throw refreshError;
      }
    }
    throw error;
  },
);

export default client;
