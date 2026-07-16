// NOTE: useSystemDefaultProcesses / useManufacturingProcessById / useManufacturingProcessesByUser
// are RECONSTRUCTED to match the useProducts.ts/useWastes.ts convention (base file content
// wasn't in the pasted context, only its usage in screens/mfg_process/*.tsx). Merge with your
// real file if names differ. useManufacturingProcessStats / useFilteredManufacturingProcesses
// are the doc's literal required additions (§2).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createManufacturingProcess,
  deleteManufacturingProcess,
  getFilteredManufacturingProcesses,
  getManufacturingProcessById,
  getManufacturingProcessesByUser,
  getManufacturingProcessStats,
  getSystemDefaultProcesses
} from '../services/manufacturingProcesses';

export const useSystemDefaultProcesses = (options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', 'defaults'], queryFn: getSystemDefaultProcesses, ...options });

// Alias — your waste-upload form (app/screens/forms/waste.tsx) imports this exact name
// for its manufacturing-process picker. I didn't have that file in context when I
// reconstructed this hook file, so the name got dropped; same query, same data, just
// restoring the name your existing screen actually calls.
export const useManufacturingProcesses = useSystemDefaultProcesses;

export const useManufacturingProcessById = (id: string, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', id], queryFn: () => getManufacturingProcessById(id), enabled: !!id, ...options });

export const useManufacturingProcessesByUser = (userId: string, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', 'user', userId], queryFn: () => getManufacturingProcessesByUser(userId), enabled: !!userId, ...options });

export const useCreateManufacturingProcess = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createManufacturingProcess, onSuccess: () => qc.invalidateQueries({ queryKey: ['manufacturing-processes'] }) });
};

export const useDeleteManufacturingProcess = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteManufacturingProcess(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['manufacturing-processes'] }) });
};

// §2 additions
export const useManufacturingProcessStats = (id: string, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', id, 'stats'], queryFn: () => getManufacturingProcessStats(id), enabled: !!id, ...options });

export const useFilteredManufacturingProcesses = (params: Record<string, string>, options = {}) =>
  useQuery({ queryKey: ['manufacturing-processes', 'search', params], queryFn: () => getFilteredManufacturingProcesses(params), ...options });