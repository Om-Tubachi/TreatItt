import { api } from '../lib/api';

export const getAllProducts = () => api.get('/products').then(r => r.data.data);
export const getProductById = (id: string) => api.get(`/products/${id}`).then(r => r.data.data);
export const getProductsByUser = (userId: string) => api.get(`/products/user/${userId}`).then(r => r.data.data);
export const getProductsByFrp = (frpId: string) => api.get(`/products/frp/${frpId}`).then(r => r.data.data);
export const getFilteredProducts = (params: Record<string, string>) => api.get('/products', { params }).then(r => r.data.data);
export const createProduct = (body: any) => api.post('/products', body).then(r => r.data.data);
export const updateProduct = (id: string, body: any) => api.patch(`/products/${id}`, body).then(r => r.data.data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`).then(r => r.data.data);