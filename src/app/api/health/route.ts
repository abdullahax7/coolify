import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthCheck {
  ok: boolean;
  latency_ms?: number;
  error?: string;
}

interface HealthResponse {
  ok: boolean;
  timestamp: string;
  uptime_s: number;
  checks: {
    database: HealthCheck;
    storage: HealthCheck;
  };
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from('profiles').select('id', { head: true, count: 'exact' }).limit(0);
    if (error) return { ok: false, error: error.message, latency_ms: Date.now() - start };
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown', latency_ms: Date.now() - start };
  }
}

async function checkStorage(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.storage.listBuckets();
    if (error) return { ok: false, error: error.message, latency_ms: Date.now() - start };
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown', latency_ms: Date.now() - start };
  }
}

export async function GET() {
  const [database, storage] = await Promise.all([checkDatabase(), checkStorage()]);
  const ok = database.ok && storage.ok;

  const body: HealthResponse = {
    ok,
    timestamp: new Date().toISOString(),
    uptime_s: Math.round(process.uptime()),
    checks: { database, storage },
  };

  return NextResponse.json(body, {
    status: ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
