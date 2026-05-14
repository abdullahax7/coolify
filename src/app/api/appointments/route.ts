import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Use admin client to bypass RLS for administrative fetch
  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.from('appointments').select('*').is('deleted_at', null).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ appointments: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const appt = {
    id: `APT-${Date.now()}`,
    name: body.name, number: body.number,
    timing: body.timing, day: body.day,
    description: body.description ?? null,
    created_at: new Date().toISOString(),
  };
  
  // Use admin client to bypass RLS for administrative insert
  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.from('appointments').insert(appt).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
