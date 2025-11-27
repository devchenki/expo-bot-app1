// React Hook для работы с установками с кэшированием
import { useState, useEffect, useCallback } from 'react';
import { installationsApi, Installation } from '../lib/api';
import { toast } from 'sonner';
import { useApiCache } from './useApiCache';

export function useInstallations(zone?: string) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get, invalidate } = useApiCache();

  const fetchInstallations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cacheKey = `installations:${zone || 'all'}`;
      const data = await get(
        cacheKey,
        () => zone 
          ? installationsApi.getByZone(zone)
          : installationsApi.getAll(),
        2 * 60 * 1000 // 2 минуты кэша
      );
      
      setInstallations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки установок';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [zone, get]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  const createInstallation = useCallback(async (data: Omit<Installation, 'id'>) => {
    try {
      const newInstallation = await installationsApi.create(data);
      setInstallations(prev => [newInstallation, ...prev]);
      // Инвалидировать кэш после изменения
      invalidate(/^installations:/);
      toast.success('Установка создана');
      return newInstallation;
    } catch (err) {
      toast.error('Ошибка создания установки');
      throw err;
    }
  }, [invalidate]);

  const updateInstallation = useCallback(async (id: number, data: Partial<Installation>) => {
    try {
      const updated = await installationsApi.update(id, data);
      setInstallations(prev => 
        prev.map(inst => inst.id === id ? updated : inst)
      );
      invalidate(/^installations:/);
      toast.success('Установка обновлена');
      return updated;
    } catch (err) {
      toast.error('Ошибка обновления установки');
      throw err;
    }
  }, [invalidate]);

  const completeInstallation = useCallback(async (id: number) => {
    try {
      await installationsApi.complete(id);
      setInstallations(prev => prev.filter(inst => inst.id !== id));
      invalidate(/^installations:/);
      toast.success('Установка завершена');
    } catch (err) {
      toast.error('Ошибка завершения установки');
      throw err;
    }
  }, [invalidate]);

  return {
    installations,
    loading,
    error,
    refetch: fetchInstallations,
    createInstallation,
    updateInstallation,
    completeInstallation,
  };
}

