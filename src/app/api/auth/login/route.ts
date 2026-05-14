import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyCaptcha, captchaEnabled } from '@/lib/captcha';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { name: 'login', capacity: 5, refillPerSec: 1 / 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many sign-in attempts. Please wait a minute and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const { email, password, captchaToken } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  if (captchaEnabled()) {
    if (!captchaToken || captchaToken === 'bypass-token') {
      return NextResponse.json({ error: 'Please complete the CAPTCHA.' }, { status: 400 });
    }
    const valid = await verifyCaptcha(captchaToken);
    if (!valid) {
      return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
    }
  }

  // signInWithPassword on the SSR client writes auth cookies into the response
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  return NextResponse.json({ success: true });
}
