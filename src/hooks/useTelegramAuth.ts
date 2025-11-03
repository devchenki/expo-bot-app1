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
    // Ждем загрузки Telegram Web App SDK
    const checkTelegramWebApp = () => {
      // Проверяем, что запущено в Telegram и скрипт загружен
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Инициализируем Web App
        tg.ready();
        tg.expand();
        
        setIsTelegram(true);

        // Получаем данные пользователя из Telegram Web App
        // initDataUnsafe содержит данные пользователя
        const tgUser = tg.initDataUnsafe?.user;
        
        console.log('Telegram Web App initialized:', {
          hasWebApp: !!window.Telegram?.WebApp,
          hasUser: !!tgUser,
          initData: tg.initDataUnsafe,
          user: tgUser
        });
        
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
          
          console.log('Setting user data:', userData);
          setUser(userData);
          
          // Если есть photo_url, используем его
          if (userData.photo_url) {
            setAvatarUrl(userData.photo_url);
          } else {
            // Пытаемся получить фото через Bot API (если нужно)
            fetchUserAvatar(tgUser.id);
          }
        } else {
          // Если пользователя нет в initDataUnsafe, пробуем получить через initData
          console.warn('User data not found in initDataUnsafe');
        }

        setInitData(tg.initDataUnsafe);
        
        // Слушаем обновления темы Telegram
        if (tg.onEvent) {
          tg.onEvent('themeChanged', () => {
            // Можно обновить тему приложения
          });
        }
        
      } else {
        // Development mode или не в Telegram - используем тестового пользователя
        console.warn('Telegram Web App not available, using test user');
        setIsTelegram(false);
        setUser({
          id: 694377627,
          first_name: 'Тестовый',
          username: 'test_user',
        });
      }
    };

    // Проверяем сразу, если скрипт уже загружен
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      checkTelegramWebApp();
    } else {
      // Ждем загрузки скрипта Telegram Web App
      const scriptCheckInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          clearInterval(scriptCheckInterval);
          checkTelegramWebApp();
        }
      }, 100);

      // Останавливаем проверку через 5 секунд, если скрипт не загрузился
      setTimeout(() => {
        clearInterval(scriptCheckInterval);
        if (!window.Telegram?.WebApp) {
          console.warn('Telegram Web App script not loaded after 5 seconds');
          checkTelegramWebApp();
        }
      }, 5000);
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

