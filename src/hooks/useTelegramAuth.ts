// React Hook для работы с Telegram WebApp
import { useEffect, useState } from 'react';

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
        onEvent?: (event: string, handler: () => void) => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
            is_premium?: boolean;
          };
          [key: string]: any;
        };
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export function useTelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<any>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем, что запущено в Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      setIsTelegram(true);

      // Получаем данные пользователя из Telegram Web App
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        // Получаем все доступные данные пользователя
        const userData: TelegramUser = {
          id: tgUser.id,
          first_name: tgUser.first_name || '',
          last_name: tgUser.last_name,
          username: tgUser.username,
          language_code: tgUser.language_code,
          photo_url: tgUser.photo_url, // URL фото профиля (если доступно)
          is_premium: tgUser.is_premium,
        };
        
        setUser(userData);
        
        // Если есть photo_url, используем его
        if (userData.photo_url) {
          setAvatarUrl(userData.photo_url);
        } else {
          // Пытаемся получить фото через Bot API (если нужно)
          // Это можно сделать через бэкенд запрос
          fetchUserAvatar(tgUser.id);
        }
      }

      setInitData(tg.initDataUnsafe);
      
      // Слушаем обновления темы Telegram (если доступно)
      if (tg.onEvent) {
        tg.onEvent('themeChanged', () => {
          // Можно обновить тему приложения
        });
      }
      
    } else {
      // Development mode - используем тестового пользователя
      setIsTelegram(false);
      setUser({
        id: 694377627,
        first_name: 'Тестовый',
        username: 'test_user',
      });
    }
  }, []);

  // Функция для получения аватара пользователя через бота
  const fetchUserAvatar = async (userId: number) => {
    try {
      // Можно добавить запрос к вашему бэкенду для получения фото
      // Например через Bot API: https://api.telegram.org/bot<token>/getUserProfilePhotos
      // Но это нужно делать через ваш backend для безопасности токена
      // Пока оставляем как есть - photo_url из initDataUnsafe должен работать
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  return { user, initData, isTelegram, avatarUrl };
}

