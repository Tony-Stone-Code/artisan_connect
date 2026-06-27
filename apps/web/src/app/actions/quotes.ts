'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createQuote(data: {
  request_id: string
  amount: number
  description?: string
  expires_in_days: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const artisan = await prisma.artisanProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })

  if (!artisan) return { error: 'Artisan profile not found' }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: data.request_id }
  })

  if (!request) return { error: 'Service request not found' }
  if (request.artisan_id !== artisan.id) return { error: 'Forbidden' }

  // Check if a pending quote already exists
  const existingPendingQuote = await prisma.quote.findFirst({
    where: {
      request_id: data.request_id,
      artisan_id: artisan.id,
      status: 'PENDING'
    }
  })

  if (existingPendingQuote) {
    return { error: 'You already have a pending quote for this request. Please wait for the customer to respond or for it to expire.' }
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + data.expires_in_days)

  const quote = await prisma.quote.create({
    data: {
      request_id: data.request_id,
      artisan_id: artisan.id,
      amount: data.amount,
      description: data.description,
      status: 'PENDING',
      expires_at: expiresAt
    }
  })
  
  revalidatePath(`/dashboard/requests/${data.request_id}`)
  return { success: true, quote }
}

export async function rejectQuote(quoteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { request: { include: { customer: { include: { user: true } } } } }
  })

  if (!quote) return { error: 'Quote not found' }
  
  // Verify that the user is the customer who made the request
  if (quote.request.customer.user.supabase_uid !== user.id) {
    return { error: 'Forbidden' }
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: 'REJECTED' }
  })

  revalidatePath(`/dashboard/requests/${quote.request_id}`)
  return { success: true }
}
