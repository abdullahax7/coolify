import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const path = `orders/${id}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: signedData } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  const signedUrl = signedData?.signedUrl ?? null;

  const { data, error } = await supabase
    .from('orders')
    .update({ pdf_url: signedUrl })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pdfUrl: signedUrl, order: data });
}
