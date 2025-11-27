interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Получить из кэша или выполнить запрос
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; staleWhileRevalidate?: boolean } = {}
  ): Promise<T> {
    const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

    // Проверить кэш
    const cached = this.cache.get(key);
    const isStale = cached && Date.now() - cached.timestamp > ttl;

    if (cached && !isStale) {
      return cached.data;
    }

    // Если есть pending request - вернуть его
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Выполнить новый запрос
    const request = fetcher()
      .then(data => {
        this.cache.set(key, { data, timestamp: Date.now(), ttl });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        
        // Если есть stale данные, вернуть их при ошибке
        if (staleWhileRevalidate && cached) {
          return cached.data;
        }
        throw error;
      });

    this.pendingRequests.set(key, request);
    return request;
  }

  /**
   * Инвалидировать кэш
   */
  invalidate(pattern?: RegExp) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Получить статистику кэша
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        isStale: Date.now() - entry.timestamp > entry.ttl,
      })),
    };
  }
}

export const queryCache = new QueryCache();
