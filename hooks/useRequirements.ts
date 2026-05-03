import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRequirement, deleteRequirement, getRequirementById, updateRequirement } from '../services/requirements';

export const useRequirementById = (id: string, options = {}) =>
  useQuery({ queryKey: ['requirements', id], queryFn: () => getRequirementById(id), ...options });

export const useCreateRequirement = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createRequirement, onSuccess: () => qc.invalidateQueries({ queryKey: ['requirements'] }) });
};

export const useUpdateRequirement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateRequirement(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['requirements'] });
      qc.invalidateQueries({ queryKey: ['requirements', id] });
    },
  });
};

export const useDeleteRequirement = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteRequirement(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['requirements'] }) });
};