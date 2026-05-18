import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { performCleanupAndLog } from '@/lib/cleanup';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Verify the requester is an admin
  const { data: { user: requester } } = await supabase.auth.getUser();
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', requester.id).single();
  const isAdmin = profile?.is_admin || false;

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: targetUser } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (targetUser.is_admin || targetUser.role === 'admin' || id === requester.id) {
    return NextResponse.json({ error: 'User is admin, cannot be deleted' }, { status: 403 });
  }

  // 1. Audit Log the deletion
  // Note: Orders will be kept because of 'on delete set null' in DB schema
  await performCleanupAndLog({
    itemId: id,
    itemType: 'user',
    itemName: targetUser.name || targetUser.email,
    deletedBy: requester.id,
    files: [] // Add user avatar if exists in future
  });

  // 2. Use admin client to delete from auth.users
  const adminClient = await createAdminClient();
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(id);
  
  if (deleteError) {
    console.error('Error deleting user:', deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
