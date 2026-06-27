import { createClient } from '@supabase/supabase-js';
import prisma from './src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const usersToCreate = [
    { email: 'testcustomer2@example.com', password: 'password123', first: 'Test', last: 'Customer', role: 'CUSTOMER' },
    { email: 'testartisan2@example.com', password: 'password123', first: 'Test', last: 'Artisan', role: 'ARTISAN' }
  ];

  for (const u of usersToCreate) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true
    });
    if (error) {
      console.error("Error creating user", u.email, error);
      continue;
    }
    const uid = data.user.id;
    await prisma.user.create({
      data: {
        id: uid,
        email: u.email,
        first_name: u.first,
        last_name: u.last,
        role: u.role as any
      }
    });

    if (u.role === 'CUSTOMER') {
      await prisma.customerProfile.create({ data: { user_id: uid } });
    } else {
      await prisma.artisanProfile.create({ data: { user_id: uid } });
    }
    console.log("Created", u.email);
  }
}
main().finally(() => prisma.$disconnect());
