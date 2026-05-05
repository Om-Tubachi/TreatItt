import { useQuery } from '@tanstack/react-query';
import { getAllIndustries } from '../services/industries';

export const useIndustries = () =>
    useQuery({
        queryKey: ['industries'],
        queryFn: getAllIndustries,
        staleTime: Infinity,
        gcTime: Infinity,
    });