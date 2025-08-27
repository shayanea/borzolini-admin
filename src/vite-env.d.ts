/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_RETRY_ATTEMPTS: string;
  readonly VITE_API_RETRY_DELAY: string;

  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_DEBUG: string;

  // Feature Flags
  readonly VITE_ENABLE_OFFLINE_MODE: string;
  readonly VITE_ENABLE_CACHING: string;
  readonly VITE_ENABLE_ANALYTICS: string;

  // Cache Configuration
  readonly VITE_CACHE_APPOINTMENTS_TTL: string;
  readonly VITE_CACHE_APPOINTMENTS_MAX_SIZE: string;
  readonly VITE_CACHE_USERS_TTL: string;
  readonly VITE_CACHE_USERS_MAX_SIZE: string;
  readonly VITE_CACHE_CALENDAR_TTL: string;
  readonly VITE_CACHE_CALENDAR_MAX_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
