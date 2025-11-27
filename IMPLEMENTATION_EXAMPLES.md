# 💻 ПРИМЕРЫ КОДА ДЛЯ РЕАЛИЗАЦИИ РЕКОМЕНДАЦИЙ

## Содержание
1. [Error Boundary](#error-boundary)
2. [API Cache Implementation](#api-cache-implementation)
3. [Loading States](#loading-states)
4. [Улучшенные компоненты](#улучшенные-компоненты)
5. [Offline Support](#offline-support)
6. [Multi-Step Form](#multi-step-form)
7. [Export Utilities](#export-utilities)

---

## Error Boundary

### Реализация ErrorBoundary компонента

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Отправить на сервер логирование ошибки
    if (window.Telegram?.WebApp?.initData) {
      // logErrorToServer(error, window.Telegram.WebApp.initData);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-1">Что-то пошло не так</h2>
                  <p className="text-sm text-muted-foreground">
                    Приложение столкнулось с неожиданной ошибкой
                  </p>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="w-full bg-muted p-3 rounded text-left">
                    <p className="text-xs font-mono text-destructive break-words">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                  <Button onClick={this.handleReset} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Повторить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    На главную
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Использование в App.tsx
export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Остальное содержимое */}
      </div>
    </ErrorBoundary>
  );
}
```

---

## API Cache Implementation

### Query Cache для снижения нагрузки

```typescript
// src/lib/api/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Получить из кэша или выполнить запрос
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; staleWhileRevalidate?: boolean } = {}
  ): Promise<T> {
    const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

    // Проверить кэш
    const cached = this.cache.get(key);
    const isStale = cached && Date.now() - cached.timestamp > ttl;

    if (cached && !isStale) {
      return cached.data;
    }

    // Если есть pending request - вернуть его
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Выполнить новый запрос
    const request = fetcher()
      .then(data => {
        this.cache.set(key, { data, timestamp: Date.now(), ttl });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        
        // Если есть stale данные, вернуть их при ошибке
        if (staleWhileRevalidate && cached) {
          return cached.data;
        }
        throw error;
      });

    this.pendingRequests.set(key, request);
    return request;
  }

  /**
   * Инвалидировать кэш
   */
  invalidate(pattern?: RegExp) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Получить статистику кэша
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        isStale: Date.now() - entry.timestamp > entry.ttl,
      })),
    };
  }
}

export const queryCache = new QueryCache();

// Использование в hooks
export function useInstallations() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInstallations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await queryCache.get(
        'installations',
        () => installationsApi.getAll(),
        { ttl: 2 * 60 * 1000 } // 2 минуты
      );
      setInstallations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  const createInstallation = useCallback(async (data: Installation) => {
    const result = await installationsApi.create(data);
    // Инвалидировать кэш
    queryCache.invalidate(/^installations/);
    // Рефетч
    await fetchInstallations();
    return result;
  }, [fetchInstallations]);

  return {
    installations,
    loading,
    createInstallation,
    refetch: fetchInstallations,
  };
}
```

---

## Loading States

### Skeleton Components для всех типов контента

```typescript
// src/components/ui/skeletons.tsx
import { Skeleton } from './skeleton';

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-2">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ImageSkeleton() {
  return <Skeleton className="w-full aspect-square rounded-lg" />;
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// Использование в компонентах
export function InstallationsPage() {
  const { installations, loading } = useInstallations();

  if (loading) {
    return <ListSkeleton count={5} />;
  }

  return (
    <div className="space-y-3">
      {installations.map(inst => (
        <InstallationCard key={inst.id} installation={inst} />
      ))}
    </div>
  );
}
```

### Loading Indicator Component

```typescript
// src/components/ui/loading-indicator.tsx
import { Loader, AlertCircle } from 'lucide-react';
import { Progress } from './progress';

interface LoadingIndicatorProps {
  variant?: 'spinner' | 'progress' | 'dots';
  label?: string;
  progress?: number;
}

export function LoadingIndicator({
  variant = 'spinner',
  label = 'Загрузка...',
  progress,
}: LoadingIndicatorProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="animate-spin">
          <Loader className="h-8 w-8 text-primary" />
        </div>
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Progress value={progress || 0} className="w-32 h-1" />
        <p className="text-sm text-muted-foreground">
          {label} {progress ? `${progress}%` : ''}
        </p>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }

  return null;
}
```

---

## Улучшенные компоненты

### Empty State Component с Action

```typescript
// src/components/ui/empty-state.tsx
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'compact' | 'default' | 'large';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const paddingMap = {
    compact: 'py-8 px-4',
    default: 'py-16 px-4',
    large: 'py-24 px-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg text-center ${paddingMap[variant]}`}>
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {description}
      </p>

      {action}
    </div>
  );
}

// Примеры использования
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
```

### Form Field Component с валидацией

```typescript
// src/components/ui/form-field.tsx
interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  input: React.ReactNode;
}

export function FormField({
  label,
  description,
  error,
  helperText,
  required = false,
  input,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <div className={error ? 'ring-2 ring-destructive/50 rounded' : ''}>
        {input}
      </div>

      {error ? (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

// Использование
<FormField
  label="Номер стойки"
  description="Например: C-5, E-12"
  helperText="Максимум 10 символов"
  error={errors.rack?.message}
  required
  input={
    <input
      {...register('rack', {
        required: 'Укажите номер стойки',
        pattern: {
          value: /^[A-Z]-\d{1,3}$/,
          message: 'Формат: X-NN (например, C-5)',
        },
        maxLength: {
          value: 10,
          message: 'Максимум 10 символов',
        },
      })}
      placeholder="C-"
      className="w-full px-3 py-2 border rounded"
    />
  }
/>
```

---

## Offline Support

### Service Worker для offline приложения

```typescript
// public/sw.js
const CACHE_NAME = 'expo-bot-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Для GET запросов
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Кэшировать успешные responses
          if (response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Вернуть из кэша при отсутствии интернета
          return caches.match(event.request).then((response) => {
            return response || new Response('Offline', { status: 503 });
          });
        })
    );
  }
});

// Использование в main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}
```

### IndexedDB для локального хранилища данных

```typescript
// src/lib/offline/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface InstallationDB extends DBSchema {
  installations: {
    key: number;
    value: Installation;
    indexes: { 'by-date': string };
  };
  equipment: {
    key: number;
    value: Equipment;
  };
  pending: {
    key: number;
    value: {
      type: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<InstallationDB> | null = null;

export async function initDB() {
  db = await openDB<InstallationDB>('expo-bot', 1, {
    upgrade(db) {
      // Store для установок
      if (!db.objectStoreNames.contains('installations')) {
        const store = db.createObjectStore('installations', { keyPath: 'id' });
        store.createIndex('by-date', 'date');
      }

      // Store для оборудования
      if (!db.objectStoreNames.contains('equipment')) {
        db.createObjectStore('equipment', { keyPath: 'id' });
      }

      // Store для pending операций
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'timestamp', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function saveToLocalDB<T extends { id: number }>(
  storeName: 'installations' | 'equipment',
  data: T
) {
  if (!db) await initDB();
  await db!.put(storeName, data);
}

export async function getFromLocalDB(storeName: 'installations' | 'equipment') {
  if (!db) await initDB();
  return db!.getAll(storeName);
}

export async function addPendingOperation(
  type: 'create' | 'update' | 'delete',
  entity: string,
  data: any
) {
  if (!db) await initDB();
  await db!.add('pending', {
    type,
    entity,
    data,
    timestamp: Date.now(),
  });
}

export async function getPendingOperations() {
  if (!db) await initDB();
  return db!.getAll('pending');
}

export async function clearPendingOperation(key: number) {
  if (!db) await initDB();
  await db!.delete('pending', key);
}

// Использование в hooks
export function useInstallationsOffline() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchInstallations = useCallback(async () => {
    try {
      if (isOnline) {
        const data = await installationsApi.getAll();
        // Сохранить локально
        data.forEach(inst => saveToLocalDB('installations', inst));
        setInstallations(data);
      } else {
        // Использовать локальные данные
        const localData = await getFromLocalDB('installations');
        setInstallations(localData);
      }
    } catch (error) {
      console.error('Error fetching installations:', error);
      // Fallback к локальным данным
      const localData = await getFromLocalDB('installations');
      setInstallations(localData);
    }
  }, [isOnline]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  const createInstallation = useCallback(
    async (data: Omit<Installation, 'id'>) => {
      // Добавить локально с временным ID
      const tempId = Date.now();
      const tempData = { ...data, id: tempId } as Installation;

      await saveToLocalDB('installations', tempData);
      setInstallations(prev => [tempData, ...prev]);

      if (isOnline) {
        try {
          const result = await installationsApi.create(data);
          // Заменить временный ID на реальный
          await saveToLocalDB('installations', result);
          setInstallations(prev =>
            prev.map(inst => (inst.id === tempId ? result : inst))
          );
        } catch (error) {
          // Сохранить как pending operation
          await addPendingOperation('create', 'installation', data);
        }
      } else {
        // Сохранить как pending operation
        await addPendingOperation('create', 'installation', data);
      }
    },
    [isOnline]
  );

  return { installations, isOnline, createInstallation, refetch: fetchInstallations };
}
```

---

## Multi-Step Form

### Wizard Component для CreateInstallationDialog

```typescript
// src/components/CreateInstallationWizard.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isValid?: () => boolean;
}

interface CreateInstallationWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreateInstallationWizard({
  open,
  onClose,
  onSubmit,
}: CreateInstallationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rack: '',
    eventId: null,
    laptopId: null,
    printer1: { type: null, id: null },
    printer2: { type: null, id: null },
  });

  const steps: Step[] = [
    {
      id: 'basic-info',
      title: 'Основная информация',
      description: 'Укажите стойку и мероприятие',
      component: <BasicInfoStep data={formData} onChange={setFormData} />,
      isValid: () => formData.rack && formData.eventId,
    },
    {
      id: 'equipment',
      title: 'Оборудование',
      description: 'Выберите ноутбук и принтеры',
      component: <EquipmentStep data={formData} onChange={setFormData} />,
      isValid: () => formData.laptopId,
    },
    {
      id: 'confirmation',
      title: 'Подтверждение',
      description: 'Проверьте информацию',
      component: <ConfirmationStep data={formData} />,
      isValid: () => true,
    },
  ];

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Сбросить форму
      setCurrentStep(0);
      setFormData({
        rack: '',
        eventId: null,
        laptopId: null,
        printer1: { type: null, id: null },
        printer2: { type: null, id: null },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Step Content */}
        <div className="py-6 min-h-64">{step.component}</div>

        {/* Actions */}
        <Separator />
        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
          >
            ← Назад
          </Button>
          <Button
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!step.isValid?.() || loading}
            loading={loading}
          >
            {currentStep === steps.length - 1 ? 'Создать' : 'Далее →'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Step компоненты
function BasicInfoStep({ data, onChange }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="C-5"
        value={data.rack}
        onChange={(e) => onChange({ ...data, rack: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      />
      <select
        value={data.eventId || ''}
        onChange={(e) => onChange({ ...data, eventId: Number(e.target.value) || null })}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Выберите мероприятие...</option>
        {/* Options */}
      </select>
    </div>
  );
}

function EquipmentStep({ data, onChange }) {
  return (
    <div className="space-y-4">
      <select
        value={data.laptopId || ''}
        onChange={(e) => onChange({ ...data, laptopId: Number(e.target.value) || null })}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Выберите ноутбук...</option>
        {/* Options */}
      </select>
      {/* Printer selects */}
    </div>
  );
}

function ConfirmationStep({ data }) {
  return (
    <div className="space-y-4">
      <div className="bg-accent/10 p-4 rounded">
        <p className="text-sm"><strong>Стойка:</strong> {data.rack}</p>
        <p className="text-sm"><strong>Мероприятие:</strong> Event #{data.eventId}</p>
        <p className="text-sm"><strong>Ноутбук:</strong> Laptop #{data.laptopId}</p>
      </div>
    </div>
  );
}
```

---

## Export Utilities

### CSV и Excel экспорт

```typescript
// src/lib/export/exporters.ts
export function exportToCSV(
  data: Record<string, any>[],
  filename: string = 'export.csv'
) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Экранировать кавычки и оборачивать в кавычки если нужно
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
}

export async function exportToExcel(
  data: Record<string, any>[],
  filename: string = 'export.xlsx'
) {
  // Требует: npm install xlsx
  const XLSX = await import('xlsx');

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, filename);
}

export async function exportToPDF(
  data: Record<string, any>[],
  title: string = 'Report',
  filename: string = 'export.pdf'
) {
  // Требует: npm install pdfkit
  const PDFDocument = (await import('pdfkit')).default;

  const doc = new PDFDocument({ size: 'A4' });
  const stream = doc.pipe(
    new Blob([], { type: 'application/pdf' }) as any
  );

  // Header
  doc.fontSize(16).font('Helvetica-Bold').text(title, 50, 50);
  doc.fontSize(10).font('Helvetica').text(new Date().toLocaleDateString(), 50, 80);

  // Table
  let y = 120;
  const headers = Object.keys(data[0]);
  const colWidth = (595 - 100) / headers.length;

  // Header row
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#333');
  headers.forEach((header, i) => {
    doc.text(header, 50 + i * colWidth, y, { width: colWidth, align: 'left' });
  });

  y += 20;
  doc.strokeColor('#ddd').moveTo(50, y).lineTo(545, y).stroke();
  y += 10;

  // Data rows
  doc.font('Helvetica').fillColor('#000');
  data.forEach((row, rowIndex) => {
    if (y > 750) {
      doc.addPage();
      y = 50;
    }

    headers.forEach((header, colIndex) => {
      const value = String(row[header] ?? '');
      doc.fontSize(8).text(value, 50 + colIndex * colWidth, y, {
        width: colWidth,
        align: 'left',
        ellipsis: true,
      });
    });

    y += 15;

    if (rowIndex < data.length - 1) {
      doc.strokeColor('#f0f0f0').moveTo(50, y).lineTo(545, y).stroke();
      y += 5;
    }
  });

  doc.end();

  // Скачать файл
  stream.on('finish', () => {
    const blob = stream as Blob;
    downloadFile(blob, filename, 'application/pdf');
  });
}

function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: mimeType })
    : content;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Использование в компонентах
<Button onClick={() => {
  exportToCSV(installations, 'installations.csv');
}}>
  <Download className="h-4 w-4 mr-2" />
  Скачать CSV
</Button>
```

---

## Заключение

Эти примеры показывают как реализовать основные рекомендации:

✅ Error Boundary для обработки ошибок
✅ Query Cache для оптимизации API
✅ Loading States для лучшего UX
✅ Переиспользуемые компоненты
✅ Offline Support с Service Worker
✅ Multi-step Form для сложных процессов
✅ Export функции для данных

Каждый пример готов к копированию и использованию в проекте.

