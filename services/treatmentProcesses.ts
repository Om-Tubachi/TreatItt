import { api } from '../lib/api';
export const getAllTreatmentProcesses = () => api.get('/treatment-processes').then(r => r.data.data);
export const getTreatmentProcessById = (id: string) => api.get(`/treatment-processes/${id}`).then(r => r.data.data);
export const getTreatmentProcessesByRecycler = (recyclerId: string) => api.get(`/treatment-processes/recycler/${recyclerId}`).then(r => r.data.data);
export const createTreatmentProcess = (body: any) => api.post('/treatment-processes', body).then(r => r.data.data);
export const updateTreatmentProcess = (id: string, body: any) => api.patch(`/treatment-processes/${id}`, body).then(r => r.data.data);
export const deleteTreatmentProcess = (id: string) => api.delete(`/treatment-processes/${id}`).then(r => r.data.data);