import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

/**
 * DELETE /api/auth/delete-account
 *
 * Deletes the requesting user's auth.users row. The `profiles` row cascades
 * out via the `on delete cascade` foreign key, and orders/properties get
 * their `user_id` set to NULL (GDPR-style anonymization).
 *
 * Requires the user's password as confirmation (re-auth) to prevent CSRF.
 */
export async function POST(req: NextRequest) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password) return NextResponse.json({ error: 'Password confirmation required.' }, { status: 400 });

  // Re-auth: verify the password matches the current session's email.
  const { error: signInErr } = await userClient.auth.signInWithPassword({
    email: user.email!,
    password,
  });
  if (signInErr) return NextResponse.json({ error: 'Password is incorrect.' }, { status: 403 });

  // Refuse if the requester is an admin — admins must demote themselves first
  // through a different admin to avoid the last-admin-locked-out scenario.
  const { data: profile } = await userClient.from('profiles').select('is_admin, name').eq('id', user.id).single();
  if (profile?.is_admin) {
    return NextResponse.json(
      { error: 'Admin accounts cannot self-delete. Contact another admin to remove your account.' },
      { status: 403 },
    );
  }

  const admin = await createAdminClient();
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  await logAudit({
    adminId: user.id, adminEmail: user.email, action: 'delete',
    targetTable: 'auth.users', targetId: user.id, targetName: profile?.name ?? user.email,
    diff: { reason: 'self-delete' }, request: req,
  });

  // Sign the user out (cookie cleanup).
  await userClient.auth.signOut();
  return NextResponse.json({ success: true });
}
