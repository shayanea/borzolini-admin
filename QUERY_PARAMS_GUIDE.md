# Query Parameters Guide

How filtering and sorting works across all API calls.

## Common Parameters

**Pagination**:

- `page` - Page number (starts at 1)
- `limit` - Items per page

**Search and filters**:

- `search` - Text search
- `status` - Filter by status
- `type` - Filter by type

**Dates**:

- `date_from` / `startDate` - Start date
- `date_to` / `endDate` - End date
- `timeFrom` / `timeTo` - Time range (HH:mm)

**Sorting**:

- `sort_by` - Field to sort by
- `sort_order` - `asc` or `desc`

## Service Examples

### Appointments

```typescript
AppointmentsService.getAll({
  page: 1,
  limit: 20,
  status: 'confirmed',
  clinic_id: 'clinic-123',
  date_from: '2024-01-01',
  date_to: '2024-01-31',
  sort_by: 'scheduled_date',
  sort_order: 'desc',
});
```

### Users

```typescript
UsersService.getUsers({
  role: 'veterinarian',
  search: 'john',
  city: 'New York',
  isVerified: true,
  sortBy: 'firstName',
  sortOrder: 'asc',
});
```

### Calendar

```typescript
calendarService.getCalendarData('2024-01-15', {
  veterinarianIds: ['vet-1', 'vet-2'], // Arrays get joined with commas
  status: 'confirmed',
  timeFrom: '09:00',
  timeTo: '17:00',
});
```

## The buildQueryParams Utility

All services use `apiService.buildQueryParams()` to convert objects to query strings.

It automatically:

- Removes undefined/null values
- Joins arrays with commas
- Converts booleans to strings
- Converts all other types to strings

Example:

```typescript
const params = apiService.buildQueryParams({
  page: 1,
  status: 'active',
  tags: ['urgent', 'follow-up'], // becomes "urgent,follow-up"
  isVerified: true, // becomes "true"
  search: undefined, // excluded
});
```

## Using Constants

Import constants to avoid typos:

```typescript
import { QUERY_PARAMS, SORT_ORDERS } from '@/constants';

const params = {
  [QUERY_PARAMS.PAGE]: 1,
  [QUERY_PARAMS.SORT_BY]: 'createdAt',
  [QUERY_PARAMS.SORT_ORDER]: SORT_ORDERS.DESC,
};
```

## In Components

### Filter State

```typescript
const [filters, setFilters] = useState({
  page: 1,
  limit: 20,
  search: '',
  status: undefined,
});

const handleFilterChange = newFilters => {
  setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to page 1
};
```

### Table Integration

```typescript
const handleTableChange = (pagination, filters, sorter) => {
  onFiltersChange({
    page: pagination.current,
    limit: pagination.pageSize,
    status: filters.status?.[0],
    sort_by: sorter.field,
    sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
  });
};
```

## Common Mistakes

**Don't hardcode query strings**:

```typescript
// Bad
const url = `/appointments?status=confirmed&page=1`;

// Good
const params = { status: 'confirmed', page: 1 };
AppointmentsService.getAll(params);
```

**Don't forget to validate**:

```typescript
// Check limits
if (filters.limit > 100) filters.limit = 100;
if (filters.page < 1) filters.page = 1;
```
