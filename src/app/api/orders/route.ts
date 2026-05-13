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
    .is('deleted_at', null)
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
    .select('name, phone, is_admin')
    .eq('id', user.id)
    .single();
  const isAdmin = profile?.is_admin ?? false;

  const body = await req.json();

  const customerName  = isAdmin && body.customerName  ? body.customerName  : (profile?.name  ?? '');
  const customerEmail = isAdmin && body.customerEmail ? body.customerEmail : (user.email     ?? '');
  const customerPhone = isAdmin && body.customerPhone ? body.customerPhone : (profile?.phone ?? '');

  // Non-admins cannot self-mark orders as paid/active. Status, price, and
  // square_payment_id are server-controlled: paid orders are minted by the
  // Square webhook (/api/checkout/webhook); anything created via this route
  // by a regular user is treated as pending and unpriced until that webhook
  // fires (or an admin updates the record).
  const status = isAdmin && body.status ? body.status : 'pending';
  const price  = isAdmin && body.price  ? body.price  : (body.price ?? '');
  const squarePaymentId = isAdmin && body.squarePaymentId ? body.squarePaymentId : null;

  const order = {
    id: `ORD-${Date.now()}`,
    user_id: user.id,
    type: body.type,
    name: body.name,
    price,
    detail: body.detail ?? '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status,
    form_type: body.formType ?? null,
    form_data: body.formData ?? null,
    pdf_url: body.pdfUrl ?? null,
    square_payment_id: squarePaymentId,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
