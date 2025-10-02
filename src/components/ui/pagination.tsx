'use client';

import Link from 'next/link';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  queryParams?: Record<string, string | string[]>;
  sortFields?: string[];
  sortOrders?: string[];
};

function getPaginationRange(
  total: number,
  current: number
): (number | string)[] {
  const delta = 2;
  const range: (number | string)[] = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) range.unshift('...');
  if (current + delta < total - 1) range.push('...');

  range.unshift(1);
  if (total > 1) range.push(total);

  return range;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = '',
  queryParams = {},
  sortFields = [],
  sortOrders = [],
}: PaginationProps) {
  const router = useRouter();

  const makeUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams({ ...queryParams } as Record<
        string,
        string
      >);
      params.set('page', page.toString());
      if (sortFields.length) params.set('sort', sortFields.join(','));
      if (sortOrders.length) params.set('order', sortOrders.join(','));
      return `${basePath}?${params.toString()}`;
    },
    [basePath, queryParams, sortFields, sortOrders]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        router.push(makeUrl(currentPage + 1));
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        router.push(makeUrl(currentPage - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPage, totalPages, router, makeUrl]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-sm">
      <Button
        variant="outline"
        className="focus-visible:ring"
        disabled={currentPage <= 1}
        asChild
      >
        <Link href={makeUrl(1)}>
          <span className="sm:hidden">&laquo;</span>
          <span className="hidden sm:inline">&laquo; First</span>
        </Link>
      </Button>

      <Button
        variant="outline"
        className="focus-visible:ring"
        disabled={currentPage <= 1}
        asChild
      >
        <Link href={makeUrl(currentPage - 1)}>
          <span className="sm:hidden">&lsaquo;</span>
          <span className="hidden sm:inline">&lsaquo; Prev</span>
        </Link>
      </Button>

      {getPaginationRange(totalPages, currentPage).map(
        (p: number | string, i: number) =>
          p === '...' ? (
            <span key={i} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={i}
              variant={p === currentPage ? 'default' : 'outline'}
              className="min-w-[2rem] focus-visible:ring"
              asChild
            >
              <Link href={makeUrl(p as number)}>{p}</Link>
            </Button>
          )
      )}

      <Button
        variant="outline"
        className="focus-visible:ring"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link href={makeUrl(currentPage + 1)}>
          <span className="sm:hidden">&rsaquo;</span>
          <span className="hidden sm:inline">Next &rsaquo;</span>
        </Link>
      </Button>

      <Button
        variant="outline"
        className="focus-visible:ring"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link href={makeUrl(totalPages)}>
          <span className="sm:hidden">&raquo;</span>
          <span className="hidden sm:inline">Last &raquo;</span>
        </Link>
      </Button>
    </div>
  );
}
