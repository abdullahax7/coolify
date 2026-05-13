import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mineOnly = url.searchParams.get('mine') === 'true';

    const supabase = await createAdminClient();
    const client = await (await import('@/lib/supabase/server')).createClient();
    const { data: { user } } = await client.auth.getUser();

    let query = supabase
      .from('wales_forms')
      .select('*')
      .is('deleted_at', null);

    if (mineOnly && user) {
      query = query.eq('client_email', user.email);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ wales: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('wales_forms')
      .insert([{
        form_type: body.formType,
        client_name: body.clientName,
        client_email: body.clientEmail,
        client_phone: body.clientPhone,
        notes: body.notes,
        form_data: body.formData
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}
