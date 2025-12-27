import { useFilterManagement } from '@/hooks/common/use-filter-management';
import type { CalendarFilters } from '@/types/calendar';
import { useCallback } from 'react';

export const useCalendarFilters = (selectedVeterinarians: string[]) => {
  const {
    filters,
    setFilters,
    setFilter,
    searchQuery,
    handleSearch: onSearch,
  } = useFilterManagement<CalendarFilters>({
    initialFilters: {
      veterinarianIds: [],
      includeCancelled: false,
      search: '',
      priority: undefined,
      appointmentType: undefined,
      status: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      isTelemedicine: undefined,
      isHomeVisit: undefined,
      sortBy: 'startTime',
      sortOrder: 'ASC',
      page: 1,
      limit: 100,
    },
    resetToPage1: () => setFilter('page', 1),
  });

  // Enhanced filter handling
  const handleFiltersChange = useCallback(
    (newFilters: Partial<CalendarFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleSearch = useCallback(
    (searchText: string) => {
      onSearch(searchText);
    },
    [onSearch]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      veterinarianIds: selectedVeterinarians,
      includeCancelled: false,
      search: '',
      priority: undefined,
      appointmentType: undefined,
      status: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      isTelemedicine: undefined,
      isHomeVisit: undefined,
      sortBy: 'startTime',
      sortOrder: 'ASC',
      page: 1,
      limit: 100,
    });
  }, [selectedVeterinarians, setFilters]);

  // Merge filters with debounced search query
  const activeFilters = {
    ...filters,
    search: searchQuery,
  };

  return {
    filters: activeFilters,
    handleFiltersChange,
    handleSearch,
    clearFilters,
  };
};
