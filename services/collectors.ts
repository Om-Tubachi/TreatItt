import { api } from '../lib/api';

export const registerCollector = (body: any)              => api.post('/collectors/register', body).then(r => r.data.data);
export const getCollectorById  = (id: string)             => api.get(`/collectors/${id}`).then(r => r.data.data);
export const updateCollector   = (id: string, body: any)  => api.patch(`/collectors/${id}`, body).then(r => r.data.data);
export const deleteCollector   = (id: string)             => api.delete(`/collectors/${id}`).then(r => r.data.data);