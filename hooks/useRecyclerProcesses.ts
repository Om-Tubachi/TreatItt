import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRecyclerProcess, deleteRecyclerProcess, getAllRecyclerProcesses, updateRecyclerProcess } from '../services/recyclerProcesses';

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