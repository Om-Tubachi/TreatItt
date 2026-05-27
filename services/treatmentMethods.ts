import { api } from '../lib/api';
export const getAllTreatmentMethods = () => api.get('/treatment-methods').then(r => r.data.data);