'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { UAParser } from 'ua-parser-js';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const RANGE_OPTIONS = [
  { label: 'Today', value: '1d' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year', value: '365d' },
];

type UserAgentData = {
  ua: string;
  count: number;
};

type TopUserAgentsProps = {
  className?: string;
  visitsByRange: Record<string, { userAgent: string | null }[]>;
  initialRange?: string;
};

export default function TopUserAgents({
  className,
  visitsByRange,
  initialRange = '30d',
}: TopUserAgentsProps) {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  const data: Record<string, UserAgentData[]> = Object.fromEntries(
    Object.entries(visitsByRange)
      .map(([range, visits]) => [
        range,
        visits.reduce<Record<string, number>>((acc, v) => {
          const key = v.userAgent ?? 'Unknown';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}),
      ])
      .map(([range, counts]) => [
        range,
        Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([ua, count]) => ({ ua, count })),
      ])
  );

  const currentData = data[selectedRange] ?? [];

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Top User Agents</CardTitle>
        <div className="flex items-center gap-2">
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
      <CardContent className="space-y-2 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 justify-items-center">
          {['type', 'os', 'browser'].map(chartType => {
            const donutGrouped = currentData.reduce<Record<string, number>>(
              (acc, { ua, count }) => {
                const parsed = new UAParser(ua).getResult();
                const key =
                  chartType === 'type'
                    ? (parsed.device.type ?? 'desktop')
                    : chartType === 'os'
                      ? (parsed.os.name ?? 'Unknown OS')
                      : (parsed.browser.name ?? 'Unknown Browser');
                acc[key] = (acc[key] || 0) + count;
                return acc;
              },
              {}
            );
            const donutTotal = Object.values(donutGrouped).reduce(
              (a, b) => a + b,
              0
            );
            const donutEntries = Object.entries(donutGrouped)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);
            const otherCount =
              donutTotal - donutEntries.reduce((sum, [, val]) => sum + val, 0);
            if (otherCount > 0) {
              donutEntries.push(['Other', otherCount]);
            }

            const colors = [
              'text-chart-1',
              'text-chart-2',
              'text-chart-3',
              'text-chart-4',
              'text-chart-5',
            ];

            return (
              <div
                key={chartType}
                className="flex flex-row items-start gap-4 w-full justify-center"
              >
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 36 36"
                  className="rotate-[-90deg]"
                >
                  {(() => {
                    let cumulativePercent = 0;
                    return donutEntries.map(([label, value], i) => {
                      const percent = (value / donutTotal) * 100;
                      const strokeDasharray = `${percent} 100`;
                      const strokeDashoffset = `${-cumulativePercent}`;
                      cumulativePercent += percent;
                      return (
                        <circle
                          key={label}
                          r="15.91549431"
                          cx="18"
                          cy="18"
                          fill="transparent"
                          stroke="currentColor"
                          className={colors[i % colors.length]}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeWidth="2"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="flex flex-col flex-wrap gap-2 text-sm text-muted-foreground mt-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {chartType}
                  </span>
                  {donutEntries.map(([label], i) => (
                    <div key={label} className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${colors[i % colors.length]}`}
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
