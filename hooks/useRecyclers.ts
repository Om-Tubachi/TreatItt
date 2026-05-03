import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRecycler, getRecyclerById, registerRecycler, updateRecycler } from '../services/recyclers';

export const useRecyclerById = (id: string, options = {}) =>
  useQuery({ queryKey: ['recyclers', id], queryFn: () => getRecyclerById(id), ...options });

export const useRegisterRecycler = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: registerRecycler, onSuccess: () => qc.invalidateQueries({ queryKey: ['recyclers'] }) });
};

export const useUpdateRecycler = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateRecycler(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['recyclers'] });
      qc.invalidateQueries({ queryKey: ['recyclers', id] });
    },
  });
};

export const useDeleteRecycler = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteRecycler(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['recyclers'] }) });
};