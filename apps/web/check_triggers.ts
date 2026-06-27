import prisma from './src/lib/prisma';

async function main() {
  const triggers: any[] = await prisma.$queryRawUnsafe(`
    SELECT t.tgname, pg_get_triggerdef(t.oid) as def
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE c.relname = 'users';
  `);
  console.log("TRIGGERS:", triggers);
}
main().finally(() => prisma.$disconnect());
