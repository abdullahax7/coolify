import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .order('date_uploaded', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate fresh 1-hour signed URLs for every document that has a file
  const docs = await Promise.all((data ?? []).map(async (doc) => {
    if (!doc.file_url) return doc;
    const path = toStoragePath(doc.file_url as string);
    if (!path) return doc;
    const { data: signed } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 60 * 60); // 1-hour TTL
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

  let storagePath: string | null = null;
  let fileName: string | null = null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const path = `documents/${meta.propertyId ?? 'misc'}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
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

  const { data, error } = await supabase.from('property_documents').insert(doc).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return a fresh signed URL in the response so the UI can show it immediately
  if (storagePath) {
    const { data: signed } = await supabase.storage.from('documents').createSignedUrl(storagePath, 60 * 60);
    return NextResponse.json({ ...data, file_url: signed?.signedUrl ?? storagePath }, { status: 201 });
  }

  return NextResponse.json(data, { status: 201 });
}
