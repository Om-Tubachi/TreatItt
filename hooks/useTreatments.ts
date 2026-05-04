import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTreatment, deleteTreatment, getAllTreatments,
    getFilteredTreatments, getTreatmentById, getTreatmentsByRecycler,
} from '../services/treatments';

export const useAllTreatments = (options = {}) =>
    useQuery({ queryKey: ['treatments'], queryFn: getAllTreatments, ...options });

export const useTreatmentById = (id: string, options = {}) =>
    useQuery({ queryKey: ['treatments', id], queryFn: () => getTreatmentById(id), ...options });

export const useTreatmentsByRecycler = (recyclerId: string, options = {}) =>
    useQuery({ queryKey: ['treatments', 'recycler', recyclerId], queryFn: () => getTreatmentsByRecycler(recyclerId), ...options });

export const useFilteredTreatments = (params: Record<string, string>, options = {}) =>
    useQuery({ queryKey: ['treatments', 'filtered', params], queryFn: () => getFilteredTreatments(params), ...options });

export const useCreateTreatment = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: createTreatment, onSuccess: () => qc.invalidateQueries({ queryKey: ['treatments'] }) });
};

export const useDeleteTreatment = () => {
    const qc = useQueryClient();
    return useMutation({ mutationFn: (id: string) => deleteTreatment(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['treatments'] }) });
};