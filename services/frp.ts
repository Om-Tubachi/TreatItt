import { api } from '../lib/api';

export const getAllFrp = () =>
  api.get('/frp').then(r => {
    return r.data.data
    
  });