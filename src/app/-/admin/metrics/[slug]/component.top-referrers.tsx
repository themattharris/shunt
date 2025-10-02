'use client';

import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const RANGE_OPTIONS = [
  { label: 'Today', value: '1d' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year', value: '365d' },
];

type VisitData = {
  referrer: string;
  count: number;
};

type TopReferrersProps = {
  className?: string;
  visitsByRange: Record<string, { referrer: string | null }[]>;
  initialRange?: string;
};

export default function TopReferrers({
  className,
  visitsByRange,
  initialRange = '30d',
}: TopReferrersProps) {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  const referrerCounts: Record<string, VisitData[]> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(visitsByRange).map(([range, visits]) => {
        const counts = visits.reduce<Record<string, number>>((acc, v) => {
          const key = v.referrer ?? 'Direct';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        return [
          range,
          Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([referrer, count]) => ({ referrer, count })),
        ];
      })
    );
  }, [visitsByRange]);

  const currentReferrers = referrerCounts[selectedRange] ?? [];

  return (
    <Card className={cn('w-1/2', className)}>
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle className="text-lg font-semibold">Top Referrers</CardTitle>
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-6 pt-0 flex items-start gap-6 w-full">
        {currentReferrers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data</p>
        ) : (
          <ul className="space-y-2 w-full">
            {currentReferrers.map(ref => (
              <li key={ref.referrer} className="flex text-sm">
                <span className="w-3/4 truncate">
                  {ref.referrer.startsWith('http') ? (
                    <Link
                      href={ref.referrer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {ref.referrer}
                      <ExternalLink className="w-3.5 h-3.5 inline-block" />
                    </Link>
                  ) : (
                    ref.referrer
                  )}
                </span>
                <span className="w-1/4 text-right">{ref.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
