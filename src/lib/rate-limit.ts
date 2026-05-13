import { NextRequest } from 'next/server';

/**
 * In-process rate limiter (token bucket per key).
 *
 * Notes & limits:
 * - Memory is per-instance. On a single-VPS / single-instance deploy
 *   (typical Coolify setup) this is fine. On a horizontally scaled deploy,
 *   replace with Redis (e.g. @upstash/ratelimit).
 * - Resets on server restart.
 * - Caller decides the bucket key (usually IP or "ip:route").
 */

type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

function takeToken(key: string, capacity: number, refillPerSec: number, cost = 1): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: capacity, updatedAt: now };
  const elapsedSec = (now - b.updatedAt) / 1000;
  const refilled = Math.min(capacity, b.tokens + elapsedSec * refillPerSec);
  if (refilled < cost) {
    const need = cost - refilled;
    const retryAfter = Math.ceil(need / refillPerSec);
    buckets.set(key, { tokens: refilled, updatedAt: now });
    return { ok: false, retryAfter };
  }
  buckets.set(key, { tokens: refilled - cost, updatedAt: now });
  return { ok: true, retryAfter: 0 };
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export interface RateLimitOpts {
  /** Unique label per route — combined with IP to form the bucket key. */
  name: string;
  /** Max tokens before rate-limiting kicks in (burst capacity). */
  capacity: number;
  /** Tokens refilled per second (sustained rate). */
  refillPerSec: number;
}

/**
 * Check rate limit. Returns { ok: false, retryAfter } when limited.
 * Recommended limits for common cases (per IP):
 *   - Login / register / password reset: capacity 5, refill 1/60 (5 burst, ~1/min sustained)
 *   - Contact / cash-inquiries / messages: capacity 3, refill 1/120 (3 burst, 1 per 2 min)
 *   - Share form (admin): capacity 10, refill 1/30
 */
export function rateLimit(req: NextRequest, opts: RateLimitOpts) {
  const ip = clientIp(req);
  const key = `${opts.name}:${ip}`;
  return takeToken(key, opts.capacity, opts.refillPerSec);
}
