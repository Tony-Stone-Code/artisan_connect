import { prisma } from './src/lib/prisma';
async function main() {
  await prisma.$executeRawUnsafe('ALTER PUBLICATION supabase_realtime ADD TABLE "Message";');
  console.log("Realtime enabled for Message table.");
}
main().catch(console.error).finally(() => process.exit());
