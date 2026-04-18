import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensurePdfBucket() {
  console.log('Checking for "pdfs" bucket...');
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const pdfBucket = buckets.find(b => b.name === 'pdfs');

  if (!pdfBucket) {
    console.log('Bucket "pdfs" not found. Creating it now...');
    const { error: createError } = await supabase.storage.createBucket('pdfs', {
      public: true, // Making it public so publicUrl works
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError.message);
    } else {
      console.log('Successfully created "pdfs" bucket.');
    }
  } else {
    console.log('Bucket "pdfs" already exists.');
  }
}

ensurePdfBucket().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
