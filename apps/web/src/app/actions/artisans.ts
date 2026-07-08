'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getArtisans(query?: string) {
  try {
    const whereClause: any = {
      is_available: true,
      // For now, we only show verified artisans on the public directory
      // is_verified: true, 
      user: {
        role: 'ARTISAN',
      }
    };

    if (query) {
      const orConditions: any[] = [
        { business_name: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];

      // Handle split names (e.g. "Small Boat" matching first_name="Small", last_name="Boat")
      const queryParts = query.split(' ').filter(p => p.length > 0);
      if (queryParts.length > 0) {
        orConditions.push({
          AND: queryParts.map(part => ({
            OR: [
              { user: { first_name: { contains: part, mode: 'insensitive' } } },
              { user: { last_name: { contains: part, mode: 'insensitive' } } },
              { user: { email: { contains: part, mode: 'insensitive' } } }
            ]
          }))
        });
      }

      // Use AI to extract semantic intent from the query
      if (process.env.GEMINI_API_KEY) {
        try {
          const { object } = await generateObject({
            model: google('gemini-2.5-flash'),
            system: `You are an expert search assistant for a home services directory in Ghana. 
Parse the user's search query to determine the required artisan profession.
Extract the most relevant artisan profession needed (e.g. Plumber, Electrician, Carpenter). If the query is just a specific business name or person's name (e.g. "John", "Acme Corp"), return an empty string. Only return a profession if the user is describing a problem (e.g., "my sink is leaking") or directly asking for a trade.`,
            prompt: query,
            schema: z.object({
              profession: z.string().describe('The type of artisan needed (e.g., Plumber, Electrician, Carpenter), or empty string if not applicable'),
            }),
          });

          if (object.profession && object.profession.trim() !== '') {
            // Add the AI-extracted profession to the search criteria
            orConditions.push({
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
            });
          }
        } catch (aiError) {
          console.error('AI intent extraction failed:', aiError);
          // Fail silently and fall back to standard text search
        }
      }

      whereClause.OR = orConditions;
    }

    const artisans = await prisma.artisanProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            avatar_url: true,
          }
        },
        services: {
          select: {
            id: true,
            description: true,
            price_min: true,
            price_max: true,
            subcategory: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: [
        { is_verified: 'desc' },
        { average_rating: 'desc' },
      ],
      take: 50,
    });

    return artisans;
  } catch (error) {
    console.error('Failed to fetch artisans:', error);
    return [];
  }
}

export async function getArtisanById(id: string) {
  try {
    const artisanScalar = await prisma.artisanProfile.findFirst({
      where: { id },
      select: {
        id: true,
        user_id: true,
        bio: true,
        business_name: true,
        address: true,
        latitude: true,
        longitude: true,
        service_radius_km: true,
        average_rating: true,
        review_count: true,
        is_verified: true,
        is_available: true,
        availability_status: true,
      }
    });

    if (!artisanScalar) return null;

    const user = await prisma.user.findUnique({
      where: { id: artisanScalar.user_id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        created_at: true,
      }
    });

    const services = await prisma.artisanService.findMany({
      where: { artisan_id: id },
      select: {
        id: true,
        description: true,
        price_min: true,
        price_max: true,
        subcategory: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    const artisanBase = {
      ...artisanScalar,
      user,
      services,
    };

    const portfolio = await prisma.portfolioItem.findMany({
      where: { artisan_id: id },
      orderBy: { created_at: 'desc' }
    });

    const reviews = await prisma.review.findMany({
      where: { artisan_id: id },
      include: {
        customer: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                avatar_url: true,
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    return {
      ...artisanBase,
      portfolio,
      reviews
    };
  } catch (error) {
    console.error(`Failed to fetch artisan with ID ${id}:`, error);
    return null;
  }
}

export async function updateArtisanLocation(latitude: number, longitude: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabase_uid: user.id },
      include: { artisan_profile: true }
    });

    if (!dbUser || !dbUser.artisan_profile) {
      return { success: false, error: 'Artisan profile not found' };
    }

    await prisma.artisanProfile.update({
      where: { id: dbUser.artisan_profile.id },
      data: {
        latitude,
        longitude
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update artisan location:', error);
    return { success: false, error: error.message || 'Failed to update location' };
  }
}
