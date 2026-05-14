import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase.from('messages').select('*').is('deleted_at', null).order('received_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: 'messages', capacity: 3, refillPerSec: 1 / 120 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const supabase = await createClient();
  const body = await req.json();
  const message = {
    id: `MSG-${Date.now()}`,
    name: body.name, email: body.email, phone: body.phone ?? '',
    subject: body.subject ?? 'Contact Form',
    message: body.message,
  };
  const { error } = await supabase.from('messages').insert(message);
  if (error) {
    console.error('[Messages API] Insert failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(message, { status: 201 });
}
