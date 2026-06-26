const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe('ALTER PUBLICATION supabase_realtime ADD TABLE "Message";');
  console.log("Realtime enabled for Message table.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
