import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyCaptcha, captchaEnabled } from '@/lib/captcha';

export async function POST(req: NextRequest) {
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
