import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRequirement, deleteRequirement, getAllRequirements,
  getFilteredRequirements, getRequirementById, getRequirementsByUser, updateRequirement
} from '../services/requirements';

export const useAllRequirements = (options = {}) =>
  useQuery({ queryKey: ['requirements'], queryFn: getAllRequirements, ...options });

export const useRequirementById = (id: string, options = {}) =>
  useQuery({ queryKey: ['requirements', id], queryFn: () => getRequirementById(id), ...options });

export const useRequirementsByUser = (userId: string, options = {}) =>
  useQuery({ queryKey: ['requirements', 'user', userId], queryFn: () => getRequirementsByUser(userId), ...options });

export const useFilteredRequirements = (params: Record<string, string>, options = {}) =>
  useQuery({ queryKey: ['requirements', 'filtered', params], queryFn: () => getFilteredRequirements(params), ...options });

export const useCreateRequirement = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createRequirement, onSuccess: () => qc.invalidateQueries({ queryKey: ['requirements'] }) });
};

export const useDeleteRequirement = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteRequirement(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['requirements'] }) });
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