import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: DataPoint[];
  max?: number;
  unit?: string;
}

export function TrendChart({ title, data, max, unit }: TrendChartProps) {
  const maxValue = max || Math.max(...data.map(d => d.value), 1);
  const avgValue = Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length);

  return (
    <Card className="border-border/40 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {title}
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Среднее: {avgValue}{unit || ''}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini bar chart */}
        <div className="space-y-2">
          {data.map((point) => (
            <div key={point.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{point.label}</span>
                <span className="font-semibold">{point.value}{unit || ''}</span>
              </div>
              <div className="w-full bg-muted rounded-full overflow-hidden h-2">
                <div
                  className="bg-primary/80 h-full rounded-full transition-all"
                  style={{ width: `${(point.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
