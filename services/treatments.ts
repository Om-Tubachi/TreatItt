import { api } from '../lib/api';

export const getAllTreatments = () => api.get('/treatments').then(r => r.data.data);
export const getTreatmentById = (id: string) => api.get(`/treatments/${id}`).then(r => r.data.data);
export const getTreatmentsByRecycler = (recyclerId: string) => api.get(`/treatments/recycler/${recyclerId}`).then(r => r.data.data);
export const getFilteredTreatments = (params: Record<string, string>) => api.get('/treatments', { params }).then(r => r.data.data);
export const createTreatment = (body: any) => api.post('/treatments', body).then(r => r.data.data);
export const updateTreatment = (id: string, body: any) => api.patch(`/treatments/${id}`, body).then(r => r.data.data);
export const deleteTreatment = (id: string) => api.delete(`/treatments/${id}`).then(r => r.data.data);