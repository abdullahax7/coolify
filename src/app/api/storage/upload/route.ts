import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isProcessableImage, processImage } from '@/lib/image-pipeline';

// Bigger upload payload allowance for photo galleries.
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await createAdminClient();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'properties';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Ensure bucket exists.
    const { data: buckets } = await admin.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    if (!bucketExists) {
      await admin.storage.createBucket(bucket, { public: true });
    }

    // 2. Optional image normalization: WebP, EXIF strip, max 1920px.
    let uploadBuffer: ArrayBuffer | Buffer = await file.arrayBuffer();
    let uploadMime: string = file.type || 'application/octet-stream';
    let uploadExt: string = (file.name.split('.').pop() || 'bin').toLowerCase();

    if (isProcessableImage(file.type, file.name)) {
      const processed = await processImage(Buffer.from(uploadBuffer), file.type);
      uploadBuffer = processed.buffer;
      uploadMime = processed.mime;
      uploadExt = processed.ext;
    }

    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80) || 'file';
    const fileName = `${Date.now()}-${safeBase}.${uploadExt}`;
    const filePath = fileName;

    // 3. Upload.
    const { data: uploadData, error: uploadError } = await admin.storage
      .from(bucket)
      .upload(filePath, uploadBuffer as Buffer, {
        cacheControl: '31536000, immutable',
        upsert: false,
        contentType: uploadMime,
      });

    if (uploadError) {
      if (bucket === 'properties') {
        const { data: fallbackData, error: fallbackError } = await admin.storage
          .from('property-images')
          .upload(filePath, uploadBuffer as Buffer, {
            cacheControl: '31536000, immutable',
            upsert: false,
            contentType: uploadMime,
          });

        if (!fallbackError) {
          const { data: { publicUrl } } = admin.storage.from('property-images').getPublicUrl(fallbackData.path);
          return NextResponse.json({ url: publicUrl });
        }
      }

      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = admin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('[storage/upload] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
