import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { softDeleteRow } from '@/lib/soft-delete';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('wales_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from('wales_forms')
      .update({
        form_type: body.formType,
        client_name: body.clientName,
        client_email: body.clientEmail,
        client_phone: body.clientPhone,
        notes: body.notes,
        form_data: body.formData,
        status: body.status || 'pending'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      throw error;
    }

    // Synchronize with orders table if this is a user-purchased form
    try {
      const isTenancy = body.formType.toLowerCase().includes('tenancy') || body.formType.toLowerCase().includes('occupation contract');
      const tenancyTypes = ['Tenancy Agreement', 'Tenancy Agreements', 'Fixed Term Standard Occupation Contract'];
      
      let query = supabase.from('orders').update({
        customer_name: body.clientName,
        customer_email: body.clientEmail,
        customer_phone: body.clientPhone,
        form_data: body.formData,
        status: body.status
      }).eq('customer_email', body.clientEmail);

      if (isTenancy) {
        query = query.in('form_type', tenancyTypes);
      } else {
        query = query.eq('form_type', body.formType);
      }
      
      const { error: orderUpdateError } = await query;
      
      if (orderUpdateError) {
        console.warn('Sync to orders failed (non-critical):', orderUpdateError.message);
      }
    } catch (e) {
      console.warn('Sync to orders exception:', e);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Verify admin via the user-scoped client (admin client bypasses RLS, can't check identity).
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await userClient.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adminClient = await createAdminClient();
  const { data: existing } = await adminClient.from('wales_forms').select('client_name, form_type').eq('id', id).single();

  return softDeleteRow({
    table: 'wales_forms',
    id,
    adminId: user.id,
    adminEmail: user.email,
    targetName: existing?.client_name || existing?.form_type || null,
    request,
  });
}
