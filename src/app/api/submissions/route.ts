import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  const isAdmin = profile?.is_admin ?? false;

  const query = supabase.from('property_submissions').select('*').order('submitted_at', { ascending: false });
  if (!isAdmin) query.eq('user_id', user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const submission = {
    id: `SUB-${Date.now()}`,
    user_id: user.id,
    address: body.address, postcode: body.postcode, type: body.type,
    beds: body.beds, baths: body.baths, sqft: body.sqft, price: body.price,
    description: body.description, features: body.features,
    status: 'pending',
    contact_name: body.contactName, contact_email: body.contactEmail, contact_phone: body.contactPhone,
  };

  const { data, error } = await supabase.from('property_submissions').insert(submission).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
