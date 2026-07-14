import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type EntityType = 'product' | 'waste' | 'requirement' | 'recycling';

export interface MetricFilter {
  min?: number;
  max?: number;
  eq?: string | number;
  in?: (string | number)[];
}

export interface FilterState {
  entityTypes: EntityType[];
  mode: 'entity' | 'actor'; // 'actor' = one pin per user (map ribbon), 'entity' = one per listing
  near: { radiusKm: number } | null; // lat/lng merged in at request time from device location
  categoryId: string[];
  compositionId: string[];
  gradeId: string[];
  resinId: string[];
  formTemplateId: string[];
  metrics: Record<string, MetricFilter>;
  recency: { sort: 'newest' | 'oldest'; withinHours?: number };
  page: number;
  pageSize: number;
}

const DEFAULT_FILTERS: FilterState = {
  entityTypes: ['product'],
  mode: 'entity',
  near: null,
  categoryId: [],
  compositionId: [],
  gradeId: [],
  resinId: [],
  formTemplateId: [],
  metrics: {},
  recency: { sort: 'newest' },
  page: 1,
  pageSize: 20,
};

type Layer2Field = 'categoryId' | 'compositionId' | 'gradeId' | 'resinId';

interface FilterContextType {
  filters: FilterState;
  setEntityTypes: (types: EntityType[]) => void;
  setActorTypes: (types: EntityType[]) => void;
  setNear: (near: FilterState['near']) => void;
  setLayer2: (field: Layer2Field, ids: string[]) => void;
  setMetric: (key: string, value: MetricFilter | undefined) => void;
  setRecency: (recency: FilterState['recency']) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType>({
  filters: DEFAULT_FILTERS,
  setEntityTypes: () => {},
  setActorTypes: () => {},
  setNear: () => {},
  setLayer2: () => {},
  setMetric: () => {},
  setRecency: () => {},
  resetFilters: () => {},
  activeFilterCount: 0,
});

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setEntityTypes = useCallback((types: EntityType[]) => {
    // Marketplace tabs — single-select, always entity mode (one pin/card per listing).
    // Always resets mode explicitly so a prior Map-screen actor-mode selection
    // doesn't bleed into Marketplace when the user navigates back.
    setFilters((f) => ({
      ...f,
      entityTypes: types,
      mode: 'entity',
      categoryId: [],
      compositionId: [],
      gradeId: [],
      resinId: [],
      formTemplateId: [],
      metrics: {},
      page: 1,
    }));
  }, []);

  const setActorTypes = useCallback((types: EntityType[]) => {
    // Map ribbon — multi-select. Empty selection falls back to normal entity search.
    setFilters((f) => ({
      ...f,
      entityTypes: types,
      mode: types.length ? 'actor' : 'entity',
      page: 1,
    }));
  }, []);

  const setNear = useCallback((near: FilterState['near']) => {
    setFilters((f) => ({ ...f, near, page: 1 }));
  }, []);

  const setLayer2 = useCallback((field: Layer2Field, ids: string[]) => {
    setFilters((f) => ({ ...f, [field]: ids, page: 1 }));
  }, []);

  const setMetric = useCallback((key: string, value: MetricFilter | undefined) => {
    setFilters((f) => {
      const metrics = { ...f.metrics };
      if (value === undefined) delete metrics[key];
      else metrics[key] = value;
      return { ...f, metrics, page: 1 };
    });
  }, []);

  const setRecency = useCallback((recency: FilterState['recency']) => {
    setFilters((f) => ({ ...f, recency, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters((f) => ({ ...DEFAULT_FILTERS, entityTypes: f.entityTypes }));
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categoryId.length +
      filters.compositionId.length +
      filters.gradeId.length +
      filters.resinId.length +
      Object.keys(filters.metrics).length +
      (filters.recency.withinHours ? 1 : 0)
    );
  }, [filters]);

  const value = useMemo(
    () => ({
      filters,
      setEntityTypes,
      setActorTypes,
      setNear,
      setLayer2,
      setMetric,
      setRecency,
      resetFilters,
      activeFilterCount,
    }),
    [filters, setEntityTypes, setActorTypes, setNear, setLayer2, setMetric, setRecency, resetFilters, activeFilterCount]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};