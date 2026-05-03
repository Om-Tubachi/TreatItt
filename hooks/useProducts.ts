import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, getProductById, updateProduct } from '../services/products';

export const useProductById = (id: string, options = {}) =>
  useQuery({ queryKey: ['products', id], queryFn: () => getProductById(id), ...options });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
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

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteProduct(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};