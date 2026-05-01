import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // e.g. http://192.168.x.x:3000
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto handle 401s globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // call signout
      console.log(`This will always be triggered for 4XX, code is: {err.response.status}`);
      
    }
    return Promise.reject(err);
  }
);