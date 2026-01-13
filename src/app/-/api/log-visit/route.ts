import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { domain, slug, referrer, userAgent, ip } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const domainRecord = await db.domain.findFirst({
      where: { host: domain },
    });
    if (!domainRecord) {
      throw new Error('Domain not found');
    }

    const targetUrl = await db.url.findFirst({
      where: {
        slug,
        domainId: domainRecord.id,
      },
    });
    if (!targetUrl) {
      throw new Error('URL not found');
    }

    await db.visit.create({
      data: {
        referrer,
        userAgent,
        ip,
        url: { connect: { id: targetUrl.id } },
        domain: { connect: { id: domainRecord.id } },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
  }
}
