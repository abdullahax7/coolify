import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  });
  const json = await res.json() as { success: boolean };
  return json.success === true;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, captchaToken } = await req.json();

    const captchaEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true';
    if (captchaEnabled) {
      if (!captchaToken) {
        return NextResponse.json({ error: 'Please complete the CAPTCHA.' }, { status: 400 });
      }
      const valid = await verifyCaptcha(captchaToken);
      if (!valid) {
        return NextResponse.json({ error: 'CAPTCHA verification failed.' }, { status: 400 });
      }
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      needsConfirmation: !data.session 
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
