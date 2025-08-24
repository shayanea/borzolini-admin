import { environment } from '@/config/environment';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  ttl: number;
  maxSize: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
    this.cleanupExpiredItems();
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private cleanupExpiredItems(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Cleanup expired items every minute
  startCleanupInterval(): void {
    window.setInterval(() => {
      this.cleanupExpiredItems();
    }, 60000);
  }
}

// Create cache instances for different data types
export const appointmentsCache = new CacheService(environment.cache.appointments);
export const usersCache = new CacheService(environment.cache.users);
export const calendarCache = new CacheService({
  ttl: environment.cache.calendar?.ttl || 300000, // 5 minutes default
  maxSize: environment.cache.calendar?.maxSize || 50, // 50 items default
});

// Start cleanup intervals
appointmentsCache.startCleanupInterval();
usersCache.startCleanupInterval();
calendarCache.startCleanupInterval();

export default CacheService;
