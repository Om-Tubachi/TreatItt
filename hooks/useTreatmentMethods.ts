import { useQuery } from '@tanstack/react-query';
import { getAllTreatmentMethods } from '../services/treatmentMethods';

export const useAllTreatmentMethods = (options = {}) =>
    useQuery({ queryKey: ['treatment-methods'], queryFn: getAllTreatmentMethods, staleTime: Infinity, ...options });