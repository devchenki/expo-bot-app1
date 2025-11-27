// React Hook для работы с оборудованием с кэшированием
import { useState, useEffect, useCallback } from 'react';
import { equipmentApi, Laptop, BrotherPrinter, GodexPrinter } from '../lib/api';
import { useApiCache } from './useApiCache';

export function useEquipment() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [brotherPrinters, setBrotherPrinters] = useState<BrotherPrinter[]>([]);
  const [godexPrinters, setGodexPrinters] = useState<GodexPrinter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApiCache();

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [laptopsData, brotherData, godexData] = await Promise.all([
        get('equipment:laptops', () => equipmentApi.getLaptops(), 5 * 60 * 1000),
        get('equipment:brother', () => equipmentApi.getBrotherPrinters(), 5 * 60 * 1000),
        get('equipment:godex', () => equipmentApi.getGodexPrinters(), 5 * 60 * 1000),
      ]);
      
      setLaptops(laptopsData);
      setBrotherPrinters(brotherData);
      setGodexPrinters(godexData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки оборудования';
      setError(errorMessage);
      console.error('Equipment fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  return {
    laptops,
    brotherPrinters,
    godexPrinters,
    loading,
    error,
    refetch: fetchEquipment,
  };
}

