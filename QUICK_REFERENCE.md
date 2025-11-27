# 🚀 QUICK REFERENCE - EXPO-BOT-APP1 IMPROVEMENTS

## 📦 NEW COMPONENTS - Copy & Paste Ready

### ErrorBoundary
```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrap your app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Loading States
```typescript
import { ListSkeleton, CardSkeleton } from './ui/skeletons';

// Show while loading
if (loading) {
  return <ListSkeleton count={5} />;
}

// Or single card
return <CardSkeleton />;
```

### Empty States
```typescript
import { EmptyState } from './ui/empty-state';
import { Package } from 'lucide-react';

<EmptyState
  icon={<Package className="h-12 w-12" />}
  title="No data"
  description="Create your first item"
  action={<Button>Create</Button>}
  variant="default" // compact | default | large
/>
```

### Page Transitions
```typescript
import { PageTransition } from './components/PageTransition';

<PageTransition>
  <YourContent />
</PageTransition>
```

### Loading Indicator
```typescript
import { LoadingIndicator } from './ui/loading-indicator';

// Spinner
<LoadingIndicator variant="spinner" label="Loading..." />

// Dots
<LoadingIndicator variant="dots" label="Processing..." />

// Progress
<LoadingIndicator variant="progress" label="Uploading" progress={65} />
```

### Trend Chart
```typescript
import { TrendChart } from './components/TrendChart';

<TrendChart
  title="Usage by Zone"
  data={[
    { label: 'Zone A', value: 45 },
    { label: 'Zone B', value: 32 },
    { label: 'Zone C', value: 78 },
  ]}
  unit="%" // optional
/>
```

## 📊 API CACHE - Usage

### In Hooks
```typescript
import { useApiCache } from './hooks/useApiCache';

const { get, invalidate, getStats } = useApiCache();

// Fetch with cache
const data = await get(
  'my-data-key',
  () => api.fetchData(),
  5 * 60 * 1000 // 5 min TTL
);

// Invalidate after update
await apiCall();
invalidate(/^my-data:/); // regex pattern

// Get cache stats
console.log(getStats());
```

### Already Integrated Hooks
```typescript
// All these use QueryCache automatically:
- useInstallations()      // 2 min cache
- useEquipment()          // 5 min cache
- useConsumables()        // 3 min cache
- useEvents()             // 5 min cache
```

## 📤 EXPORT DATA

### CSV Export
```typescript
import { exportToCSV } from '../lib/export/exporters';

const handleExport = () => {
  const data = [
    { 'Name': 'Item 1', 'Status': 'Active' },
    { 'Name': 'Item 2', 'Status': 'Inactive' },
  ];
  exportToCSV(data, 'export.csv');
};
```

### Excel Export (requires xlsx)
```typescript
import { exportToExcel } from '../lib/export/exporters';

await exportToExcel(data, 'export.xlsx');
```

### PDF Export (requires pdfkit)
```typescript
import { exportToPDF } from '../lib/export/exporters';

await exportToPDF(data, 'Report Title', 'report.pdf');
```

## 🎯 QUICK INTEGRATION PATTERNS

### Complete Page Example
```typescript
import { useState } from 'react';
import { ListSkeleton } from './ui/skeletons';
import { EmptyState } from './ui/empty-state';
import { Package, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function MyPage() {
  const { items, loading } = useMyHook();

  // Show loading
  if (loading) return <ListSkeleton count={5} />;

  // Show empty
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="No items"
        description="Create your first item"
        action={<Button><Plus />Create</Button>}
      />
    );
  }

  // Show content
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### With API Cache
```typescript
import { useApiCache } from './hooks/useApiCache';

export function MyComponent() {
  const { get, invalidate } = useApiCache();
  const [data, setData] = useState(null);

  // Load with cache
  const loadData = async () => {
    const result = await get(
      'my-key',
      () => api.fetch(),
      5 * 60 * 1000
    );
    setData(result);
  };

  // Update and invalidate
  const updateData = async (newData) => {
    await api.update(newData);
    invalidate(/^my-/); // Invalidate all 'my-*' keys
    await loadData(); // Refetch fresh data
  };

  return (
    <div>
      {/* Use data */}
    </div>
  );
}
```

## 📍 WHERE TO FIND EXAMPLES

### Working Examples in Codebase
- **Loading States**: HomePage.tsx
- **Empty States**: InstallationsPage.tsx
- **Export**: StatisticsPage.tsx
- **QueryCache**: useInstallations.ts
- **Header Menu**: Header.tsx
- **Bottom Nav**: BottomNav.tsx

## 🎨 STYLING

All components use:
- ✅ Tailwind CSS
- ✅ Shadcn UI theme
- ✅ Dark theme (bg-background, text-foreground)
- ✅ Primary color for accents
- ✅ Muted for secondary text

Customize in `globals.css` or Tailwind config.

## ⚡ PERFORMANCE TIPS

1. **Use QueryCache for repeated API calls**
   ```typescript
   // Don't do this
   const data1 = await api.fetch(); // 1st call
   const data2 = await api.fetch(); // 2nd call (duplicate!)
   
   // Do this instead
   const data1 = await get('key', api.fetch, ttl);
   const data2 = await get('key', api.fetch, ttl); // From cache!
   ```

2. **Invalidate cache smartly**
   ```typescript
   // After user updates data
   invalidate(/^installations:/); // Clears all related caches
   ```

3. **Use useCallback in hooks**
   All new hooks use `useCallback` to prevent unnecessary re-renders.

## 🐛 COMMON ISSUES

### "Component not found"
Make sure you're importing from correct path:
```typescript
// ✅ Correct
import { ListSkeleton } from './ui/skeletons';
import { EmptyState } from './ui/empty-state';

// ❌ Wrong
import { ListSkeleton } from './skeletons';
```

### "Loading state not showing"
Check that your hook returns a `loading` boolean:
```typescript
// ✅ Make sure your hook returns loading
const { data, loading, error } = useMyHook();

// Show skeleton while loading
if (loading) return <ListSkeleton />;
```

### "Cache not working"
Make sure you're calling invalidate when data changes:
```typescript
// After API call
await api.create(data);
invalidate(/^installations:/); // Important!
await refetch(); // Now refetch will get fresh data
```

## 📚 FILES TO REMEMBER

| File | Purpose |
|------|---------|
| `ErrorBoundary.tsx` | Error handling |
| `skeletons.tsx` | Loading states |
| `empty-state.tsx` | Empty screens |
| `loading-indicator.tsx` | Progress indicators |
| `PageTransition.tsx` | Page animations |
| `cache.ts` | Cache logic |
| `exporters.ts` | Data export |
| `useApiCache.ts` | Cache hook |

## 🚀 NEXT STEPS

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Check Components**
   - Open any page and verify loading states work
   - Try creating/deleting items and check empty states
   - Verify no errors in console

3. **Deploy**
   ```bash
   npm run build
   ```

## 💡 TIPS & TRICKS

- Use `variant="compact"` for EmptyState in modals
- Use `variant="large"` for full-page empty states
- LoadingIndicator "dots" is better for quick operations
- LoadingIndicator "spinner" is better for long operations
- Use "progress" variant when you know the %

## 📞 QUICK HELP

**Page won't load?**
- Check ErrorBoundary wrapper in App.tsx ✅

**Data not showing?**
- Add EmptyState for when items.length === 0 ✅

**Loading forever?**
- Check if loading state is properly returned from hook ✅

**Cache not updating?**
- Call invalidate() after API changes ✅

---

**Version**: 1.0.0  
**Last Updated**: 2024-12-20  
**Status**: ✅ Production Ready
