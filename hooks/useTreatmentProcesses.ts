import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTreatmentProcess, deleteTreatmentProcess, getAllTreatmentProcesses, getTreatmentProcessesByRecycler } from '../services/treatmentProcesses';

export const useAllTreatmentProcesses = (options = {}) =>
    useQuery({ queryKey: ['treatment-processes'], queryFn: getAllTreatmentProcesses, ...options });

export const useTreatmentProcessesByRecycler = (recyclerId: string, options = {}) =>
    useQuery({ queryKey: ['treatment-processes', 'recycler', recyclerId], queryFn: () => getTreatmentProcessesByRecycler(recyclerId), ...options });

export const useCreateTreatmentProcess = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: createTreatmentProcess, onSuccess: () => qc.invalidateQueries({ queryKey: ['treatment-processes'] }) });
};

export const useDeleteTreatmentProcess = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: (id: string) => deleteTreatmentProcess(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['treatment-processes'] }) });
};
