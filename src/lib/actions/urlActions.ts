'use server';

import { db } from '@/lib/db';
import { getDomainFromHeaders } from '@/lib/server-utils';
import { shuffle } from 'lodash';
import { delCachedKey } from '@/lib/kv';

async function getDomain() {
  const host = await getDomainFromHeaders();
  return db.domain.findFirst({
    where: {
      host: host,
    },
  });
}

export async function addUrl(formData: FormData) {
  const slug = formData.get('slug')?.toString();
  const target = formData.get('target')?.toString();

  if (!slug || !target) {
    throw new Error('Missing slug or target');
  }

  const domain = await getDomain();
  if (!domain) {
    throw new Error('Domain not found');
  }

  try {
    await db.url.create({
      data: { slug, target, enabled: true, domain: domain.host },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add URL');
  }
}

export async function updateUrl(formData: FormData) {
  const id = formData.get('id') ? Number(formData.get('id')) : undefined;
  const slug = formData.get('slug')?.toString();
  const target = formData.get('target')?.toString();
  const domain = await getDomain();
  if (!id || !slug || !target) {
    throw new Error('Missing slug or target');
  }
  if (!domain) {
    throw new Error('Domain not found');
  }
  try {
    await db.url.update({
      where: { id: id, domain: domain.host },
      data: { slug, target },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update URL');
  }
}

export async function deleteUrl(formData: FormData) {
  const slug = formData.get('slug')?.toString();
  const target = formData.get('target')?.toString();

  if (!slug || !target) {
    throw new Error('Missing slug or target');
  }

  const domain = await getDomain();
  if (!domain) {
    throw new Error('Domain not found');
  }

  try {
    await db.url.delete({
      where: { slug, target, domain: domain.host },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete URL');
  }
}

export async function toggleUrl(formData: FormData) {
  const slug = formData.get('slug')?.toString();
  const enabled = formData.get('enabled')?.toString() === 'true';

  if (!slug) throw new Error('Missing slug');

  const domain = await getDomain();
  if (!domain) {
    throw new Error('Domain not found');
  }

  try {
    await db.url.update({
      where: { slug, domain: domain.host },
      data: { enabled },
    });
    if (!enabled) {
      // clear the cache if the URL is disabled
      await delCachedKey(domain.host, slug);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to toggle URL');
  }
}

export async function topUrls(
  limit: number = 10,
  since_date: Date = new Date(),
  order: 'asc' | 'desc' | 'rand' = 'desc'
) {
  const domain = await getDomain();
  if (!domain) {
    throw new Error('Domain not found');
  }

  try {
    const urlVisits = await db.visit.groupBy({
      by: ['urlId'],
      where: {
        Url: {
          domain: domain.host,
          enabled: true,
          visits: {
            some: {
              visitedAt: {
                gte: since_date,
              },
            },
          },
        },
      },
      _count: {
        urlId: true,
      },
      orderBy:
        order === 'rand'
          ? undefined
          : {
              _count: {
                urlId: order,
              },
            },
      take: limit,
    });

    let urlIds = urlVisits.map(v => v.urlId).filter(Boolean) as number[];
    if (order === 'rand') {
      urlIds = shuffle(urlIds).slice(0, limit);
    }

    const urls = await db.url.findMany({
      where: {
        id: { in: urlIds },
      },
    });

    return urls;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch top URLs');
  }
}

export async function getUrl(slug: string, enabled: boolean = true) {
  const domain = await getDomain();
  if (!domain) {
    console.error('Domain not found');
    return null;
  }

  try {
    const urlEntry = await db.url.findFirst({
      where: { slug, domain: domain.host, enabled },
    });

    if (!urlEntry) {
      return null;
    }

    const now = new Date();
    if (
      (urlEntry.startAt && now < urlEntry.startAt) ||
      (urlEntry.endAt && now > urlEntry.endAt)
    ) {
      return null;
    }
    return urlEntry;
  } catch (error) {
    console.error(error);
    return null;
  }
}
