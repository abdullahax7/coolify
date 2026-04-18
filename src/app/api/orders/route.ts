import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  const isAdmin = profile?.is_admin ?? false;

  const query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (!isAdmin) query.eq('user_id', user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone')
    .eq('id', user.id)
    .single();

  const body = await req.json();
  const order = {
    id: `ORD-${Date.now()}`,
    user_id: user.id,
    type: body.type,
    name: body.name,
    price: body.price,
    detail: body.detail ?? '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: body.status ?? 'pending',
    form_type: body.formType ?? null,
    form_data: body.formData ?? null,
    pdf_url: body.pdfUrl ?? null,
    square_payment_id: body.squarePaymentId ?? null,
    customer_name: profile?.name ?? '',
    customer_email: user.email ?? '',
    customer_phone: profile?.phone ?? '',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
