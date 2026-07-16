import { api } from '../lib/api';
export const getAllTreatmentMethods = () => api.get('/treatment-methods').then(r => r.data.data);
export const getTreatmentMethodAggregates = () =>
  api.get('/treatment-methods/aggregates').then(r => r.data.data);
