import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, getWelcomeEmailHtml } from '@/lib/email';
import { verifyCaptcha, captchaEnabled } from '@/lib/captcha';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, { name: 'register', capacity: 5, refillPerSec: 1 / 60 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      );
    }

    const { name, email, phone, password, captchaToken, role } = await req.json();

    if (captchaEnabled()) {
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
        emailRedirectTo: `${new URL(req.url).origin}/auth/callback`,
        data: { name, phone, role: role || 'tenant' }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send Welcome Email (Non-blocking)
    sendEmail({
      to: email,
      subject: 'Welcome to Property Trader!',
      html: getWelcomeEmailHtml(name),
    }).catch(err => console.error('Failed to send welcome email:', err));

    return NextResponse.json({ 
      success: true, 
      needsConfirmation: !data.session 
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Registration error:', msg);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
