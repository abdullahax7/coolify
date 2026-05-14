import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { softDeleteRow } from '@/lib/soft-delete';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  return data?.is_admin ? user : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  
  // Use admin client to bypass RLS for administrative update
  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.from('property_documents').update(body).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const adminClient = await createAdminClient();
  const { data: doc } = await adminClient
    .from('property_documents')
    .select('file_url, file_name, document_type')
    .eq('id', id)
    .single();

  // Storage file is kept on soft delete so restore can bring it back. If we
  // hit the fallback hard-delete path (column missing), clean up the file then.
  const cleanupFile = async () => {
    if (!doc?.file_url) return;
    let path: string | null = null;
    if (!doc.file_url.startsWith('http')) {
      path = doc.file_url;
    } else {
      try {
        const url = new URL(doc.file_url);
        path = url.pathname.split('/documents/')[1]?.split('?')[0] ?? null;
      } catch { /* ignore */ }
    }
    if (path) await adminClient.storage.from('documents').remove([path]);
  };

  return softDeleteRow({
    table: 'property_documents',
    id,
    adminId: admin.id,
    adminEmail: admin.email,
    targetName: doc?.file_name || doc?.document_type || null,
    request: req,
    onHardDelete: cleanupFile,
  });
}
