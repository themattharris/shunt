import SiteLogo from '@/components/site-logo';
import { getDomain } from '@/lib/server-utils';
import { topUrls } from '@/lib/actions/urlActions';
import SlugRedirect from './component.slug-redirect';
import { Url } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const domain = await getDomain();
  const since_date = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const topUrlsList = await topUrls(10, since_date);

  return (
    <div className="w-full max-w-screen-md px-4 mx-auto">
      <SiteLogo />
      {domain?.show_input && (
        <div className="flex flex-col items-center justify-center w-full mt-8 mb-8">
          <SlugRedirect />
        </div>
      )}
      {domain?.show_top_slugs && topUrlsList.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full mt-16">
          <h2 className="text-xl font-bold mb-4">Most Visited Today</h2>
          <ul className="flex flex-wrap gap-2 justify-center">
            {topUrlsList.map((u: Url) => (
              <li key={u.id}>
                <Link href={`${u.target}`}>
                  <Button variant={'outline'} className="px-4 py-2">
                    {u.slug}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
