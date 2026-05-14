import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

interface SoftDeleteOpts {
  table: string;
  id: string;
  adminId?: string | null;
  adminEmail?: string | null;
  targetName?: string | null;
  request?: NextRequest;
  /** Called only on hard-delete fallback (e.g. column missing). Use to clean
   *  up storage files since the row will be gone immediately. */
  onHardDelete?: () => Promise<void>;
}

/**
 * Soft-delete a row by stamping `deleted_at = now()`.
 *
 * If the `deleted_at` column does not yet exist on the table (pre-migration),
 * silently falls back to a hard DELETE so the user-facing operation still works.
 *
 * Audit-logs the action either way.
 */
export async function softDeleteRow(opts: SoftDeleteOpts): Promise<NextResponse> {
  const { table, id, adminId, adminEmail, targetName, request, onHardDelete } = opts;
  const admin = await createAdminClient();

  const { error: softErr } = await admin
    .from(table)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (softErr && /deleted_at/i.test(softErr.message)) {
    if (onHardDelete) {
      try { await onHardDelete(); } catch (e) { console.warn('[soft-delete] onHardDelete failed:', e); }
    }
    const { error: hardErr } = await admin.from(table).delete().eq('id', id);
    if (hardErr) return NextResponse.json({ error: hardErr.message }, { status: 500 });
    await logAudit({
      adminId, adminEmail, action: 'delete',
      targetTable: table, targetId: id, targetName,
      diff: { hard: true, reason: 'soft-delete column missing' },
      request,
    });
    return NextResponse.json({ success: true, hard: true });
  }

  if (softErr) return NextResponse.json({ error: softErr.message }, { status: 500 });

  await logAudit({
    adminId, adminEmail, action: 'delete',
    targetTable: table, targetId: id, targetName,
    diff: { soft: true }, request,
  });
  return NextResponse.json({ success: true, soft: true });
}
