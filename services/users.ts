import { api } from '../lib/api';

export const getUserById = (id: string) => api.get(`/users/${id}`).then(r => r.data.data);
export const searchUsers = (q: string, limit = 20) => api.get('/users/search', { params: { q, limit } }).then(r => r.data.data);
export const forgotPassword = (email: string) => api.post('/users/auth/forgot-password', { email }).then(r => r.data.data);
export const resetPassword = (email: string, newPassword: string) => api.post('/users/auth/reset-password', { email, newPassword }).then(r => r.data.data);