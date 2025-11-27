// React Hook для работы с расходниками с кэшированием
import { useState, useEffect, useCallback } from 'react';
import { consumablesApi, BrotherConsumable, GodexConsumable } from '../lib/api';
import { toast } from 'sonner';
import { useApiCache } from './useApiCache';

export function useConsumables() {
  const [brotherConsumables, setBrotherConsumables] = useState<BrotherConsumable[]>([]);
  const [godexConsumables, setGodexConsumables] = useState<GodexConsumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get, invalidate } = useApiCache();

  const fetchConsumables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [brotherData, godexData] = await Promise.all([
        get('consumables:brother', () => consumablesApi.getBrother(), 3 * 60 * 1000),
        get('consumables:godex', () => consumablesApi.getGodex(), 3 * 60 * 1000),
      ]);
      
      setBrotherConsumables(brotherData);
      setGodexConsumables(godexData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки расходников';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchConsumables();
  }, [fetchConsumables]);

  const updateBrother = useCallback(async (id: number, quantity: number, username?: string) => {
    try {
      const updated = await consumablesApi.updateBrother(id, quantity, username);
      setBrotherConsumables(prev => 
        prev.map(c => c.id === id ? updated : c)
      );
      invalidate(/^consumables:/);
      toast.success('Количество обновлено');
      return updated;
    } catch (err) {
      toast.error('Ошибка обновления');
      throw err;
    }
  }, [invalidate]);

  const updateGodex = useCallback(async (id: number, quantity: number, username?: string) => {
    try {
      const updated = await consumablesApi.updateGodex(id, quantity, username);
      setGodexConsumables(prev => 
        prev.map(c => c.id === id ? updated : c)
      );
      invalidate(/^consumables:/);
      toast.success('Количество обновлено');
      return updated;
    } catch (err) {
      toast.error('Ошибка обновления');
      throw err;
    }
  }, [invalidate]);

  return {
    brotherConsumables,
    godexConsumables,
    loading,
    error,
    refetch: fetchConsumables,
    updateBrother,
    updateGodex,
  };
}

