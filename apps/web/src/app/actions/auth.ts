'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { sendCustomerWelcomeEmail, sendArtisanWelcomeEmail } from '@/lib/email'

export async function createProfile(data: {
  supabase_uid: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'CUSTOMER' | 'ARTISAN'
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      if (!existingUser.supabase_uid) {
        await prisma.user.update({
          where: { email: data.email },
          data: { supabase_uid: data.supabase_uid },
        })
      }
      return { success: true }
    }

    // Create base user
    const user = await prisma.user.create({
      data: {
        supabase_uid: data.supabase_uid,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        role: data.role as Role,
      },
    })

    // Create specific profile based on role and send welcome email
    if (data.role === 'CUSTOMER') {
      await prisma.customerProfile.create({
        data: { user_id: user.id },
      })
      // Send welcome email asynchronously
      sendCustomerWelcomeEmail(data.email, data.first_name)
    } else if (data.role === 'ARTISAN') {
      await prisma.artisanProfile.create({
        data: { user_id: user.id },
      })
      // Send welcome email + verification reminder asynchronously
      sendArtisanWelcomeEmail(data.email, data.first_name)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to create profile:', error)
    return { success: false, error: 'Failed to create profile in database' }
  }
}

export async function updateProfile(data: {
  first_name: string
  last_name: string
  phone: string
  avatar_url?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    await prisma.user.update({
      where: { supabase_uid: user.id },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        ...(data.avatar_url && { avatar_url: data.avatar_url }),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { success: false, error: 'Failed to update profile in database' }
  }
}
