import { api } from '../lib/api';

export const getAllManufacturingProcesses = () =>
  api.get('/api/v1/manufacturing-processes').then(r => r.data.data);