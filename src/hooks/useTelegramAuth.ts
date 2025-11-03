// React Hook для работы с Telegram WebApp
import { useEffect, useState } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function useTelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<any>(null);

  useEffect(() => {
    // Проверяем, что запущено в Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Получаем данные пользователя
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser(tgUser);
      }

      setInitData(tg.initDataUnsafe);
    } else {
      // Development mode - используем тестового пользователя
      setUser({
        id: 694377627,
        first_name: 'Тестовый',
        username: 'test_user',
      });
    }
  }, []);

  return { user, initData };
}

