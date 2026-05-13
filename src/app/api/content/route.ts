import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = url.searchParams.get('page');

  const supabase = await createClient();
  
  let query = supabase.from('site_content').select('*');
  if (page && page !== 'all') {
    query = query.eq('page_identifier', page);
  }

  const { data, error } = await query.order('page_identifier').order('section_key');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data });
}

interface ContentUpdate {
  page_identifier: string;
  section_key: string;
  content_value: string;
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { updates } = body; // Array of { page_identifier, section_key, content_value }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Invalid updates payload' }, { status: 400 });
    }

    // Upsert updates
    const { data, error } = await supabase.from('site_content').upsert(
      updates.map((u: ContentUpdate) => ({
        page_identifier: u.page_identifier,
        section_key: u.section_key,
        content_value: u.content_value,
        updated_at: new Date().toISOString()
      })),
      { onConflict: 'page_identifier,section_key' }
    ).select();

    if (error) {
      console.error('[content] PUT error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const count = data ? data.length : 0;
    return NextResponse.json({ success: true, count });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
