import prisma from './src/lib/prisma';

async function main() {
  const func: any[] = await prisma.$queryRawUnsafe(`
    SELECT pg_get_functiondef(oid) as def
    FROM pg_proc
    WHERE proname = 'handle_new_user';
  `);
  console.log("FUNCTION:", func);
}
main().finally(() => prisma.$disconnect());
