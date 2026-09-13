import prisma from '../src/lib/prisma';

async function main() {
  console.log('Seeding an Escrow Quote...');

  // Get customer and artisan
  const customer = await prisma.customerProfile.findFirst({
    where: { user: { email: 'customer@demo.com' } }
  });
  const artisan = await prisma.artisanProfile.findFirst({
    where: { user: { email: 'plumber@demo.com' } }
  });

  if (!customer || !artisan) {
    console.error('Missing customer or artisan');
    return;
  }

  // Create a pending request
  const request = await prisma.serviceRequest.create({
    data: {
      customer_id: customer.id,
      artisan_id: artisan.id,
      title: 'Screenshot Escrow Request',
      description: 'This is a test request specifically for capturing the Escrow UI screenshot.',
      address: 'Test Address',
      status: 'QUOTED'
    }
  });

  // Create the quote
  await prisma.quote.create({
    data: {
      request_id: request.id,
      artisan_id: artisan.id,
      amount: 250.00,
      description: 'Will fix everything perfectly.',
      status: 'PENDING',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Successfully seeded quote for request:', request.title);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
