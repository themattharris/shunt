import { headers } from 'next/headers';
import { resolveDevHostname } from '@/lib/utils';
import { db } from '@/lib/db';

export async function getDomainFromHeaders() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host');
  if (!host) {
    throw new Error('Host header not found');
  }
  return resolveDevHostname(host);
}

export async function getDomain() {
  const host = await getDomainFromHeaders();
  return await db.domain.findFirst({
    where: {
      host: host,
    },
  });
}
