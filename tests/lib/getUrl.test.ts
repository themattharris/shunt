import { getUrl } from '@/lib/actions/urlActions';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/server-utils', () => ({
  getDomainFromHeaders: () => 'example.com',
}));

vi.mock('@/lib/db', () => ({
  db: {
    domain: {
      findFirst: vi.fn().mockResolvedValue({ host: 'example.com' }),
    },
    url: {
      findFirst: vi.fn().mockResolvedValue({
        slug: 'test',
        startAt: null,
        endAt: null,
        enabled: true,
      }),
    },
  },
}));

describe('getUrl', () => {
  it('returns the url object when valid', async () => {
    const result = await getUrl('test');
    expect(result?.slug).toBe('test');
  });

  it('returns null when disabled', async () => {
    vi.resetModules();

    vi.doMock('@/lib/db', () => ({
      db: {
        domain: {
          findFirst: vi.fn().mockResolvedValue({ host: 'example.com' }),
        },
        url: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    }));

    const { getUrl } = await import('@/lib/actions/urlActions.js');
    const result = await getUrl('test');
    expect(result).toBeNull();
  });
});
