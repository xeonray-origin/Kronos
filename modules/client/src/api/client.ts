import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default client;
