'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export interface DashboardData {
  role: 'CUSTOMER' | 'ARTISAN' | 'ADMIN' | 'SUPERADMIN';
  user: {
    name: string;
    email: string;
    businessName?: string | null;
  };
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  stats: {
    stat1Label: string;
    stat1Value: number | string;
    stat1Sub: string;

    stat2Label: string;
    stat2Value: number | string;
    stat2Sub: string;

    stat3Label: string;
    stat3Value: number | string;
    stat3Sub: string;

    stat4Label: string;
    stat4Value: string;
    stat4Sub: string;
  };
  recentRequests: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    counterpartName: string;
    counterpartRole: string;
    trade: string;
    amount: number | null;
  }>;
}

export async function getDashboardOverview(): Promise<{ data?: DashboardData; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabase_uid: user.id },
      include: {
        customer_profile: true,
        artisan_profile: {
          include: {
            identity: true,
          },
        },
      },
    });

    if (!dbUser) return { error: 'User not found in system database' };

    if (dbUser.role === 'ARTISAN') {
      const artisan = dbUser.artisan_profile;
      if (!artisan) {
        return {
          data: {
            role: 'ARTISAN',
            user: {
              name: `${dbUser.first_name} ${dbUser.last_name}`,
              email: dbUser.email,
            },
            verificationStatus: 'PENDING',
            stats: {
              stat1Label: 'Pending Quotes',
              stat1Value: 0,
              stat1Sub: 'Awaiting your action',
              stat2Label: 'Active Jobs',
              stat2Value: 0,
              stat2Sub: 'In progress',
              stat3Label: 'Completed Jobs',
              stat3Value: 0,
              stat3Sub: 'Fully delivered',
              stat4Label: 'Total Earned',
              stat4Value: 'GHS 0.00',
              stat4Sub: 'Released from escrow',
            },
            recentRequests: [],
          },
        };
      }

      const [pendingRequests, activeJobs, completedJobs, escrowEarnings, recentRequests] = await Promise.all([
        prisma.serviceRequest.count({
          where: {
            artisan_id: artisan.id,
            status: { in: ['PENDING', 'QUOTED'] },
          },
        }),
        prisma.serviceRequest.count({
          where: {
            artisan_id: artisan.id,
            status: 'IN_PROGRESS',
          },
        }),
        prisma.serviceRequest.count({
          where: {
            artisan_id: artisan.id,
            status: 'COMPLETED',
          },
        }),
        prisma.escrowPayment.findMany({
          where: {
            quote: {
              artisan_id: artisan.id,
            },
            status: 'RELEASED',
          },
          select: { amount: true },
        }),
        prisma.serviceRequest.findMany({
          where: { artisan_id: artisan.id },
          include: {
            customer: {
              include: { user: true },
            },
            quotes: {
              where: { artisan_id: artisan.id },
              take: 1,
            },
          },
          orderBy: { created_at: 'desc' },
          take: 5,
        }),
      ]);

      const totalEarnedNumber = escrowEarnings.reduce((acc, p) => acc + Number(p.amount), 0);

      const verificationStatus = artisan.identity?.status || (artisan.is_verified ? 'VERIFIED' : 'PENDING');

      return {
        data: {
          role: 'ARTISAN',
          user: {
            name: `${dbUser.first_name} ${dbUser.last_name}`,
            email: dbUser.email,
            businessName: artisan.business_name,
          },
          verificationStatus,
          stats: {
            stat1Label: 'Incoming Requests',
            stat1Value: pendingRequests,
            stat1Sub: 'Awaiting your quote',
            stat2Label: 'Active Jobs',
            stat2Value: activeJobs,
            stat2Sub: 'Currently in progress',
            stat3Label: 'Completed Jobs',
            stat3Value: completedJobs,
            stat3Sub: 'Successfully signed off',
            stat4Label: 'Total Revenue',
            stat4Value: `GHS ${totalEarnedNumber.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            stat4Sub: 'Paid out to MoMo wallet',
          },
          recentRequests: recentRequests.map((r) => ({
            id: r.id,
            title: r.title,
            status: r.status,
            createdAt: r.created_at.toISOString(),
            counterpartName: `${r.customer.user.first_name} ${r.customer.user.last_name}`,
            counterpartRole: 'Customer',
            trade: r.address || 'Greater Accra',
            amount: r.quotes[0] ? Number(r.quotes[0].amount) : null,
          })),
        },
      };
    }

    // CUSTOMER OR DEFAULT
    const customer = dbUser.customer_profile;
    if (!customer) {
      return {
        data: {
          role: 'CUSTOMER',
          user: {
            name: `${dbUser.first_name} ${dbUser.last_name}`,
            email: dbUser.email,
          },
          stats: {
            stat1Label: 'Total Requests',
            stat1Value: 0,
            stat1Sub: 'All time requests',
            stat2Label: 'Active Jobs',
            stat2Value: 0,
            stat2Sub: 'Work in progress',
            stat3Label: 'Completed Jobs',
            stat3Value: 0,
            stat3Sub: 'Approved and signed off',
            stat4Label: 'Escrow Protected',
            stat4Value: 'GHS 0.00',
            stat4Sub: 'Total funds secured',
          },
          recentRequests: [],
        },
      };
    }

    const [totalRequests, activeJobs, completedJobs, escrowPayments, recentRequests] = await Promise.all([
      prisma.serviceRequest.count({
        where: { customer_id: customer.id },
      }),
      prisma.serviceRequest.count({
        where: {
          customer_id: customer.id,
          status: { in: ['PENDING', 'QUOTED', 'IN_PROGRESS'] },
        },
      }),
      prisma.serviceRequest.count({
        where: {
          customer_id: customer.id,
          status: 'COMPLETED',
        },
      }),
      prisma.escrowPayment.findMany({
        where: {
          quote: {
            request: {
              customer_id: customer.id,
            },
          },
        },
        select: { amount: true, fee_amount: true },
      }),
      prisma.serviceRequest.findMany({
        where: { customer_id: customer.id },
        include: {
          artisan: {
            include: {
              user: true,
              services: {
                include: { subcategory: true },
                take: 1,
              },
            },
          },
          quotes: {
            where: { status: 'ACCEPTED' },
            take: 1,
          },
        },
        orderBy: { created_at: 'desc' },
        take: 5,
      }),
    ]);

    const totalEscrowNumber = escrowPayments.reduce(
      (acc, p) => acc + Number(p.amount) + Number(p.fee_amount),
      0
    );

    return {
      data: {
        role: 'CUSTOMER',
        user: {
          name: `${dbUser.first_name} ${dbUser.last_name}`,
          email: dbUser.email,
        },
        stats: {
          stat1Label: 'Total Requests',
          stat1Value: totalRequests,
          stat1Sub: 'Created by you',
          stat2Label: 'Active Jobs',
          stat2Value: activeJobs,
          stat2Sub: 'In progress or pending',
          stat3Label: 'Completed Jobs',
          stat3Value: completedJobs,
          stat3Sub: 'Finished and approved',
          stat4Label: 'Escrow Volume',
          stat4Value: `GHS ${totalEscrowNumber.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          stat4Sub: 'Protected by virtual escrow',
        },
        recentRequests: recentRequests.map((r) => ({
          id: r.id,
          title: r.title,
          status: r.status,
          createdAt: r.created_at.toISOString(),
          counterpartName: `${r.artisan.user.first_name} ${r.artisan.user.last_name}`,
          counterpartRole: r.artisan.business_name || 'Artisan',
          trade: r.artisan.services[0]?.subcategory?.name || 'Skilled Trade',
          amount: r.quotes[0] ? Number(r.quotes[0].amount) : null,
        })),
      },
    };
  } catch (err: any) {
    console.error('Error fetching dashboard overview:', err);
    return { error: 'Failed to load dashboard metrics' };
  }
}
