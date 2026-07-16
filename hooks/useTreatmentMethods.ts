import { useQuery } from '@tanstack/react-query';
import { getAllTreatmentMethods, getTreatmentMethodAggregates } from '../services/treatmentMethods';

export const useAllTreatmentMethods = (options = {}) =>
  useQuery({ queryKey: ['treatment-methods'], queryFn: getAllTreatmentMethods, staleTime: Infinity, ...options });

// §2 addition
export const useTreatmentMethodAggregates = (options = {}) =>
  useQuery({ queryKey: ['treatment-methods', 'aggregates'], queryFn: getTreatmentMethodAggregates, ...options });
