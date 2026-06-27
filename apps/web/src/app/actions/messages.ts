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
