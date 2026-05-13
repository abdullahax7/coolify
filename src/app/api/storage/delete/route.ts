import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { url, bucket } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const targetBucket = bucket || 'site-assets';
    
    // Extract file path from URL
    // Supabase public URL format: https://.../storage/v1/object/public/bucket-name/file-name
    const urlParts = url.split(`/public/${targetBucket}/`);
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'Invalid Supabase URL for deletion' }, { status: 400 });
    }
    const filePath = urlParts[1];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await admin.storage
      .from(targetBucket)
      .remove([filePath]);

    if (error) {
      console.error('[storage-delete] Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[storage-delete] Catch error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
