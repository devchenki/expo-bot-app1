// React Hook для работы с активностью
import { useState, useEffect, useCallback } from 'react';
import { activityApi, ActivityDisplay } from '../lib/api';
import { SUPABASE_URL, SUPABASE_KEY } from '../lib/api/config';

/**
 * Получить аватар пользователя из БД (та же логика, что в useTelegramAuth)
 */
async function fetchAvatarFromDB(userId: string | number): Promise<string | null> {
  try {
    const userIdStr = String(userId);
    
    // Пробуем получить из БД (activity_log) - последний avatar_url для этого пользователя
    if (SUPABASE_URL && SUPABASE_KEY) {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/activity_log?user_id=eq.${userIdStr}&select=avatar_url&limit=1&order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].avatar_url) {
          console.log(`Found avatar for user ${userIdStr} in activity_log:`, data[0].avatar_url);
          return data[0].avatar_url;
        }
      }
    }

    // Пробуем Telegram CDN (может не работать из-за конфиденциальности)
    const telegramCdnUrl = `https://cdn.telegram.org/widget/photo?size=m&user_id=${userIdStr}`;
    return telegramCdnUrl; // Пробуем, но может не сработать
    
  } catch (error) {
    console.log(`Could not get avatar for user ${userId}:`, error);
    return null;
  }
}

export function useActivity(limit: number = 10) {
  const [activities, setActivities] = useState<ActivityDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityApi.getRecent(limit);
      
      // Обогащаем активности аватарами из БД для тех, у кого нет avatar_url
      const enrichedData = await Promise.all(
        data.map(async (activity) => {
          // Если уже есть avatar_url, используем его
          if (activity.avatar_url) {
            return activity;
          }

          // Если есть user_id, пробуем получить аватар из БД
          if (activity.user_id) {
            const avatarUrl = await fetchAvatarFromDB(activity.user_id);
            if (avatarUrl) {
              return {
                ...activity,
                avatar_url: avatarUrl,
              };
            }
          }

          return activity;
        })
      );
      
      setActivities(enrichedData);
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

