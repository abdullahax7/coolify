import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { performCleanupAndLog } from '@/lib/cleanup';
import { logAudit } from '@/lib/audit';


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  const isAdmin = profile?.is_admin || false;

  const { data: existing } = await supabase.from('custom_properties').select('*').eq('id', id).single();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!isAdmin && existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const {
    title, location, price, beds, baths, sqft, type, sector,
    notes, image_url, gallery_urls, map_embed_url, description,
    features, interior, exterior, listingType, is_approved,
    is_rejected, rejection_reason, assigned_to_email,
    restore,
  } = body;

  // Restore (admin only): clears deleted_at.
  if (restore === true) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const adminClient = await createAdminClient();
    const { error } = await adminClient.from('custom_properties').update({ deleted_at: null }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await logAudit({
      adminId: user.id, adminEmail: user.email, action: 'restore',
      targetTable: 'custom_properties', targetId: id, targetName: existing.title, request: req,
    });
    return NextResponse.json({ success: true });
  }

  const updateData: Record<string, unknown> = {
    title, location, price, beds, baths, sqft, type, sector,
    notes, image_url, gallery_urls, map_embed_url, description,
    features, interior, exterior, listing_type: listingType
  };

  if (!isAdmin) {
    updateData.is_approved = false;
    updateData.status = null;
  } else {
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (updateData.is_approved === true) {
      updateData.status = 'Live';
    }
    // Admin-only fields: rejection workflow + user assignment.
    if (is_rejected !== undefined) updateData.is_rejected = is_rejected;
    if (rejection_reason !== undefined) updateData.rejection_reason = rejection_reason;
    if (assigned_to_email !== undefined) updateData.assigned_to_email = assigned_to_email;
  }

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.from('custom_properties').update(updateData).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    adminId: user.id,
    adminEmail: user.email,
    action: is_approved === true ? 'approve' : is_approved === false ? 'reject' : 'update',
    targetTable: 'custom_properties',
    targetId: id,
    targetName: title || existing.title,
    diff: { before: existing, after: data },
    request: req,
  });

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const hard = url.searchParams.get('hard') === 'true';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  const isAdmin = profile?.is_admin || false;

  const { data: existing } = await supabase.from('custom_properties').select('*').eq('id', id).single();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!isAdmin && existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminClient = await createAdminClient();

  // Hard delete path: admin-only AND must be already soft-deleted (or hard=true override).
  if (hard) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden — admin required for hard delete' }, { status: 403 });

    const filesToDelete: string[] = [];
    if (existing.image_url) filesToDelete.push(existing.image_url);
    if (existing.gallery_urls) {
      const urls = String(existing.gallery_urls).split('|DELIM|').filter(Boolean);
      filesToDelete.push(...urls);
    }

    await performCleanupAndLog({
      itemId: id,
      itemType: 'property',
      itemName: existing.title,
      deletedBy: user.id,
      files: filesToDelete,
    });

    const { error } = await adminClient.from('custom_properties').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAudit({
      adminId: user.id, adminEmail: user.email, action: 'delete',
      targetTable: 'custom_properties', targetId: id, targetName: existing.title,
      diff: { before: existing, hard: true }, request: req,
    });

    return NextResponse.json({ success: true, hard: true });
  }

  // Soft-delete path (default).
  const { error: softErr } = await adminClient
    .from('custom_properties')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  // If deleted_at column doesn't exist (pre-migration), fall back to hard delete.
  if (softErr && /deleted_at/i.test(softErr.message)) {
    const filesToDelete: string[] = [];
    if (existing.image_url) filesToDelete.push(existing.image_url);
    if (existing.gallery_urls) {
      const urls = String(existing.gallery_urls).split('|DELIM|').filter(Boolean);
      filesToDelete.push(...urls);
    }
    await performCleanupAndLog({
      itemId: id, itemType: 'property', itemName: existing.title,
      deletedBy: user.id, files: filesToDelete,
    });
    const { error: delErr } = await adminClient.from('custom_properties').delete().eq('id', id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

    await logAudit({
      adminId: user.id, adminEmail: user.email, action: 'delete',
      targetTable: 'custom_properties', targetId: id, targetName: existing.title,
      diff: { before: existing, hard: true, reason: 'soft-delete column missing' }, request: req,
    });
    return NextResponse.json({ success: true, hard: true });
  }

  if (softErr) return NextResponse.json({ error: softErr.message }, { status: 500 });

  await logAudit({
    adminId: user.id, adminEmail: user.email, action: 'delete',
    targetTable: 'custom_properties', targetId: id, targetName: existing.title,
    diff: { before: existing, soft: true }, request: req,
  });

  return NextResponse.json({ success: true, soft: true });
}
