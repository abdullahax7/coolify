import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

function verifySquareSignature(body: string, signature: string, sigKey: string, url: string): boolean {
  const hmac = crypto.createHmac('sha256', sigKey);
  hmac.update(url + body);
  const expected = hmac.digest('base64');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-square-hmacsha256-signature') ?? '';
  const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? '';

  // Use a dedicated env var so the URL is stable across deployments / proxies
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('x-forwarded-host') ?? req.nextUrl.host}`;
  const webhookUrl = `${appUrl}/api/checkout/webhook`;

  if (sigKey && !verifySquareSignature(rawBody, signature, sigKey, webhookUrl)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try { event = JSON.parse(rawBody); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (event.type !== 'payment.completed') {
    return NextResponse.json({ received: true });
  }

  // Correct path: event.data.object.payment (not event.data.object)
  const dataObj = (event.data as Record<string, unknown>)?.object as Record<string, unknown>;
  const payment = dataObj?.payment as Record<string, unknown>;
  const paymentId = payment?.id as string;
  const note = payment?.note as string ?? '';
  const email = payment?.buyer_email_address as string ?? '';
  const referenceId = payment?.reference_id as string ?? '';   // user_id embedded here
  const amountMoney = payment?.amount_money as { amount?: number; currency?: string } ?? {};
  const priceStr = amountMoney.amount ? `£${(amountMoney.amount / 100).toFixed(2)}` : '';

  const supabase = adminClient();

  const noteLower = note.toLowerCase();
  const isListing = noteLower.includes('plan') || noteLower.includes('selling') || noteLower.includes('letting');
  const order = {
    id: `ORD-${paymentId ?? Date.now()}`,
    user_id: referenceId || null,
    type: isListing ? 'listing' : 'service',
    name: note || 'Property Service',
    price: priceStr,
    detail: 'Paid via Square',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'active',
    square_payment_id: paymentId ?? null,
    customer_email: email || '',
    created_at: new Date().toISOString(),
  };

  // upsert for idempotency — safe to replay the same webhook
  const { error: dbError } = await supabase.from('orders').upsert(order, { onConflict: 'id' });
  if (dbError) console.error('Order upsert failed:', dbError.message);

  if (email) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
      from: `Property Trader <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Order Confirmed – ${order.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1e293b">Order Confirmed ✓</h2>
          <p>Thank you for your purchase!</p>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Order</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${order.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Amount</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${order.price}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Date</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${order.date}</td></tr>
          </table>
          <p style="margin-top:24px">Our team will be in touch shortly. Contact us on 0800 6890604 if you need help.</p>
          <p style="color:#64748b;font-size:0.85rem">Property Trader · info@propertytrader1.co.uk</p>
        </div>
      `,
    }).catch(err => console.error('Email send failed:', err));
  }

  return NextResponse.json({ received: true });
}
