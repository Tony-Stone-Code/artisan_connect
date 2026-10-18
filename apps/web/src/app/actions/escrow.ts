'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

// Note: In production, this would integrate with Paystack/Stripe.
// We are simulating the successful payment by directly creating the EscrowPayment.
export async function acceptQuoteAndPayEscrow(quoteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      artisan: true,
      request: { include: { customer: { include: { user: true } } } }
    }
  })

  if (!quote) return { error: 'Quote not found' }
  if (quote.status !== 'PENDING') return { error: 'Quote is no longer pending' }
  
  // Verify that the user is the customer who made the request
  if (quote.request.customer.user.supabase_uid !== user.id) {
    return { error: 'Forbidden' }
  }

  // Simulate payment processing...
  const paymentRef = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`
  const feeAmount = Number(quote.amount) * 0.05 // 5% platform fee simulation

  // Perform a transaction to ensure all statuses update atomically
  try {
    await prisma.$transaction([
      prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'ACCEPTED' }
      }),
      prisma.serviceRequest.update({
        where: { id: quote.request_id },
        data: { status: 'IN_PROGRESS' }
      }),
      prisma.escrowPayment.create({
        data: {
          quote_id: quoteId,
          amount: quote.amount,
          fee_amount: feeAmount,
          status: 'HELD',
          payment_ref: paymentRef
        }
      })
    ])

    revalidatePath(`/dashboard/requests/${quote.request_id}`)

    // Realtime in-app notification to Artisan
    await createNotification({
      userId: quote.artisan.user_id,
      title: 'Escrow Funded & Work Authorized',
      message: `${quote.request.customer.user.first_name} paid GHS ${quote.amount} into Escrow for "${quote.request.title}". You may begin work!`,
      type: 'SUCCESS',
      data: { requestId: quote.request_id, quoteId: quote.id, amount: quote.amount },
    })

    return { success: true }
  } catch (err: any) {
    console.error('Escrow Payment Failed:', err)
    return { error: 'Payment simulation failed' }
  }
}

export async function releaseEscrow(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { 
      customer: { include: { user: true } },
      artisan: { include: { user: true } },
      quotes: {
        where: { status: 'ACCEPTED' },
        include: { escrow: true }
      }
    }
  })

  if (!request) return { error: 'Request not found' }
  if (request.status !== 'COMPLETED') return { error: 'Job must be marked completed by the artisan first' }
  if (request.customer.user.supabase_uid !== user.id) return { error: 'Forbidden' }

  const acceptedQuote = request.quotes[0]
  if (!acceptedQuote || !acceptedQuote.escrow) {
    return { error: 'No escrow payment found for this request' }
  }

  if (acceptedQuote.escrow.status !== 'HELD') {
    return { error: `Funds are already ${acceptedQuote.escrow.status.toLowerCase()}` }
  }

  // Update escrow status to RELEASED
  await prisma.escrowPayment.update({
    where: { id: acceptedQuote.escrow.id },
    data: { 
      status: 'RELEASED',
      released_at: new Date()
    }
  })

  // Realtime in-app notification to Artisan
  await createNotification({
    userId: request.artisan.user_id,
    title: 'Payment Released!',
    message: `${request.customer.user.first_name} confirmed completion. GHS ${acceptedQuote.amount} has been released from escrow!`,
    type: 'SUCCESS',
    data: { requestId, amount: acceptedQuote.amount },
  })

  revalidatePath(`/dashboard/requests/${requestId}`)
  return { success: true }
}
