import { prisma } from '../src/lib/prisma';

// Base coordinate: Accra (-0.1869, 5.6037)
const BASE_LNG = -0.1869;
const BASE_LAT = 5.6037;

async function main() {
  const artisans = await prisma.artisanProfile.findMany();
  
  for (const artisan of artisans) {
    if (artisan.latitude == null || artisan.longitude == null) {
      // Add random jitter of +/- 0.05 degrees (approx 5km)
      const lat = BASE_LAT + (Math.random() - 0.5) * 0.1;
      const lng = BASE_LNG + (Math.random() - 0.5) * 0.1;

      await prisma.artisanProfile.update({
        where: { id: artisan.id },
        data: {
          latitude: lat,
          longitude: lng,
        }
      });
      console.log(`Updated coordinates for artisan ${artisan.id}`);
    }
  }
  console.log("Coordinate generation complete.");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
