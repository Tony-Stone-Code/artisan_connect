'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    return { categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { error: 'Failed to fetch categories' }
  }
}

export async function getArtisanServices() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const profile = await prisma.artisanProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })

  if (!profile) return { error: 'Profile not found' }

  const services = await prisma.artisanService.findMany({
    where: { artisan_id: profile.id },
    include: {
      subcategory: {
        include: {
          category: true
        }
      }
    }
  })

  return { services }
}

export async function addArtisanService(data: {
  subcategory_id: string
  description?: string
  price_min?: number
  price_max?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const profile = await prisma.artisanProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })

  if (!profile) return { error: 'Profile not found' }

  // Check if service already exists
  const existing = await prisma.artisanService.findFirst({
    where: {
      artisan_id: profile.id,
      subcategory_id: data.subcategory_id
    }
  })

  if (existing) {
    return { error: 'You have already added this service.' }
  }

  try {
    await prisma.artisanService.create({
      data: {
        artisan_id: profile.id,
        subcategory_id: data.subcategory_id,
        description: data.description || null,
        price_min: data.price_min || null,
        price_max: data.price_max || null
      }
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Error adding service:', error)
    return { error: 'Failed to add service' }
  }
}

export async function removeArtisanService(serviceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const profile = await prisma.artisanProfile.findFirst({
    where: { user: { supabase_uid: user.id } }
  })

  if (!profile) return { error: 'Profile not found' }

  const service = await prisma.artisanService.findUnique({
    where: { id: serviceId }
  })

  if (!service || service.artisan_id !== profile.id) {
    return { error: 'Service not found or unauthorized' }
  }

  try {
    await prisma.artisanService.delete({
      where: { id: serviceId }
    })

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    console.error('Error removing service:', error)
    return { error: 'Failed to remove service' }
  }
}
