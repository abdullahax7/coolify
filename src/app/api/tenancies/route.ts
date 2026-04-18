import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

  const { data, error } = await supabase.from('tenancies').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tenancies: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const tenancy = {
    id: `TEN-${Date.now()}`,
    property_id: body.propertyId, property_name: body.propertyName,
    start_date: body.startDate, end_date: body.endDate,
    rent_amount: body.rentAmount, rent_frequency: body.rentFrequency, rent_day: body.rentDay,
    deposit_amount: body.depositAmount,
    tenant_name: body.tenantName, tenant_email: body.tenantEmail, tenant_phone: body.tenantPhone,
    agreement_file_url: body.agreementFileUrl ?? null,
    status: body.status ?? 'Pending',
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('tenancies').insert(tenancy).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
