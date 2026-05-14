import { createAdminClient } from '@/lib/supabase/server';

interface DeletionOptions {
  itemId: string;
  itemType: string;
  itemName?: string;
  deletedBy?: string;
  files?: string[]; // URLs or paths
}

/**
 * Utility to delete files from Supabase storage and log the deletion event.
 */
export async function performCleanupAndLog(options: DeletionOptions) {
  const admin = await createAdminClient();
  const fileResults: { url: string; success: boolean; error?: string }[] = [];

  if (options.files && options.files.length > 0) {
    for (const fileUrl of options.files) {
      if (!fileUrl) continue;
      
      try {
        // Extract bucket and path from URL
        // Example URL: https://xyz.supabase.co/storage/v1/object/public/properties/123.jpg
        const urlObj = new URL(fileUrl);
        const pathParts = urlObj.pathname.split('/storage/v1/object/public/')[1]?.split('/');
        
        if (pathParts && pathParts.length >= 2) {
          const bucket = pathParts[0];
          const path = pathParts.slice(1).join('/');
          
          const { error } = await admin.storage.from(bucket).remove([path]);
          fileResults.push({ url: fileUrl, success: !error, error: error?.message });
        } else {
          fileResults.push({ url: fileUrl, success: false, error: 'Could not parse bucket/path from URL' });
        }
      } catch (e) {
        fileResults.push({ url: fileUrl, success: false, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }

  // Log the deletion
  const { error: logError } = await admin.from('deletion_logs').insert({
    item_id: options.itemId,
    item_type: options.itemType,
    item_name: options.itemName,
    deleted_by: options.deletedBy,
    associated_files: fileResults,
    success: fileResults.every(f => f.success),
    error_message: fileResults.find(f => !f.success)?.error
  });

  if (logError) {
    console.error('[cleanup] Failed to log deletion:', logError.message);
  }

  return fileResults;
}
