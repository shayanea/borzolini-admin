import type { CalendarFilters } from '@/types/calendar';
import { useCallback, useState } from 'react';

export const useCalendarFilters = (selectedVeterinarians: string[]) => {
  // Enhanced filtering state
  const [filters, setFilters] = useState<CalendarFilters>({
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
  });

  // Enhanced filter handling
  const handleFiltersChange = useCallback((newFilters: Partial<CalendarFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  const handleSearch = useCallback((searchText: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchText,
      page: 1, // Reset to first page when search changes
    }));
  }, []);

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
  }, [selectedVeterinarians]);

  return {
    filters,
    handleFiltersChange,
    handleSearch,
    clearFilters,
  };
};
