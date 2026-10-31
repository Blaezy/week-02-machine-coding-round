import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_FILTERS } from '../constants/index.js';
import { filterTasks, hasActiveFilters } from '../utils/filters.js';

export function useTaskFilters(tasks) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const setFilter = useCallback((patch) => setFilters((current) => ({ ...current, ...patch })), []);
  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    filteredTasks,
    isFiltering: hasActiveFilters(filters),
  };
}
