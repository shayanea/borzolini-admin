import { useCallback, useState } from 'react';

/**
 * Generic filter value type
 */
export type FilterValue = string | number | boolean | null | undefined | [string, string];

/**
 * Filter state type - key-value pairs of filter name to filter value
 */
export type FilterState = Record<string, FilterValue>;

/**
 * Filter management hook return type
 */
export interface UseFilterManagementReturn<T extends FilterState = FilterState> {
  // Filter state
  filters: T;
  
  // Filter actions
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (newFilters: Partial<T>) => void;
  clearFilter: (key: keyof T) => void;
  clearAllFilters: () => void;
  resetFilters: () => void;
  
  // Search state
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (value: string) => void;
  
  // Utilities
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

/**
 * Configuration options for filter management
 */
export interface FilterManagementConfig<T extends FilterState> {
  initialFilters?: Partial<T>;
  onFilterChange?: (filters: T) => void;
  resetToPage1?: () => void; // Callback to reset pagination when filters change
}

/**
 * Reusable hook for managing filter state
 * 
 * @param config - Configuration options
 * @returns Filter management state and handlers
 * 
 * @example
 * ```tsx
 * interface MyFilters {
 *   status: string | null;
 *   city: string | null;
 *   dateRange: [string, string] | null;
 * }
 * 
 * const filterManager = useFilterManagement<MyFilters>({
 *   initialFilters: { status: null, city: null, dateRange: null },
 *   resetToPage1: () => setCurrentPage(1),
 * });
 * 
 * // Use in component
 * <Select
 *   value={filterManager.filters.status}
 *   onChange={(value) => filterManager.setFilter('status', value)}
 * />
 * ```
 */
export function useFilterManagement<T extends FilterState = FilterState>(
  config: FilterManagementConfig<T> = {}
): UseFilterManagementReturn<T> {
  const { initialFilters = {} as T, onFilterChange, resetToPage1 } = config;

  // Filter state
  const [filters, setFiltersState] = useState<T>(initialFilters as T);
  
  // Search text state
  const [searchText, setSearchTextState] = useState('');

  /**
   * Set a single filter value
   */
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const newFilters = { ...filters, [key]: value };
      setFiltersState(newFilters);
      
      // Reset to page 1 when filter changes
      if (resetToPage1) {
        resetToPage1();
      }
      
      // Trigger onChange callback
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [filters, onFilterChange, resetToPage1]
  );

  /**
   * Set multiple filters at once
   */
  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFiltersState(updatedFilters);
      
      // Reset to page 1 when filters change
      if (resetToPage1) {
        resetToPage1();
      }
      
      // Trigger onChange callback
      if (onFilterChange) {
        onFilterChange(updatedFilters);
      }
    },
    [filters, onFilterChange, resetToPage1]
  );

  /**
   * Clear a specific filter
   */
  const clearFilter = useCallback(
    (key: keyof T) => {
      const newFilters = { ...filters };
      newFilters[key] = null as T[keyof T];
      setFiltersState(newFilters);
      
      // Reset to page 1 when filter is cleared
      if (resetToPage1) {
        resetToPage1();
      }
      
      // Trigger onChange callback
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [filters, onFilterChange, resetToPage1]
  );

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as T
    );
    setFiltersState(clearedFilters);
    setSearchTextState('');
    
    // Reset to page 1 when clearing filters
    if (resetToPage1) {
      resetToPage1();
    }
    
    // Trigger onChange callback
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  }, [filters, onFilterChange, resetToPage1]);

  /**
   * Reset filters to initial state
   */
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters as T);
    setSearchTextState('');
    
    // Reset to page 1 when resetting filters
    if (resetToPage1) {
      resetToPage1();
    }
    
    // Trigger onChange callback
    if (onFilterChange) {
      onFilterChange(initialFilters as T);
    }
  }, [initialFilters, onFilterChange, resetToPage1]);

  /**
   * Set search text
   */
  const setSearchText = useCallback(
    (text: string) => {
      setSearchTextState(text);
      
      // Reset to page 1 when search changes
      if (resetToPage1) {
        resetToPage1();
      }
    },
    [resetToPage1]
  );

  /**
   * Handle search input (convenience wrapper)
   */
  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
    },
    [setSearchText]
  );

  /**
   * Check if any filters are active (non-null/non-empty)
   */
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== undefined && value !== ''
  ) || searchText !== '';

  /**
   * Count of active filters
   */
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== null && value !== undefined && value !== ''
  ).length + (searchText ? 1 : 0);

  return {
    // Filter state
    filters,
    
    // Filter actions
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    
    // Search state
    searchText,
    setSearchText,
    handleSearch,
    
    // Utilities
    hasActiveFilters,
    activeFilterCount,
  };
}
