import { kv } from '@vercel/kv';

export async function getCachedKey(domain: string, key: string) {
  const domain_key = `${domain}:${key}`;
  return await kv.get<string>(domain_key);
}

export async function setCachedKeys(domain: string, slug: string, url: string) {
  const domain_key = `${domain}:${slug}`;
  await kv.set(domain_key, url);
}

export async function incrCacheKey(domain: string, key: string) {
  const domain_key = `${domain}:${key}`;
  return await kv.incr(domain_key);
}

export async function delCachedKey(domain: string, key: string) {
  const domain_key = `${domain}:${key}`;
  return await kv.del(domain_key);
}
