import { api } from '../lib/api';

export const getAllRecyclers = () => api.get('/recyclers').then(r => r.data.data);
export const getRecyclerById = (id: string) => api.get(`/recyclers/${id}`).then(r => r.data.data);
export const getFilteredRecyclers = (params: Record<string, string>) => api.get('/recyclers', { params }).then(r => r.data.data);
export const registerRecycler = (body: any) => api.post('/recyclers/register', body).then(r => r.data.data);
export const updateRecycler = (id: string, body: any) => api.patch(`/recyclers/${id}`, body).then(r => r.data.data);
export const getAllRecyclerProcesses = () => api.get('/recycle-processes/').then(r => r.data.data);