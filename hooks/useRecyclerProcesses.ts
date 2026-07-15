import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRecyclerProcess, deleteRecyclerProcess, getAllRecyclerProcesses, getRecycleProcessesByRecycler, getRecyclerProcessById, updateRecyclerProcess } from '../services/recyclerProcesses';

export const useAllRecyclerProcesses = (options = {}) =>
    useQuery({ queryKey: ['recycler-processes'], queryFn: getAllRecyclerProcesses, ...options });

export const useCreateRecyclerProcess = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: createRecyclerProcess, onSuccess: () => qc.invalidateQueries({ queryKey: ['recycler-processes'] }) });
};

export const useUpdateRecyclerProcess = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: any }) => updateRecyclerProcess(id, body),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['recycler-processes'] }),
    });
};

export const useDeleteRecyclerProcess = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: (id: string) => deleteRecyclerProcess(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['recycler-processes'] }) });
};

export const useRecyclerProcessById = (id: string, options = {}) =>
    useQuery({ queryKey: ['recycler-processes', id], queryFn: () => getRecyclerProcessById(id), enabled: !!id, ...options });

export const useRecycleProcessesByRecycler = (recyclerId: string, options = {}) =>
    useQuery({ queryKey: ['recycler-processes', 'recycler', recyclerId], queryFn: () => getRecycleProcessesByRecycler(recyclerId), enabled: !!recyclerId, ...options })