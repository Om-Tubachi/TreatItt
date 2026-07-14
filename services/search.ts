import { FilterState } from '../context/filter';
import { api } from '../lib/api';

export interface SearchPin {
  entityType: string;
  entityId: string;
  latitude: number | null;
  longitude: number | null;
}

export interface SearchResponse {
  results: any[];
  pins: SearchPin[];
  page: number;
  pageSize: number;
  total: number;
}

export const postSearch = (filters: FilterState): Promise<SearchResponse> =>
  api.post('/search', filters).then((r) => r.data.data);

export const postFacetOptions = (filters: Partial<FilterState>) =>
  api.post('/search/facets', filters).then((r) => r.data.data);

export interface MapPin {
  kind: 'actor' | 'entity';
  latitude: number;
  longitude: number;
  // actor-mode fields
  userId?: string;
  username?: string;
  displayName?: string;
  company?: string;
  // entity-mode fields
  entityType?: string;
  entityId?: string;
}

// services/search.ts
export const postSearchPins = (
  filters: Omit<FilterState, 'near'> & { near?: { lat: number; lng: number; radiusKm: number } }
): Promise<{ pins: MapPin[] }> => api.post('/search/pins', filters).then((r) => r.data.data);