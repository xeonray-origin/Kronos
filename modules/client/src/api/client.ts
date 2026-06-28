import axios from 'axios';
import { store, authActions } from '@/store';
const client = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.get('/auth/refresh');
        const { token } = res.data;
        store.dispatch(authActions.setToken(token));
        error.config.headers.Authorization = token;
        return client(error.config);
      } catch (refreshError) {
        console.error('Refresh token expired or invalid');
        throw refreshError;
      }
    }
    throw error;
  },
);

client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default client;
