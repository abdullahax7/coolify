import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase.from('cash_inquiries').select('*').is('deleted_at', null).order('id', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inquiries: data });
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: 'cash-inquiries', capacity: 3, refillPerSec: 1 / 120 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const supabase = await createClient();
  const body = await req.json();

  if (!body.image_urls || !Array.isArray(body.image_urls) || body.image_urls.length === 0) {
    return NextResponse.json({ error: 'At least one property image is required.' }, { status: 400 });
  }

  const inquiry = {
    id: `CASH-${Date.now()}`,
    name: body.name, 
    phone: body.phone, 
    email: body.email,
    price: body.price, 
    address: body.address, 
    postcode: body.postcode,
    image_urls: body.image_urls,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'new',
  };
  const { error } = await supabase.from('cash_inquiries').insert(inquiry);
  if (error) {
    console.error('[Cash Inquiry API] Insert failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(inquiry, { status: 201 });
}
