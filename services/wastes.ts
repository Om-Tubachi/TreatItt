import { api } from '../lib/api';

export const uploadWaste = (body: any) => api.post('api/v1/wastes', body).then(r => r.data.data);
export const getWasteById = (id: string) => api.get(`api/v1/wastes/${id}`).then(r => r.data.data);
export const updateWaste = (id: string, body: any) => api.patch(`api/v1/wastes/${id}`, body).then(r => r.data.data);
export const deleteWaste = (id: string) => api.delete(`api/v1/wastes/${id}`).then(r => r.data.data);