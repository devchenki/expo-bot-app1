// React Hook для работы с мероприятиями с кэшированием
import { useState, useEffect, useCallback } from 'react';
import { eventsApi, Event } from '../lib/api';
import { toast } from 'sonner';
import { useApiCache } from './useApiCache';

export function useEvents(month?: number, year?: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get, invalidate } = useApiCache();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Event[];
      const cacheKey = month && year ? `events:${year}-${month}` : 'events:all';
      
      data = await get(
        cacheKey,
        () => month && year 
          ? eventsApi.getByMonth(year, month)
          : eventsApi.getAll(),
        5 * 60 * 1000 // 5 минут кэша
      );
      
      // Автоматически завершаем прошедшие мероприятия
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const event of data) {
        if (event.id && event.end_date) {
          const endDate = new Date(event.end_date);
          endDate.setHours(0, 0, 0, 0);
          
          // Если дата окончания в прошлом и мероприятие ещё не завершено
          if (endDate < today && event.status !== 'completed') {
            try {
              await eventsApi.complete(event.id);
              // Обновляем локальное состояние
              setEvents(prev => prev.map(e => 
                e.id === event.id ? { ...e, status: 'completed' as const } : e
              ));
            } catch (err) {
              console.error('Error auto-completing event:', err);
            }
          }
        }
      }
      
      setEvents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки мероприятий';
      setError(errorMessage);
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [month, year, get]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(async (data: Omit<Event, 'id'>) => {
    try {
      const newEvent = await eventsApi.create(data);
      setEvents(prev => [newEvent, ...prev]);
      invalidate(/^events:/);
      return newEvent;
    } catch (err) {
      throw err;
    }
  }, [invalidate]);

  const updateEvent = useCallback(async (id: number, data: Partial<Event>) => {
    try {
      const updated = await eventsApi.update(id, data);
      setEvents(prev => prev.map(e => e.id === id ? updated : e));
      invalidate(/^events:/);
      return updated;
    } catch (err) {
      throw err;
    }
  }, [invalidate]);

  const completeEvent = useCallback(async (id: number) => {
    try {
      await eventsApi.complete(id);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'completed' as const } : e));
      invalidate(/^events:/);
      toast.success('Мероприятие завершено');
    } catch (err) {
      toast.error('Ошибка завершения мероприятия');
      throw err;
    }
  }, [invalidate]);

  const deleteEvent = useCallback(async (id: number) => {
    try {
      await eventsApi.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      invalidate(/^events:/);
      toast.success('Мероприятие удалено');
    } catch (err) {
      toast.error('Ошибка удаления мероприятия');
      throw err;
    }
  }, [invalidate]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    completeEvent,
    deleteEvent,
  };
}
