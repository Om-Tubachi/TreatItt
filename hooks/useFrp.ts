import { useQuery } from '@tanstack/react-query';
import { getAllFrp } from '../services/frp';

export const useFrp = () =>
  useQuery({
    queryKey: ['frp'],
    queryFn: getAllFrp,
    staleTime: Infinity,
    gcTime: Infinity,
  });