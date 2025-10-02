// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCachedKey, setCachedKeys, incrCacheKey } from '@/lib/kv';
import { getDomainFromRequest } from '@/lib/utils';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internal routes
  if (pathname.startsWith('/-/')) {
    return NextResponse.next();
  }

  // Assume the slug is the pathname without the leading slash.
  const domain = getDomainFromRequest(req);
  const slug = pathname.slice(1);

  let targetUrl = await getCachedKey(domain, slug);

  // Try fetching from cache
  if (!targetUrl) {
    // Not in cache, defer to /api/resolve for resolution
    const res = await fetch(`${req.nextUrl.origin}/-/api/resolve?slug=${slug}`);
    if (res.ok) {
      const data = await res.json();
      targetUrl = data.target;
      if (targetUrl) {
        setCachedKeys(domain, slug, targetUrl).catch(console.error);
      }
    } else {
      console.error('Error fetching target URL:', res.statusText);
    }
  }

  if (targetUrl) {
    // Log the visit asynchronously (don't await to speed up redirection)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : req.headers.get('x-real-ip');

    fetch(`${req.nextUrl.origin}/-/api/log-visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: domain,
        slug,
        referrer: req.headers.get('referer'),
        userAgent: req.headers.get('user-agent'),
        ip,
      }),
    }).catch(console.error);

    incrCacheKey(domain, slug);
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

// Specify the matcher to catch all paths that aren’t static assets.
export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)',
};
