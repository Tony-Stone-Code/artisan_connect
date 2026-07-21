import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding categories and subcategories...')

  const categories = [
    {
      name: 'Plumbing',
      description: 'Pipes, leaks, installations, and repairs',
      icon_url: 'Wrench', // Maps to Lucide icons theoretically
      subcategories: [
        'Pipe Repair',
        'Leak Detection',
        'Fixture Installation',
        'Water Heater Repair',
        'Drain Cleaning'
      ]
    },
    {
      name: 'Electrical',
      description: 'Wiring, lighting, and electrical appliances',
      icon_url: 'Zap',
      subcategories: [
        'Wiring & Rewiring',
        'Lighting Installation',
        'Appliance Repair',
        'Generator Maintenance',
        'Fault Finding'
      ]
    },
    {
      name: 'Carpentry',
      description: 'Woodwork, furniture, and structural repairs',
      icon_url: 'Hammer',
      subcategories: [
        'Furniture Assembly',
        'Furniture Repair',
        'Roofing',
        'Cabinetry',
        'Door & Window Fitting'
      ]
    },
    {
      name: 'Masonry & Construction',
      description: 'Building, tiling, and concrete work',
      icon_url: 'HardHat',
      subcategories: [
        'Tiling',
        'Block Laying',
        'Plastering',
        'Painting',
        'Concrete Work'
      ]
    },
    {
      name: 'Auto Mechanics',
      description: 'Vehicle repairs and maintenance',
      icon_url: 'Car',
      subcategories: [
        'Engine Repair',
        'Electrical Diagnostics',
        'Tire & Brake Service',
        'Bodywork & Spraying'
      ]
    },
    {
      name: 'Cleaning & Landscaping',
      description: 'House cleaning, yard work, and pest control',
      icon_url: 'Sparkles',
      subcategories: [
        'Deep House Cleaning',
        'Yard Mowing & Weeding',
        'Fumigation & Pest Control',
        'Post-Construction Cleaning'
      ]
    },
    {
      name: 'Other',
      description: 'Specialized or custom skills not listed above',
      icon_url: 'MoreHorizontal',
      subcategories: [
        'Custom / Specialized Skill'
      ]
    }
  ]

  for (const cat of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        description: cat.description,
        icon_url: cat.icon_url,
      },
      create: {
        name: cat.name,
        description: cat.description,
        icon_url: cat.icon_url,
      }
    })

    for (const sub of cat.subcategories) {
      // Upserting subcategories requires finding them first since there's no unique constraint on name alone in schema.
      // But we can just findFirst and create if not exists
      const existingSub = await prisma.subcategory.findFirst({
        where: {
          name: sub,
          category_id: createdCategory.id
        }
      })

      if (!existingSub) {
        await prisma.subcategory.create({
          data: {
            name: sub,
            category_id: createdCategory.id
          }
        })
      }
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
