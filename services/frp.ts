import { api } from '../lib/api';

export const getAllFrp = () =>
  api.get('api/v1/frp').then(r => {
    console.log(r.data.data);
    return r.data.data
    
  });