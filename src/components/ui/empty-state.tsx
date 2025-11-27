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
