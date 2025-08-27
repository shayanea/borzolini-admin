// React Query cache time constants
// These values are used consistently across all hooks and services

// Stale time constants (how long data is considered fresh)
export const STALE_TIMES = {
  // Very short - for frequently changing data
  VERY_SHORT: 30 * 1000, // 30 seconds

  // Short - for data that changes occasionally
  SHORT: 1 * 60 * 1000, // 1 minute

  // Medium - for data that changes moderately
  MEDIUM: 2 * 60 * 1000, // 2 minutes

  // Default - for most data
  DEFAULT: 5 * 60 * 1000, // 5 minutes

  // Long - for data that changes infrequently
  LONG: 10 * 60 * 1000, // 10 minutes

  // Very long - for data that rarely changes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

// Garbage collection time constants (how long inactive data stays in cache)
export const GC_TIMES = {
  // Very short - for frequently accessed data
  VERY_SHORT: 2 * 60 * 1000, // 2 minutes

  // Short - for commonly accessed data
  SHORT: 5 * 60 * 1000, // 5 minutes

  // Medium - for moderately accessed data
  MEDIUM: 10 * 60 * 1000, // 10 minutes

  // Default - for most data
  DEFAULT: 15 * 60 * 1000, // 15 minutes

  // Long - for infrequently accessed data
  LONG: 30 * 60 * 1000, // 30 minutes

  // Very long - for rarely accessed data
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// Predefined combinations for common use cases
export const CACHE_PRESETS = {
  // Real-time data (frequently updated)
  REAL_TIME: {
    staleTime: STALE_TIMES.VERY_SHORT,
    gcTime: GC_TIMES.VERY_SHORT,
  },

  // Live data (updated regularly)
  LIVE: {
    staleTime: STALE_TIMES.SHORT,
    gcTime: GC_TIMES.SHORT,
  },

  // Active data (moderately updated)
  ACTIVE: {
    staleTime: STALE_TIMES.MEDIUM,
    gcTime: GC_TIMES.MEDIUM,
  },

  // Standard data (default behavior)
  STANDARD: {
    staleTime: STALE_TIMES.DEFAULT,
    gcTime: GC_TIMES.DEFAULT,
  },

  // Stable data (infrequently updated)
  STABLE: {
    staleTime: STALE_TIMES.LONG,
    gcTime: GC_TIMES.LONG,
  },

  // Static data (rarely updated)
  STATIC: {
    staleTime: STALE_TIMES.VERY_LONG,
    gcTime: GC_TIMES.VERY_LONG,
  },
} as const;

// Type exports for TypeScript
export type StaleTime = (typeof STALE_TIMES)[keyof typeof STALE_TIMES];
export type GcTime = (typeof GC_TIMES)[keyof typeof GC_TIMES];
export type CachePreset = (typeof CACHE_PRESETS)[keyof typeof CACHE_PRESETS];
