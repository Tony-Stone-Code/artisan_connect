import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Set up globals
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Mock globalThis.prisma so getArtisans can find it
;(globalThis as any).prisma = prisma

// Import getArtisans AFTER setting globalThis.prisma
import { getArtisans } from '../src/app/actions/artisans'

async function runSearchTests() {
  console.log('--- AI Semantic Search Tests ---\n')
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set. Semantic search will fallback to standard text search.')
    process.exit(1)
  }

  const queries = [
    'my sink is leaking',
    'i need someone to fix my wiring',
    'my car engine is making a weird noise',
    'broken chair repair'
  ]

  for (const query of queries) {
    console.log(`\nTesting Query: "${query}"`)
    const results = await getArtisans(query)
    
    if (results.length === 0) {
      console.log(`  -> No results found.`)
    } else {
      console.log(`  -> Found ${results.length} artisan(s):`)
      for (const artisan of results) {
        const skills = artisan.services?.map((s: any) => s.subcategory?.name).join(', ') || 'No specific skills'
        console.log(`     - ${artisan.user.first_name} ${artisan.user.last_name} (${artisan.business_name || 'N/A'})`)
        console.log(`       Skills: ${skills}`)
      }
    }
  }

  console.log('\n--- Tests Complete ---')
}

runSearchTests()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
