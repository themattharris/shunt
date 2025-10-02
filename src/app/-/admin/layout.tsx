import type { Metadata } from 'next';
import { getDomain } from '@/lib/server-utils';
import SiteLogo from '@/components/site-logo';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import LogoutButton from '@/components/logout-button';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getDomainFromHeaders } from '@/lib/server-utils';
import { ThemeToggle } from '@/components/theme-toggle';

export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomain();
  return {
    title: `Admin | ${domain?.title}`,
    description: `Admin panel for ${domain?.title}`,
  };
}

async function checkAuth(admin_password: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('admin_token')?.value;
  const password_match = await bcrypt.compare(token || '', admin_password);
  if (!password_match) {
    redirect('/-/login');
  }
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = await getDomainFromHeaders();
  const domain = await db.domain.findFirst({
    where: {
      host: host,
    },
  });
  if (!domain) return <div>Domain not found</div>;
  await checkAuth(domain.admin_password);

  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <header
          className="container border-b-2 w-full mx-auto px-0 sm:px-4 py-1 flex justify-between items-center"
          role="banner"
          aria-label="Admin site header"
        >
          <Link href="/-/admin" aria-label="Admin Home">
            <SiteLogo className="w-24 mx-0 my-2" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>
        <main className="flex-grow container mx-auto px-0 sm:px-4 py-8">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  );
}
