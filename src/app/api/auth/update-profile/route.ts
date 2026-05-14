import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * PUT /api/auth/update-profile
 *
 * Updates the requesting user's profile (name, phone). Email change is NOT
 * handled here — Supabase requires a separate verified-email flow for that.
 */
export async function PUT(req: NextRequest) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null) as { name?: string; phone?: string } | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const updates: Record<string, string> = {};
  if (typeof body.name === 'string' && body.name.trim().length > 0) updates.name = body.name.trim();
  if (typeof body.phone === 'string') updates.phone = body.phone.trim();

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('id, name, phone, email')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
