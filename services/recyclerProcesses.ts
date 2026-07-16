// Matches the real backend routes in recycleProcess.routes.js — base path is
// /recycle-processes (mounted in routes/index.js). getRecyclerProcessById is an
// alias of getRecycleProcessById: your two hook files use both names for the same
// endpoint, so both need to resolve rather than picking one and breaking the other.
import { api } from '../lib/api';

export const getAllRecyclerProcesses = () =>
  api.get('/recycle-processes').then(r => r.data.data);

export const getRecycleProcessById = (id: string) =>
  api.get(`/recycle-processes/${id}`).then(r => r.data.data);

export const getRecyclerProcessById = getRecycleProcessById;

export const getRecycleProcessesByRecycler = (recyclerId: string) =>
  api.get(`/recycle-processes/recycler/${recyclerId}`).then(r => r.data.data);

export const createRecyclerProcess = (body: {
  treatmentId: string;
  capacityKg: number;
  schedules?: any;
  date?: string;
  charges?: number;
}) => api.post('/recycle-processes', body).then(r => r.data.data);

export const updateRecyclerProcess = (id: string, body: any) =>
  api.patch(`/recycle-processes/${id}`, body).then(r => r.data.data);

export const deleteRecyclerProcess = (id: string) =>
  api.delete(`/recycle-processes/${id}`).then(r => r.data.data);