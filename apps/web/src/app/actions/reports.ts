'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ReportStatus, EntityType } from '@prisma/client';

/**
 * Submits a new report (by a customer or artisan).
 */
export async function submitReport({
  targetId,
  targetType,
  reason,
}: {
  targetId: string;
  targetType: EntityType;
  reason: string;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  // Get the internal User ID
  const internalUser = await prisma.user.findFirst({
    where: { supabase_uid: user.id }
  });

  if (!internalUser) {
    throw new Error('User profile not found');
  }

  const report = await prisma.report.create({
    data: {
      reporter_id: internalUser.id,
      target_id: targetId,
      target_type: targetType,
      reason,
      status: 'OPEN',
    },
  });

  return report;
}

/**
 * Fetches all reports for the admin dashboard.
 */
export async function getReports() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  const role = user.user_metadata?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    throw new Error('Forbidden');
  }

  const reports = await prisma.report.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      reporter: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  });

  return reports;
}

/**
 * Updates the status of a report and potentially suspends an artisan manually.
 */
export async function updateReportStatus(reportId: string, status: ReportStatus, suspendTarget: boolean = false) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  const role = user.user_metadata?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    throw new Error('Forbidden');
  }

  const adminProfile = await prisma.adminProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  });

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: { 
      status,
      assigned_to: adminProfile?.id || null
    },
  });

  if (suspendTarget && updatedReport.target_type === 'USER') {
    // If it's a user/artisan, we can mark them as unavailable or disabled
    await prisma.artisanProfile.updateMany({
      where: { user_id: updatedReport.target_id },
      data: { is_available: false, availability_status: 'SUSPENDED' },
    });
  }

  revalidatePath('/admin/reports');
  return updatedReport;
}
