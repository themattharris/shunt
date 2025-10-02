import { Url } from '@prisma/client';
import { db } from '@/lib/db';
import { getDomainFromHeaders } from '@/lib/server-utils';
import AdminAddUrlRow from './component.add-url-row';
import AdminUrlRow from './component.url-row';
import { Pagination } from '@/components/ui/pagination';

export const metadata = {
  title: 'Admin | Shunt',
  description: 'Admin panel for managing URL shortcuts.',
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const host = await getDomainFromHeaders();
  const domain = await db.domain.findFirst({
    where: {
      host: host,
    },
  });
  if (!domain) return <div>Domain not found</div>;

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || '1', 10);
  const take = 10;
  const skip = (page - 1) * take;

  const [urls, total] = await Promise.all([
    db.url.findMany({
      where: { domain: domain.host },
      include: { _count: { select: { visits: true } } },
      skip,
      take,
      orderBy: { startAt: 'desc' },
    }) as Promise<(Url & { _count: { visits: number } })[]>,
    db.url.count({ where: { domain: domain.host } }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="sm:table w-full border-collapse hidden">
        <div className="table-header-group">
          <div className="table-row">
            <div className="table-cell text-left py-2 px-2 border-b font-semibold w-1/8">
              URLs
            </div>
            <div className="table-cell text-left py-2 px-2 border-b font-semibold w-1/12" />
            <div className="table-cell text-left py-2 px-2 border-b font-semibold w-5/8">
              Target
            </div>
            <div className="table-cell text-left py-2 px-2 border-b font-semibold w-1/8">
              Visits
            </div>
            <div className="table-cell text-left py-2 px-2 border-b font-semibold w-1/8">
              Actions
            </div>
          </div>
        </div>
        <div className="table-row-group">
          <AdminAddUrlRow />
          {urls.map(url => (
            <AdminUrlRow key={url.id} url={url} visits={url._count.visits} />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-4">
        <AdminAddUrlRow />
        {urls.map(url => (
          <div key={url.id} className="text-sm">
            <AdminUrlRow url={url} visits={url._count.visits} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <section className="w-full text-center mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/-/admin"
            queryParams={{}}
          />
        </section>
      )}
    </>
  );
}
