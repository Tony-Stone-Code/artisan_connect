import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Enriching artisan data with pictures, bios, and portfolio items...');

  const artisanProfiles = await prisma.artisanProfile.findMany({
    include: {
      user: true,
      services: {
        include: {
          subcategory: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  const tradeUpdates: Record<string, {
    avatar: string;
    businessName: string;
    bio: string;
    address: string;
    rating: number;
    reviewCount: number;
    portfolio: Array<{ title: string; imageUrl: string; description: string }>;
  }> = {
    'plumber@demo.com': {
      avatar: '/images/artisan_plumber_1782323020851.png',
      businessName: 'Mensah Plumbing Solutions',
      bio: 'Licensed master plumber with over 10 years of experience serving residential and commercial properties in Greater Accra. Certified in leak detection and pressure systems.',
      address: 'Osu, Accra',
      rating: 4.9,
      reviewCount: 28,
      portfolio: [
        { title: 'Modern Bathroom Pipe Installation', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', description: 'Complete copper pipe fitting for luxury apartment' },
        { title: 'Industrial Water Filtration System', imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80', description: 'Dual pump setup with automatic pressure regulators' },
        { title: 'Emergency Leak Interception', imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80', description: 'High-pressure valve replacement completed in under 2 hours' }
      ]
    },
    'electrician@demo.com': {
      avatar: '/images/artisan_electrician_ghana.jpg',
      businessName: 'Osei Bright Electrical & Solar',
      bio: 'Certified master electrician specializing in smart residential wiring, inverter backups, generator maintenance, and modern LED lighting systems across East Legon.',
      address: 'East Legon, Accra',
      rating: 4.8,
      reviewCount: 34,
      portfolio: [
        { title: 'Smart Home Lighting Grid', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', description: 'Architectural recessed lighting with Lutron controls' },
        { title: 'High-Capacity Circuit Breaker Panel', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', description: 'Commercial grade distribution board with surge protection' },
        { title: 'Chandelier & Accent Fitting', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', description: 'Precision mounting for two-story foyer light fixture' }
      ]
    },
    'mechanic@demo.com': {
      avatar: '/images/artisan_mechanic_ghana.jpg',
      businessName: 'Yaw Auto Engineering & Diagnostics',
      bio: 'Computerized vehicle diagnostics, automatic transmission overhauls, suspension tuning, and complete braking systems for Japanese, Korean, and German automobiles.',
      address: 'Spintex Road, Accra',
      rating: 4.95,
      reviewCount: 42,
      portfolio: [
        { title: 'V6 Engine Full Diagnostic & Overhaul', imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', description: 'Rebuilt timing chain, intake valves, and fuel injectors' },
        { title: 'Hydraulic Brake System Replacement', imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', description: 'Performance ceramic pads and slotted rotors' },
        { title: 'Transmission Fluid Flush & Calibration', imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80', description: 'Electronic valve body service and zero-play testing' }
      ]
    },
    'carpenter@demo.com': {
      avatar: '/images/artisan_carpenter_1782323041206.png',
      businessName: 'Boateng Custom Hardwood Works',
      bio: 'Artisanal furniture craftsman crafting custom Odum, Mahogany, and Teak doors, acoustic paneling, luxury kitchens, and reinforced roofing structures.',
      address: 'Dansoman, Accra',
      rating: 4.85,
      reviewCount: 19,
      portfolio: [
        { title: 'Custom Mahogany Security Door', imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80', description: 'Hand-carved Ghanaian hardwood with mortise deadbolt' },
        { title: 'Custom Minimalist Kitchen Cabinetry', imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', description: 'Soft-close dovetail drawers with waterproof finish' },
        { title: 'Floating Solid Teak Dining Table', imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', description: 'Live-edge slab table with powder-coated steel base' }
      ]
    }
  };

  for (const profile of artisanProfiles) {
    const email = profile.user.email;
    const update = tradeUpdates[email];

    if (update) {
      // Update User Avatar
      await prisma.user.update({
        where: { id: profile.user_id },
        data: { avatar_url: update.avatar }
      });

      // Update Profile Details
      await prisma.artisanProfile.update({
        where: { id: profile.id },
        data: {
          business_name: update.businessName,
          bio: update.bio,
          address: update.address,
          average_rating: update.rating,
          review_count: update.reviewCount,
          is_verified: true,
          is_available: true,
        }
      });

      // Clear existing portfolio items to prevent duplicates
      await prisma.portfolioItem.deleteMany({
        where: { artisan_id: profile.id }
      });

      // Add high quality portfolio items
      for (const item of update.portfolio) {
        await prisma.portfolioItem.create({
          data: {
            artisan_id: profile.id,
            title: item.title,
            image_url: item.imageUrl,
            description: item.description,
          }
        });
      }

      console.log(`Updated ${email} with pictures, bio, and ${update.portfolio.length} portfolio items.`);
    } else {
      // Generic artisan fallback update if missing details
      const categoryName = profile.services[0]?.subcategory?.category?.name || 'General';
      const fallbackAvatars: Record<string, string> = {
        'Plumbing': '/images/artisan_plumber_1782323020851.png',
        'Electrical': '/images/artisan_electrician_1782323029739.png',
        'Carpentry': '/images/artisan_carpenter_1782323041206.png',
        'Auto Mechanics': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      };
      
      const avatarUrl = fallbackAvatars[categoryName] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      
      if (!profile.user.avatar_url) {
        await prisma.user.update({
          where: { id: profile.user_id },
          data: { avatar_url: avatarUrl }
        });
      }

      if (!profile.business_name) {
        await prisma.artisanProfile.update({
          where: { id: profile.id },
          data: {
            business_name: `${profile.user.first_name} ${profile.user.last_name} Trades`,
            address: profile.address || 'Accra, Ghana',
            is_available: true,
            is_verified: true,
          }
        });
      }
    }
  }

  console.log('Finished enriching artisan media!');
}

main()
  .catch(console.error)
  .finally(() => pool.end());
