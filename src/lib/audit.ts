import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export type AuditAction = 'create' | 'update' | 'delete' | 'restore' | 'approve' | 'reject' | 'login' | 'logout';

interface AuditEntry {
  adminId?: string | null;
  adminEmail?: string | null;
  action: AuditAction;
  targetTable: string;
  targetId?: string | null;
  targetName?: string | null;
  diff?: Record<string, unknown> | null;
  request?: NextRequest;
}

/**
 * Best-effort audit log write. Never throws — the operation that produced
 * the audit event should never fail because telemetry failed.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const admin = await createAdminClient();
    const ip = entry.request
      ? entry.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        entry.request.headers.get('x-real-ip') ||
        null
      : null;
    const userAgent = entry.request?.headers.get('user-agent') || null;

    await admin.from('admin_audit_log').insert({
      admin_id: entry.adminId ?? null,
      admin_email: entry.adminEmail ?? null,
      action: entry.action,
      target_table: entry.targetTable,
      target_id: entry.targetId ?? null,
      target_name: entry.targetName ?? null,
      diff: entry.diff ?? null,
      ip,
      user_agent: userAgent,
    });
  } catch (err) {
    console.error('[audit] log failed:', err);
  }
}
