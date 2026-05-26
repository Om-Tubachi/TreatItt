import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllRecyclerProcesses, getAllRecyclers, getFilteredRecyclers, getRecyclerById, registerRecycler, updateRecycler } from '../services/recyclers';

export const useAllRecyclers = (options = {}) =>
  useQuery({ queryKey: ['recyclers'], queryFn: getAllRecyclers, ...options });

export const useRecyclerById = (id: string, options = {}) =>
  useQuery({ queryKey: ['recyclers', id], queryFn: () => getRecyclerById(id), ...options });

export const useFilteredRecyclers = (params: Record<string, string>, options = {}) =>
  useQuery({ queryKey: ['recyclers', 'filtered', params], queryFn: () => getFilteredRecyclers(params), ...options });

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

export const useAllRecyclerProccesses = () => {
  return useQuery({
    queryKey: ['recycler-processes'],
    queryFn: getAllRecyclerProcesses
  });
}