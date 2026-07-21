'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMessages(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get messages for the request
  const messages = await prisma.message.findMany({
    where: { request_id: requestId },
    orderBy: { created_at: 'asc' }
  })

  return { messages }
}

export async function sendMessage(requestId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { error: 'Unauthorized' }

  // Ensure request exists and user has access
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { artisan: true, customer: true }
  })

  if (!request) return { error: 'Request not found' }

  const isArtisan = request.artisan.user_id === dbUser.id
  const isCustomer = request.customer.user_id === dbUser.id

  if (!isArtisan && !isCustomer) {
    return { error: 'Forbidden' }
  }

  // Determine receiver (the other party)
  const receiverId = isArtisan ? request.customer.user_id : request.artisan.user_id

  const message = await prisma.message.create({
    data: {
      request_id: requestId,
      sender_id: dbUser.id,
      content,
    }
  })

  // We don't necessarily need to revalidatePath here because Realtime handles the frontend updates,
  // but we can revalidate the request page just in case of server-render.
  revalidatePath(`/dashboard/requests/${requestId}`)

  return { message }
}

export async function getUnreadMessageCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { count: 0 }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { count: 0 }

  // Count messages where the current user is part of the request, 
  // the sender is NOT the current user, and is_read is false
  const count = await prisma.message.count({
    where: {
      is_read: false,
      sender_id: { not: dbUser.id },
      request: {
        OR: [
          { customer: { user_id: dbUser.id } },
          { artisan: { user_id: dbUser.id } }
        ]
      }
    }
  })

  return { count }
}

export async function markMessagesAsRead(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  const dbUser = await prisma.user.findUnique({ where: { supabase_uid: user.id } })
  if (!dbUser) return { success: false }

  // Update all unread messages in this request where the current user is NOT the sender
  await prisma.message.updateMany({
    where: {
      request_id: requestId,
      sender_id: { not: dbUser.id },
      is_read: false
    },
    data: {
      is_read: true
    }
  })

  return { success: true }
}
