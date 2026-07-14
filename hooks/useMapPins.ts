import { useQuery } from '@tanstack/react-query';
import { FilterState } from '../context/filter';
import { postSearchPins } from '../services/search';

interface Coords {
  latitude: number;
  longitude: number;
}

export const useMapPins = (filters: FilterState, location: Coords | null, options = {}) => {
  // Compute location bounding window properties safely if proximity limits are set
  const near =
    filters.near?.radiusKm && location
      ? { lat: location.latitude, lng: location.longitude, radiusKm: filters.near.radiusKm }
      : undefined;

  return useQuery({
    queryKey: ['search', 'pins', filters, filters.mode, location?.latitude, location?.longitude],
    queryFn: () => postSearchPins({ ...filters, mode: filters.mode, near }),
    // Execution guard: Runs if an actor mode query is selected OR explicit entity items are specified
    enabled: filters.mode === 'actor' || (Array.isArray(filters.entityTypes) && filters.entityTypes.length > 0),
    ...options,
  });
};