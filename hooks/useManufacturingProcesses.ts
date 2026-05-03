import { useQuery } from '@tanstack/react-query';
import { getAllManufacturingProcesses } from '../services/manufacturingProcesses';

export const useManufacturingProcesses = () =>
  useQuery({
    queryKey: ['manufacturing-processes'],
    queryFn: getAllManufacturingProcesses,
    staleTime: Infinity,
    gcTime: Infinity,
  });