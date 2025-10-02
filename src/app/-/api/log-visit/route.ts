import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { domain, slug, referrer, userAgent, ip } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const targetUrl = await db.url.findFirst({
      where: {
        slug,
        domain: {
          equals: domain,
        },
      },
    });
    if (!domain) {
      throw new Error('Domain not found');
    }
    if (!targetUrl) {
      throw new Error('URL not found');
    }

    await db.visit.create({
      data: {
        domain,
        slug,
        referrer,
        userAgent,
        ip,
        urlId: targetUrl.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
  }
}
