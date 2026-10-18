import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const rawConnectionString = `${process.env.DATABASE_URL || ''}`;

const isProduction = process.env.NODE_ENV === 'production';
const requiresSsl = 
  isProduction || 
  rawConnectionString.includes('sslmode=') || 
  rawConnectionString.includes('supabase.co') ||
  rawConnectionString.includes('pooler.supabase.com');

// Strip sslmode from connection string so pg-connection-string doesn't override our explicit ssl configuration
const cleanConnectionString = rawConnectionString
  .replace(/([?&])sslmode=[^&]+(&|$)/, '$1')
  .replace(/[?&]$/, '');

const pool = new Pool({ 
  connectionString: cleanConnectionString,
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  max: isProduction ? 15 : 5, // Connection pool limit
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
