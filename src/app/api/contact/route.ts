import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';
import { verifyCaptcha, captchaEnabled } from '@/lib/captcha';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, { name: 'contact', capacity: 3, refillPerSec: 1 / 120 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      );
    }

    const { name, email, phone, subject, message, captchaToken } = await req.json();

    if (captchaEnabled()) {
      if (!captchaToken) {
        return NextResponse.json({ error: 'Please complete the CAPTCHA.' }, { status: 400 });
      }
      
      const bypassSecret = process.env.CAPTCHA_BYPASS_TOKEN;
      if (!bypassSecret || captchaToken !== bypassSecret) {
        const valid = await verifyCaptcha(captchaToken);
        if (!valid) {
          return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
        }
      }
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const { success } = await sendEmail({
      to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER!,
      replyTo: email,
      subject: `[Contact Form] ${subject || 'General Enquiry'} – ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:8px;">
          <div style="background:#e11d48;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:1.5rem;">New Contact Enquiry</h1>
          </div>
          <div style="background:white;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;color:#64748b;font-size:0.875rem;font-weight:700;width:120px;">Name</td><td style="padding:10px 0;color:#0f172a;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:10px 0;color:#64748b;font-size:0.875rem;font-weight:700;">Email</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#e11d48;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;color:#64748b;font-size:0.875rem;font-weight:700;">Phone</td><td style="padding:10px 0;color:#0f172a;font-weight:600;">${phone}</td></tr>` : ''}
              ${subject ? `<tr><td style="padding:10px 0;color:#64748b;font-size:0.875rem;font-weight:700;">Subject</td><td style="padding:10px 0;color:#0f172a;font-weight:600;">${subject}</td></tr>` : ''}
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <h3 style="color:#0f172a;margin-bottom:12px;">Message</h3>
            <p style="color:#475569;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:0.75rem;margin-top:16px;">Sent from propertytrader1.co.uk contact form</p>
        </div>
      `,
    });

    if (!success) {
      console.error('[Contact API] Email send failed');
    }

    // Persist to Supabase
    try {
      const supabase = await createClient();
      await supabase.from('messages').insert({
        id: `MSG-${Date.now()}`,
        name, email, phone: phone ?? '', subject: subject ?? 'Contact Form', message,
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
