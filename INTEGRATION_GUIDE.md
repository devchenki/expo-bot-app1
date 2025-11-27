# 🔧 ГАЙД ПО ИНТЕГРАЦИИ УЛУЧШЕНИЙ

## Как использовать новые компоненты и функции

---

## 1️⃣ ErrorBoundary (уже интегрирован)

### ✅ Уже установлен в `App.tsx`

ErrorBoundary автоматически ловит все ошибки в приложении.

**Проверить**: Откройте app, попробуйте вызвать ошибку - должна показать fallback UI

---

## 2️⃣ Loading States

### Использование в компонентах

```typescript
import { CardSkeleton, ListSkeleton } from './ui/skeletons';

export function MyComponent() {
  const { data, loading } = useSomeHook();

  if (loading) {
    return <ListSkeleton count={5} />;
  }

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Что добавить:
1. Все страницы должны показывать skeleton во время загрузки
2. HomePage - уже готово ✅
3. InstallationsPage - нужно добавить
4. ConsumablesPage - нужно добавить
5. EventsPage - нужно добавить

### Как добавить:
```typescript
// 1. Импорт
import { ListSkeleton } from './ui/skeletons';

// 2. Добавить в компонент
const { data, loading } = useHook();

if (loading) return <ListSkeleton count={5} />;

// 3. Готово!
```

---

## 3️⃣ EmptyState

### Использование

```typescript
import { EmptyState } from './ui/empty-state';
import { Package, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function MyComponent() {
  const { items } = useItems();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="Нет установок"
        description="Создайте первую установку оборудования"
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Создать установку
          </Button>
        }
      />
    );
  }

  return (
    // Ваш контент
  );
}
```

### Где добавить:
- [ ] InstallationsPage (когда нет установок)
- [ ] ConsumablesPage (когда нет расходников)
- [ ] EventsPage (когда нет мероприятий)
- [ ] SearchPage (когда нет результатов)

---

## 4️⃣ Header с Hamburger Menu (уже готово)

✅ Уже обновлён в `src/components/Header.tsx`

**Что изменилось**:
- Вместо 6 иконок - 3 иконки
- История, Справка, Настройки - в меню (Hamburger)
- Поиск и Уведомления - остались в header

---

## 5️⃣ Bottom Navigation (уже оптимизирована)

✅ Уже обновлена в `src/components/BottomNav.tsx`

**Что изменилось**:
- Icon-only (без текста)
- Добавлены Tooltips (наведите на иконку)
- Меньше высоты
- Лучше выглядит на мобилках

---

## 6️⃣ Query Cache

### Интеграция в hooks

```typescript
// src/hooks/useInstallations.ts
import { useApiCache } from './useApiCache';

export function useInstallations(zone?: string) {
  const { get, invalidate } = useApiCache();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstallations = useCallback(async () => {
    setLoading(true);
    try {
      // Используем кэш вместо прямого запроса
      const data = await get(
        `installations:${zone || 'all'}`,
        () => installationsApi.getAll(),
        { ttl: 2 * 60 * 1000 } // 2 минуты кэша
      );
      setInstallations(data);
    } finally {
      setLoading(false);
    }
  }, [get, zone]);

  const createInstallation = useCallback(async (data: Installation) => {
    const result = await installationsApi.create(data);
    // Инвалидировать кэш при изменении
    invalidate(/^installations:/);
    await fetchInstallations();
    return result;
  }, [invalidate, fetchInstallations]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  return { installations, loading, createInstallation };
}
```

### Где интегрировать:
- [ ] useInstallations
- [ ] useEquipment
- [ ] useEvents
- [ ] useConsumables

---

## 7️⃣ Export функции

### CSV Export (готов)

```typescript
import { exportToCSV } from '../lib/export/exporters';
import { toast } from 'sonner';

const handleExportCSV = () => {
  try {
    const data = installations.map(inst => ({
      'Стойка': inst.rack,
      'Ноутбук': inst.laptop,
      'Дата': new Date(inst.date).toLocaleDateString('ru-RU'),
    }));
    exportToCSV(data, 'installations.csv');
    toast.success('Данные загружены');
  } catch (error) {
    toast.error('Ошибка при экспорте');
  }
};

// В JSX
<Button onClick={handleExportCSV}>
  <Download className="h-4 w-4 mr-2" />
  Скачать CSV
</Button>
```

### Excel Export

```typescript
import { exportToExcel } from '../lib/export/exporters';

// Требует: npm install xlsx
const handleExportExcel = async () => {
  try {
    await exportToExcel(data, 'report.xlsx');
    toast.success('Excel файл загружен');
  } catch (error) {
    toast.error('Ошибка при экспорте');
  }
};
```

### PDF Export

```typescript
import { exportToPDF } from '../lib/export/exporters';

// Требует: npm install pdfkit
const handleExportPDF = async () => {
  try {
    await exportToPDF(data, 'Отчёт об установках', 'report.pdf');
    toast.success('PDF файл загружен');
  } catch (error) {
    toast.error('Ошибка при экспорте');
  }
};
```

### Что добавить:
- [x] CSV в StatisticsPage ✅
- [ ] Export кнопки на других страницах
- [ ] Excel export (нужна установка пакета)
- [ ] PDF export (нужна установка пакета)

---

## 8️⃣ LoadingIndicator

### Использование

```typescript
import { LoadingIndicator } from './ui/loading-indicator';

// Spinner
<LoadingIndicator variant="spinner" label="Загрузка..." />

// Dots
<LoadingIndicator variant="dots" label="Обработка..." />

// Progress bar
<LoadingIndicator variant="progress" label="Загрузка" progress={65} />
```

---

## ✅ CHECKLIST ДЛЯ ИНТЕГРАЦИИ

### Уже готово:
- [x] ErrorBoundary в App.tsx
- [x] Header с hamburger menu
- [x] Bottom Nav оптимизирована
- [x] HomePage с loading states
- [x] StatisticsPage с CSV экспортом
- [x] Query Cache система
- [x] Export функции

### Нужно добавить:
- [ ] Loading states в InstallationsPage
- [ ] Loading states в ConsumablesPage
- [ ] Loading states в EventsPage
- [ ] Empty states везде
- [ ] Page transition animations
- [ ] Query Cache в all hooks
- [ ] Export buttons на других страницах

### Опционально:
- [ ] Интеграция Recharts для графиков
- [ ] Excel export (если нужен XLSX)
- [ ] PDF export (если нужен jsPDF)

---

## 🚀 БЫСТРЫЙ СТАРТ

### 1. Проверить уже интегрированное

```bash
npm run dev
# Откройте приложение
# Проверьте:
# 1. Header имеет hamburger menu (≡)
# 2. Bottom Nav показывает иконки с tooltips
# 3. HomePage показывает loaders при открытии
```

### 2. Добавить в одном компоненте

```typescript
// InstallationsPage.tsx

// 1. Импортируем
import { ListSkeleton } from './ui/skeletons';
import { EmptyState } from './ui/empty-state';

// 2. Добавляем loading check
if (loading) return <ListSkeleton count={5} />;

// 3. Добавляем empty state
if (installations.length === 0) {
  return (
    <EmptyState
      icon={<Package />}
      title="Нет установок"
      description="Создайте первую установку"
      action={<Button>Создать</Button>}
    />
  );
}

// 4. Готово!
```

### 3. Тестировать

```bash
npm run dev
# Приложение должно выглядеть лучше!
```

---

## 📚 ДОКУМЕНТАЦИЯ

### Компоненты
- `ErrorBoundary` - `/src/components/ErrorBoundary.tsx`
- `EmptyState` - `/src/components/ui/empty-state.tsx`
- `CardSkeleton` - `/src/components/ui/skeletons.tsx`
- `LoadingIndicator` - `/src/components/ui/loading-indicator.tsx`
- `TrendChart` - `/src/components/TrendChart.tsx`

### Функции
- `exportToCSV` - `/src/lib/export/exporters.ts`
- `exportToExcel` - `/src/lib/export/exporters.ts`
- `exportToPDF` - `/src/lib/export/exporters.ts`
- `QueryCache` - `/src/lib/api/cache.ts`

### Hooks
- `useApiCache` - `/src/hooks/useApiCache.ts`

---

## 💡 ПРИМЕРЫ

Готовые примеры в `/src/components`:
- HomePage - показывает loading + skeletons ✅
- StatisticsPage - показывает export ✅
- Header - показывает hamburger menu ✅
- BottomNav - показывает icon-only + tooltips ✅

---

## 🐛 TROUBLESHOOTING

### Loading не показывается
```typescript
// Убедитесь что hook возвращает loading state
const { data, loading } = useHook();
// ✅ loading должен быть boolean
```

### EmptyState не работает
```typescript
// Убедитесь что проверяете length правильно
if (items.length === 0) {
  // Это будет работать
}
```

### Export не работает
```typescript
// Убедитесь что данные в правильном формате
const data = items.map(item => ({
  'Колонка1': item.field1,
  'Колонка2': item.field2,
}));
exportToCSV(data, 'file.csv');
```

---

## 📞 ПОМОЩЬ

Если что-то не работает:
1. Проверьте импорты
2. Проверьте, что используете правильный вариант компонента
3. Посмотрите примеры в HomePage/StatisticsPage
4. Проверьте console на ошибки

---

**Готово к интеграции! 🚀**
