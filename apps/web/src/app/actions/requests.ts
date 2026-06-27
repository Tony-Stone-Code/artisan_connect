'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendNewRequestEmail, sendStatusUpdateEmail } from '@/lib/email'

export async function getRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const role = user.user_metadata?.role

  if (role === 'CUSTOMER') {
    const customer = await prisma.customerProfile.findFirst({
      where: { user: { supabase_uid: user.id } }
    })
    
    if (!customer) return { requests: [] }

    const requests = await prisma.serviceRequest.findMany({
      where: { customer_id: customer.id },
      include: { artisan: { include: { user: true } } },
      orderBy: { created_at: 'desc' }
    })
    return { requests }
  } else if (role === 'ARTISAN') {
    const artisan = await prisma.artisanProfile.findFirst({
      where: { user: { supabase_uid: user.id } }
    })

    if (!artisan) return { requests: [] }

    const requests = await prisma.serviceRequest.findMany({
      where: { artisan_id: artisan.id },
      include: { customer: { include: { user: true } } },
      orderBy: { created_at: 'desc' }
    })
    return { requests }
  }

  return { requests: [] }
}

export async function createRequest(data: {
  artisan_id: string
  title: string
  description: string
  location_text: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const customer = await prisma.customerProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })

  if (!customer) return { error: 'Customer profile not found' }

  const request = await prisma.serviceRequest.create({
    data: {
      customer_id: customer.id,
      artisan_id: data.artisan_id,
      title: data.title,
      description: data.description,
      address: data.location_text,
      status: 'PENDING'
    },
    include: {
      artisan: { include: { user: true } },
      customer: { include: { user: true } }
    }
  })

  // Send Email Notification to Artisan asynchronously
  sendNewRequestEmail(
    request.artisan.user.email,
    request.artisan.user.first_name,
    request.customer.user.first_name,
    request.title
  )

  revalidatePath('/dashboard/requests')
  return { success: true }
}

export async function getArtisans() {
  const artisans = await prisma.artisanProfile.findMany({
    include: { user: true }
  })
  
  // Flatten for the frontend component
  return {
    artisans: artisans.map(a => ({
      id: a.id,
      first_name: a.user.first_name,
      last_name: a.user.last_name
    }))
  }
}

export async function getRequestById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      customer: { include: { user: true } },
      artisan: { include: { user: true } },
      review: true,
      quotes: { 
        orderBy: { created_at: 'desc' },
        include: { escrow: true }
      }
    }
  })

  if (!request) return { error: 'Request not found' }

  // Verify ownership
  const isCustomer = request.customer.user.supabase_uid === user.id
  const isArtisan = request.artisan.user.supabase_uid === user.id

  if (!isCustomer && !isArtisan) {
    return { error: 'Forbidden' }
  }

  return { request }
}

export async function updateRequestStatus(id: string, status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { 
      artisan: { include: { user: true } }, 
      customer: { include: { user: true } } 
    }
  })

  if (!request) return { error: 'Request not found' }

  // Verify ownership (only the artisan should be able to update status normally, but let's allow customer to cancel)
  const isArtisan = request.artisan.user.supabase_uid === user.id
  const isCustomer = request.customer.user.supabase_uid === user.id

  if (!isArtisan && !(isCustomer && status === 'CANCELLED')) {
    return { error: 'Forbidden' }
  }

  const updatedRequest = await prisma.serviceRequest.update({
    where: { id },
    data: { status },
    include: {
      customer: { include: { user: true } },
      artisan: { include: { user: true } }
    }
  })

  // Send Status Update Email to Customer asynchronously
  sendStatusUpdateEmail(
    updatedRequest.customer.user.email,
    updatedRequest.customer.user.first_name,
    updatedRequest.artisan.user.first_name,
    updatedRequest.title,
    status
  )

  revalidatePath(`/dashboard/requests/${id}`)
  revalidatePath('/dashboard/requests')
  return { success: true }
}
