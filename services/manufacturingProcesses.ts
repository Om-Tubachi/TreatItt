import { api } from '../lib/api';

export const getAllManufacturingProcesses = () =>
  api.get('/manufacturing-processes').then(r => r.data.data);