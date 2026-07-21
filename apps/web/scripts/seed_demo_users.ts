import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const demoUsers = [
  {
    email: 'plumber@demo.com',
    password: 'password123',
    firstName: 'Kwame',
    lastName: 'Mensah',
    role: 'ARTISAN',
    businessName: 'Mensah Plumbing Solutions',
    bio: 'Expert plumber with 10 years of experience in Accra. Specializing in pipe leaks, installations, and full water system designs.',
    categoryName: 'Plumbing',
    subcategories: ['Pipe Repair', 'Leak Detection']
  },
  {
    email: 'electrician@demo.com',
    password: 'password123',
    firstName: 'Ama',
    lastName: 'Osei',
    role: 'ARTISAN',
    businessName: 'Osei Bright Lights',
    bio: 'Professional electrician. I fix wiring issues, install chandeliers, and repair faulty generators.',
    categoryName: 'Electrical',
    subcategories: ['Wiring & Rewiring', 'Generator Maintenance']
  },
  {
    email: 'mechanic@demo.com',
    password: 'password123',
    firstName: 'Yaw',
    lastName: 'Adom',
    role: 'ARTISAN',
    businessName: 'Yaw Auto Works',
    bio: 'Your trusted auto mechanic. Bring your Toyota, Honda, or Kia. I do engine diagnostics and brake service.',
    categoryName: 'Auto Mechanics',
    subcategories: ['Engine Repair', 'Tire & Brake Service']
  },
  {
    email: 'carpenter@demo.com',
    password: 'password123',
    firstName: 'Kofi',
    lastName: 'Boateng',
    role: 'ARTISAN',
    businessName: 'Boateng Woodworks',
    bio: 'Master carpenter making custom furniture, repairing broken chairs, and installing solid doors.',
    categoryName: 'Carpentry',
    subcategories: ['Furniture Repair', 'Door & Window Fitting']
  },
  {
    email: 'customer@demo.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Customer',
    role: 'CUSTOMER'
  }
]

async function main() {
  console.log('Starting demo users seed...')
  let loginsMd = '# Demo Account Logins\n\nUse these accounts to test the ArtisanConnect platform.\n\n| Name | Role | Email | Password | Primary Skill |\n|---|---|---|---|---|\n'

  for (const user of demoUsers) {
    console.log(`Processing ${user.email}...`)
    
    // 1. Create or get user in Supabase Auth
    let supabaseUid: string | null = null
    const { data: existingAuth, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    const existing = existingAuth?.users.find(u => u.email === user.email)
    
    if (existing) {
      console.log(`User ${user.email} already exists in Auth.`)
      supabaseUid = existing.id
    } else {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role
        }
      })
      if (error) {
        console.error(`Failed to create Auth for ${user.email}`, error)
        continue
      }
      supabaseUid = data.user.id
      console.log(`Created Auth for ${user.email}`)
    }

    if (!supabaseUid) continue

    // 2. Create in Prisma if not exists
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          supabase_uid: supabaseUid,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: '0500000000',
          role: user.role as any
        }
      })
      console.log(`Created DB User for ${user.email}`)
    }

    // 3. Create Profile
    if (user.role === 'CUSTOMER') {
      let profile = await prisma.customerProfile.findFirst({ where: { user_id: dbUser.id } })
      if (!profile) {
        await prisma.customerProfile.create({ data: { user_id: dbUser.id } })
      }
    } else if (user.role === 'ARTISAN') {
      let profile = await prisma.artisanProfile.findFirst({ where: { user_id: dbUser.id } })
      if (!profile) {
        profile = await prisma.artisanProfile.create({
          data: {
            user_id: dbUser.id,
            business_name: user.businessName,
            bio: user.bio,
            address: 'Accra, Ghana',
            latitude: 5.6037 + (Math.random() - 0.5) * 0.1,
            longitude: -0.1869 + (Math.random() - 0.5) * 0.1,
            is_available: true,
            is_verified: true, // Make them verified for demo
            average_rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random 3.0 to 5.0 rating
            review_count: Math.floor(Math.random() * 20) + 1
          }
        })
      }

      // 4. Assign Skills (ArtisanServices)
      if (user.categoryName && user.subcategories) {
        const category = await prisma.category.findUnique({ where: { name: user.categoryName } })
        if (category) {
          for (const subName of user.subcategories) {
            const sub = await prisma.subcategory.findFirst({ 
              where: { name: subName, category_id: category.id } 
            })
            if (sub && profile) {
              // Ensure we don't duplicate services
              const existingService = await prisma.artisanService.findFirst({
                where: { artisan_id: profile.id, subcategory_id: sub.id }
              })
              if (!existingService) {
                await prisma.artisanService.create({
                  data: {
                    artisan_id: profile.id,
                    subcategory_id: sub.id,
                    price_min: 50,
                    price_max: 200
                  }
                })
                console.log(`Added skill ${subName} to ${user.email}`)
              }
            }
          }
        }
      }
    }
    
    loginsMd += `| ${user.firstName} ${user.lastName} | ${user.role} | ${user.email} | ${user.password} | ${user.categoryName || 'N/A'} |\n`
  }

  // Save logins to a file in the workspace
  const fs = require('fs')
  fs.writeFileSync('C:/Users/DellXPS15/.gemini/antigravity/brain/3e432db8-a341-4af8-9ddd-8821c5d2a389/demo_logins.md', loginsMd)
  console.log('Saved demo logins to artifacts!')
  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
