import { api } from '../lib/api';

export const getUserById = (id: string) => api.get(`/users/${id}`).then(r => r.data.data);