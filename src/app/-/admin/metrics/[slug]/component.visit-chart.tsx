'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Url, Visit } from '@prisma/client';
import { format } from 'date-fns';
import { groupBy } from 'lodash';
import { formatHex, parse } from 'culori';
import { useTheme } from '@/lib/context/theme';
import { Button } from '@/components/ui/button';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer as RC,
} from 'recharts';

type ExtendedUrl = Url & {
  visits: Visit[];
};

type VisitChartsProps = {
  className?: string;
  url: ExtendedUrl;
};

export default function VisitCharts({ className, url }: VisitChartsProps) {
  const { theme, setTheme } = useTheme();
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [selectedRange, setSelectedRange] = useState<
    '1h' | '6h' | '12h' | '24h' | '7d' | '30d' | 'all'
  >('all');

  useEffect(() => {
    const updateColor = () => {
      const computed = getComputedStyle(document.documentElement);
      const raw = computed.getPropertyValue('--chart-3').trim();
      const parsed = parse(raw);
      const hex = parsed ? formatHex(parsed) : '#000000';
      setForegroundColor(hex);
    };

    if (!setTheme) return;

    updateColor();
  }, [setTheme, theme]);

  const visits = url.visits;

  const now = new Date();
  const filteredVisits = visits.filter(v => {
    const visitDate = new Date(v.visitedAt);
    if (selectedRange === '1h')
      return (
        visitDate > new Date(now.getTime() - 1 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    if (selectedRange === '6h')
      return (
        visitDate > new Date(now.getTime() - 6 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    if (selectedRange === '12h')
      return (
        visitDate > new Date(now.getTime() - 12 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    if (selectedRange === '24h')
      return (
        visitDate > new Date(now.getTime() - 24 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    if (selectedRange === '7d')
      return (
        visitDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    if (selectedRange === '30d')
      return (
        visitDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) &&
        visitDate <= now
      );
    return true;
  });

  const showFullDailyRange = !['1h', '6h', '12h'].includes(selectedRange);
  const dailySource = showFullDailyRange ? filteredVisits : visits;

  const byDay = groupBy(dailySource, v =>
    format(new Date(v.visitedAt), 'yyyy-MM-dd')
  );
  const byIp = groupBy(filteredVisits, v => v.ip);

  const byReferrer = groupBy(filteredVisits, v => v.referrer ?? 'Direct');
  const referrerData = Object.entries(byReferrer).map(([referrer, visits]) => ({
    name: referrer,
    value: visits.length,
  }));

  const dayData = Object.entries(byDay).map(([day, visits]) => ({
    name: day,
    count: visits.length,
  }));

  const timeBucketSize =
    selectedRange === '1h'
      ? 5
      : selectedRange === '6h'
        ? 15
        : selectedRange === '12h'
          ? 30
          : 60;

  const hourLabels = (() => {
    const labels: string[] = [];
    for (let i = 0; i < 1440; i += timeBucketSize) {
      const h = Math.floor(i / 60)
        .toString()
        .padStart(2, '0');
      const m = (i % 60).toString().padStart(2, '0');
      labels.push(`${h}:${m}`);
    }
    return labels;
  })();

  const byTimeBucket = groupBy(filteredVisits, v => {
    const date = new Date(v.visitedAt);
    const minutes = date.getHours() * 60 + date.getMinutes();
    const bucketStart = Math.floor(minutes / timeBucketSize) * timeBucketSize;
    const h = Math.floor(bucketStart / 60)
      .toString()
      .padStart(2, '0');
    const m = (bucketStart % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  });

  const hourData = hourLabels.map(label => ({
    name: label,
    count: byTimeBucket[label]?.length || 0,
  }));

  const ipData = Object.entries(byIp).map(([ip, visits]) => ({
    name: ip,
    count: visits.length,
  }));

  const dailyTrend = Object.entries(byDay)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, v]) => ({ name: date, count: v.length }));

  const heatmapData = Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 24 }, (_, h) => ({
      day: d,
      hour: h,
      count: filteredVisits.filter(v => {
        const date = new Date(v.visitedAt);
        return date.getDay() === d && date.getHours() === h;
      }).length,
    }))
  ).flat();

  const maxHeat = Math.max(...heatmapData.map(d => d.count), 1);

  return (
    <Card className={cn('w-1/2', className)}>
      <CardHeader>
        <div className="flex gap-4 justify-between">
          <CardTitle className="text-lg font-semibold">Events</CardTitle>
          <div className="flex gap-2 text-sm mb-4">
            {['1h', '6h', '12h', '24h', '7d', '30d', 'all'].map(range => (
              <Button
                key={range}
                className={cn(
                  'px-3 py-1 rounded border',
                  selectedRange === range ? '' : 'bg-muted text-foreground'
                )}
                onClick={() => setSelectedRange(range as typeof selectedRange)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-start gap-6">
        <div className="flex flex-col gap-6 mt-6 w-full">
          <div>
            <div className="text-sm font-semibold mb-2">Daily Visit Trend</div>
            <RC width="100%" height={100}>
              <LineChart data={dailyTrend}>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={foregroundColor}
                  dot={false}
                />
              </LineChart>
            </RC>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Visits per Day</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={foregroundColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">
              Visits per Time Bucket
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={foregroundColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Visits per IP</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ipData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={foregroundColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Visits by Referrer</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={referrerData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {referrerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={foregroundColor} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">
              Visits Heatmap (Hour × Day)
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-px bg-border text-[10px]">
                <div className="bg-background" />
                {Array.from({ length: 24 }, (_, h) => (
                  <div
                    key={`h-${h}`}
                    className="text-center bg-background text-muted-foreground"
                  >
                    {h}
                  </div>
                ))}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (dayLabel, d) => (
                    <React.Fragment key={`row-${d}`}>
                      <div className="bg-background text-right pr-1 text-muted-foreground">
                        {dayLabel}
                      </div>
                      {Array.from({ length: 24 }, (_, h) => {
                        const value =
                          heatmapData.find(
                            cell => cell.day === d && cell.hour === h
                          )?.count || 0;
                        const intensity = value / maxHeat;
                        const bg = `rgba(0, 0, 0, ${intensity})`;
                        return (
                          <div
                            key={`cell-${d}-${h}`}
                            title={`${value} visits`}
                            style={{ backgroundColor: bg }}
                            className="h-5"
                          />
                        );
                      })}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
