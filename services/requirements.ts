import { api } from '../lib/api';

export const createRequirement = (body: any) => api.post('/requirements', body).then(r => r.data.data);
export const getRequirementById = (id: string) => api.get(`/requirements/${id}`).then(r => r.data.data);
export const updateRequirement = (id: string, body: any) => api.patch(`/requirements/${id}`, body).then(r => r.data.data);
export const deleteRequirement = (id: string) => api.delete(`/requirements/${id}`).then(r => r.data.data);