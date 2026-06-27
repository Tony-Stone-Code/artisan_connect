'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function createDispute(requestId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { supabase_uid: user.id }
  })
  if (!dbUser) return { error: 'User not found in database' }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      customer: true,
      quotes: {
        where: { status: 'ACCEPTED' },
        include: { escrow: true }
      }
    }
  })

  if (!request) return { error: 'Request not found' }
  if (request.customer.user_id !== dbUser.id) return { error: 'Only the customer can file a dispute' }
  if (request.status !== 'IN_PROGRESS' && request.status !== 'COMPLETED') {
    return { error: 'Disputes can only be filed during or after the job' }
  }

  const acceptedQuote = request.quotes[0]
  if (!acceptedQuote || !acceptedQuote.escrow) {
    return { error: 'No escrow payment found to dispute' }
  }

  if (acceptedQuote.escrow.status !== 'HELD') {
    return { error: `Funds are already ${acceptedQuote.escrow.status.toLowerCase()}` }
  }

  try {
    await prisma.$transaction([
      prisma.serviceRequest.update({
        where: { id: requestId },
        data: { status: 'DISPUTED' }
      }),
      prisma.escrowPayment.update({
        where: { id: acceptedQuote.escrow.id },
        data: { status: 'DISPUTED' }
      }),
      prisma.report.create({
        data: {
          reporter_id: dbUser.id,
          target_id: requestId,
          target_type: 'REQUEST',
          reason: reason,
          status: 'OPEN'
        }
      })
    ])

    revalidatePath(`/dashboard/requests/${requestId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Dispute Creation Failed:', err)
    return { error: 'Failed to file dispute' }
  }
}

export async function generateDisputeSummary(reportId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if admin
  const admin = await prisma.adminProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })
  if (!admin) return { error: 'Forbidden' }

  const report = await prisma.report.findUnique({
    where: { id: reportId }
  })

  if (!report || report.target_type !== 'REQUEST') {
    return { error: 'Invalid report' }
  }

  // Fetch all chat messages for this request
  const messages = await prisma.message.findMany({
    where: { request_id: report.target_id },
    orderBy: { created_at: 'asc' },
    include: { sender: true }
  })

  const chatLogs = messages.map(m => `[${m.created_at.toISOString()}] ${m.sender.first_name} ${m.sender.last_name}: ${m.content}`).join('\n')

  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'), // Upgraded to 2.5 flash
      prompt: `You are an impartial dispute resolution assistant for ArtisanConnect, a service marketplace. 
A customer has filed a dispute with the following reason:
"${report.reason}"

Below are the chat logs between the Customer and the Artisan.
Please read the chat logs and provide a completely unbiased, factual summary of what happened. Do not take sides.

Chat Logs:
${chatLogs || '(No messages found)'}`
    })

    await prisma.report.update({
      where: { id: reportId },
      data: { ai_summary: text }
    })

    revalidatePath(`/dashboard/admin/disputes`)
    return { success: true, summary: text }
  } catch (err: any) {
    console.error('AI Summarization Failed:', err)
    return { error: 'Failed to generate summary' }
  }
}

export async function resolveDispute(reportId: string, decision: 'REFUND' | 'RELEASE') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if admin
  const admin = await prisma.adminProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })
  if (!admin) return { error: 'Forbidden' }

  const report = await prisma.report.findUnique({
    where: { id: reportId }
  })

  if (!report || report.target_type !== 'REQUEST') {
    return { error: 'Invalid report' }
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: report.target_id },
    include: {
      quotes: {
        where: { status: 'ACCEPTED' },
        include: { escrow: true }
      }
    }
  })

  if (!request) return { error: 'Request not found' }

  const acceptedQuote = request.quotes[0]
  if (!acceptedQuote || !acceptedQuote.escrow) {
    return { error: 'No escrow payment found' }
  }

  const nextRequestStatus = decision === 'REFUND' ? 'CANCELLED' : 'COMPLETED'
  const nextEscrowStatus = decision === 'REFUND' ? 'REFUNDED' : 'RELEASED'

  try {
    await prisma.$transaction([
      prisma.serviceRequest.update({
        where: { id: request.id },
        data: { status: nextRequestStatus }
      }),
      prisma.escrowPayment.update({
        where: { id: acceptedQuote.escrow.id },
        data: { 
          status: nextEscrowStatus,
          released_at: decision === 'RELEASE' ? new Date() : null
        }
      }),
      prisma.report.update({
        where: { id: reportId },
        data: { status: 'RESOLVED', assigned_to: admin.id }
      })
    ])

    revalidatePath(`/dashboard/admin/disputes`)
    revalidatePath(`/dashboard/requests/${request.id}`)
    return { success: true }
  } catch (err: any) {
    console.error('Dispute Resolution Failed:', err)
    return { error: 'Failed to resolve dispute' }
  }
}
