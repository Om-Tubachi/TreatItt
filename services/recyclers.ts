import { api } from '../lib/api';

export const registerRecycler = (body: any)              => api.post('/recyclers/register', body).then(r => r.data.data);
export const getRecyclerById  = (id: string)             => api.get(`/recyclers/${id}`).then(r => r.data.data);
export const updateRecycler   = (id: string, body: any)  => api.patch(`/recyclers/${id}`, body).then(r => r.data.data);
export const deleteRecycler   = (id: string)             => api.delete(`/recyclers/${id}`).then(r => r.data.data);