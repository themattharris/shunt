import { PrismaClient } from '@prisma/client';
import geo from 'geoip-lite';

const prisma = new PrismaClient();

async function backfillGeo() {
  const visits = await prisma.visit.findMany({
    where: {
      OR: [{ country: null }, { region: null }, { city: null }],
    },
    take: 1000, // batch size
  });

  for (const visit of visits) {
    if (!visit.ip) continue;
    const lookup = geo.lookup(visit.ip);
    if (!lookup) continue;

    console.log(`Backfilling visit ${visit.id} with IP ${visit.ip}`);
    console.log(`Lookup result: ${JSON.stringify(lookup)}`);

    await prisma.visit.update({
      where: { id: visit.id },
      data: {
        country: lookup.country,
        region: lookup.region,
        city: lookup.city,
        latitude: lookup.ll[0],
        longitude: lookup.ll[1],
        timezone: lookup.timezone,
        metro: lookup.metro,
        area: lookup.area,
      },
    });
  }

  console.log(`✅ Backfilled ${visits.length} visits`);
}

backfillGeo()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
