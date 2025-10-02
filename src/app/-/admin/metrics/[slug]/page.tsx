import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import TopReferrers from './component.top-referrers';
import TopUserAgents from './component.top-user-agents';
import UrlSummary from './component.url-summary';
import VisitSummary from './component.visit-summary';
import VisitCharts from './component.visit-chart';
// import VisitorOrigins from '@/components/visitor-origins';

export default async function MetricsPage({
  params,
}: {
  params?: Promise<{ slug?: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return notFound();
  const url = await db.url.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      visits: {
        orderBy: { visitedAt: 'desc' },
      },
    },
  });

  if (!url) return notFound();

  const now = Date.now();
  const visitsByRange = {
    '1d': url.visits.filter(
      v => new Date(v.visitedAt) > new Date(now - 1 * 24 * 60 * 60 * 1000)
    ),
    '7d': url.visits.filter(
      v => new Date(v.visitedAt) > new Date(now - 7 * 24 * 60 * 60 * 1000)
    ),
    '30d': url.visits.filter(
      v => new Date(v.visitedAt) > new Date(now - 30 * 24 * 60 * 60 * 1000)
    ),
    '90d': url.visits.filter(
      v => new Date(v.visitedAt) > new Date(now - 90 * 24 * 60 * 60 * 1000)
    ),
    '365d': url.visits.filter(
      v => new Date(v.visitedAt) > new Date(now - 365 * 24 * 60 * 60 * 1000)
    ),
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-row justify-evenly gap-4">
        <UrlSummary className="w-1/2" url={url} />
        <VisitSummary className="w-1/2" url={url} />
      </div>
      <div className="flex flex-row justify-evenly gap-4">
        <VisitCharts className="w-full" url={url} />
      </div>
      <div className="flex flex-row justify-evenly gap-4">
        <TopReferrers className="w-1/2" visitsByRange={visitsByRange} />
        <TopUserAgents className="w-1/2" visitsByRange={visitsByRange} />
      </div>

      <div className="flex">
        {/* <VisitorOrigins className="w-full" visitsByRange={visitsByRange} /> */}
      </div>
    </div>
  );
}
