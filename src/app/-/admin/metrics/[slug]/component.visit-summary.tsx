import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Url, Visit } from '@prisma/client';
import { groupBy } from 'lodash';
import { format } from 'date-fns';

type ExtendedUrl = Url & {
  visits: Visit[];
};

type VisitSummaryProps = {
  className?: string;
  url: ExtendedUrl;
};

export default async function VisitSummary({
  className,
  url,
}: VisitSummaryProps) {
  const visits = url.visits;

  const byDay = groupBy(visits, v =>
    format(new Date(v.visitedAt), 'yyyy-MM-dd')
  );
  const busiestDay =
    Object.entries(byDay).sort((a, b) => b[1].length - a[1].length)[0]?.[0] ||
    'N/A';

  const byHour = groupBy(visits, v => new Date(v.visitedAt).getHours());
  const busiestHour =
    Object.entries(byHour).sort((a, b) => b[1].length - a[1].length)[0]?.[0] ||
    'N/A';

  const byIp = groupBy(visits, v => v.ip);
  const busiestIp =
    Object.entries(byIp).sort((a, b) => b[1].length - a[1].length)[0]?.[0] ||
    'N/A';

  const times = visits.map(v => new Date(v.visitedAt).getHours());
  const averageHour =
    times.length > 0
      ? Math.round(times.reduce((acc, h) => acc + h, 0) / times.length)
      : null;
  const mostActiveTime = averageHour !== null ? `${averageHour}:00` : 'N/A';

  const mostActiveDay = visits.length
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        visits
          .map(v => new Date(v.visitedAt).getDay())
          .reduce((acc, d, _, arr) =>
            arr.filter(x => x === d).length > arr.filter(x => x === acc).length
              ? d
              : acc
          )
      ]
    : 'N/A';

  return (
    <Card className={cn('w-1/2', className)}>
      <CardHeader>
        <div className="flex gap-4">
          <CardTitle className="text-lg font-semibold">Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-start gap-6">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>Busiest Day: {busiestDay}</div>
          <div>Busiest Hour: {busiestHour}:00</div>
          <div>Busiest IP: {busiestIp}</div>
          <div>
            Most active time: {mostActiveTime} on {mostActiveDay}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
