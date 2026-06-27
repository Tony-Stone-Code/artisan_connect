import prisma from './src/lib/prisma';

async function main() {
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
  await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS public.handle_new_user();`);
  console.log("Trigger dropped successfully!");
}
main().finally(() => prisma.$disconnect());
