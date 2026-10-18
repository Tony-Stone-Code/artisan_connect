'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NotificationType } from '@prisma/client';

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  data: any;
  created_at: string;
}

export async function getUserNotifications(): Promise<{
  notifications: UserNotification[];
  unreadCount: number;
  userId?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { notifications: [], unreadCount: 0, error: 'Unauthorized' };

  const dbUser = await prisma.user.findUnique({
    where: { supabase_uid: user.id },
    select: { id: true }
  });

  if (!dbUser) return { notifications: [], unreadCount: 0, error: 'User not found' };

  const [rawNotifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: 'desc' },
      take: 25,
    }),
    prisma.notification.count({
      where: { user_id: dbUser.id, is_read: false },
    })
  ]);

  const notifications: UserNotification[] = rawNotifications.map((n) => ({
    id: n.id,
    user_id: n.user_id,
    title: n.title,
    message: n.message,
    type: n.type,
    is_read: n.is_read,
    data: n.data,
    created_at: n.created_at.toISOString(),
  }));

  return { notifications, unreadCount, userId: dbUser.id };
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const dbUser = await prisma.user.findUnique({
    where: { supabase_uid: user.id },
    select: { id: true }
  });
  if (!dbUser) return { success: false, error: 'User not found' };

  await prisma.notification.updateMany({
    where: { id, user_id: dbUser.id },
    data: { is_read: true },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const dbUser = await prisma.user.findUnique({
    where: { supabase_uid: user.id },
    select: { id: true }
  });
  if (!dbUser) return { success: false, error: 'User not found' };

  await prisma.notification.updateMany({
    where: { user_id: dbUser.id, is_read: false },
    data: { is_read: true },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  data?: Record<string, any>;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        user_id: params.userId,
        title: params.title,
        message: params.message,
        type: params.type || 'INFO',
        data: params.data ?? undefined,
      },
    });
    return { success: true, notification };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, error };
  }
}
