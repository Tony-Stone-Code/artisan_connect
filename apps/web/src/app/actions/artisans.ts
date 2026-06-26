'use server';

import prisma from '@/lib/prisma';

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
      whereClause.OR = [
        { business_name: { contains: query, mode: 'insensitive' } },
        { user: { first_name: { contains: query, mode: 'insensitive' } } },
        { user: { last_name: { contains: query, mode: 'insensitive' } } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];
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
    const artisan = await prisma.artisanProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_url: true,
            created_at: true,
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
        },
        portfolio: {
          orderBy: { created_at: 'desc' }
        },
        reviews: {
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
        }
      }
    });

    return artisan;
  } catch (error) {
    console.error(`Failed to fetch artisan with ID ${id}:`, error);
    return null;
  }
}
