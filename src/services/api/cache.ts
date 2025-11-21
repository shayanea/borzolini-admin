import { appointmentsCache, calendarCache, lookupsCache, usersCache } from '../core/cache.service';

// Cache management utilities
export class ApiCache {
  static get(key: string): any {
    return (
      appointmentsCache.get(key) ||
      usersCache.get(key) ||
      calendarCache.get(key) ||
      lookupsCache.get(key)
    );
  }

  static set(
    key: string,
    data: any,
    type?: 'appointments' | 'users' | 'calendar' | 'lookups'
  ): void {
    if (type === 'appointments') {
      appointmentsCache.set(key, data);
    } else if (type === 'users') {
      usersCache.set(key, data);
    } else if (type === 'calendar') {
      calendarCache.set(key, data);
    } else if (type === 'lookups') {
      lookupsCache.set(key, data);
    }
  }

  static clear(type?: 'appointments' | 'users' | 'calendar' | 'lookups'): void {
    if (type === 'appointments') {
      appointmentsCache.clear();
    } else if (type === 'users') {
      usersCache.clear();
    } else if (type === 'calendar') {
      calendarCache.clear();
    } else if (type === 'lookups') {
      lookupsCache.clear();
    } else {
      appointmentsCache.clear();
      usersCache.clear();
      calendarCache.clear();
      lookupsCache.clear();
    }
  }

  static invalidateByUrl(url: string): void {
    // Clear any cached data that might be related to this URL
    // This is a simple implementation - could be enhanced based on URL patterns
    const cacheTypes: Array<'appointments' | 'users' | 'calendar' | 'lookups'> = [
      'appointments',
      'users',
      'calendar',
      'lookups',
    ];

    cacheTypes.forEach(type => {
      if (url.includes(type)) {
        this.clear(type);
      }
    });
  }
}

export default ApiCache;
