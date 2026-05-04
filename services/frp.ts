import { api } from '../lib/api';

export const getAllFrp = () =>
  api.get('/frp').then(r => {
    console.log(r.data.data);
    return r.data.data
    
  });