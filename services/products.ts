import { api } from '../lib/api';

export const createProduct = (body: any) => api.post('/products', body).then(r => r.data.data);
export const getProductById = (id: string) => api.get(`/products/${id}`).then(r => r.data.data);
export const updateProduct = (id: string, body: any) => api.patch(`/products/${id}`, body).then(r => r.data.data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`).then(r => r.data.data);