import { useCallback } from 'react';
import { queryCache } from '../lib/api/cache';

export function useApiCache() {
  const get = useCallback(
    async <T,>(
      key: string,
      fetcher: () => Promise<T>,
      ttl?: number
    ): Promise<T> => {
      return queryCache.get(key, fetcher, { ttl });
    },
    []
  );

  const invalidate = useCallback((pattern?: RegExp) => {
    queryCache.invalidate(pattern);
  }, []);

  const getStats = useCallback(() => {
    return queryCache.getStats();
  }, []);

  return { get, invalidate, getStats };
}
