import { api } from '../lib/api';

export const getSystemDefaults = () => api.get('/manufacturing-processes').then(r => r.data.data);
export const getManufacturingProcessById = (id: string) => api.get(`/manufacturing-processes/${id}`).then(r => r.data.data);
export const getManufacturingProcessesByUser = (userId: string) => api.get(`/manufacturing-processes/user/${userId}`).then(r => r.data.data);
export const createManufacturingProcess = (body: any) => api.post('/manufacturing-processes', body).then(r => r.data.data);
export const updateManufacturingProcess = (id: string, body: any) => api.patch(`/manufacturing-processes/${id}`, body).then(r => r.data.data);
export const deleteManufacturingProcess = (id: string) => api.delete(`/manufacturing-processes/${id}`).then(r => r.data.data);