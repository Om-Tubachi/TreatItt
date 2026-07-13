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