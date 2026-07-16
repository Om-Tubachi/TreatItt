import { api } from '../lib/api';

export const getUserById = (id: string) => api.get(`/users/${id}`).then(r => r.data.data);
export const searchUsers = (q: string, limit = 20) =>
  api.get('/users/search', { params: { q, limit } }).then(r => r.data.data);
