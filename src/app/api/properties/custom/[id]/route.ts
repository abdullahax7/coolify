import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { performCleanupAndLog } from '@/lib/cleanup';
import { logAudit } from '@/lib/audit';

// Document file_url is stored as a bucket-relative path, but legacy rows may
// hold a signed URL — accept either and return the bucket path.
function documentPath(fileUrl: string | null | undefined): string | null {
  if (!fileUrl) return null;
  if (!fileUrl.startsWith('http')) return fileUrl;
  try {
    const url = new URL(fileUrl);
    return url.pathname.split('/documents/')[1]?.split('?')[0] ?? null;
  } catch { return null; }
}


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

  // Restore (admin only): clears deleted_at on the property and cascades to its documents
  // so anything that was soft-deleted alongside the property comes back together.
  if (restore === true) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const adminClient = await createAdminClient();
    const { error } = await adminClient.from('custom_properties').update({ deleted_at: null }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { error: docRestoreErr } = await adminClient
      .from('property_documents')
      .update({ deleted_at: null })
      .eq('property_id', id);
    if (docRestoreErr && !/deleted_at/i.test(docRestoreErr.message)) {
      console.warn('[custom_properties restore] failed to restore child documents:', docRestoreErr.message);
    }
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
    if (assigned_to_email !== undefined) {
      // Normalize to lowercase so reads with auth.email (always lowercase) match.
      updateData.assigned_to_email = assigned_to_email
        ? String(assigned_to_email).toLowerCase()
        : assigned_to_email;
    }
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

  if (existing.is_approved !== data.is_approved || existing.deleted_at !== data.deleted_at) {
    revalidatePath('/sitemap.xml');
  }

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

  // Collect property image files + child-document storage paths. Used by both
  // hard-delete paths so a permanently removed property leaves no orphans.
  const collectAndPurgeChildren = async () => {
    const imageFiles: string[] = [];
    if (existing.image_url) imageFiles.push(existing.image_url);
    if (existing.gallery_urls) {
      const urls = String(existing.gallery_urls).split('|DELIM|').filter(Boolean);
      imageFiles.push(...urls);
    }

    const { data: docs } = await adminClient
      .from('property_documents')
      .select('id, file_url')
      .eq('property_id', id);

    const docPaths = (docs ?? [])
      .map(d => documentPath(d.file_url as string | null))
      .filter((p): p is string => !!p);

    if (docPaths.length > 0) {
      const { error: storageErr } = await adminClient.storage.from('documents').remove(docPaths);
      if (storageErr) console.warn('[custom_properties hard-delete] documents bucket cleanup:', storageErr.message);
    }
    if (docs && docs.length > 0) {
      const { error: docDelErr } = await adminClient
        .from('property_documents')
        .delete()
        .eq('property_id', id);
      if (docDelErr) console.warn('[custom_properties hard-delete] property_documents row cleanup:', docDelErr.message);
    }

    await performCleanupAndLog({
      itemId: id,
      itemType: 'property',
      itemName: existing.title,
      deletedBy: user.id,
      files: imageFiles,
    });
  };

  // Hard delete path: admin-only AND must be already soft-deleted (or hard=true override).
  if (hard) {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden — admin required for hard delete' }, { status: 403 });

    await collectAndPurgeChildren();

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
  const now = new Date().toISOString();
  const { error: softErr } = await adminClient
    .from('custom_properties')
    .update({ deleted_at: now })
    .eq('id', id);

  // If deleted_at column doesn't exist (pre-migration), fall back to hard delete.
  if (softErr && /deleted_at/i.test(softErr.message)) {
    await collectAndPurgeChildren();
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

  // Cascade the soft-delete to child documents so they disappear from active
  // lists alongside the property. Storage files stay in the `documents` bucket
  // until the property is purged from trash — that's what makes restore work.
  const { error: docSoftErr } = await adminClient
    .from('property_documents')
    .update({ deleted_at: now })
    .eq('property_id', id)
    .is('deleted_at', null);
  if (docSoftErr && !/deleted_at/i.test(docSoftErr.message)) {
    console.warn('[custom_properties soft-delete] cascade documents:', docSoftErr.message);
  }

  await logAudit({
    adminId: user.id, adminEmail: user.email, action: 'delete',
    targetTable: 'custom_properties', targetId: id, targetName: existing.title,
    diff: { before: existing, soft: true }, request: req,
  });

  if (existing.is_approved) {
    revalidatePath('/sitemap.xml');
  }

  return NextResponse.json({ success: true, soft: true });
}
