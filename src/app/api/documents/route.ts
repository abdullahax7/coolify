import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

// Extract storage path from either a stored path or a legacy signed URL.
function toStoragePath(fileUrl: string): string | null {
  if (!fileUrl) return null;
  if (!fileUrl.startsWith('http')) return fileUrl; // already a path
  try {
    const url = new URL(fileUrl);
    // Supabase signed URL: /storage/v1/object/sign/documents/<path>
    const parts = url.pathname.split('/documents/');
    return parts[1]?.split('?')[0] ?? null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = await requireAdmin(supabase);
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const mineOnly = searchParams.get('mine') === 'true';

  // Emails are compared case-insensitively — Supabase normalizes auth emails
  // to lowercase, but assigned_to_email may have been entered with any case.
  const userEmailLower = (user.email ?? '').toLowerCase();

  const adminClient = await createAdminClient();

  let query = adminClient.from('property_documents').select('*').is('deleted_at', null);

  if (mineOnly) {
    // Documents for every property the user owns or is assigned to (case-insensitive on email).
    const { data: myProps } = await adminClient
      .from('custom_properties')
      .select('id')
      .or(`user_id.eq.${user.id},assigned_to_email.ilike.${userEmailLower}`)
      .is('deleted_at', null);
    const ids = (myProps ?? []).map(p => p.id);
    if (ids.length === 0) {
      return NextResponse.json({ documents: [] });
    }
    query = query.in('property_id', ids);
  } else if (!admin) {
    if (!propertyId) return NextResponse.json({ error: 'Property ID required' }, { status: 400 });

    const { data: prop, error: propErr } = await adminClient
      .from('custom_properties')
      .select('user_id, assigned_to_email')
      .eq('id', propertyId)
      .single();

    const assignedEmailLower = (prop?.assigned_to_email ?? '').toLowerCase();
    if (propErr || !prop || (assignedEmailLower !== userEmailLower && prop.user_id !== user.id)) {
      return NextResponse.json({ error: 'Access denied. You are not assigned to or owner of this property.' }, { status: 403 });
    }

    query = query.eq('property_id', propertyId);
  } else if (propertyId) {
    query = query.eq('property_id', propertyId);
  }

  const { data, error } = await query.order('date_uploaded', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate fresh 1-hour signed URLs for every document that has a file
  const docs = await Promise.all((data ?? []).map(async (doc) => {
    if (!doc.file_url) return doc;
    const path = toStoragePath(doc.file_url as string);
    if (!path) return doc;
    const { data: signed } = await adminClient.storage
      .from('documents')
      .createSignedUrl(path, 60 * 60 * 24); // 24-hour TTL
    return { ...doc, file_url: signed?.signedUrl ?? doc.file_url };
  }));

  return NextResponse.json({ documents: docs });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const meta = JSON.parse(formData.get('meta') as string ?? '{}');

  // Use admin client to bypass RLS for administrative storage/db operations
  const adminClient = await createAdminClient();

  let storagePath: string | null = null;
  let fileName: string | null = null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const path = `documents/${meta.propertyId ?? 'misc'}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await adminClient.storage
      .from('documents')
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    // Store the path, not a signed URL — signed URLs expire
    storagePath = path;
    fileName = file.name;
  }

  const doc = {
    id: `DOC-${Date.now()}`,
    property_id: meta.propertyId ?? '', property_name: meta.propertyName ?? '',
    document_type: meta.documentType ?? '', expiry_date: meta.expiryDate ?? '',
    date_uploaded: new Date().toISOString().split('T')[0],
    status: meta.status ?? 'Current',
    file_url: storagePath, file_name: fileName,
  };

  const { data, error } = await adminClient.from('property_documents').insert(doc).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return a fresh signed URL in the response so the UI can show it immediately
  if (storagePath) {
    const { data: signed } = await adminClient.storage.from('documents').createSignedUrl(storagePath, 60 * 60 * 24);
    return NextResponse.json({ ...data, file_url: signed?.signedUrl ?? storagePath }, { status: 201 });
  }

  return NextResponse.json(data, { status: 201 });
}
