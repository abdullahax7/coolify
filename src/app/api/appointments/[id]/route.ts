import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { softDeleteRow } from '@/lib/soft-delete';
import { logAudit } from '@/lib/audit';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const adminClient = await createAdminClient();
  const { data, error } = await adminClient
    .from('appointments')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit({
    adminId: admin.id, adminEmail: admin.email, action: 'update',
    targetTable: 'appointments', targetId: id, targetName: data?.name ?? null,
    diff: { after: body }, request: req,
  });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adminClient = await createAdminClient();
  const { data: existing } = await adminClient.from('appointments').select('name').eq('id', id).single();

  return softDeleteRow({
    table: 'appointments',
    id,
    adminId: admin.id,
    adminEmail: admin.email,
    targetName: existing?.name ?? null,
    request: req,
  });
}
