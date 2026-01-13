import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import UserAgent from 'user-agents';

const prisma = new PrismaClient();
async function main() {
  const domains = await Promise.all([
    prisma.domain.upsert({
      where: { host: 'shunt.to' },
      update: {},
      create: {
        host: 'shunt.to',
        title: 'Shunt',
        description: 'A URL shortener',
        adminPasswordHash: await bcrypt.hash('shunt', 10),
      },
    }),
  ]);

  const metricsUrl = await prisma.url.create({
    data: {
      slug: 'metrics',
      target: 'https://shunt.to/metrics',
      domain: { connect: { id: domains[0].id } },
      enabled: true,
      startAt: new Date(),
      endAt: null,
    },
  });

  const referrerPool = [
    null,
    'https://google.com',
    'https://twitter.com',
    'https://github.com',
    'https://newsletter.site',
  ];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await Promise.all(
    Array.from({ length: 1000 }).map((_, i) => {
      const isMobile = faker.datatype.boolean();
      const userAgent = new UserAgent({
        deviceCategory: isMobile ? 'mobile' : 'desktop',
      }).toString();
      return prisma.visit.create({
        data: {
          visitedAt: i < 75 ? today : faker.date.recent({ days: 90 }),
          referrer: faker.helpers.arrayElement(referrerPool),
          userAgent: userAgent,
          ip: faker.internet.ipv4({}),
          domain: { connect: { id: domains[0].id } },
          url: { connect: { id: metricsUrl.id } },
        },
      });
    })
  );

  for (let i = 0; i < 12; i++) {
    const slug = `slug${i}`;
    const target = faker.helpers.arrayElement([
      'https://www.nytimes.com',
      'https://vercel.com',
      'https://github.com',
      'https://www.wikipedia.org',
      'https://www.youtube.com',
      'https://openai.com',
      'https://nextjs.org',
      'https://www.apple.com',
      'https://www.reddit.com',
      'https://developer.mozilla.org',
    ]);

    const url = await prisma.url.create({
      data: {
        slug,
        target,
        domain: { connect: { id: domains[0].id } },
        enabled: i % 5 !== 0, // 1 in 5 are disabled
        startAt: yesterday,
        endAt: null,
      },
    });

    // Optionally add 1–10 visits
    const visitCount = faker.number.int({ min: 1, max: 10 });
    await Promise.all(
      Array.from({ length: visitCount }).map(() => {
        const isMobile = faker.datatype.boolean();
        const referrerPool = [
          null,
          'https://google.com',
          'https://twitter.com',
          'https://github.com',
          'https://newsletter.site',
        ];

        return prisma.visit.create({
          data: {
            visitedAt: faker.date.between({ from: yesterday, to: today }),
            referrer: faker.helpers.arrayElement(referrerPool),
            userAgent: isMobile
              ? faker.helpers.arrayElement([
                  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1',
                  'Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36',
                ])
              : faker.internet.userAgent(),
            ip: faker.internet.ipv4({}),
            domain: { connect: { id: domains[0].id } },
            url: { connect: { id: url.id } },
          },
        });
      })
    );
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
