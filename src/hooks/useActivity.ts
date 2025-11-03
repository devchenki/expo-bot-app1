// React Hook для работы с активностью
import { useState, useEffect, useCallback } from 'react';
import { activityApi, ActivityDisplay } from '../lib/api';

export function useActivity(limit: number = 10) {
  const [activities, setActivities] = useState<ActivityDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityApi.getRecent(limit);
      setActivities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки активности';
      setError(errorMessage);
      console.error('Activity fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
}

