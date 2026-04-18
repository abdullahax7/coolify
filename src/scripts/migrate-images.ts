import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadBase64(base64: string, fileName: string) {
  if (!base64 || !base64.startsWith('data:image')) return base64;

  try {
    const match = base64.match(/data:image\/([a-zA-Z+]+);base64,(.+)/);
    if (!match) return base64;

    const mimeType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const finalFileName = `${Date.now()}-${fileName}.${mimeType}`;

    const { data, error } = await supabase.storage
      .from('properties')
      .upload(finalFileName, buffer, {
        contentType: `image/${mimeType}`,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(data.path);

    console.log(`Uploaded ${finalFileName}`);
    return publicUrl;
  } catch (err) {
    console.error('Upload error:', err);
    return base64;
  }
}

async function migrate() {
  console.log('Starting migration...');

  const { data: properties, error } = await supabase
    .from('custom_properties')
    .select('*');

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  console.log(`Found ${properties.length} properties to process.`);

  for (const prop of properties) {
    console.log(`Processing property: ${prop.title} (${prop.id})`);

    let updatedImageUrl = prop.image_url;
    if (prop.image_url && prop.image_url.startsWith('data:image')) {
      updatedImageUrl = await uploadBase64(prop.image_url, `prop-${prop.id}-main`);
    }

    let updatedGalleryUrls = prop.gallery_urls;
    if (prop.gallery_urls && prop.gallery_urls.includes('data:image')) {
      const gallery = prop.gallery_urls.split('|DELIM|').map((s: string) => s.trim()).filter(Boolean);
      const newGallery = [];
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i].startsWith('data:image')) {
          const url = await uploadBase64(gallery[i], `prop-${prop.id}-gallery-${i}`);
          newGallery.push(url);
        } else {
          newGallery.push(gallery[i]);
        }
      }
      updatedGalleryUrls = newGallery.join('|DELIM|');
    }

    if (updatedImageUrl !== prop.image_url || updatedGalleryUrls !== prop.gallery_urls) {
      const { error: updError } = await supabase
        .from('custom_properties')
        .update({
          image_url: updatedImageUrl,
          gallery_urls: updatedGalleryUrls
        })
        .eq('id', prop.id);

      if (updError) console.error(`Error updating ${prop.id}:`, updError);
      else console.log(`✓ Updated ${prop.id}`);
    } else {
      console.log(`- No Base64 found for ${prop.id}`);
    }
  }

  console.log('Migration finished!');
}

migrate();
