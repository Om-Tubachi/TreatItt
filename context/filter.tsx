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
  setLayer2: (field: Layer2Field, ids: string[]) => void;
  setMetric: (key: string, value: MetricFilter | undefined) => void;
  setRecency: (recency: FilterState['recency']) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType>({
  filters: DEFAULT_FILTERS,
  setEntityTypes: () => {},
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
    // switching layer 1 invalidates layer 2/3 selections that may no longer apply
    setFilters((f) => ({
      ...f,
      entityTypes: types,
      categoryId: [],
      compositionId: [],
      gradeId: [],
      resinId: [],
      formTemplateId: [],
      metrics: {},
      page: 1,
    }));
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
    () => ({ filters, setEntityTypes, setLayer2, setMetric, setRecency, resetFilters, activeFilterCount }),
    [filters, setEntityTypes, setLayer2, setMetric, setRecency, resetFilters, activeFilterCount]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};