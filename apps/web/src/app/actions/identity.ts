'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Media Upload Action
export async function uploadMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) return { error: 'No file provided' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const bucket = (formData.get('bucket') as string) || 'verifications'

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrlData.publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Upload failed' }
  }
}

// Identity Actions
export async function getIdentityStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await prisma.artisanProfile.findUnique({
    where: { user_id: user.id },
    include: { identity: true }
  })

  return profile?.identity || null
}

export async function submitIdentity(data: {
  ghana_card_no: string
  card_image_url: string
  selfie_url: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const profile = await prisma.artisanProfile.findUnique({
    where: { user_id: user.id }
  })

  if (!profile) return { error: 'Artisan profile not found' }

  await prisma.artisanIdentity.upsert({
    where: { artisan_id: profile.id },
    update: {
      ghana_card_no: data.ghana_card_no,
      card_image_url: data.card_image_url,
      selfie_url: data.selfie_url,
      status: 'PENDING'
    },
    create: {
      artisan_id: profile.id,
      ghana_card_no: data.ghana_card_no,
      card_image_url: data.card_image_url,
      selfie_url: data.selfie_url,
      status: 'PENDING'
    }
  })

  revalidatePath('/dashboard/identity')
  return { success: true }
}

// Admin Actions
export async function getPendingIdentities() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata?.role !== 'ADMIN' && user.user_metadata?.role !== 'SUPERADMIN')) {
    return { error: 'Unauthorized' }
  }

  const identities = await prisma.artisanIdentity.findMany({
    where: { status: 'PENDING' },
    include: {
      artisan: {
        include: { user: true }
      }
    }
  })

  return { identities }
}

export async function approveIdentity(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata?.role !== 'ADMIN' && user.user_metadata?.role !== 'SUPERADMIN')) {
    return { error: 'Unauthorized' }
  }

  await prisma.artisanIdentity.update({
    where: { id },
    data: { status: 'VERIFIED', verified_at: new Date() }
  })

  const identity = await prisma.artisanIdentity.findUnique({ where: { id } })
  if (identity) {
    await prisma.artisanProfile.update({
      where: { id: identity.artisan_id },
      data: { is_verified: true }
    })
  }

  revalidatePath('/admin/verification')
  return { success: true }
}

export async function rejectIdentity(id: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata?.role !== 'ADMIN' && user.user_metadata?.role !== 'SUPERADMIN')) {
    return { error: 'Unauthorized' }
  }

  await prisma.artisanIdentity.update({
    where: { id },
    data: { status: 'REJECTED', notes }
  })

  revalidatePath('/admin/verification')
  return { success: true }
}
