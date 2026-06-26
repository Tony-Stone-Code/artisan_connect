require('dotenv').config({ path: '.env.local' });
require('ts-node').register({ transpileOnly: true });

const { prisma } = require('./src/lib/prisma.ts');

async function main() {
  const users = await prisma.user.findMany();
  console.log('Total users in public.User:', users.length);
  console.dir(users, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
