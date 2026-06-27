'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(requestId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  try {
    // Verify the request exists, is COMPLETED, and the current user is the customer
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { customer: true, artisan: true, review: true }
    })

    if (!request) {
      return { error: 'Request not found' }
    }

    if (request.status !== 'COMPLETED') {
      return { error: 'You can only review completed jobs' }
    }

    if (request.customer.user_id !== user.id) {
      return { error: 'Only the customer can leave a review' }
    }

    if (request.review) {
      return { error: 'You have already reviewed this job' }
    }

    // Determine basic sentiment based on rating
    let sentiment = 'Neutral'
    if (rating >= 4) sentiment = 'Positive'
    if (rating <= 2) sentiment = 'Negative'

    // Perform atomic transaction to create the review and update the artisan's average rating
    await prisma.$transaction(async (tx) => {
      // 1. Create the review
      await tx.review.create({
        data: {
          request_id: requestId,
          customer_id: request.customer_id,
          artisan_id: request.artisan_id,
          rating,
          comment: comment || null,
          sentiment
        }
      })

      // 2. Recalculate average rating for the Artisan
      const artisan = request.artisan
      const oldAvg = artisan.average_rating
      const oldCount = artisan.review_count
      
      const newCount = oldCount + 1
      const newAvg = ((oldAvg * oldCount) + rating) / newCount

      // 3. Update the artisan
      await tx.artisanProfile.update({
        where: { id: artisan.id },
        data: {
          average_rating: newAvg,
          review_count: newCount
        }
      })
    })

    // Revalidate relevant pages
    revalidatePath(`/dashboard/requests/${requestId}`)
    revalidatePath(`/artisans/${request.artisan_id}`)
    revalidatePath('/artisans')
    
    return { success: true }
  } catch (err: any) {
    console.error('Failed to create review:', err)
    return { error: 'An unexpected error occurred while saving the review.' }
  }
}
