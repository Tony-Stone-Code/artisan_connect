import { createClient } from '@supabase/supabase-js';

// Use require to prevent hoisting
require('dotenv').config({ path: '.env.local' });
const prisma = require('./src/lib/prisma').default;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function main() {
  console.log('Fetching users from Supabase Auth...');
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log(`Found ${users.length} users in Supabase Auth.`);

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { supabase_uid: user.id }
    });

    if (!existing) {
      console.log(`Syncing missing user ${user.email}...`);
      const nameParts = (user.user_metadata?.full_name || '').split(' ');
      const firstName = user.user_metadata?.first_name || nameParts[0] || 'Unknown';
      const lastName = user.user_metadata?.last_name || nameParts.slice(1).join(' ') || 'User';
      const roleRaw = user.user_metadata?.role || 'CUSTOMER';
      const role = roleRaw.toUpperCase();

      try {
        const newUser = await prisma.user.create({
          data: {
            supabase_uid: user.id,
            email: user.email || '',
            first_name: firstName,
            last_name: lastName,
            role: role,
          }
        });
        
        if (role === 'CUSTOMER') {
          await prisma.customerProfile.create({ data: { user_id: newUser.id } });
        } else if (role === 'ARTISAN') {
          await prisma.artisanProfile.create({ data: { user_id: newUser.id } });
        } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
          await prisma.adminProfile.create({ data: { user_id: newUser.id, is_super: role === 'SUPERADMIN' } });
        }
        
        console.log(`Successfully synced ${user.email}`);
      } catch (err) {
        console.error(`Failed to sync ${user.email}:`, err);
      }
    } else {
      console.log(`User ${user.email} already exists in Prisma db.`);
    }
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
