import axios from 'axios';
import { Platform } from 'react-native';

export let _token: string | null = null;
export const setToken = (t: string | null) => { _token = t; };

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});


// Request Logger
api.interceptors.request.use(config => {
  console.log(`🚀 [API Request] ${config.method?.toUpperCase()} -> ${config.url}`);
  console.log('Headers:', JSON.stringify(config.headers, null, 2));
  if (config.data) console.log('Body:', JSON.stringify(config.data, null, 2));
  return config;
});

// Response Logger
api.interceptors.response.use(
  response => {
    console.log(`✅ [API Response] ${response.status} <- ${response.config.url}`);
    return response;
  },
  error => {
    console.log(`❌ [API Error] ${error.response?.status || error.message} <- ${error.config?.url}`);
    if (error.response?.data) {
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    }
    return Promise.reject(error);
  }
);

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
      console.log(err.response)
    }
    return Promise.reject(err);
  }
);