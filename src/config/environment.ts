export const environment = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://borzolini-service.onrender.com/api/v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '2'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '5000'),
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Clinic Admin',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_NODE_ENV || 'development',
    debug: import.meta.env.VITE_DEBUG === 'true',
  },

  // Feature Flags
  features: {
    enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
    enableCaching: import.meta.env.VITE_ENABLE_CACHING === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Cache Configuration
  cache: {
    appointments: {
      ttl: parseInt(import.meta.env.VITE_CACHE_APPOINTMENTS_TTL || '300000'), // 5 minutes
      maxSize: parseInt(import.meta.env.VITE_CACHE_APPOINTMENTS_MAX_SIZE || '100'),
    },
    users: {
      ttl: parseInt(import.meta.env.VITE_CACHE_USERS_TTL || '600000'), // 10 minutes
      maxSize: parseInt(import.meta.env.VITE_CACHE_USERS_MAX_SIZE || '50'),
    },
    calendar: {
      ttl: parseInt(import.meta.env.VITE_CACHE_CALENDAR_TTL || '300000'), // 5 minutes
      maxSize: parseInt(import.meta.env.VITE_CACHE_CALENDAR_MAX_SIZE || '50'),
    },
    reviews: {
      ttl: parseInt(import.meta.env.VITE_CACHE_REVIEWS_TTL || '300000'), // 5 minutes
      maxSize: parseInt(import.meta.env.VITE_CACHE_REVIEWS_MAX_SIZE || '100'),
    },
    lookups: {
      ttl: parseInt(import.meta.env.VITE_CACHE_LOOKUPS_TTL || '3600000'), // 60 minutes
      maxSize: parseInt(import.meta.env.VITE_CACHE_LOOKUPS_MAX_SIZE || '50'),
    },
  },
} as const;

export type Environment = typeof environment;
