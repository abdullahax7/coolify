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

// Map camelCase Order fields to DB snake_case column names
const FIELD_MAP: Record<string, string> = {
  customerName:    'customer_name',
  customerEmail:   'customer_email',
  customerPhone:   'customer_phone',
  formType:        'form_type',
  formData:        'form_data',
  pdfUrl:          'pdf_url',
  squarePaymentId: 'square_payment_id',
  status:          'status',
};
const SKIP = new Set(['id', 'date']);

function toSnake(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (SKIP.has(k)) continue;
    out[FIELD_MAP[k] ?? k] = v;
  }
  return out;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin && data.user_id !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const update = toSnake(body);

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.from('orders').update(update).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit({
    adminId: admin.id, adminEmail: admin.email, action: 'update',
    targetTable: 'orders', targetId: id, targetName: data?.name ?? null,
    diff: { after: update }, request: req,
  });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adminClient = await createAdminClient();
  const { data: existing } = await adminClient.from('orders').select('name').eq('id', id).single();

  return softDeleteRow({
    table: 'orders',
    id,
    adminId: admin.id,
    adminEmail: admin.email,
    targetName: existing?.name ?? null,
    request: req,
  });
}
