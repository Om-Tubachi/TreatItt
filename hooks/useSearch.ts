import { useQuery } from '@tanstack/react-query';
import { FilterState } from '../context/filter';
import { postFacetOptions, postSearch } from '../services/search';

export const useSearch = (filters: FilterState, options = {}) =>
  useQuery({
    queryKey: ['search', filters],
    queryFn: () => postSearch(filters),
    enabled: filters.entityTypes.length > 0,
    ...options,
  });

export const useFacetOptions = (filters: Partial<FilterState>, options = {}) =>
  useQuery({
    queryKey: ['search', 'facets', filters],
    queryFn: () => postFacetOptions(filters),
    ...options,
  });