import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCollector, getCollectorById, registerCollector, updateCollector } from '../services/collectors';

export const useCollectorById = (id: string, options = {}) =>
  useQuery({ queryKey: ['collectors', id], queryFn: () => getCollectorById(id), ...options });

export const useRegisterCollector = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: registerCollector, onSuccess: () => qc.invalidateQueries({ queryKey: ['collectors'] }) });
};

export const useUpdateCollector = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateCollector(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['collectors'] });
      qc.invalidateQueries({ queryKey: ['collectors', id] });
    },
  });
};

export const useDeleteCollector = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteCollector(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['collectors'] }) });
};