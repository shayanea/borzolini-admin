# Cache Time Constants

This directory contains constants for React Query cache configuration, specifically for `staleTime` and `gcTime` values used throughout the application.

## Overview

The cache time constants provide a centralized way to manage React Query caching behavior, ensuring consistency across all hooks and services.

## Available Constants

### STALE_TIMES

Stale time determines how long data is considered "fresh" before React Query marks it as stale and potentially refetches it.

```typescript
import { STALE_TIMES } from '@/constants';

// Available values:
STALE_TIMES.VERY_SHORT; // 30 seconds
STALE_TIMES.SHORT; // 1 minute
STALE_TIMES.MEDIUM; // 2 minutes
STALE_TIMES.DEFAULT; // 5 minutes
STALE_TIMES.LONG; // 10 minutes
STALE_TIMES.VERY_LONG; // 30 minutes
```

### GC_TIMES

Garbage collection time determines how long inactive data stays in the cache before being removed.

```typescript
import { GC_TIMES } from '@/constants';

// Available values:
GC_TIMES.VERY_SHORT; // 2 minutes
GC_TIMES.SHORT; // 5 minutes
GC_TIMES.MEDIUM; // 10 minutes
GC_TIMES.DEFAULT; // 15 minutes
GC_TIMES.LONG; // 30 minutes
GC_TIMES.VERY_LONG; // 1 hour
```

### CACHE_PRESETS

Predefined combinations of stale time and GC time for common use cases.

```typescript
import { CACHE_PRESETS } from '@/constants';

// Available presets:
CACHE_PRESETS.REAL_TIME; // { staleTime: 30s, gcTime: 2m }
CACHE_PRESETS.LIVE; // { staleTime: 1m, gcTime: 5m }
CACHE_PRESETS.ACTIVE; // { staleTime: 2m, gcTime: 10m }
CACHE_PRESETS.STANDARD; // { staleTime: 5m, gcTime: 15m }
CACHE_PRESETS.STABLE; // { staleTime: 10m, gcTime: 30m }
CACHE_PRESETS.STATIC; // { staleTime: 30m, gcTime: 1h }
```

## Usage Examples

### Using Presets (Recommended)

```typescript
import { CACHE_PRESETS } from '@/constants';

const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  ...CACHE_PRESETS.STANDARD, // Spreads both staleTime and gcTime
});

// Or use individual properties
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: CACHE_PRESETS.STANDARD.staleTime,
  gcTime: CACHE_PRESETS.STANDARD.gcTime,
});
```

### Using Individual Constants

```typescript
import { STALE_TIMES, GC_TIMES } from '@/constants';

const { data } = useQuery({
  queryKey: ['real-time-data'],
  queryFn: fetchRealTimeData,
  staleTime: STALE_TIMES.VERY_SHORT,
  gcTime: GC_TIMES.VERY_SHORT,
});
```

### When to Use Each Preset

- **REAL_TIME**: Data that changes very frequently (e.g., system health, live metrics)
- **LIVE**: Data that updates regularly (e.g., API health, active sessions)
- **ACTIVE**: Data that changes moderately (e.g., endpoint tests, user activity)
- **STANDARD**: Default for most data (e.g., user lists, dashboard stats)
- **STABLE**: Data that changes infrequently (e.g., clinic information, service lists)
- **STATIC**: Data that rarely changes (e.g., configuration, reference data)

## Migration Guide

When updating existing code, replace hardcoded values with constants:

```typescript
// Before
staleTime: 5 * 60 * 1000, // 5 minutes
gcTime: 10 * 60 * 1000,    // 10 minutes

// After
...CACHE_PRESETS.STANDARD
```

## Benefits

1. **Consistency**: All cache times are defined in one place
2. **Maintainability**: Easy to adjust cache behavior across the application
3. **Readability**: Clear intent with descriptive constant names
4. **Type Safety**: Full TypeScript support with proper types
5. **Performance**: Optimized cache times for different data types

## Best Practices

1. Use presets when possible for common scenarios
2. Use individual constants when you need specific combinations
3. Choose the appropriate preset based on data volatility
4. Consider user experience when setting cache times
5. Monitor performance and adjust as needed
