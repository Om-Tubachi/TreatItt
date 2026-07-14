import { useQuery } from '@tanstack/react-query';
import { FilterState } from '../context/filter';
import { postSearchPins } from '../services/search';

interface Coords {
  latitude: number;
  longitude: number;
}

export const useMapPins = (filters: FilterState, location: Coords | null, options = {}) => {
  const near =
    filters.near?.radiusKm && location
      ? { lat: location.latitude, lng: location.longitude, radiusKm: filters.near.radiusKm }
      : undefined;

  return useQuery({
    queryKey: ['search', 'pins', filters, location?.latitude, location?.longitude],
    queryFn: () => postSearchPins({ ...filters, near }),
    enabled: filters.entityTypes.length > 0,
    ...options,
  });
};