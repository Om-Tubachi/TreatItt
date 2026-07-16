// NOTE: base CRUD functions below (getSystemDefaultProcesses, getManufacturingProcessById,
// getManufacturingProcessesByUser, create/update/delete) are RECONSTRUCTED to match the
// convention used in services/products.ts / services/wastes.ts (not present in the pasted
// context). If your real file already has these with different names, merge accordingly —
// only getManufacturingProcessStats and getFilteredManufacturingProcesses are the doc's
// literal required additions (§2).
import { api } from '../lib/api';

export const getSystemDefaultProcesses = () =>
  api.get('/manufacturing-processes').then(r => r.data.data);

export const getManufacturingProcessById = (id: string) =>
  api.get(`/manufacturing-processes/${id}`).then(r => r.data.data);

export const getManufacturingProcessesByUser = (userId: string) =>
  api.get(`/manufacturing-processes/user/${userId}`).then(r => r.data.data);

export const createManufacturingProcess = (body: any) =>
  api.post('/manufacturing-processes', body).then(r => r.data.data);

export const updateManufacturingProcess = (id: string, body: any) =>
  api.patch(`/manufacturing-processes/${id}`, body).then(r => r.data.data);

export const deleteManufacturingProcess = (id: string) =>
  api.delete(`/manufacturing-processes/${id}`).then(r => r.data.data);

// §2 additions
export const getManufacturingProcessStats = (id: string) =>
  api.get(`/manufacturing-processes/${id}/stats`).then(r => r.data.data);

export const getFilteredManufacturingProcesses = (params: Record<string, string>) =>
  api.get('/manufacturing-processes/search', { params }).then(r => r.data.data);
