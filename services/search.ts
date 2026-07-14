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

export interface MapPin {
  kind: 'actor' | 'entity';
  latitude: number;
  longitude: number;
  userId?: string;
  username?: string;
  displayName?: string;
  company?: string;
  entityType?: string;
  entityId?: string;
}

export const postSearch = (filters: FilterState): Promise<SearchResponse> =>
  api.post('/search', filters).then((r) => r.data.data);

export const postFacetOptions = (filters: Partial<FilterState>) =>
  api.post('/search/facets', filters).then((r) => r.data.data);

export const postSearchPins = (
  filters: Omit<FilterState, 'near'> & { 
    mode: 'actor' | 'entity';
    near?: { lat: number; lng: number; radiusKm: number } 
  }
): Promise<{ pins: MapPin[] }> => 
  api.post('/search/pins', filters).then((r) => {
    console.log('filters are');
    
    console.log(filters);
    
    console.log('postSearchPins response:', r.data.data);
    return r.data.data;
  });