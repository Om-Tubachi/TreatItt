import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct, deleteProduct, getAllProducts,
  getFilteredProducts, getProductById, getProductsByUser, updateProduct
} from '../services/products';

export const useAllProducts = (options = {}) =>
  useQuery({ queryKey: ['products'], queryFn: getAllProducts, ...options });

export const useProductById = (id: string, options = {}) =>
  useQuery({ queryKey: ['products', id], queryFn: () => getProductById(id), ...options });

export const useProductsByUser = (userId: string, options = {}) =>
  useQuery({ queryKey: ['products', 'user', userId], queryFn: () => getProductsByUser(userId), ...options });

export const useFilteredProducts = (params: Record<string, string>, options = {}) =>
  useQuery({ queryKey: ['products', 'filtered', params], queryFn: () => getFilteredProducts(params), ...options });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteProduct(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateProduct(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['products', id] });
    },
  });
};