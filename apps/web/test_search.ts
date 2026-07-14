import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const query = "Boat";
  const whereClause: any = {
    is_available: true,
    user: {
      role: 'ARTISAN',
    }
  };

  const orConditions: any[] = [
    { business_name: { contains: query, mode: 'insensitive' } },
    { bio: { contains: query, mode: 'insensitive' } },
  ];

  const queryParts = query.split(' ').filter(p => p.length > 0);
  if (queryParts.length > 0) {
    orConditions.push({
      AND: queryParts.map(part => ({
        OR: [
          { user: { first_name: { contains: part, mode: 'insensitive' } } },
          { user: { last_name: { contains: part, mode: 'insensitive' } } }
        ]
      }))
    });
  }

  whereClause.OR = orConditions;

  console.log("Where Clause:", JSON.stringify(whereClause, null, 2));

  try {
    const artisans = await prisma.artisanProfile.findMany({
      where: whereClause,
      include: {
        user: true
      }
    });
    console.log("Found:", artisans.length);
    console.log(artisans.map(a => a.user.first_name + " " + a.user.last_name));
  } catch (e) {
    console.error("Error:", e);
  }
}

main().finally(() => prisma.$disconnect());
