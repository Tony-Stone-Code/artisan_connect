'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Role } from '@prisma/client';

export async function getPlatformMetrics() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  // Ensure user is admin
  const userRole = user.user_metadata?.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
    throw new Error('Forbidden');
  }

  try {
    const [totalUsers, verifiedArtisans, completedJobs, pendingReports] = await Promise.all([
      prisma.user.count(),
      prisma.artisanIdentity.count({
        where: { status: 'VERIFIED' }
      }),
      prisma.serviceRequest.count({
        where: { status: 'COMPLETED' }
      }),
      prisma.report.count({
        where: { status: 'OPEN' }
      })
    ]);

    return {
      totalUsers,
      verifiedArtisans,
      completedJobs,
      pendingReports
    };
  } catch (dbError) {
    console.error('Error fetching platform metrics:', dbError);
    return {
      totalUsers: 0,
      verifiedArtisans: 0,
      completedJobs: 0,
      pendingReports: 0
    };
  }
}

export async function getUsers() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  const userRole = user.user_metadata?.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
    throw new Error('Forbidden');
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
        last_login: true,
        artisan_profile: {
          select: {
            is_verified: true
          }
        }
      }
    });

    return users;
  } catch (dbError) {
    console.error('Error fetching users:', dbError);
    return [];
  }
}
