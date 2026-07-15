import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createManufacturingProcess, deleteManufacturingProcess, getManufacturingProcessById,
  getManufacturingProcessesByUser, getSystemDefaults, updateManufacturingProcess
} from '../services/manufacturingProcesses';

export const useSystemDefaultProcesses = (options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes'], queryFn: getSystemDefaults, ...options });

export const useManufacturingProcessById = (id: string, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', id], queryFn: () => getManufacturingProcessById(id), enabled: !!id, ...options });

export const useManufacturingProcessesByUser = (userId: string, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', 'user', userId], queryFn: () => getManufacturingProcessesByUser(userId), enabled: !!userId, ...options });

export const useCreateManufacturingProcess = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createManufacturingProcess, onSuccess: () => qc.invalidateQueries({ queryKey: ['manufacturing-processes'] }) });
};

export const useUpdateManufacturingProcess = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => updateManufacturingProcess(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['manufacturing-processes'] });
      qc.invalidateQueries({ queryKey: ['manufacturing-processes', id] });
    },
  });
};

export const useDeleteManufacturingProcess = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteManufacturingProcess(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['manufacturing-processes'] }) });
};