import { api } from '../lib/api';
export const getAllRecyclerProcesses = () => api.get('/recycle-processes').then(r => r.data.data);
export const getRecyclerProcessById = (id: string) => api.get(`/recycle-processes/${id}`).then(r => r.data.data);
export const createRecyclerProcess = (body: any) => api.post('/recycle-processes', body).then(r => r.data.data);
export const updateRecyclerProcess = (id: string, body: any) => api.patch(`/recycle-processes/${id}`, body).then(r => r.data.data);
export const deleteRecyclerProcess = (id: string) => api.delete(`/recycle-processes/${id}`).then(r => r.data.data);