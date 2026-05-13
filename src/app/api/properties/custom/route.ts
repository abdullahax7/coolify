import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mineOnly = url.searchParams.get('mine') === 'true';
  const assigned = url.searchParams.get('assigned') === 'true';
  const trash = url.searchParams.get('trash') === 'true';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminClient = await createAdminClient();
  let query = adminClient.from('custom_properties').select('*, profiles(is_admin, email)');

  // Determine admin status once.
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    isAdmin = !!profile?.is_admin;
  }

  // Trash view: admins only.
  if (trash) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    query = query.not('deleted_at', 'is', null);
  } else {
    // Default: exclude soft-deleted. Tolerate missing column on first deploy.
    query = query.is('deleted_at', null);
  }

  if (user) {
    if (!isAdmin && !trash) {
      if (assigned) {
        query = query.eq('assigned_to_email', user.email);
      } else if (mineOnly) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.or(`is_approved.eq.true,user_id.eq.${user.id},assigned_to_email.eq.${user.email}`);
      }
    }
  } else {
    // Guest: only approved and not expired.
    query = query.eq('is_approved', true).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  // Graceful fallback if deleted_at column doesn't exist yet (pre-migration).
  if (error && /deleted_at/i.test(error.message)) {
    let retry = adminClient.from('custom_properties').select('*, profiles(is_admin, email)');
    if (user) {
      if (!isAdmin) {
        if (assigned) retry = retry.eq('assigned_to_email', user.email);
        else if (mineOnly) retry = retry.eq('user_id', user.id);
        else retry = retry.or(`is_approved.eq.true,user_id.eq.${user.id},assigned_to_email.eq.${user.email}`);
      }
    } else {
      retry = retry.eq('is_approved', true).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
    }
    const retryResult = await retry.order('created_at', { ascending: false });
    if (retryResult.error) return NextResponse.json({ error: retryResult.error.message }, { status: 500 });
    return NextResponse.json({ properties: retryResult.data });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  const isAdmin = profile?.is_admin || false;

  const body = await req.json();
  const adminClient = await createAdminClient();

  // Find latest active listing plan to set expiration
  const { data: latestOrder } = await adminClient
    .from('orders')
    .select('expires_at')
    .eq('user_id', user.id)
    .not('expires_at', 'is', null)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 1. Verify plan (for non-admins)
  if (!isAdmin && !latestOrder) {
    return NextResponse.json({ error: 'You need an active listing plan to post a property.' }, { status: 403 });
  }

  // 2. Strict Field Mapping & Validation
  const {
    title, location, price, beds, baths, sqft, type, sector, status,
    notes, image_url, gallery_urls, map_embed_url, description,
    features, interior, exterior, listing_type
  } = body;

  if (!title || !location || !price) {
    return NextResponse.json({ error: 'Title, location and price are required.' }, { status: 400 });
  }

  const prop = {
    id: `PROP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title, location, price, beds, baths, sqft, type, sector, status,
    notes, image_url, gallery_urls, map_embed_url, description,
    features, interior, exterior, listing_type,
    user_id: user.id,
    expires_at: latestOrder?.expires_at || null,
    is_approved: isAdmin ? (body.is_approved ?? true) : false
  };

  const { data, error } = await adminClient.from('custom_properties').insert(prop).select().single();
  if (error) {
    console.error('[properties/custom] POST error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit({
    adminId: user.id,
    adminEmail: user.email,
    action: 'create',
    targetTable: 'custom_properties',
    targetId: prop.id,
    targetName: title,
    diff: { after: prop },
    request: req,
  });

  return NextResponse.json(data, { status: 201 });
}
