import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { performCleanupAndLog } from '@/lib/cleanup';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await createAdminClient();
  const buckets = ['properties', 'property-images', 'pdfs'];
  const results = [];

  for (const bucket of buckets) {
    try {
      // 1. List files in bucket
      const { data: files, error: listError } = await admin.storage.from(bucket).list('', { limit: 100 });
      if (listError) throw listError;

      if (!files || files.length === 0) continue;

      // 2. Fetch all related tables to check for references
      // This is a simplified check. In a real app, you'd have a media table tracking all refs.
      const { data: props } = await admin.from('custom_properties').select('image_url, gallery_urls');
      const { data: orders } = await admin.from('orders').select('pdf_url');
      const { data: docs } = await admin.from('property_documents').select('file_url');

      const allRefs = new Set([
        ...(props?.map(p => p.image_url) || []),
        ...(props?.flatMap(p => p.gallery_urls?.split('|DELIM|')) || []),
        ...(orders?.map(o => o.pdf_url) || []),
        ...(docs?.map(d => d.file_url) || [])
      ].filter(Boolean));

      // 3. Compare and delete
      for (const file of files) {
        // Skip placeholders
        if (file.name === '.emptyFolderPlaceholder') continue;

        const publicUrl = admin.storage.from(bucket).getPublicUrl(file.name).data.publicUrl;
        
        // Simple reference check: is the public URL anywhere in our referenced set?
        // Note: This might need more robust URL matching depending on how URLs are stored
        const isReferenced = Array.from(allRefs).some(ref => ref?.includes(file.name));

        if (!isReferenced) {
          // Log and delete orphaned file
          await performCleanupAndLog({
            itemId: 'ORPHAN-' + file.name,
            itemType: 'orphaned_file',
            itemName: `${bucket}/${file.name}`,
            files: [publicUrl]
          });
          results.push({ bucket, file: file.name, status: 'deleted' });
        }
      }
    } catch (e) {
      console.error(`[cleanup-orphaned] Error in bucket ${bucket}:`, e);
    }
  }

  return NextResponse.json({ processed: results.length, details: results });
}
