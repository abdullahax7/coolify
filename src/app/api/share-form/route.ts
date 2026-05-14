import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Admin-only — this endpoint sends attachments through our SMTP relay
    // and was previously open to the world (open relay risk).
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await userClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Defense in depth: even admins can't blast unlimited mail.
    const rl = rateLimit(req, { name: 'share-form', capacity: 10, refillPerSec: 1 / 30 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many emails. Try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      );
    }

    const { recipientEmail, recipientName, formType, pdfBase64, pdfName, senderNote } = await req.json();

    if (!recipientEmail || !pdfBase64 || !formType) {
      return NextResponse.json(
        { error: 'recipientEmail, formType and pdfBase64 are required.' },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const fileName = pdfName || `${formType}.pdf`;
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    await transporter.sendMail({
      from: `"Property Trader" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Your Wales Form – ${formType}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:8px;">
          <div style="background:#6366f1;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:1.4rem;">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales Form Ready</h1>
          </div>
          <div style="background:white;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
            <p style="color:#0f172a;font-size:1rem;">Dear ${recipientName || 'Client'},</p>
            <p style="color:#475569;line-height:1.7;">
              Please find your <strong>${formType}</strong> form attached to this email.
              ${senderNote ? `<br/><br/>${senderNote}` : ''}
            </p>
            <p style="color:#475569;line-height:1.7;margin-top:16px;">
              If you have any questions, please don't hesitate to contact us.
            </p>
            <p style="color:#94a3b8;font-size:0.8rem;margin-top:24px;">
              Property Trader — 0800 6890604
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('share-form error:', err);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
