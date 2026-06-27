import prisma from './src/lib/prisma';

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TYPE "RequestStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';`);
  await prisma.$executeRawUnsafe(`ALTER TYPE "EscrowStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';`);
  console.log('Enums updated successfully');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
