import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/storage/delete
 *
 * Admin-only. Removes a file from a Supabase storage bucket by URL.
 * Previously this had no auth check and could be invoked by anyone — a
 * full storage wipe primitive. Now guarded.
 */
export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await userClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { url, bucket } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const targetBucket = bucket || 'site-assets';
    const urlParts = String(url).split(`/public/${targetBucket}/`);
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'Invalid Supabase URL for deletion' }, { status: 400 });
    }
    const filePath = urlParts[1];

    const admin = await createAdminClient();
    const { error } = await admin.storage.from(targetBucket).remove([filePath]);
    if (error) {
      console.error('[storage-delete] Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[storage-delete] Catch error:', msg);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
