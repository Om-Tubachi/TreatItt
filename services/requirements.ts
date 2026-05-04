import { api } from '../lib/api';

export const getAllRequirements = () => api.get('/requirements').then(r => r.data.data);
export const getRequirementById = (id: string) => api.get(`/requirements/${id}`).then(r => r.data.data);
export const getRequirementsByUser = (userId: string) => api.get(`/requirements/user/${userId}`).then(r => r.data.data);
export const getRequirementsByFrp = (frpId: string) => api.get(`/requirements/frp/${frpId}`).then(r => r.data.data);
export const getFilteredRequirements = (params: Record<string, string>) => api.get('/requirements', { params }).then(r => r.data.data);
export const createRequirement = (body: any) => api.post('/requirements', body).then(r => r.data.data);
export const updateRequirement = (id: string, body: any) => api.patch(`/requirements/${id}`, body).then(r => r.data.data);
export const deleteRequirement = (id: string) => api.delete(`/requirements/${id}`).then(r => r.data.data);