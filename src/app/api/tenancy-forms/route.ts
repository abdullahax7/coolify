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

  const { data, error } = await supabase.from('tenancy_forms').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ forms: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const record = {
    id: `TF-${Date.now()}`,
    tenant_name: body.tenantName, landlord_name: body.landlordName,
    property_address: body.propertyAddress,
    contract_start_date: body.contractStartDate, contract_end_date: body.contractEndDate,
    monthly_rent: body.monthlyRent, deposit_amount: body.depositAmount,
    tenant_email: body.tenantEmail, tenant_phone: body.tenantPhone,
    landlord_email: body.landlordEmail, landlord_phone: body.landlordPhone,
    additional_notes: body.additionalNotes ?? '',
    contract_file_url: body.contractFileUrl ?? null,
    status: body.status ?? 'draft',
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('tenancy_forms').insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
