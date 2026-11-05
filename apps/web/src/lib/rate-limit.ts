import { headers } from 'next/headers';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache
// Uses a Map with automatic expiration cleanup to prevent memory bloat
const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent stale keys from accumulating
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitMap.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Core sliding window rate limiter
 * @param key Unique key to identify client/action (e.g. `ai:user_123` or `auth:ip_1.2.3.4`)
 * @param limit Maximum allowed requests within the time window
 * @param windowSeconds Window length in seconds (default 60s)
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  cleanupStaleEntries(windowMs);

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const currentCount = record.timestamps.length;
  const remaining = Math.max(0, limit - currentCount);
  const oldestTimestamp = record.timestamps[0] || now;
  const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

  if (currentCount >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record current request
  record.timestamps.push(now);

  return {
    success: true,
    limit,
    remaining: limit - (currentCount + 1),
    resetSeconds: Math.max(1, resetSeconds),
  };
}

/**
 * Extracts client IP safely from Next.js request headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = headersList.get('x-real-ip');
    if (realIp) {
      return realIp.trim();
    }
    const cfConnectingIp = headersList.get('cf-connecting-ip');
    if (cfConnectingIp) {
      return cfConnectingIp.trim();
    }
  } catch {
    // In case headers() is invoked in a context where headers aren't available
  }
  return '127.0.0.1';
}

/**
 * Rate limiter for AI operations (Google Gemini dispute summaries, semantic query parsing)
 * Default: 12 calls per minute per user/IP
 */
export async function rateLimitAi(identifier?: string, limit: number = 12, windowSeconds: number = 60): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const key = `ai:${identifier || ip}`;
  return checkRateLimit(key, limit, windowSeconds);
}

/**
 * Rate limiter for Authentication (login, registration, password resets)
 * Default: 6 attempts per minute per IP
 */
export async function rateLimitAuth(identifier?: string, limit: number = 6, windowSeconds: number = 60): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const key = `auth:${identifier || ip}`;
  return checkRateLimit(key, limit, windowSeconds);
}

/**
 * Rate limiter for sensitive mutations (creating requests, quotes, reports)
 * Default: 20 actions per minute per user/IP
 */
export async function rateLimitMutation(identifier?: string, limit: number = 20, windowSeconds: number = 60): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const key = `mutation:${identifier || ip}`;
  return checkRateLimit(key, limit, windowSeconds);
}
