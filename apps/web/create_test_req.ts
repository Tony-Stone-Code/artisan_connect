import prisma from './src/lib/prisma';

async function main() {
  // Find any customer
  const customer = await prisma.customerProfile.findFirst({ include: { user: true } });
  // Find any artisan
  const artisan = await prisma.artisanProfile.findFirst({ include: { user: true } });

  if (!customer || !artisan) {
    console.log("Could not find a customer or artisan in the DB.");
    return;
  }

  // Create a pending request
  const req = await prisma.serviceRequest.create({
    data: {
      customer_id: customer.id,
      artisan_id: artisan.id,
      title: "Test Escrow Flow",
      description: "Need my pipes fixed to test the escrow flow.",
      address: "123 Test St",
      status: "PENDING"
    }
  });

  console.log("CREATED_REQUEST_ID:", req.id);
  console.log("CUSTOMER_EMAIL:", customer.user.email);
  console.log("ARTISAN_EMAIL:", artisan.user.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
