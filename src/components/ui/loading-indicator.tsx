import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  variant?: 'spinner' | 'dots' | 'progress';
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

  if (variant === 'progress') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
        <div className="w-full bg-muted rounded-full overflow-hidden h-2">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {label} {progress ? `${progress}%` : ''}
        </p>
      </div>
    );
  }

  return null;
}
