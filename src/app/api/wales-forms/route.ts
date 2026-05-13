import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

/**
 * GET /api/wales-forms
 *
 * Auth model:
 * - Unauthenticated: 401.
 * - Logged-in non-admin: forced to mine=true (their own forms only).
 * - Admin: full list (optionally still filtered by mine=true).
 */
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await userClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    const isAdmin = !!profile?.is_admin;

    const url = new URL(request.url);
    const mineOnly = url.searchParams.get('mine') === 'true';

    const admin = await createAdminClient();
    let query = admin
      .from('wales_forms')
      .select('*')
      .is('deleted_at', null);

    if (!isAdmin || mineOnly) {
      // Non-admins always scoped to their own email.
      query = query.eq('client_email', user.email);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ wales: data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST /api/wales-forms
 *
 * Auth: must be logged in. client_email is pinned to the requester's email
 * unless the requester is an admin (admin can create forms on behalf of clients).
 */
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await userClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    const isAdmin = !!profile?.is_admin;

    const body = await request.json();

    if (!body.formType || !body.clientName) {
      return NextResponse.json({ error: 'formType and clientName are required.' }, { status: 400 });
    }

    const clientEmail = isAdmin && body.clientEmail ? body.clientEmail : user.email;

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('wales_forms')
      .insert([{
        form_type: body.formType,
        client_name: body.clientName,
        client_email: clientEmail,
        client_phone: body.clientPhone,
        notes: body.notes,
        form_data: body.formData,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    console.error('[wales-forms] POST error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
