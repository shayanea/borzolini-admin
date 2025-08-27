# Query Parameters Guide for Clinic Admin System

This guide explains how to use the updated query parameters for filtering and sorting across all services in the clinic administration system.

## Overview

The system now provides a consistent approach to handling query parameters for filtering, sorting, and pagination across all services. This ensures:

- **Consistency**: All services use the same parameter naming conventions
- **Maintainability**: Centralized parameter handling logic
- **Flexibility**: Support for various filter types and combinations
- **Type Safety**: Full TypeScript support for all parameters

## Common Query Parameters

### Pagination Parameters

- `page`: Page number (starts from 1)
- `limit`: Number of items per page

### Search and Basic Filters

- `search`: Text search across relevant fields
- `status`: Filter by status (appointments, users, etc.)
- `type`: Filter by type (appointment type, user role, etc.)
- `priority`: Filter by priority level

### Date Filters

- `date_from` / `startDate`: Start date for date ranges
- `date_to` / `endDate`: End date for date ranges
- `timeFrom`: Start time (HH:mm format)
- `timeTo`: End time (HH:mm format)

### Location and ID Filters

- `clinic_id`: Filter by clinic
- `staff_id`: Filter by staff member
- `pet_id`: Filter by pet
- `owner_id`: Filter by owner
- `veterinarianId`: Filter by veterinarian
- `city`: Filter by city
- `country`: Filter by country

### Boolean Filters

- `is_telemedicine`: Filter telemedicine appointments
- `is_home_visit`: Filter home visit appointments
- `isVerified`: Filter verified users
- `includeCancelled`: Include cancelled appointments

### Cost and Duration Filters

- `cost_min` / `cost_max`: Cost range filters
- `duration_min` / `duration_max`: Duration range filters

### Sorting Parameters

- `sort_by`: Field to sort by
- `sort_order`: Sort direction (`asc` or `desc`)

### Array Filters (Comma-separated)

- `veterinarianIds`: Multiple veterinarian IDs
- `petTypes`: Multiple pet types

## Service-Specific Implementations

### Appointments Service

```typescript
import { AppointmentsService } from '@/services/appointments.service';

// Basic filtering
const appointments = await AppointmentsService.getAll({
  page: 1,
  limit: 20,
  status: 'confirmed',
  type: 'consultation',
  priority: 'high',
  clinic_id: 'clinic-123',
  date_from: '2024-01-01',
  date_to: '2024-01-31',
  search: 'emergency',
  sort_by: 'scheduled_date',
  sort_order: 'desc',
});

// Advanced filtering with cost and duration
const expensiveAppointments = await AppointmentsService.getAll({
  cost_min: 100,
  cost_max: 500,
  duration_min: 30,
  duration_max: 120,
  is_telemedicine: true,
});
```

### Users Service

```typescript
import { UsersService } from '@/services/users.service';

// Basic user filtering
const users = await UsersService.getUsers({
  page: 1,
  limit: 50,
  role: 'veterinarian',
  status: 'active',
  search: 'john',
  sortBy: 'firstName',
  sortOrder: 'asc',
});

// Advanced user filtering
const verifiedUsers = await UsersService.getUsers({
  isVerified: true,
  city: 'New York',
  country: 'USA',
  lastLoginFrom: '2024-01-01',
  lastLoginTo: '2024-01-31',
});
```

### Calendar Service

```typescript
import { CalendarService } from '@/services/calendar.service';

// Calendar data with filters
const calendarData = await calendarService.getCalendarData('2024-01-15', {
  veterinarianIds: ['vet-1', 'vet-2'],
  petTypes: ['dog', 'cat'],
  status: 'confirmed',
  priority: 'high',
  appointmentType: 'consultation',
  search: 'emergency',
  timeFrom: '09:00',
  timeTo: '17:00',
  isTelemedicine: false,
  isHomeVisit: true,
  page: 1,
  limit: 100,
  sortBy: 'startTime',
  sortOrder: 'asc',
});
```

## Using the buildQueryParams Utility

All services now use the centralized `buildQueryParams` utility function for consistent parameter handling:

```typescript
import { apiService } from '@/services/api';

// The utility automatically handles:
// - Undefined/null values (excluded)
// - Array values (joined with commas)
// - Boolean values (converted to strings)
// - All other types (converted to strings)

const params = apiService.buildQueryParams({
  page: 1,
  limit: 20,
  status: 'active',
  tags: ['urgent', 'follow-up'], // Will become "urgent,follow-up"
  isVerified: true, // Will become "true"
  search: 'john',
});

const queryString = params.toString();
// Result: "page=1&limit=20&status=active&tags=urgent,follow-up&isVerified=true&search=john"
```

## Constants for Consistency

Use the predefined constants for parameter names to ensure consistency:

```typescript
import { QUERY_PARAMS, SORT_ORDERS, SORT_FIELDS } from '@/constants';

// Instead of hardcoding strings
const params = {
  [QUERY_PARAMS.PAGE]: 1,
  [QUERY_PARAMS.LIMIT]: 20,
  [QUERY_PARAMS.STATUS]: 'active',
  [QUERY_PARAMS.SORT_BY]: SORT_FIELDS.CREATED_AT,
  [QUERY_PARAMS.SORT_ORDER]: SORT_ORDERS.DESC,
};
```

## Best Practices

### 1. Always Use TypeScript Interfaces

```typescript
interface MyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

### 2. Handle Date Ranges Consistently

```typescript
// Support both individual dates and date ranges
interface DateFilters {
  date_from?: string;
  date_to?: string;
  dateRange?: [string, string]; // For UI compatibility
}
```

### 3. Use Meaningful Default Values

```typescript
const defaultFilters: AppointmentsFilters = {
  page: 1,
  limit: 20,
  sort_by: 'scheduled_date',
  sort_order: 'desc',
};
```

### 4. Validate Parameters Before Sending

```typescript
const validateFilters = (filters: AppointmentsFilters): boolean => {
  if (filters.page && filters.page < 1) return false;
  if (filters.limit && (filters.limit < 1 || filters.limit > 100)) return false;
  if (filters.sort_order && !['asc', 'desc'].includes(filters.sort_order)) return false;
  return true;
};
```

## Error Handling

The system automatically handles common parameter errors:

- **Invalid values**: Automatically excluded from query
- **Type mismatches**: Converted to appropriate string format
- **Empty arrays**: Excluded from query
- **Undefined/null**: Automatically filtered out

## Migration Guide

If you're updating existing code:

1. **Replace manual parameter building** with `apiService.buildQueryParams()`
2. **Update parameter names** to use the new constants
3. **Add missing filter options** that are now supported
4. **Test all filter combinations** to ensure compatibility

## Examples in Components

### Filter Component

```typescript
const AppointmentsFilters = () => {
  const [filters, setFilters] = useState<AppointmentsFilters>({
    page: 1,
    limit: 20,
    status: undefined,
    type: undefined,
    priority: undefined,
    search: '',
    sort_by: 'scheduled_date',
    sort_order: 'desc',
  });

  const handleFilterChange = (newFilters: Partial<AppointmentsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to first page
    setFilters(updatedFilters);
    onFilters(updatedFilters);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    handleFilterChange({
      sort_by: field,
      sort_order: order,
    });
  };
};
```

### Table Component

```typescript
const AppointmentsTable = () => {
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newFilters: AppointmentsFilters = {
      page: pagination.current,
      limit: pagination.pageSize,
      status: filters.status?.[0],
      type: filters.type?.[0],
      priority: filters.priority?.[0],
      sort_by: sorter.field,
      sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
    };

    onFilters(newFilters);
  };
};
```

This updated system provides a robust, consistent, and maintainable approach to handling query parameters across all services in the clinic administration system.
