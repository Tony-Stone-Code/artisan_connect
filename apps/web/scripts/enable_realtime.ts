import prisma from '../src/lib/prisma';

async function main() {
  try {
    // Check if publication exists
    const pubExists = await prisma.$queryRaw`
      SELECT pubname FROM pg_publication WHERE pubname = 'supabase_realtime';
    `;
    
    if ((pubExists as any[]).length === 0) {
      console.log('Creating publication supabase_realtime...');
      await prisma.$executeRawUnsafe(`CREATE PUBLICATION supabase_realtime;`);
    }

    console.log('Adding Message table to supabase_realtime publication...');
    await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "Message";`);
    console.log('Successfully enabled Realtime for Message table!');
  } catch (e: any) {
    if (e.message.includes('already part of publication')) {
       console.log('Table is already in the publication. Good to go!');
    } else {
       console.error('Error:', e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
