import { NextRequest, NextResponse } from 'next/server';
import { getUrl } from '@/lib/actions/urlActions';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const enabled = true;
    const urlEntry = await getUrl(slug, enabled);

    if (!urlEntry) {
      return NextResponse.json({ target: null });
    }

    return NextResponse.json({
      id: urlEntry.id,
      target: urlEntry.target,
      domain: urlEntry.domain,
    });
  } catch (error) {
    console.error('Error resolving slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
