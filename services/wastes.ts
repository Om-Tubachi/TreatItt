import { api } from '../lib/api';

export const uploadWaste = (body: any) => api.post('/wastes', body).then(r => r.data.data);
export const getWasteById = (id: string) => api.get(`/wastes/${id}`).then(r => r.data.data);
export const updateWaste = (id: string, body: any) => api.patch(`/wastes/${id}`, body).then(r => r.data.data);
export const deleteWaste = (id: string) => api.delete(`/wastes/${id}`).then(r => r.data.data);
export const getWasteByUser = (id:string) => api.get(`/wastes/user/${id}`).then(res => res.data.data);
export const getAllWasteListings = () => api.get(`/wastes/`).then(res => res.data.data);