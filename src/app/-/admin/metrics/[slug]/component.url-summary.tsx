import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Url, Visit } from '@prisma/client';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

type ExtendedUrl = Url & {
  visits: Visit[];
};

type UrlSummaryProps = {
  className?: string;
  url: ExtendedUrl;
};

async function getMicrolinkScreenshot(target: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(target)}&screenshot=true&meta=false`,
      {
        next: { revalidate: 3600 },
      }
    );
    const json = await res.json();
    return json?.data?.screenshot?.url ?? null;
  } catch {
    return null;
  }
}

export default async function UrlSummary({ className, url }: UrlSummaryProps) {
  const screenshot = await getMicrolinkScreenshot(url.target);

  const totalVisits = url.visits.length;
  const lastVisit = url.visits[0]?.visitedAt;
  const firstVisit = url.visits[url.visits.length - 1]?.visitedAt;
  return (
    <Card className={cn('w-1/2', className)}>
      <CardHeader>
        <div className="flex gap-4">
          <CardTitle className="text-lg font-semibold">Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-start gap-6">
        {screenshot && (
          <Image
            src={screenshot}
            alt={`Preview of ${url.target}`}
            className="w-48 h-32 object-cover rounded border"
            width={192}
            height={128}
          />
        )}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>Slug: {url.slug}</div>
          <div>
            URL:{' '}
            <span className="w-3/4 truncate">
              {url.target.startsWith('http') ? (
                <Link
                  href={url.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  {url.target}
                  <ExternalLink className="w-3.5 h-3.5 inline-block" />
                </Link>
              ) : (
                url.target
              )}
            </span>
          </div>
          <div>Total Visits: {totalVisits}</div>
          {firstVisit && (
            <div>First Visit: {new Date(firstVisit).toLocaleString()}</div>
          )}
          {lastVisit && (
            <div>Last Visit: {new Date(lastVisit).toLocaleString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
