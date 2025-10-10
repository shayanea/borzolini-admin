# Constants

Centralized constants for the app.

## Cache Times

`cache-times.ts` defines React Query cache configurations.

### Stale Times

How long data is considered fresh:

```typescript
STALE_TIMES.VERY_SHORT; // 30 seconds
STALE_TIMES.SHORT; // 1 minute
STALE_TIMES.MEDIUM; // 2 minutes
STALE_TIMES.DEFAULT; // 5 minutes
STALE_TIMES.LONG; // 10 minutes
STALE_TIMES.VERY_LONG; // 30 minutes
```

### GC Times

How long inactive data stays in cache:

```typescript
GC_TIMES.VERY_SHORT; // 2 minutes
GC_TIMES.SHORT; // 5 minutes
GC_TIMES.MEDIUM; // 10 minutes
GC_TIMES.DEFAULT; // 15 minutes
GC_TIMES.LONG; // 30 minutes
GC_TIMES.VERY_LONG; // 1 hour
```

### Presets

Predefined combinations for common use cases:

```typescript
CACHE_PRESETS.REAL_TIME; // Very short times for live data
CACHE_PRESETS.LIVE; // Short times for frequently updated data
CACHE_PRESETS.ACTIVE; // Medium times for moderately changing data
CACHE_PRESETS.STANDARD; // Default for most data
CACHE_PRESETS.STABLE; // Long times for infrequently changing data
CACHE_PRESETS.STATIC; // Very long times for rarely changing data
```

## Usage

Use presets in React Query hooks:

```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  ...CACHE_PRESETS.STANDARD, // Spreads staleTime and gcTime
});
```

Or use individual constants:

```typescript
const { data } = useQuery({
  queryKey: ['real-time-data'],
  queryFn: fetchRealTimeData,
  staleTime: STALE_TIMES.VERY_SHORT,
  gcTime: GC_TIMES.VERY_SHORT,
});
```

## When to Use Which Preset

- **REAL_TIME**: System health, live metrics
- **LIVE**: API health, active sessions
- **ACTIVE**: User activity, recent appointments
- **STANDARD**: User lists, dashboard stats (default choice)
- **STABLE**: Clinic info, service lists
- **STATIC**: Configuration, reference data

## Why Use These

Instead of hardcoding:

```typescript
// Bad
staleTime: 5 * 60 * 1000,
```

Use constants:

```typescript
// Good
...CACHE_PRESETS.STANDARD
```

This makes it:

- Easier to update cache times across the app
- Clearer what the intent is
- Consistent across all queries
