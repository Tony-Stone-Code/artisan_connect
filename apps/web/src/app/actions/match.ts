'use server'

import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// Initialize Gemini provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function matchServiceRequest(prompt: string) {
  try {
    // 1. Generate structured data using Gemini
    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      system: `You are an expert triage assistant for a home services platform in Ghana. 
Your job is to parse the user's problem description into a structured service request.
Extract the most relevant artisan profession needed (e.g. Plumber, Electrician, Carpenter).
Extract the location if mentioned, otherwise leave it empty.
Keep the title short (max 6 words).
Keep the cleanedDescription concise.
Use minimal tokens.`,
      prompt: prompt,
      schema: z.object({
        profession: z.string().describe('The type of artisan needed, e.g., Plumber, Electrician, Carpenter, Mason, Painter'),
        title: z.string().describe('A short, actionable title for the job'),
        cleanedDescription: z.string().describe('A clean, clear summary of the problem'),
        location: z.string().describe('The physical location/city if mentioned in the prompt, else empty string'),
        urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
      }),
    })

    // 2. Query Prisma for matching Artisans based on the extracted profession
    // We use a case-insensitive search on the Category or Subcategory
    const matchedArtisans = await prisma.artisanProfile.findMany({
      where: {
        services: {
          some: {
            subcategory: {
              OR: [
                { name: { contains: object.profession, mode: 'insensitive' } },
                { category: { name: { contains: object.profession, mode: 'insensitive' } } }
              ]
            }
          }
        }
      },
      include: {
        user: true,
        services: {
          include: {
            subcategory: {
              include: { category: true }
            }
          }
        }
      },
      take: 10
    })

    // Map to a clean frontend object
    const artisans = matchedArtisans.map(a => ({
      id: a.id,
      first_name: a.user.first_name,
      last_name: a.user.last_name,
      business_name: a.business_name,
      average_rating: a.average_rating,
      review_count: a.review_count,
      matched_service: a.services[0]?.subcategory?.name || object.profession
    }))

    return { result: object, artisans }
  } catch (error: any) {
    console.error('AI Matching Error:', error)
    return { error: 'Failed to process your request. Please try again.' }
  }
}
