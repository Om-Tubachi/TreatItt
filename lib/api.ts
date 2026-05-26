import axios from 'axios';
import { Platform } from 'react-native';

export let _token: string | null = null;
export const setToken = (t: string | null) => { _token = t; };

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  if (Platform.OS !== 'web' && _token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.log(`[API] 401: ${err.response.status}`);
    }
    return Promise.reject(err);
  }
);